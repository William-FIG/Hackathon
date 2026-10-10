# PlotTwist 项目结构与开发治理总结

> 基于当前工作区文件的静态核查生成。本文不披露或读取 `.env.local` 的密钥内容；未执行测试、构建或部署，因此“测试覆盖”仅描述现有测试代码的范围，而非运行结果。

## 1. 项目定位与技术栈

PlotTwist 是一个浏览器优先的互动词汇学习游戏，面向大学学习者。学习者通过英语词汇推进六章原创剧情，也可将自己的笔记转换为本地知识小游戏。界面支持简体中文（`zh-CN`）、书面香港粤语（`zh-HK`）和英语（`en`）。

- **前端：** React 19 + TypeScript + Vite；入口为 `src/main.tsx`，以 `React.StrictMode` 渲染 `App`。
- **交互与资源：** `lucide-react` 图标、浏览器 SpeechSynthesis/Web Audio、`pdfjs-dist` 本地 PDF 文本提取；章节场景及角色头像均为 `public/` 下的本地 SVG。
- **测试：** Vitest（`npm test`）与 Playwright 烟测脚本（`npm run test:e2e`）。`npm run build` 会执行前端 TypeScript 检查与 Vite 打包；根级 `api/` 需额外以 `npm run typecheck:api` 检查。
- **服务端边界：** `api/character-chat.ts` 是 Vercel 风格的 Serverless API，用于可选的 DeepSeek 角色反馈。前端不会直接访问 Provider SDK 或 API 密钥。
- **配置与安全：** `.env.local` 及所有 `*.local` 已由 `.gitignore` 忽略。DeepSeek 仅使用服务端未加 `VITE_` 前缀的 `DEEPSEEK_API_KEY`、`DEEPSEEK_BASE_URL`、`DEEPSEEK_MODEL`。

## 2. 顶层目录与职责

```text
.
├─ .kiro/                         # Kiro steering、hooks 与功能规格
├─ api/                           # Vercel Serverless API 与单元测试
├─ public/
│  ├─ characters/                 # 四个本地角色 SVG 头像
│  └─ story-scenes/               # 六章剧情场景 SVG
├─ scripts/smoke.mjs              # Playwright 浏览器烟测
├─ src/                           # React 客户端
│  ├─ components/                 # 故事、章节挑战、普通页面、笔记游戏
│  ├─ features/virtual-character/ # 当前独立的角色复习功能
│  ├─ App.tsx                     # 页面导航、全局状态与持久化编排
│  ├─ data.ts                     # 词书及六章故事的规范内容源
│  ├─ logic.ts                    # 进度迁移、确定性出题、笔记解析
│  ├─ storyLocale.ts / i18n.ts    # 剧情与界面三语数据
│  ├─ audio.ts / pdf.ts           # 浏览器音频和 PDF 能力封装
│  └─ types.ts                    # 领域类型契约
├─ docs/                          # 产品、架构与交接文档
├─ package.json                   # npm scripts 与依赖
├─ tsconfig.app.json              # 前端 TypeScript 配置
└─ tsconfig.api.json              # API 独立 TypeScript 配置
```

`dist/` 是构建输出，`artifacts/` 是本地截图等产物，二者均不作为源码提交。仓库同时有 `package-lock.json` 和 `pnpm-lock.yaml`，但现有 scripts 以 npm 为主。

## 3. 核心功能与运行数据流

### 3.1 应用编排与持久化

`src/App.tsx` 是单页面应用的编排层，不使用 React Router。它维护当前页面、词书、语言、音效、朗读速度以及全局 `AppProgress`；页面包括首页、入门选书、故事地图、故事阅读、章节挑战、角色复习、笔记游戏与学习档案。

进度由 `src/logic.ts` 保存到 `localStorage` 键 `plottwist-progress-v1`。`loadProgress()` 会容错解析旧记录、补齐新词书、限制章节/段落范围，并从旧字段推导位置，从而保持既有 V1 存档可读。语言、音频开关和朗读速度分别保存在独立的本地键中。存储不可用时，应用会保持当前会话可用。

