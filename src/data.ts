import type { Book, BookId, Chapter } from './types'

function sampleBook(id: BookId, title: string, level: string, focus: string, description: string, rows: string): Book {
  return { id, title, subtitle: `${level} · 学习演示词表`, level, focus, description,
    words: rows.trim().split('\n').map((row) => {
      const [word, meaning, meaningHK, definition, example] = row.split('|').map((part) => part.trim())
      return { word, meaning, meaningHK, meaningEN: definition, definition, example, difficulty: level }
    }),
  }
}

export const books: Record<BookId, Book> = {
  ielts: {
    id: 'ielts', title: 'IELTS Vocabulary', subtitle: '雅思核心演示词表',
    description: '从证据到反击，用语境记住高频学术词汇。',
    level: 'IELTS', focus: 'Academic evidence & argument', words: [
      { word: 'fabricated', meaning: '伪造的', definition: 'invented or made up to deceive', example: 'The evidence was fabricated to hide the truth.', difficulty: 'B2' },
      { word: 'discrepancy', meaning: '差异；矛盾', definition: 'a difference between things that should match', example: 'She noticed a discrepancy in the two reports.', difficulty: 'C1' },
      { word: 'corroborate', meaning: '证实；佐证', definition: 'to support a statement with evidence', example: 'The video could corroborate her account.', difficulty: 'C1' },
      { word: 'covert', meaning: '秘密的；隐蔽的', definition: 'hidden or kept secret', example: 'A covert meeting took place after midnight.', difficulty: 'C1' },
      { word: 'incriminating', meaning: '显示有罪的', definition: 'suggesting that someone is guilty', example: 'The message was incriminating evidence.', difficulty: 'C1' },
      { word: 'vindicate', meaning: '洗清嫌疑；证明正确', definition: 'to clear someone of blame or suspicion', example: 'The records would vindicate the intern.', difficulty: 'C1' },
      { word: 'leverage', meaning: '利用；影响力', definition: 'to use something to maximum advantage', example: 'She used the audit as leverage.', difficulty: 'B2' },
      { word: 'confront', meaning: '当面对质', definition: 'to face someone and challenge them', example: 'She decided to confront the director.', difficulty: 'B2' },
      { word: 'resilient', meaning: '有韧性的', definition: 'able to recover quickly from difficulty', example: 'Her resilient attitude surprised the team.', difficulty: 'B2' },
      { word: 'revelation', meaning: '惊人发现；揭露', definition: 'a surprising fact made known', example: 'The final revelation changed everything.', difficulty: 'B2' },
      { word: 'anonymous', meaning: '匿名的', definition: 'without a known name', example: 'An anonymous source sent the archive.', difficulty: 'B2' },
      { word: 'scrutinize', meaning: '仔细审查', definition: 'to examine something very carefully', example: 'She had to scrutinize every signature.', difficulty: 'C1' },
      { word: 'authenticate', meaning: '鉴定真伪', definition: 'to prove that something is genuine', example: 'The expert could authenticate the recording.', difficulty: 'C1' },
      { word: 'ambiguous', meaning: '含糊的', definition: 'having more than one possible meaning', example: 'The instruction was deliberately ambiguous.', difficulty: 'C1' },
      { word: 'implicate', meaning: '牵连', definition: 'to show that someone was involved in a crime', example: 'The ledger could implicate the chairwoman.', difficulty: 'C1' },
      { word: 'alliance', meaning: '联盟', definition: 'a partnership formed for a common purpose', example: 'An unlikely alliance formed overnight.', difficulty: 'B2' },
      { word: 'betrayal', meaning: '背叛', definition: 'the act of being disloyal', example: 'The betrayal came from a trusted friend.', difficulty: 'B2' },
      { word: 'ultimatum', meaning: '最后通牒', definition: 'a final demand with consequences', example: 'The board gave her an ultimatum.', difficulty: 'C1' },
      { word: 'testimony', meaning: '证词', definition: 'a formal statement given as evidence', example: 'Her testimony changed the hearing.', difficulty: 'C1' },
      { word: 'accountability', meaning: '问责', definition: 'responsibility for actions and decisions', example: 'The staff demanded accountability.', difficulty: 'C1' },
    ],
  },
  cet6: {
    id: 'cet6', title: 'CET-6 Vocabulary', subtitle: '六级核心演示词表',
    description: '在同一条高能主线中，练习另一组真实参与剧情的词汇。',
    level: 'CET-6', focus: 'Evidence & public decisions', words: [
      { word: 'forged', meaning: '伪造的', definition: 'copied or created dishonestly', example: 'The signature was forged.', difficulty: 'CET-6' },
      { word: 'inconsistency', meaning: '不一致；矛盾', definition: 'a lack of agreement between facts', example: 'An inconsistency appeared in the timeline.', difficulty: 'CET-6' },
      { word: 'verify', meaning: '核实；证实', definition: 'to check that something is true', example: 'The engineer could verify the timestamp.', difficulty: 'CET-6' },
      { word: 'secretive', meaning: '遮遮掩掩的', definition: 'unwilling to share information', example: 'His secretive calls raised suspicion.', difficulty: 'CET-6' },
      { word: 'damning', meaning: '确凿不利的', definition: 'showing strong evidence of wrongdoing', example: 'The recording was damning evidence.', difficulty: 'CET-6' },
      { word: 'exonerate', meaning: '证明无罪', definition: 'to officially clear someone from blame', example: 'The audit would exonerate her.', difficulty: 'CET-6' },
      { word: 'exploit', meaning: '利用', definition: 'to make full use of a resource', example: 'She could exploit the loophole to reveal the truth.', difficulty: 'CET-6' },
      { word: 'challenge', meaning: '质疑；挑战', definition: 'to question the truth or authority of something', example: 'She chose to challenge the accusation.', difficulty: 'CET-6' },
      { word: 'persistent', meaning: '坚持不懈的', definition: 'continuing despite difficulty', example: 'Her persistent search uncovered the file.', difficulty: 'CET-6' },
      { word: 'disclosure', meaning: '披露；揭露', definition: 'the act of making information known', example: 'The disclosure shocked the board.', difficulty: 'CET-6' },
      { word: 'unknown', meaning: '身份不明的', definition: 'not identified or familiar', example: 'An unknown sender shared the file.', difficulty: 'CET-6' },
      { word: 'inspect', meaning: '检查', definition: 'to look at something carefully', example: 'She would inspect the original log.', difficulty: 'CET-6' },
      { word: 'confirm', meaning: '确认', definition: 'to establish that something is true', example: 'The expert could confirm the recording.', difficulty: 'CET-6' },
      { word: 'vague', meaning: '含糊的', definition: 'not clearly expressed', example: 'The order was intentionally vague.', difficulty: 'CET-6' },
      { word: 'involve', meaning: '牵涉', definition: 'to include someone in an event', example: 'The records involve the chairwoman.', difficulty: 'CET-6' },
      { word: 'partnership', meaning: '合作关系', definition: 'a relationship between people working together', example: 'A new partnership formed overnight.', difficulty: 'CET-6' },
      { word: 'deception', meaning: '欺骗', definition: 'the act of making someone believe something false', example: 'The deception came from a friend.', difficulty: 'CET-6' },
      { word: 'demand', meaning: '要求', definition: 'a firm request', example: 'The board made a final demand.', difficulty: 'CET-6' },
      { word: 'statement', meaning: '陈述', definition: 'a spoken or written account', example: 'Her statement changed the hearing.', difficulty: 'CET-6' },
      { word: 'responsibility', meaning: '责任', definition: 'a duty to deal with something', example: 'The staff demanded responsibility.', difficulty: 'CET-6' },
    ],
  },
  hkdse: sampleBook('hkdse', 'HKDSE English', 'HKDSE', 'Critical reading & argument', '结合香港公开考试语境的论证与调查词汇。', `false|虚假的|虛假嘅|not true or real|The false report misled the team.
gap|差距|落差|a difference between two things|A gap appeared in the timeline.
prove|证明|證明|to show that something is true|The video could prove her story.
private|私下的|私底下嘅|not public|They held a private meeting.
guilty|有罪的|有罪嘅|responsible for a wrongdoing|The guilty manager looked away.
clear|洗清嫌疑|洗清嫌疑|to free someone from blame|The logs could clear her name.
use|利用|利用|to put something to a purpose|She would use the evidence wisely.
face|面对|面對|to deal with a difficult situation|She chose to face the board.
strong|坚强的|堅強嘅|able to deal with difficulty|She stayed strong under pressure.
discovery|发现|發現|something found for the first time|The discovery changed the case.
hidden|隐藏的|收埋嘅|kept out of sight|A hidden file appeared.
examine|仔细检查|仔細檢查|to look at closely|She had to examine the seal.
check|核实|核實|to make sure something is correct|The engineer could check the date.
unclear|不清楚的|唔清楚嘅|not easy to understand|The message was unclear.
link|牵连|牽連|to connect someone with an event|The logs link him to the leak.
team|团队|團隊|people working together|The team worked through the night.
lie|谎言|大話|something said that is not true|The lie came from a friend.
choice|选择|選擇|a decision between options|She faced a hard choice.
witness|证人|證人|someone who saw an event|A witness entered the room.
duty|责任|責任|a task one is expected to do|The board had a duty to respond.`),
  a1: sampleBook('a1', 'CEFR A1', 'A1', 'Everyday words & simple clues', '用简单词汇走进同一场悬疑冒险。', `fake|假的|假嘅|not real|The email was fake.
different|不同的|唔同嘅|not the same|The two times were different.
show|展示|畀人睇|to let someone see|The camera can show the truth.
secret|秘密的|秘密嘅|not known by others|It was a secret call.
bad|坏的|壞嘅|not good|That was a bad plan.
free|自由的|自由嘅|not held or blamed|The truth could set her free.
help|帮助|幫手|to make something easier for someone|A friend came to help her.
meet|见面|見面|to see and speak to someone|She will meet the boss.
brave|勇敢的|勇敢嘅|ready to face danger|She was brave in the room.
news|消息|消息|new information|The news changed her plan.
name|名字|名|a word used to call a person|The file had no name.
look|看|睇|to use your eyes|She took a closer look.
real|真实的|真嘅|not false|Was the video real?
strange|奇怪的|奇怪嘅|not usual|She saw a strange note.
find|找到|搵到|to discover something|They can find the old file.
friend|朋友|朋友|a person you like and trust|Her friend opened the door.
hurt|伤害|傷害|to cause pain or damage|The lie could hurt everyone.
ask|询问|問|to request information|She will ask one question.
tell|告诉|話畀人知|to give information to someone|The witness will tell the truth.
right|正确的|啱嘅|correct or fair|She wanted to do the right thing.`),
  a2: sampleBook('a2', 'CEFR A2', 'A2', 'Practical situations & motives', '用常见场景词汇识别动机与证据。', `false|不真实的|唔真實嘅|not true|The report was false.
difference|差异|分別|a way in which things are not the same|She found a difference in the dates.
confirm|确认|確認|to say something is true|The camera can confirm her story.
hidden|隐藏的|收埋嘅|kept out of sight|He made a hidden call.
wrong|错误的|錯嘅|not correct|The manager made a wrong claim.
innocent|无辜的|無辜嘅|not guilty of wrongdoing|The record showed she was innocent.
support|支持|支持|to help or agree with someone|Her friend would support her.
question|质问|質問|to ask someone for an explanation|She would question the manager.
calm|冷静的|冷靜嘅|not excited or upset|She stayed calm at the meeting.
surprise|惊喜；意外|驚喜；意外|an unexpected event|The message was a surprise.
nameless|无名的|冇名嘅|without a name|A nameless note arrived.
review|检查|檢查|to study something again|She would review the report.
identify|辨认|認出|to recognize who someone is|They could identify the voice.
confusing|令人困惑的|令人困惑嘅|hard to understand|The note was confusing.
connect|联系|聯繫|to join things together|The dates connect two people.
group|小组|小組|people working together|The group met at night.
trick|诡计|詭計|a dishonest plan|She saw through the trick.
warning|警告|警告|a sign of possible danger|The letter was a warning.
report|报告|報告|a written account of facts|The report changed the hearing.
fairness|公平|公平|treating people equally|She asked for fairness.`),
  b1: sampleBook('b1', 'CEFR B1', 'B1', 'Reasoning & investigation', '练习描述证据、推理与人际冲突。', `invented|编造的|作出嚟嘅|created to deceive|The invented story did not fit.
contradiction|矛盾|矛盾|a statement opposed to another|The contradiction was obvious.
confirm|证实|證實|to show that something is true|The video could confirm her claim.
confidential|机密的|機密嘅|intended to be kept secret|It was a confidential call.
suspicious|可疑的|可疑嘅|making people think something is wrong|The suspicious note was saved.
defend|辩护|辯護|to protect someone from blame|The logs helped defend her.
advantage|优势|優勢|something that helps success|She turned the file into an advantage.
challenge|质疑|質疑|to question a claim|She would challenge the director.
determined|坚定的|堅定嘅|not willing to give up|She stayed determined.
reveal|揭露|揭露|to make known something hidden|The email would reveal the truth.
anonymous|匿名的|匿名嘅|without a known name|An anonymous note arrived.
investigate|调查|調查|to examine facts carefully|She would investigate the seal.
verify|核实|核實|to check that something is true|The engineer could verify the file.
uncertain|不确定的|唔肯定嘅|not known or clear|The message was uncertain.
associate|关联|關聯|to connect two things|The logs associate him with the leak.
coalition|联盟|聯盟|a group working toward one aim|A coalition formed overnight.
treachery|背叛|背叛|betrayal of trust|The treachery came from a friend.
deadline|最后期限|死線|the latest time something must happen|The board set a deadline.
evidence|证据|證據|facts showing what happened|The evidence changed the hearing.
justice|公正|公義|fair treatment under rules|The staff demanded justice.`),
  b2: sampleBook('b2', 'CEFR B2', 'B2', 'Nuanced argument & power', '用更精确的词汇推进复杂的权力博弈。', `fabricated|伪造的|偽造嘅|invented to deceive|The document was fabricated.
discrepancy|不一致|唔一致|a difference that should not exist|She noticed a discrepancy in the logs.
substantiate|证实|證實|to support a claim with evidence|The video could substantiate her account.
clandestine|秘密的|秘密嘅|done in secret|They held a clandestine meeting.
incriminating|显示有罪的|顯示有罪嘅|suggesting guilt|The note was incriminating.
exonerate|洗清嫌疑|洗清嫌疑|to clear from blame|The audit could exonerate her.
leverage|利用|利用|to use for advantage|She would leverage the file.
confront|对质|對質|to face and challenge|She chose to confront the director.
resilient|坚韧的|堅韌嘅|able to recover from difficulty|She remained resilient.
revelation|惊人发现|驚人發現|a surprising fact made known|The revelation changed the case.
anonymous|匿名的|匿名嘅|without a known name|An anonymous source sent the file.
scrutinize|审视|仔細審視|to examine with great care|She would scrutinize each signature.
authenticate|鉴定真伪|鑑定真偽|to establish as genuine|They could authenticate the audio.
ambiguous|含糊的|含糊嘅|open to multiple meanings|The order was ambiguous.
implicate|牵连|牽連|to show involvement in wrongdoing|The ledger could implicate the chairwoman.
alliance|联盟|聯盟|a partnership toward an aim|An unlikely alliance formed.
betrayal|背叛|背叛|an act of disloyalty|The betrayal came from a friend.
ultimatum|最后通牒|最後通牒|a final demand with consequences|The board gave an ultimatum.
testimony|证词|證詞|a formal statement as evidence|Her testimony changed the hearing.
accountability|问责|問責|responsibility for decisions|Workers demanded accountability.`),
}

