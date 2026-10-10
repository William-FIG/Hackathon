import type { Lang } from '../../types'

export type ReviewCharacterId = 'lin-zhi' | 'zhou' | 'xu-yao' | 'shen-ye'

export interface ReviewCharacterDefinition {
  id: ReviewCharacterId
  mark: string
  name: Record<Lang, string>
  role: Record<Lang, string>
  approach: Record<Lang, string>
  prompt: Record<Lang, string>
  localGreeting: Record<Lang, string>
  correctFeedback: Record<Lang, string>
  retryFeedback: Record<Lang, string>
  fallbackFeedback: Record<Lang, string>
}

export const reviewCharacters: ReviewCharacterDefinition[] = [
  {
    id: 'lin-zhi', mark: '林',
    name: { 'zh-CN': '林栀', 'zh-HK': '林梔', en: 'Lin Zhi' },
    role: { 'zh-CN': '线索复盘官', 'zh-HK': '線索覆盤官', en: 'Clue Review Lead' },
    approach: { 'zh-CN': '从证据和语境中找回答案。', 'zh-HK': '由證據同語境搵返答案。', en: 'Rebuild the answer from evidence and context.' },
    prompt: { 'zh-CN': '以林栀的冷静、证据导向风格担任单词复习考察员。', 'zh-HK': '以林梔冷靜、重證據嘅風格做生字覆習考察員。', en: 'Act as Lin Zhi: calm, evidence-led, and focused on vocabulary review.' },
    localGreeting: { 'zh-CN': '我是林栀。先看线索，再给答案；我们只复习，不改动你的故事进度。', 'zh-HK': '我係林梔。先睇線索，再畀答案；我哋只覆習，唔會改你嘅故事進度。', en: 'I am Lin Zhi. Read the clues before you answer; this review never changes story progress.' },
    correctFeedback: { 'zh-CN': '证据对上了。把这个词放回原句里，再读一遍。', 'zh-HK': '證據對上喇。將個字放返入原句，再讀一次。', en: 'The evidence matches. Put the word back into its sentence once more.' },
    retryFeedback: { 'zh-CN': '这条线索先标记为待复习。看例句，再试下一题。', 'zh-HK': '呢條線索先標記做待覆習。睇例句，再試下一題。', en: 'Keep this clue in review. Check the example, then try the next question.' },
    fallbackFeedback: { 'zh-CN': '外部考察暂时不可用。先用本地线索：词义、例句和选项都在这里。', 'zh-HK': '外部考察暫時用唔到。先用本機線索：詞義、例句同選項都喺度。', en: 'The external examiner is unavailable. Use the local clues: meaning, example, and options are here.' },
  },
  {
    id: 'zhou', mark: '周',
    name: { 'zh-CN': '老周', 'zh-HK': '周叔', en: 'Zhou' },
    role: { 'zh-CN': '证据核验员', 'zh-HK': '證據核驗員', en: 'Evidence Verifier' },
    approach: { 'zh-CN': '逐条核对，不靠猜。', 'zh-HK': '逐條核對，唔靠估。', en: 'Verify each detail; do not guess.' },
    prompt: { 'zh-CN': '以保安老周务实、逐条核验的风格担任单词复习考察员。', 'zh-HK': '以保安周叔務實、逐條核實嘅風格做生字覆習考察員。', en: 'Act as Zhou, the practical security verifier who checks one clue at a time.' },
    localGreeting: { 'zh-CN': '我是老周。别急着选，先把词和例句对一遍。', 'zh-HK': '我係周叔。唔好急住揀，先將個字同例句對一次。', en: 'I am Zhou. Do not rush the choice; cross-check the word and its example.' },
    correctFeedback: { 'zh-CN': '核验通过。这个词的证据链完整。', 'zh-HK': '核實通過。呢個字嘅證據鏈完整。', en: 'Verification passed. The evidence chain is complete.' },
    retryFeedback: { 'zh-CN': '记录一下差异；下次看到同类语境会更快。', 'zh-HK': '記低個差異；下次見到同類語境會快啲。', en: 'Note the mismatch; the next similar context will be easier.' },
    fallbackFeedback: { 'zh-CN': '连线中断也没关系，先按本地题目核验词义。', 'zh-HK': '連線中斷都唔緊要，先按本機題目核實詞義。', en: 'A broken connection is fine; verify the meaning with the local question.' },
  },
  {
    id: 'xu-yao', mark: '许',
    name: { 'zh-CN': '许遥', 'zh-HK': '許遙', en: 'Xu Yao' },
    role: { 'zh-CN': '情境联想员', 'zh-HK': '情境聯想員', en: 'Context Connector' },
    approach: { 'zh-CN': '把词和故事中的选择连起来。', 'zh-HK': '將個字同故事入面嘅選擇連埋。', en: 'Connect each word to a choice in the story.' },
    prompt: { 'zh-CN': '以许遥善于反思和情境联想的风格担任单词复习考察员。', 'zh-HK': '以許遙善於反思同情境聯想嘅風格做生字覆習考察員。', en: 'Act as Xu Yao: reflective, empathetic, and focused on contextual memory.' },
    localGreeting: { 'zh-CN': '我是许遥。先想想这个词在故事里让谁做了什么选择。', 'zh-HK': '我係許遙。先諗下個字喺故事入面令邊個做咗咩選擇。', en: 'I am Xu Yao. Think about what choice this word shaped in the story.' },
    correctFeedback: { 'zh-CN': '对了。把它和那段情境连在一起，记忆会更稳。', 'zh-HK': '啱喇。將佢同嗰段情境連埋，記憶會更穩。', en: 'That is right. Link it to that scene to make the memory stick.' },
    retryFeedback: { 'zh-CN': '没关系。先看例句里的关系和动作，再回来复习。', 'zh-HK': '唔緊要。先睇例句入面嘅關係同動作，再返嚟覆習。', en: 'That is okay. Read the relationships and actions in the example, then return.' },
    fallbackFeedback: { 'zh-CN': 'AI 连线没接上，但故事情境仍在；用例句先复盘。', 'zh-HK': 'AI 連線未接上，但故事情境仲喺度；先用例句覆盤。', en: 'AI is not connected, but the story context remains; review through the example.' },
  },
  {
    id: 'shen-ye', mark: '夜',
    name: { 'zh-CN': '沈夜', 'zh-HK': '沈夜', en: 'Shen Ye' },
    role: { 'zh-CN': '策略审查官', 'zh-HK': '策略審查官', en: 'Strategy Examiner' },
    approach: { 'zh-CN': '精准、简短、只看关键线索。', 'zh-HK': '精準、簡短、只睇關鍵線索。', en: 'Precise, brief, and focused on decisive clues.' },
    prompt: { 'zh-CN': '以沈夜冷静、简洁、策略导向的风格担任单词复习考察员。', 'zh-HK': '以沈夜冷靜、簡潔、策略導向嘅風格做生字覆習考察員。', en: 'Act as Shen Ye: controlled, concise, and strategic in vocabulary review.' },
    localGreeting: { 'zh-CN': '我是沈夜。选项已经足够；用语境排除干扰项。', 'zh-HK': '我係沈夜。選項已經足夠；用語境排除干擾項。', en: 'I am Shen Ye. The options are enough; use context to eliminate distractions.' },
    correctFeedback: { 'zh-CN': '判断准确。保留这个判断路径。', 'zh-HK': '判斷準確。記住呢條判斷路徑。', en: 'Accurate judgment. Keep that reasoning path.' },
    retryFeedback: { 'zh-CN': '暂不成立。回到定义，排除不符合语境的选项。', 'zh-HK': '暫時唔成立。返去定義，排除唔合語境嘅選項。', en: 'Not yet. Return to the definition and rule out what does not fit the context.' },
    fallbackFeedback: { 'zh-CN': '远程审查不可用。继续用本地题目完成推理。', 'zh-HK': '遠端審查用唔到。繼續用本機題目完成推理。', en: 'Remote review is unavailable. Complete the reasoning with the local question.' },
  },
]