### 3.2 词汇剧情与确定性学习机制

- `src/data.ts` 提供七本示例词书及其词汇；`getChapters()` 将词汇装配进统一的六章、每章三段的剧情结构。
- `src/storyLocale.ts` 为英语和香港书面粤语替换章节标题、叙事和结果文本；`src/i18n.ts` 提供共用 UI 文案、词义和词书描述。
- `src/components/Story.tsx` 的 `StoryReader` 负责分段阅读、词汇卡、朗读、音效、填词及第四章剧情选择；正确后才能推进到下一段或章节挑战。
- 同文件的 `ChapterChallenge` 使用 `makeQuestions()` 生成确定性的五题练习。章节达到至少 4/5 分时才解锁后续章节、记录完成状态并首次奖励 100 XP；重试可更新词汇掌握状态，但不会重复奖励 XP。
- 学习结果（XP、章节完成、解锁、掌握/错词）只由上述确定性故事和测验逻辑改变，角色功能不能修改这些字段。

### 3.3 Notes to Game（笔记转游戏）

`src/components/Notes.tsx` 实现输入、学习、配对、故事、Boss、结果等本地游戏阶段。用户可导入不超过 8MB 的 TXT、MD 或 PDF；PDF 经 `src/pdf.ts` 在浏览器内逐页提取文字，不做图片 OCR。`parseNotes()` 仅识别格式化的“术语: 定义”类文本，去重并限制为最多 20 个概念。完成游戏可通过 App 回调增加持久化的 `notesXp`，但原始笔记和单局状态不会保存或发送到远程服务。

### 3.4 音频与可访问性基础

`src/audio.ts` 封装浏览器文本朗读及提示音。朗读由用户交互触发，故事切换、语言变更、章节变更或组件卸载时会取消；提示音遵循静音与 `prefers-reduced-motion`。角色复习页也提供停止/静音与纯文本可用的路径。

## 4. 当前虚拟角色与 DeepSeek 实现

### 4.1 已实现：独立、只读的口试复习页

当前角色 UI 位于 `src/features/virtual-character/ReviewPage.tsx`，由 `App.tsx` 的 `review` 页面组合。它只接收 `bookId`、`BookProgress` 和语言，不接收 `updateBook`、`setProgress` 或任何可变学习状态回调。

- `reviewData.ts` 定义 Lin Zhi、Zhou、Xu Yao、Shen Ye 四名角色及完整三语身份、角色风格、本地问候、回退反馈和服务端安全 persona 指令；头像来自 `public/characters/`。
- 复习词优先选取错词，其次为已学未掌握词，再次为已掌握词；分类为空时使用当前词书作为练习池，且会去重。
- 口试流程为 `ready → answering → feedback`：角色提出词义题，用户提交限长文字答案，本地逻辑根据当前词条的多语释义与 definition 判定，并显示本地反馈和标准释义。
- 这些会话、转录、角色选择、语音状态、同意状态都仅存在于页面内，不写入 XP、掌握度、章节进度或 localStorage。

### 4.2 可选生成反馈与安全边界

用户在完成本地答案后，且主动勾选同意选项，才会由浏览器向同源 `POST /api/character-chat` 请求补充反馈。请求包含当前语言、词书、章节/段落、粗粒度的对错事件、当前词与安全释义、受限角色提示和最多 650 字的用户答案；不会发送整份进度、笔记内容、密钥或非必要标识符。

`api/character-chat.ts` 负责：