const legacyHKGlosses: Record<string, string> = {
  fabricated:'偽造嘅', discrepancy:'唔一致；出入', corroborate:'證實；佐證', covert:'秘密嘅', incriminating:'顯示有罪嘅', vindicate:'洗清嫌疑', leverage:'善用；借力', confront:'當面質問', resilient:'有韌性嘅', revelation:'驚人發現',
  forged:'偽造嘅', inconsistency:'唔一致；矛盾', verify:'核實', secretive:'神神秘秘嘅', damning:'對佢極不利嘅', exonerate:'洗清嫌疑', exploit:'利用', challenge:'質疑；挑戰', persistent:'鍥而不捨嘅', disclosure:'披露',
  anonymous:'匿名嘅', scrutinize:'仔細審視', authenticate:'鑑定真偽', ambiguous:'含糊嘅', implicate:'牽連', alliance:'聯盟', betrayal:'背叛', ultimatum:'最後通牒', testimony:'證詞', accountability:'問責',
  unknown:'身份不明嘅', inspect:'仔細檢查', confirm:'確認', vague:'含糊嘅', involve:'牽涉', partnership:'合作關係', deception:'欺騙', demand:'要求', statement:'陳述', responsibility:'責任',
}
for (const id of ['ielts', 'cet6'] as const) for (const word of books[id].words) {
  word.meaningHK = legacyHKGlosses[word.word] || word.meaning
  word.meaningEN = word.definition
}