export interface ReviewCopy {
  nav: string
  eyebrow: string
  title: string
  body: string
  examiner: string
  currentBook: string
  filters: Record<'priority' | 'learned' | 'mastered' | 'all', string>
  noWords: string
  fallbackPool: string
  question: string
  chooseMeaning: string
  example: string
  next: string
  correct: string
  incorrect: string
  chatTitle: string
  chatBody: string
  generatedLabel: string
  localLabel: string
  consent: string
  consentDetail: string
  prompt: string
  send: string
  sending: string
  cancel: string
  retry: string
  unavailable: string
  clearAnswer: string
}

export const reviewCopy: Record<Lang, ReviewCopy> = {
  'zh-CN': { nav:'角色复习', eyebrow:'故事角色 · 单词复习考察员', title:'让角色考察你的词汇线索', body:'选择故事角色，从当前词书中复习错词、已学词和已掌握词。答题不会改变 XP、章节或掌握记录。', examiner:'选择考察员', currentBook:'当前词书', filters:{ priority:'优先错词', learned:'已学词', mastered:'已掌握', all:'全部词汇' }, noWords:'该分类暂无可复习词。', fallbackPool:'将使用当前词书中的词进行练习。', question:'考察题', chooseMeaning:'请选择这个词在故事中的意思。', example:'例句', next:'下一词', correct:'判断正确', incorrect:'再看线索', chatTitle:'向考察员提问', chatBody:'本地考察一直可用。勾选同意后，才会将语言、当前词、词义、当前章节和答题结果发送给 DeepSeek。', generatedLabel:'AI 生成', localLabel:'本地提示', consent:'我同意将最小复习上下文发送给 DeepSeek。', consentDetail:'仅发送语言、词书/章节、答题结果、当前词及释义；不发送你的文本回答、笔记、完整进度或密钥。', prompt:'问问这个考察员如何记住当前词…', send:'发送问题', sending:'正在考察…', cancel:'取消请求', retry:'重试 AI 提问', unavailable:'AI 考察暂时不可用，已切换到本地提示。', clearAnswer:'先完成当前选择，再让 AI 围绕这个词讲解。' },
  'zh-HK': { nav:'角色覆習', eyebrow:'故事角色 · 生字覆習考察員', title:'由角色考察你嘅生字線索', body:'揀故事角色，喺而家詞書覆習錯詞、學過嘅詞同掌握咗嘅詞。答題唔會改 XP、章節或者掌握紀錄。', examiner:'揀考察員', currentBook:'而家詞書', filters:{ priority:'優先錯詞', learned:'學過嘅詞', mastered:'掌握咗嘅詞', all:'全部生字' }, noWords:'呢個分類暫時冇詞可以覆習。', fallbackPool:'會用而家詞書嘅詞嚟練習。', question:'考察題', chooseMeaning:'揀呢個字喺故事入面嘅意思。', example:'例句', next:'下一詞', correct:'判斷正確', incorrect:'再睇線索', chatTitle:'問考察員', chatBody:'本機考察一直用到。剔選同意後，先會將語言、而家個字、詞義、而家章節同答題結果傳畀 DeepSeek。', generatedLabel:'AI 生成', localLabel:'本機提示', consent:'我同意將最小覆習內容傳畀 DeepSeek。', consentDetail:'只會傳語言、詞書／章節、答題結果、而家個字同解釋；唔會傳你嘅文字回答、筆記、完整進度或者密鑰。', prompt:'問下考察員點樣記住而家個字…', send:'發送問題', sending:'考察緊…', cancel:'取消請求', retry:'重試 AI 提問', unavailable:'AI 考察暫時用唔到，已切換到本機提示。', clearAnswer:'先完成而家選擇，再畀 AI 圍繞呢個字講解。' },
  en: { nav:'Character Review', eyebrow:'STORY CAST · VOCABULARY EXAMINER', title:'Let the characters examine your clues', body:'Choose a story character to review missed, learned, and mastered words from the current book. Answers never change XP, chapters, or mastery records.', examiner:'Choose an examiner', currentBook:'Current word book', filters:{ priority:'Missed first', learned:'Words seen', mastered:'Mastered', all:'All vocabulary' }, noWords:'No words are available in this category yet.', fallbackPool:'A word from the current book is ready for practice.', question:'Review question', chooseMeaning:'Choose this word’s meaning in the story.', example:'Example', next:'Next word', correct:'Correct judgment', incorrect:'Review the clue', chatTitle:'Ask the examiner', chatBody:'Local review always works. Consent before sending only the language, current word and meaning, chapter, and answer result to DeepSeek.', generatedLabel:'AI generated', localLabel:'Local cue', consent:'I agree to send minimal review context to DeepSeek.', consentDetail:'Only language, book/chapter, answer result, and the current word and meaning are sent—never your response text, notes, full progress, or keys.', prompt:'Ask how to remember this word…', send:'Send question', sending:'Examining…', cancel:'Cancel request', retry:'Retry AI question', unavailable:'AI review is unavailable. Switched to a local cue.', clearAnswer:'Complete the current choice before asking AI to explain this word.' },
}

