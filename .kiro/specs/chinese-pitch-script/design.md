# Chinese Pitch Script Bugfix Design

## Overview

本修复以 `summary.md` 的静态核查结论为唯一事实来源，补齐一份可用于答辩的精炼中文四问四答讲稿。它回答创意原创性、Kiro 实践、目标成效和愿景，并通过固定事实边界避免把未配置的 MCP Server、未完成的剧情内角色陪伴系统，或尚未运行的验证表述为已交付事实。

修复不改变应用代码、学习规则、远程调用或现有产品文档的技术事实；交付物是一个可审阅的中文讲稿文档，其每个回答均可回溯至 `summary.md`。

## Glossary

- **Bug_Condition (C)**：评审需要四个指定主题的中文讲稿，但仓库缺少一份同时完整、精炼且符合已核查事实边界的材料。
- **Property (P)**：对满足 C 的答辩需求，讲稿提供四个清晰问题及对应的中文答案，并且每项陈述可由 `summary.md` 支持。
- **Preservation**：现有的安全、学习结果隔离、交付范围与验证状态陈述在补充讲稿后不得被弱化或夸大。
- **PitchScript**：面向评审的中文问答文档；固定包含“原创性”“Kiro 实践”“目标成效”“愿景”四个问答。
- **F (original)**：当前材料集合；内容分散在 `summary.md`，不能直接作为精炼答辩稿使用。
- **F' (fixed)**：新增的、以摘要为依据的四问四答讲稿。
- **Evidence Boundary**：只使用 `summary.md` 已陈述的实现、配置和测试资产事实；不从推测、未来计划或未运行命令推导交付结论。

## Bug Details

### Bug Condition

当评审需要快速判断 PlotTwist 的原创性、Kiro 实践、目标成效与愿景时，当前材料要求他们自行从项目总结中拼接事实。此过程既没有统一的中文问答结构，也容易使“当前已实现的独立角色复习页”被误读为“已完成的全剧情角色陪伴系统”，或把没有仓库配置的 MCP Server 误说成现有实践。

**Formal Set Notation:**

Let \(T = \{originality, kiroPractices, goalEffectiveness, vision\}\). For a pitch request \(r\), the defect condition is \(C(r) = (r.language = zh-CN) \land (r.requiredTopics = T) \land \neg E\), where \(E\) means that a concise, source-grounded Chinese four-question script already exists.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type PitchRequest
  OUTPUT: boolean

  RETURN input.language = 'zh-CN'
         AND input.requiredTopics = {
           originality,
           kiroPractices,
           goalEffectiveness,
           vision
         }
         AND NOT existsConciseSourceGroundedFourQuestionScript()
END FUNCTION
```

**Property Specification:**
```
FUNCTION expectedBehavior(script, evidence)
  INPUT: script of type PitchScript, evidence of type SummaryFacts
  OUTPUT: boolean

  RETURN script.language = 'zh-CN'
         AND script.questionCount = 4
         AND script.coversExactly(
           originality,
           kiroPractices,
           goalEffectiveness,
           vision
         )
         AND everyClaimIsSupportedBy(script, evidence)
         AND script.statesNoRepositoryConfiguredMcpServer()
         AND script.distinguishesDeliveredReviewFromPlannedStoryCompanion()
         AND script.doesNotClaimUnrunValidationPassed()