const storyWords = Object.fromEntries((Object.keys(books) as BookId[]).map((id) => [id, books[id].words.map((item) => item.word)])) as Record<BookId, string[]>

const extraChapters = [
  { title: '匿名者的密钥', subtitle: 'EPISODE 03 · 地下十三层', teaser: '一封匿名信，把线索引向不存在的楼层。', icon: '⌕', ids: [10, 11, 12, 13, 14],
    scenes: [
      (w: string[]) => `匿名邮件只写了一个地址：地下十三层。公司大楼明明只有十二层。林栀循着消防楼梯下去，发现一道没有编号的门。门缝里塞着一份 {${w[10]}} 留下的门禁记录。她刚伸手，楼上传来两个人的脚步声。`,
      (w: string[]) => `她躲进设备间，借手机微光 {${w[11]}} 每一个签名。记录末尾有一行被涂黑的姓名，却与董事长秘书的笔迹相同。要打开那道门，她得先判断卡片上的印章是否真实。`,
      (w: string[]) => `保安老周发来语音：原始录音可以 {${w[12]}}，但那份命令写得极其 {${w[13]}}。林栀把音轨拖慢半拍，听见一个女人说：“让实习生背锅。”这段声音足以 {${w[14]}} 董事会里最有权势的人。门锁突然从里面转动。`,
    ],
    success: ['她把门禁记录藏进袖口，抢在脚步靠近前进入暗门。','笔迹吻合了。那道门背后，藏着真正的原始服务器。','录音保存成功。门后的人，竟先叫出了她的名字。'] },
  { title: '最亲近的人', subtitle: 'EPISODE 04 · 信任测试', teaser: '盟友递来的钥匙，可能也是一把刀。', icon: '♜', ids: [15, 16, 17, 18, 19],
    scenes: [
      (w: string[]) => `开门的是大学室友许遥。三年前，两人曾约定一起改变这家公司。许遥说她掌握了董事长的私人账本，愿意与林栀结成 {${w[15]}}。但她说话时，视线始终避开走廊上的监控。`,
      (w: string[]) => `林栀翻开账本，发现关键一页被人撕走。许遥伸手挡住摄像头，低声说：“你必须信我。”偏偏她的手机亮起，屏幕上是主管发来的付款通知。最痛的 {${w[16]}}，往往来自最熟悉的人。`,
      (w: string[]) => `董事长给林栀下了 {${w[17]}}：天亮前交出录音，否则老周会失业。她没有崩溃，而是请许遥当众留下 {${w[18]}}。许遥握紧手机，终于承认：她收钱是为了救病重的父亲。真正的账本并不在她手里。林栀决定追问谁应该承担 {${w[19]}}。`,
    ],
    success: ['两人暂时联手；但这份信任还需要证据。','许遥沉默了。林栀没有撕破脸，她需要知道背叛背后的原因。','证词录下来了。更危险的选择，现在落在林栀手里。'] },
  { title: '全城直播', subtitle: 'EPISODE 05 · 公开审判', teaser: '当真相公开，谁会先按下断线键？', icon: '◉', ids: [10, 12, 15, 17, 19],
    scenes: [
      (w: string[]) => `清晨，许遥发来一个 {${w[10]}} 链接。它通向公司在外部备份的直播控制台。林栀知道这是陷阱也可能是机会：如果把录音和账本同步放出，董事长再也无法悄悄删除。`,
      (w: string[]) => `直播倒计时开始。技术员要求先 {${w[12]}} 音频，免得对方宣称它是合成的。许遥带着员工代表赶来，这支临时 {${w[15]}} 只有一次机会。屏幕上的观看人数开始飙升。`,
      (w: string[]) => `董事长在镜头前提出最后的 {${w[17]}}：停播，他就撤销对老周的处分。林栀没有替老周做决定。老周自己走到镜头前，要求所有管理者承担 {${w[19]}}。直播间一瞬间安静下来，接着评论刷满了同一个词：证据。`,
    ],
    success: ['她保留备份，直播控制权回到自己手中。','音频通过核验。故事第一次由他们自己讲述。','公开证据改变了局势，可董事长仍握着最后一张牌。'] },
  { title: '最后一页', subtitle: 'EPISODE 06 · 终局反转', teaser: '最后的证据，藏在故事一开始的那封邮件里。', icon: '✦', ids: [11, 13, 16, 18, 19],
    scenes: [
      (w: string[]) => `董事长把一份旧合同投上大屏，声称一切都是林栀策划的。她没有急着反驳，而是重新 {${w[11]}} 第一章那封邮件。邮件署名下面，有一个几乎看不见的笔画。`,
      (w: string[]) => `那笔画来自许遥父亲设计的内部字体，指向一条 {${w[13]}} 的合同条款。林栀终于懂了：许遥的 {${w[16]}} 只是被迫演给董事长看的戏。真正的原始账本，一直藏在那封“伪造邮件”的附件里。`,
      (w: string[]) => `听证会重新开始。老周与许遥先后给出 {${w[18]}}，所有线索汇成完整证据链。林栀把最后一页交给员工代表，而不是交给某个新的权力者。她要的不是复仇结束，而是每个人都能得到 {${w[19]}}。门外天亮了。手机弹出一条新消息：“下一个故事，轮到你写。”`,
    ],
    success: ['她找到了那枚被所有人忽略的标记。','那场背叛有了新的解释。许遥把真正的钥匙交给了她。','真相公开。林栀不再是被开除的实习生，而是改变结局的人。'] },
]