1. 校验 POST 方法、语言、词书 ID、章节/段落、受限事件、消息与词汇字段长度，并丢弃不支持字段；在 `segmentEnter` 时移除目标词/释义，避免提前泄题。
2. 仅在服务端读取 `DEEPSEEK_*`；采用默认 15 秒且可配置为 3–30 秒的超时，按客户端键执行每分钟 10 次的进程内限流。
3. 使用服务端系统提示限定语言、虚拟身份、简短学习导向、安全边界及纯文本输出；发送到 DeepSeek 的请求固定为非流式、`max_tokens: 180`、`temperature: 0.4`。
4. 清理回复控制字符、限制长度、拒绝答案泄露、要求保密/情感依赖、人类身份声称和敏感信息索取；对错误、超时、限流和不安全输出返回安全错误码。
5. 在请求取消、组件卸载、角色/语言/筛选切换时通过 `AbortController` 取消调用；失败时保留本地复习流程并显示本地角色回退反馈。模型回复仅作为 React 文本渲染，不作为 HTML 执行。

### 4.3 设计目标与当前实现的差距

角色规格设计了故事内的 `CharacterController`、本地 cue provider、持久化的 `CharacterProgress`、通用 `CharacterService` 和旁路角色面板。目前这些主线组件尚未落地：`StoryReader` 与 `ChapterChallenge` 尚未发射 typed `CharacterEvent`，主线没有本地 scripted cue 面板，角色 session/seen cues/选择/同意也未纳入 `AppProgress`。此外 API 目前直接内联 DeepSeek 请求，尚未拆分为独立 `DeepSeekCharacterProvider` adapter。

因此当前实现应被理解为：**可用的、同意门控的、独立只读角色复习和服务端安全 API 边界**；而不是已完成的全剧情陪伴角色系统。这个差异已在功能 spec 的待办任务中显式保留。

## 5. Kiro Steering：规则如何促进开发

当前 `.kiro/steering/` 包含以下规则文件：

| 文件 | 生效方式 | 主要约束 | 对开发的促进作用 |
|---|---|---|---|
| `product.md` | always | 三语、离线优先、角色仅观察/辅导、学习结果必须确定性 | 把产品边界转化为可审查的不变量，避免 AI 改分或破坏原有学习体验。 |
| `structure.md` | always | 明确 App、Story、logic、data/i18n/types 的所有权，以及角色目录和服务端布局 | 降低跨模块耦合，避免组件直接越权修改进度或将 Provider 代码带入浏览器。 |
| `tech.md` | always | 固定 React/TS/Vite/Vitest/Playwright 栈、V1 存档兼容、DeepSeek 密钥/API/取消/最小化数据规则 | 将验证、迁移和密钥安全前置，保护已有用户存档和服务端信任边界。 |
| `ai-virtual-character.md` | fileMatch（角色相关文件、`App.tsx`、`Story.tsx`、`types.ts`、`logic.ts` 等） | 显式角色领域状态、三语/无障碍、同意、回退、超时、限流与安全输出 | 仅在改动相关区域时注入细粒度要求，既强化敏感功能的实现质量，又不干扰无关开发。 |
| `spec-governance.md` | auto | Requirements-first、EARS 验收标准、需求→设计→任务同步、完成需有验证证据 | 让复杂功能从用户行为、技术方案到可执行任务保持可追踪，减少“代码存在但范围或验证缺失”。 |

这些 steering 的组合形成了“产品不变量 → 模块边界 → 技术安全 → 功能细则 → 规格可追踪性”的分层治理：日常代码改动有共同底线，角色等高敏感功能则自动获得更严格的隐私、取消和可访问性检查。

## 6. MCP Servers：当前状态与开发影响

当前仓库**不存在** `.kiro/settings/mcp.json`，也没有发现其他项目内 MCP 配置。因此项目未声明可由仓库配置启动的 MCP server。

这意味着当前开发流程主要依赖 Kiro 的内置工具、workspace steering、hooks 和 specs，而没有将数据库、设计、文档或第三方服务的 MCP 工具纳入可复现的项目配置。若未来需要加入 MCP，应将非敏感 server 定义放入 `.kiro/settings/mcp.json`，避免把密钥硬编码进配置或源码，并在团队文档中明确用途、最小权限与故障回退。

## 7. Agent Hooks：自动化如何促进开发