export function reviewNavLabel(lang: Lang): string { return reviewCopy[lang].nav }


export const reviewAvatarSrc: Record<ReviewCharacterId, string> = {
  'lin-zhi': '/characters/lin-zhi.svg',
  zhou: '/characters/zhou.svg',
  'xu-yao': '/characters/xu-yao.svg',
  'shen-ye': '/characters/shen-ye.svg',
}

export interface OralReviewCopy {
  oralMode: string
  start: string
  hearQuestion: string
  stopVoice: string
  voiceUnavailable: string
  questionFor: string
  answerPrompt: string
  submitAnswer: string
  evaluating: string
  answerRecorded: string
  localEvaluation: string
  nextQuestion: string
  feedback: string
  correct: string
  needsReview: string
  transcript: string
  aiFeedback: string
  consent: string
  consentDetail: string
  progressNote: string
  questionCounter: string
}

export const oralReviewCopy: Record<Lang, OralReviewCopy> = {
  'zh-CN': { oralMode:'互动口试', start:'开始互动考察', hearQuestion:'朗读问题', stopVoice:'停止朗读', voiceUnavailable:'当前浏览器不支持语音朗读。', questionFor:'请解释词汇：{word}', answerPrompt:'输入你对这个词义的理解…', submitAnswer:'提交回答', evaluating:'考察员正在评价…', answerRecorded:'你的回答', localEvaluation:'本地评价', nextQuestion:'下一题', feedback:'考察员反馈', correct:'回答与目标词义一致。', needsReview:'这个回答还需要结合正确释义再复习一次。', transcript:'互动记录', aiFeedback:'AI 角色反馈', consent:'同意由 DeepSeek 对本次已完成的回答提供补充反馈。', consentDetail:'只发送当前词、词义、章节和粗粒度答题结果；不发送你的文本回答、笔记、完整进度或密钥。', progressNote:'口试不会写入 XP、掌握度或故事进度。', questionCounter:'第 {current} / {total} 题' },
  'zh-HK': { oralMode:'互動口試', start:'開始互動考察', hearQuestion:'讀出問題', stopVoice:'停止朗讀', voiceUnavailable:'而家個瀏覽器唔支援語音朗讀。', questionFor:'請解釋生字：{word}', answerPrompt:'輸入你對呢個詞義嘅理解…', submitAnswer:'提交回答', evaluating:'考察員評緊…', answerRecorded:'你嘅回答', localEvaluation:'本機評價', nextQuestion:'下一題', feedback:'考察員回饋', correct:'回答同目標詞義一致。', needsReview:'呢個回答仲要配合正確解釋再覆習一次。', transcript:'互動紀錄', aiFeedback:'AI 角色回饋', consent:'同意由 DeepSeek 對今次已完成嘅回答提供補充回饋。', consentDetail:'只會傳而家個字、詞義、章節同粗略答題結果；唔會傳你嘅文字回答、筆記、完整進度或者密鑰。', progressNote:'口試唔會寫入 XP、掌握度或者故事進度。', questionCounter:'第 {current} / {total} 題' },
  en: { oralMode:'Interactive oral review', start:'Start interactive review', hearQuestion:'Read question aloud', stopVoice:'Stop voice', voiceUnavailable:'Speech synthesis is unavailable in this browser.', questionFor:'Explain the word: {word}', answerPrompt:'Type your understanding of this word…', submitAnswer:'Submit answer', evaluating:'The examiner is evaluating…', answerRecorded:'Your answer', localEvaluation:'Local evaluation', nextQuestion:'Next question', feedback:'Examiner feedback', correct:'Your response matches the target meaning.', needsReview:'Review the correct meaning once more before moving on.', transcript:'Conversation record', aiFeedback:'AI character feedback', consent:'I agree to let DeepSeek provide extra feedback on this completed answer.', consentDetail:'Only the current word, meaning, chapter, and coarse answer result are sent—not your response text, notes, full progress, or keys.', progressNote:'This oral review never writes XP, mastery, or story progress.', questionCounter:'Question {current} / {total}' },
}


