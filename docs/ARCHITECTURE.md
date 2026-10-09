# PlotTwist 架构说明（V2）

## 结构

```text
src/
  App.tsx                 全局导航、语言/音频设置、进度状态
  components/Pages.tsx    词书选择、Story Map、学习档案
  components/Story.tsx    阅读器、语音控制、词汇互动、章节测试
  components/Notes.tsx    上传/预览、游戏选择、冒险、配对、结果
  data.ts                 七本示例词书、六章剧情与目标词
  storyLocale.ts          英语与香港粤语版本的剧情及分支
  i18n.ts                 三语界面词典与释义选择
  audio.ts                SpeechSynthesis 选声与 Web Audio 音效
  pdf.ts                  pdfjs-dist 浏览器本地文字提取
  logic.ts                localStorage、题目生成、笔记规则解析
  logic.test.ts           纯逻辑与旧进度迁移测试
  styles.css / v2.css     基础样式与 V2 地图、游戏、响应式样式
scripts/smoke.mjs         Edge/Chromium 端到端演示路径
```

## 数据与进度

`BookId` 覆盖 IELTS、CET-6、HKDSE、A1/A2/B1/B2。`Book` 包含 20 个 `Word`。`Chapter` 有 3 个 `StorySegment` 和 5 个测试目标词。额外四章使用数据配置生成，使扩写不需要复制 UI。

`BookProgress` 记录已解锁章节、当前章节/段落、各章节段落位置、已完成章节、词汇学习/掌握/错词、XP 和剧情决定。七本词书进度分开；`AppProgress` 另记笔记 XP。仍使用 `plottwist-progress-v1`，`loadProgress` 为旧 IELTS/CET-6 存档补上新书和 `positions`，避免清零。

章节测试在 `makeQuestions` 里从当前词书及章节五词生成，题型交替为词义和例句填空。达 4/5 且该章以前未通关时发 100 XP，并把 `unlocked` 推到下一章；重做可更新学习记录，但不会再次发章节 XP。

## 故事与语言

`getChapters(bookId)` 把所选词书词汇放入剧情槽位。`localizeChapter` 在英语或香港粤语模式替换标题、叙事、成功/补救文本；英文目标词保持原样。`i18n.ts` 集中管理按钮、导航、反馈、错误等三语文本，并在缺少翻译时回退简体中文。语言设置用单独 localStorage 键保存，不改变学习进度。

第四章中段的 `trustDecision` 提供两条不同短场景，玩家选择保存在 `BookProgress.choices`。第一及第四章另有错误答案触发的陷阱和补救内容。

## 音频

段落朗读使用浏览器 `SpeechSynthesisUtterance`。切换段落、章节、语言或离开阅读器时取消当前语音；暂停/恢复和速度由阅读器控制。`pickVoice` 优先使用语言完全匹配的系统语音，粤语缺失时回退并提示；英文词卡优先英语发音。音效由 Web Audio 本地合成，静音或系统减少动态效果时不播放。

## Notes to Game

`pdf.ts` 动态加载 `pdfjs-dist` 与打包在项目中的 worker，逐页读取文字对象，合并为可编辑文本。TXT/MD 通过 `File.text()`。文件和内容始终在浏览器本地处理。

`parseNotes` 识别 `Term: Definition`、中文冒号或破折号结构，去重并限制 20 条。至少三条后可选择游戏。Knowledge Adventure 从定义生成干扰项并逐题揭露证据；Matching Challenge 要用户独立匹配左右两列，记录连击和曾答错的概念。两种游戏都只使用解析得到的 `Concept`。