END FUNCTION
```

### Examples

- **创意原创性**：评审问“这个点子原创在哪里？”时，正确回答应将六章原创词汇剧情、三语体验和本地 Notes to Game 连接起来；不能声称使用了未记录的外部内容或已完成的全剧情 AI 角色。
- **Kiro 实践**：评审问“如何使用 Kiro？”时，正确回答应说明分层 Steering、三个角色相关 hooks、requirements → design → tasks 的规格流；同时明确仓库未配置 MCP Server。
- **目标成效**：评审问“目标是否有效达成？”时，正确回答应说明确定性的学习进度、离线可用、本地回退和已有测试资产；不能将现有测试代码或脚本写成已运行并通过的结果。
- **愿景**：评审问“未来方向？”时，正确回答可以说明把当前独立只读复习体验逐步扩展为主线旁路辅导，但必须明确这属于已在规格中保留的后续工作，而非现状。
- **边界示例**：若问及角色反馈，正确回答是“用户完成本地答案并明确同意后，可获得可选的服务端生成补充反馈”；错误回答是“AI 角色会主动推动剧情或修改 XP”。

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- DeepSeek 凭据仍仅保留在服务端，浏览器不接触密钥；可选反馈仍须在用户明确同意且完成本地作答后才请求。（Requirements 3.1）
- XP、章节完成、解锁和词汇掌握度仍只能由既有确定性剧情与测验逻辑改变。（Requirements 3.2）
- 讲稿仍明确仓库没有配置 MCP Server，且全剧情虚拟陪伴系统仍是规划中的能力，不写成已经完成。（Requirements 3.3）
- 当前交付范围仍表述为本地、三语、确定性词汇剧情与笔记游戏核心，加上独立、只读、同意门控的角色复习反馈。
- 测试资产只能被描述为现有覆盖或可执行命令；未实际运行的验证不能被声明为通过。

**Scope:**
所有不涉及该中文四问四答讲稿的行为应完全不受本修复影响，包括：
- React 客户端、API 路由、localStorage V1 迁移及确定性出题逻辑。
- 既有三语内容、Notes to Game、音频、PDF 本地处理与角色复习流程。
- `summary.md` 中记录的事实、现有功能规格和当前待办事项。

## Hypothesized Root Cause

基于缺陷描述，最可能的原因是：

1. **信息分散而非事实缺失**：原创性、架构、Kiro 治理和验证资产分别位于 `summary.md` 的不同章节。
   - 评审无法在有限答辩时间内快速建立完整判断。
   - 开发者容易漏写其中一个指定主题。

2. **当前实现与规划范围接近**：项目同时拥有已实现的独立角色复习页和规划中的主线角色架构。
   - 若没有明确限定语，容易把设计任务误称为交付能力。

3. **工具实践存在否定性事实**：Steering、hooks 和 specs 已配置，但仓库没有 MCP 配置。
   - 通用的“Kiro/MCP”表述若未源于总结，可能错误暗示 MCP 已接入。

4. **验证状态容易被夸大**：`summary.md` 列出测试与烟测资产，并显式说明未执行测试、构建或部署。
   - 答辩稿若直接说“测试已通过”，会超出可核查证据。

## Correctness Properties

Property 1: Bug Condition - 四问四答讲稿完整且有事实依据

_For any_ 中文答辩请求，其中 `isBugCondition` 返回 true，固定后的讲稿 SHALL 提供原创性、Kiro 实践、目标成效和愿景各一项独立问答，并使每项事实陈述均能由 `summary.md` 支持。

**Validates: Requirements 2.1, 2.4**

Property 2: Kiro 实践 - 配置状态与治理机制准确

_For any_ 涉及 Steering、MCP Server、Agent Hooks 或 spec-driven development 的讲稿答案，固定后的讲稿 SHALL 说明分层 Steering、三个已配置角色 hooks 和 requirements-to-design-to-tasks 流程，并明确没有仓库配置的 MCP Server。

**Validates: Requirements 2.2, 3.3**

Property 3: 交付范围 - 当前能力与规划能力可区分

_For any_ 涉及学习核心或虚拟角色的讲稿答案，固定后的讲稿 SHALL 准确陈述本地三语确定性核心及可选、同意门控、只读角色复习反馈，并将故事全程陪伴角色表述为规划能力。

**Validates: Requirements 2.3, 3.2, 3.3**

Property 4: Preservation - 安全与验证事实不被夸大

_For any_ 不满足 `isBugCondition` 的项目事实陈述，固定后的讲稿 SHALL 保持与原始材料一致：服务端密钥与同意边界不变，学习结果只能由确定性逻辑更新，且未运行的验证不被声明为通过。

**Validates: Requirements 2.4, 3.1, 3.2**

## Fix Implementation

### Changes Required

假设根因成立，本修复只需新增一个可审阅的中文讲稿文档；不需要修改产品源码或外部服务。

**File**: `docs/CHINESE_PITCH_SCRIPT.md`

**Function**: `provideFourQuestionPitchScript`（文档职责，不是运行时代码函数）

**Specific Changes:**
1. **固定问答结构**：以四个可直接朗读的问题作为标题。
   - 顺序为原创性、Kiro 实践、目标成效、愿景。
   - 每个答案保持精炼，适合项目答辩口述。

2. **原创性答案**：陈述六章原创词汇剧情、三语体验及本地 Notes to Game 的组合。
   - 只使用 `summary.md` 的产品和内容来源说明。
   - 不将第三方模型或未实现能力当成原创交付。

3. **Kiro 实践答案**：把 product、structure、tech、角色细则与 spec-governance Steering 解释为分层治理。
   - 点出三个已配置 hooks 的时机与价值。
   - 说明 requirements → design → tasks 的追踪流程，以及无仓库 MCP 配置的事实。

4. **目标成效答案**：以确定性进度、离线本地核心、同意后的可选最小化反馈和本地回退，解释目标如何由可观察机制支撑。
   - 把 Vitest、API 测试和 Playwright 烟测称为现有验证资产。
   - 不声称这些命令在本次材料核查中已运行或已通过。

5. **愿景答案与声明边界**：说明未来可把当前独立、只读角色复习体验逐步接入主线的旁路辅导。
   - 明确该主线系统仍在功能规格待办中。
   - 重申角色不改变 XP、解锁、章节完成或掌握状态；DeepSeek 密钥保持服务端且使用受同意约束。

6. **可追溯性注记**：在文档末尾列出“事实依据：`summary.md`”，并简短列出范围声明。
   - 这使审阅者可检查每一项敏感说法。
   - 不复述密钥值、用户数据或模型返回内容。

## Testing Strategy

### Validation Approach

验证采用两阶段：先以反例核查现有材料是否无法直接满足四问四答需求，再审阅新增讲稿是否同时修复文档缺口并保留安全、交付范围和验证状态的边界。因为交付物是文档，测试以结构化内容检查与人工答辩走读为主；不应伪造运行时代码测试结果。

### Exploratory Bug Condition Checking

**Goal**：在修复前确认材料缺少一份单一、精炼、基于事实的中文四问四答稿，并验证错误表述的风险。

**Test Plan**：检查现有 `summary.md` 与规格目录：对照四个要求主题，记录内容是否分散；检查其中是否明确没有 MCP 配置、当前角色实现范围和验证未运行状态。

**Test Cases**:
1. **四主题检索**：尝试从单一现有文档直接朗读四个主题的回答；预期失败，因为没有固定四问四答稿。
2. **MCP 状态核查**：检查项目内 MCP 配置；预期反例是没有仓库配置，却可能被泛化宣称为“已使用 MCP”。
3. **角色范围核查**：对比“独立复习页”与“规划中的主线角色系统”；预期反例是二者不能从现有材料自动区分为一句答辩话术。
4. **验证状态核查**：审阅 `summary.md` 的声明；预期反例是测试资产存在但本次核查没有运行测试、构建或部署。

**Expected Counterexamples**:
- 四个所需主题虽各有证据，但没有统一的中文答辩问答结构。
- 可能误称 MCP 已配置、主线角色已完成，或测试已经通过。

### Fix Checking

**Goal**：验证所有满足 bug condition 的答辩请求，均获得完整且符合事实边界的四问四答稿。

**Pseudocode:**
```
FOR ALL request WHERE isBugCondition(request) DO
  script := provideFourQuestionPitchScript(request)
  ASSERT expectedBehavior(script, summaryFacts)