export const characterQuestionTemplates: Record<ReviewCharacterId, Record<Lang, string[]>> = {
  'lin-zhi': {
    'zh-CN': [
      '林栀把两份日志并排压在桌上，声音很轻：“一个写着 00:12，另一个写着 00:16。四分钟的 {word} 会让整场指控崩掉。你觉得它是什么意思？”',
      '会议室里只剩投影仪的嗡鸣。林栀指向这句证词：“{example}” 她抬眼问你：在这条线索里，{word} 指的是什么？',
    ],
    'zh-HK': [
      '林梔將兩份紀錄並排壓喺枱上，細聲講：「一份寫 00:12，另一份寫 00:16。四分鐘嘅 {word}，足夠令成個指控散晒。」你覺得佢係咩意思？',
      '會議室得返投影機聲。林梔指住呢句證詞：「{example}」佢望住你問：喺呢條線索入面，{word} 係咩意思？',
    ],
    en: [
      'Lin Zhi lays two logs side by side. “One says 00:12. The other says 00:16. A four-minute {word} can break this entire accusation.” What does the clue mean?',
      'Only the projector hums in the boardroom. Lin Zhi points to the evidence: “{example}” She looks up. In this clue, what does {word} mean?',
    ],
  },
  zhou: {
    'zh-CN': [
      '老周暂停监控画面，放大了时间戳：“镜头没撒谎，报告却对不上。这里的 {word} 是我必须先核验的东西。”你会怎么解释？',
      '老周把手电照向记录本：“{example}” 他敲了敲页面：如果证据之间出现 {word}，到底发生了什么？',
    ],
    'zh-HK': [
      '周叔暫停閉路電視，放大個時間戳：「鏡頭冇講大話，但份報告對唔上。呢度嘅 {word}，係我一定要先核實嘅嘢。」你會點解釋？',
      '周叔用電筒照住紀錄簿：「{example}」佢敲一敲頁面：如果證據之間出現 {word}，究竟發生咗咩事？',
    ],
    en: [
      'Zhou freezes the security footage and enlarges the timestamp. “The camera is honest, but the report does not match. This {word} is what I need to verify first.” How would you explain it?',
      'Zhou shines his torch over the logbook. “{example}” He taps the page. If evidence contains a {word}, what has happened?',
    ],
  },
  'xu-yao': {
    'zh-CN': [
      '许遥把账本缺失的那一页攥紧：“我以为没人会注意到，可两边的数字留下了 {word}。” 她需要你说出这个词在这里的含义。',
      '走廊摄像头正对着她。许遥低声重复：“{example}” 她问你：如果故事里出现 {word}，为什么它会让人不安？',
    ],
    'zh-HK': [
      '許遙攥住帳本唔見咗嗰頁：「我以為冇人會留意，但兩邊數字留低咗 {word}。」佢想你講出呢個字喺度嘅意思。',
      '走廊鏡頭正對住佢。許遙細聲重複：「{example}」佢問你：如果故事入面出現 {word}，點解會令人不安？',
    ],
    en: [
      'Xu Yao grips the missing ledger page. “I thought no one would notice, but the numbers on both sides left a {word}.” Tell her what the word means here.',
      'The corridor camera points straight at her. Xu Yao repeats, “{example}” Why would a {word} make someone uneasy in this story?',
    ],
  },
  'shen-ye': {
    'zh-CN': [
      '沈夜合上董事会档案，语气没有起伏：“如果两份证据不能同时成立，{word} 就不是小问题，而是突破口。” 给我一个准确解释。',
      '沈夜把报告推到你面前：“{example}” 他停了一秒：在审查里，{word} 会迫使我们重新判断什么？',
    ],
    'zh-HK': [
      '沈夜閂上董事會檔案，語氣冇起伏：「如果兩份證據唔可以同時成立，{word} 就唔係小問題，而係突破口。」畀我一個準確解釋。',
      '沈夜將份報告推到你面前：「{example}」佢停一停：喺審查入面，{word} 會迫我哋重新判斷乜嘢？',
    ],
    en: [
      'Shen Ye closes the board file without changing his tone. “If two pieces of evidence cannot both be true, a {word} is not a small issue. It is the opening.” Give me a precise explanation.',
      'Shen Ye pushes the report toward you. “{example}” He pauses. In an audit, what does a {word} force us to reconsider?',
    ],
  },
}