`.kiro/hooks/` 已配置三项 AI virtual character 专用 hook：

| Hook 文件 | 触发时机 | 动作 | 开发价值 |
|---|---|---|---|
| `ai-character-pre-task-alignment.json` | `PreTaskExec` | agent 在任务开始前核对相关角色规格、steering、验收与隐私/可访问性/服务边界 | 在编码前消除误解，避免实现违反确定性学习或数据最小化原则。 |
| `ai-character-sync-on-source-save.json` | `PostFileSave`；匹配角色 feature、`Story.tsx`、`App.tsx`、`types.ts`、`logic.ts` | agent 判断是否需要同步 requirements、design、tasks | 防止实现变化后规格文档过时，同时避免无关保存触发无意义更新。 |
| `ai-character-test-after-task.json` | `PostTaskExec` | command 以 120 秒超时执行 `npm test` | 将最低单元测试证据绑定到任务完成事件，及早发现回归。 |

Hooks 主要服务于角色功能这一跨 UI、持久化、隐私和 API 边界的场景：前置对齐范围，中途保持规格同步，收尾自动获得测试反馈。

## 8. Feature Spec：当前规格与项目开发协作

唯一功能规格为 `.kiro/specs/ai-virtual-character/`：

| 文件 | 内容 | 如何促进开发 |
|---|---|---|
| `requirements.md` | 七组需求：本地辅导、学习结果隔离、同意后 DeepSeek、隐私安全、三语可访问性、角色复习页、口试会话 | 以可观察的用户行为和限制确定范围，避免把“AI 角色”实现成模糊的自由聊天。 |
| `design.md` | 事件旁路架构、角色契约、最小数据流、持久化模型、取消、DeepSeek 边界、错误与测试策略；并记录复习页/口试设计 | 为多个文件的协作定义接口与禁止项，确保模型调用是可选、可取消、无权改变学习结果的旁路。 |
| `tasks.md` | 可执行任务、需求关联和完成状态 | 提供交付路线与剩余工作可见性，便于逐项验证而不是笼统宣称功能完成。 |

当前 `tasks.md` 已标记独立复习页、同意后的 review chat、口试模式及补充反馈等任务完成；通用角色契约、本地 cue/controller/panel、主线事件接入、持久化角色状态、完整远程流与浏览器覆盖等任务仍待完成。规格因此既记录已交付能力，也防止后续开发误将阶段性实现当作完整系统。

## 9. 现有验证资产与建议使用方式

- `src/logic.test.ts`：覆盖笔记解析、七本词书的题目唯一性、六章结构和旧 V1 进度迁移。
- `api/character-chat.test.ts`：覆盖 API 请求白名单、`segmentEnter` 的词汇上下文剥离及答案泄露拦截。
- `scripts/smoke.mjs`：覆盖简中主线进入 IELTS、章节地图/锁定、首段推进、`zh-HK`/`zh-CN` 切换、学习档案、笔记游戏和无页面错误。

当前烟测尚未覆盖 review 页面、同意门控、角色口试、取消/回退、API 错误状态或 DeepSeek 路由；API handler 也缺少对实际 fetch、超时、限流、取消和状态映射的测试。改动对应领域时，应按 steering 执行 `npm test`、`npm run build`，并在涉及浏览器流程时执行 `npm run test:e2e`；涉及 API 时补充 `npm run typecheck:api`。

## 10. 结论

项目的稳定核心是本地、三语、确定性的词汇剧情和笔记游戏，所有学习成果均可在不联网、无 API key 的情况下完成。Kiro 的 steering、角色 spec 和 hooks 已为可选 AI 功能建立了严格的边界：敏感数据最小化、明确同意、可取消请求、安全输出以及本地回退。

当前最重要的架构认知是将“已实现的独立角色复习页”与“规划中的全剧情角色陪伴系统”区分开来。后续开发应以现有 spec 任务为准，优先保持 V1 存档兼容、确定性学习结果与前后端信任边界。