END FOR
```

### Preservation Checking

**Goal**：验证所有不属于文档缺口的现有事实和产品行为均保持不变。

**Pseudocode:**
```
FOR ALL statement WHERE NOT isBugCondition(statement) DO
  ASSERT factualMeaning_before(statement) = factualMeaning_after(statement)
END FOR
```

**Testing Approach**：使用可重复的内容审阅清单，对高风险措辞进行文本级核验；将新增文档与 `summary.md`、`bugfix.md` 对照。文档修改不触及运行时代码，因此不以未执行的 `npm test`、构建或端到端测试结果作为完成证据。

**Test Cases**:
1. **密钥和同意保留**：确认讲稿没有将 DeepSeek 密钥描述为客户端可用，也没有略过明确同意和本地答案完成条件。
2. **学习结果保留**：确认讲稿没有赋予角色修改 XP、解锁、章节完成或掌握度的权限。
3. **范围与验证保留**：确认讲稿明确无仓库 MCP 配置、主线角色仍属未来工作，且仅把测试描述为现有资产。

### Unit Tests

- 对文档结构进行检查：恰好四个中文问题，覆盖指定四个主题。
- 对每个答案做事实断言：仅含 `summary.md` 支持的功能、配置和状态。
- 对禁止性声明做检查：没有“已配置 MCP”“已完成主线角色”或“未运行测试已通过”等表述。

### Property-Based Tests

- 生成四主题排列并验证输出仍恰含一次每个必需主题，且不会遗漏主题。
- 生成包含已实现、规划中、未配置和未运行状态的事实标签，验证渲染措辞保留其状态而不升级为完成或通过。
- 生成安全和学习结果边界的组合，验证讲稿不会产生密钥暴露、未同意调用或角色修改进度的断言。

### Integration Tests

- 以模拟答辩走读四个问题，检查每个回答可以独立朗读且总体保持简洁。
- 由不了解代码库的审阅者将讲稿与 `summary.md` 对照，检查其能识别当前实现与规划能力的差异。
- 将讲稿放入项目文档集合后，检查它不修改现有应用代码、规格事实或测试状态声明。