export function getChapters(bookId: BookId): Chapter[] {
  const w = storyWords[bookId]
  return [
    {
      title: '被开除的实习生', subtitle: 'EPISODE 01 · 零点之后', teaser: '一封伪造邮件，将她推向全公司的审判台。', icon: '✉', quizWords: w.slice(0, 5),
      segments: [
        {
          eyebrow: '01 / 03 · 指控',
          text: `凌晨 00:17，林栀的工牌在闸机上亮起红灯。她刚被宣布泄露了公司最重要的收购方案。会议室里，所有人的目光像刀一样落在她身上。唯一的证据，是一封从她邮箱发出的邮件。她看了一眼附件，心里一沉：那份文件根本不是她写的。它是 {${w[0]}} 的。`,
          focus: w[0], prompt: 'The evidence was ______ to frame her.',
          options: [w[0], w[2], w[3]], hint: '提示：文件并非真实，而是有人故意制造。',
          success: '你识破了假证据。林栀抬起头，第一次要求检查原始记录。',
        },
        {
          eyebrow: '02 / 03 · 裂缝',
          text: `她从会议桌上抽出两份打印记录。一份显示邮件在 00:12 发出；另一份却显示她的账号直到 00:16 才登录。四分钟的 {${w[1]}}，足够让整个指控崩塌。主管伸手想抢走纸张，她先一步拍下了照片。`,
          focus: w[1], prompt: 'There was a ______ between the two timestamps.',
          options: [w[4], w[1], w[0]], hint: '提示：两个本应一致的时间，出现了不一致。',
          success: '时间线出现裂缝。你获得了一条关键证据。',
        },
        {
          eyebrow: '03 / 03 · 证人',
          text: `保安老周突然给她发来一张监控截图：00:12，一个戴帽子的人站在她的工位前。影像模糊，却能看见那人的员工胸牌。林栀需要有人 {${w[2]}} 这段影像，证明它没有被改动。与此同时，她发现主管与陌生号码有一通 {${w[3]}} 通话，聊天记录里还有一条足以定罪的 {${w[4]}} 指令。`,
          focus: w[2], prompt: 'A witness can ______ her story with the security footage.',
          options: [w[1], w[2], w[4]], hint: '提示：证人提供支持，让她的说法更可信。',
          success: '监控被核实。林栀拿到了进入档案室的权限。',
          failure: '你急着公开截图。对方反咬一口，称影像是剪辑的。林栀被迫绕路寻找原始录像。',
          remedy: '补救行动：你联系保安老周取得带时间戳的原始录像。线索重新接上，但对方已经察觉。',
        },
      ],
    },
    {
      title: '董事会前的反击', subtitle: 'EPISODE 02 · 真相的代价', teaser: '公开审查当场翻盘，却引出更大的幕后黑手。', icon: '⚖', quizWords: w.slice(5, 10),
      segments: [
        {
          eyebrow: '01 / 03 · 封存的文件',
          text: `档案室的门在她身后咔哒一声合上。文件柜最底层，藏着一份 {${w[4]}} 的转账记录：收款人竟然是那位指控她的主管。林栀没有立刻拿去质问。她要让证据在董事会现场 {${w[5]}} 她。`,
          focus: w[5], prompt: 'The audit record could ______ her completely.',
          options: [w[5], w[7], w[9]], hint: '提示：证据让一个被冤枉的人洗清嫌疑。',
          success: '她保住了证据链，准备在所有人面前翻盘。',
        },
        {
          eyebrow: '02 / 03 · 倒计时',
          text: `董事会开场前十分钟，对方提出私下和解：签字离开，他们就不追责。林栀把协议推了回去。她可以 {${w[6]}} 手中的审计记录，迫使他们公开系统日志。手机屏幕亮起，只剩三分钟。`,
          focus: w[6], prompt: 'She chose to ______ the audit trail to force a public review.',
          options: [w[8], w[6], w[5]], hint: '提示：把已有资源用在最有利的地方。',
          success: '对方让步了。公开审查开始。',
        },
        {
          eyebrow: '03 / 03 · 反转',
          text: `大屏幕亮起。删除记录的人不是林栀，而是主管本人。她一直保持着 {${w[8]}} 的意志，终于走到台前，当场 {${w[7]}} 他。会议室一片寂静。她以为这就是终点，直到董事长的私人邮箱弹出一封匿名邮件。这一惊人的 {${w[9]}} 指向更深的秘密：真正指使他的人，还坐在这张桌旁。`,
          focus: w[7], prompt: 'She decided to ______ the director in front of the board.',
          options: [w[9], w[5], w[7]], hint: '提示：她决定面对面质问他。',
          success: '林栀赢回清白，也揭开了更大的谜团。地下十三层，究竟藏着什么？',
        },
      ],
    },
    ...extraChapters.map((spec, chapterIndex): Chapter => ({
      title: spec.title, subtitle: spec.subtitle, teaser: spec.teaser, icon: spec.icon,
      quizWords: spec.ids.map((id) => w[id]),
      segments: spec.scenes.map((makeText, segmentIndex) => {
        const focus = w[spec.ids[segmentIndex]]
        const word = books[bookId].words.find((item) => item.word === focus)!
        const options = [focus, w[spec.ids[(segmentIndex + 1) % 5]], w[spec.ids[(segmentIndex + 3) % 5]]]
        return { eyebrow: `${String(segmentIndex + 1).padStart(2, '0')} / 03 · ${['线索', '抉择', '转折'][segmentIndex]}`,
          text: makeText(w), focus, prompt: word.example.replace(new RegExp(`\\b${focus}\\b`, 'i'), '______'),
          options: [options[(chapterIndex + segmentIndex) % 3], options[(chapterIndex + segmentIndex + 1) % 3], options[(chapterIndex + segmentIndex + 2) % 3]],
          hint: `提示：${word.definition}`, success: spec.success[segmentIndex],
          ...(chapterIndex === 1 && segmentIndex === 1 ? { failure: '你当众指责许遥，她立刻切断了服务器。林栀失去了最重要的线索。', remedy: '补救行动：你先给许遥父亲打电话，得到合同原件。两人重新达成脆弱的合作。' } : {}),
        }
      }),
    })),
  ]
}
