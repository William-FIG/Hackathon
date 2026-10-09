import type { Book, Chapter, Lang } from './types'

interface StoryCopy { title: string; teaser: string; scenes: string[]; success: string[]; failure?: string; remedy?: string }

const en: StoryCopy[] = [
  { title:'The Fired Intern', teaser:'A forged email puts her on trial before the whole company.', scenes:[
    'At 00:17, Lin Zhi’s access badge flashed red. She had just been accused of leaking the company’s biggest acquisition plan. Every eye in the boardroom turned to her. The only evidence was an email sent from her account. She opened the attachment and knew at once: she had never written it. It was {0}.',
    'She laid two printed logs on the table. One said the email left at 00:12; the other showed that her account did not log in until 00:16. That four-minute {1} could bring down the accusation. The manager reached for the pages. She photographed them first.',
    'Security guard Zhou sent her a camera frame: at 00:12, someone in a cap stood at her desk. She needed a witness to {2} that the footage was genuine. Then she found a {3} call from the manager to an unknown number—and an {4} instruction in the chat history.',
  ], success:['You spotted the false evidence. Lin Zhi asked to see the original logs.','The timeline cracked. You secured a crucial clue.','The footage was verified. Lin Zhi gained access to the archive.'], failure:'You released the screenshot too soon. The manager called it edited footage, and Lin Zhi had to find the original video.', remedy:'Recovery: Zhou provided the original timestamped recording. The case is back on track, but someone knows she is close.' },
  { title:'The Boardroom Strike', teaser:'A public audit clears her name and exposes a deeper enemy.', scenes:[
    'The archive door clicked shut behind her. At the bottom of a cabinet lay an {4} transfer record. The recipient was the very manager who had accused her. Lin Zhi held back. She wanted the evidence to {5} her before the entire board.',
    'Ten minutes before the hearing, they offered a private deal: sign and leave, and they would drop the case. Lin Zhi pushed the paper away. She could {6} the audit trail to force the board to publish the system logs. Three minutes remained.',
    'The screen lit up. The deleted files led to the manager, not Lin Zhi. She had stayed {8} through every setback; now she stood and chose to {7} him. An anonymous email appeared on the chairwoman’s screen. Its {9} pointed to someone still sitting at the table.',
  ], success:['She preserved the chain of evidence for a public reversal.','They yielded. The open review began.','Her name was cleared, but what lies on the hidden thirteenth floor?'] },
  { title:'The Anonymous Key', teaser:'A message leads to a floor the building does not have.', scenes:[
    'The anonymous message contained one address: basement level thirteen. The tower had only twelve. Lin Zhi went down the fire stairs and found an unmarked door. A badge log left by an {10} source had been slipped underneath. Footsteps sounded above her.',
    'She hid in a service room and began to {11} every signature by phone light. The last name had been blacked out, but the handwriting matched the chairwoman’s secretary. To open the door, she had to decide whether the seal was real.',
    'Zhou sent a voice note: the recording could be {12}, but the order itself was deliberately {13}. Lin Zhi slowed the audio. A woman said, “Let the intern take the blame.” The clip could {14} the most powerful person in the boardroom. The lock turned from inside.',
  ], success:['She slipped through the door before the footsteps reached her.','The handwriting matched. The original server was behind that door.','The audio was saved. Someone behind the door already knew her name.'] },
  { title:'The Closest Ally', teaser:'A key from a friend might also be a blade.', scenes:[
    'Her university roommate Xu Yao opened the door. Three years earlier, they had promised to change this company together. Xu Yao offered a private ledger and proposed an {15}. Yet she would not look toward the corridor camera.',
    'A crucial page had been torn from the ledger. Xu Yao covered the camera and whispered, “You have to trust me.” Her phone lit up: a payment from the manager. The worst {16} can come from the person you know best.',
    'The chairwoman issued an {17}: surrender the audio by dawn or Zhou would lose his job. Lin Zhi asked Xu Yao for recorded {18}. Xu Yao admitted she had taken the money to help her sick father. The real ledger was elsewhere. Who would accept {19}?',
  ], success:['They formed a fragile partnership, but trust still needed proof.','Lin Zhi did not accuse her yet. She needed the reason behind the betrayal.','The testimony was recorded. A harder choice now awaited Lin Zhi.'], failure:'You accused Xu Yao in public. She cut power to the server, and the best clue disappeared.', remedy:'Recovery: Lin Zhi called Xu Yao’s father and obtained the original contract. Their uneasy alliance resumed.' },
  { title:'The City Watches', teaser:'Once the truth goes live, who will cut the feed?', scenes:[
    'At dawn, Xu Yao sent an {10} link to an external broadcast console. It might be a trap or a chance. If Lin Zhi released the audio and ledger together, the chairwoman could no longer erase them quietly.',
    'The stream counted down. A technician insisted on {12} the audio first, so no one could dismiss it as synthetic. Xu Yao arrived with employee representatives. Their temporary {15} had one chance. Viewer numbers began to climb.',
    'On camera, the chairwoman delivered an {17}: end the stream and Zhou keeps his job. Lin Zhi let Zhou decide. He stepped into frame and demanded {19} from every manager. The chat went silent, then flooded with one word: evidence.',
  ], success:['She kept a backup and regained control of the broadcast.','The recording passed inspection. They told the story in their own voices.','The evidence was public, but the chairwoman held one last card.'] },
  { title:'The Final Page', teaser:'The last clue was hidden in the email from the beginning.', scenes:[
    'The chairwoman displayed an old contract, claiming Lin Zhi had planned everything. Instead of arguing, Lin Zhi began to {11} the email from chapter one. Beneath the signature was a nearly invisible stroke.',
    'That stroke came from an internal font designed by Xu Yao’s father. It pointed to an {13} clause in the contract. Lin Zhi understood: Xu Yao’s {16} had been an act staged under threat. The original ledger had been inside the “fake” email all along.',
    'The hearing resumed. Zhou and Xu Yao gave their {18}, completing the chain of evidence. Lin Zhi handed the final page to the employees, not a new person in power. She wanted more than revenge: she wanted {19}. Outside, dawn broke. A new message appeared: “The next story is yours to write.”',
  ], success:['She found the mark everyone else had missed.','The betrayal made sense. Xu Yao gave her the real key.','The truth was public. Lin Zhi was no longer the fired intern; she had changed the ending.'] },
]

const hk: StoryCopy[] = [
  { title:'被炒嘅實習生', teaser:'一封假電郵，令佢喺全公司面前被審判。', scenes:[
    '凌晨 00:17，林梔張員工證喺閘機上閃起紅燈。公司話佢洩漏咗收購計劃，會議室所有人都望住佢。唯一證據，係一封由佢帳戶寄出嘅電郵。佢一睇附件就知：份文件根本唔係佢寫，係 {0} 嘅。',
    '佢攞出兩份紀錄。一份話電郵 00:12 發出，另一份顯示佢個帳戶 00:16 先登入。四分鐘嘅 {1}，足夠推翻指控。主管伸手想搶，佢快一步影低咗。',
    '保安周叔傳來閉路電視截圖：00:12，有個戴帽嘅人企喺佢張枱前。林梔要搵人 {2} 影像冇被改動。跟住佢發現主管有通 {3} 電話，對話紀錄仲留低一條 {4} 指令。',
  ], success:['你識穿咗假證據。林梔要求睇原始紀錄。','時間線穿咗窿，你攞到關鍵線索。','錄影核實咗，林梔可以進入檔案室。'], failure:'你太早公開截圖。對方反咬話影像被剪接，林梔要改行另一條路搵原片。', remedy:'補救行動：周叔攞出有時間戳嘅原始錄影。線索接返上，但對方已經發現。' },
  { title:'董事會前嘅反擊', teaser:'公開審查幫佢翻案，卻帶出更大嘅黑手。', scenes:[
    '檔案室道門喺身後「啪」一聲閂埋。櫃底有份 {4} 轉帳紀錄，收錢嘅竟然係指控佢嗰位主管。林梔冇即刻質問；佢要份證據喺董事會面前 {5} 佢。',
    '開會前十分鐘，對方提出私下和解：簽字走人就唔追究。林梔推返份協議。佢可以 {6} 審計紀錄，迫董事會公開系統日誌。仲有三分鐘。',
    '大屏幕亮起。刪紀錄嘅唔係林梔，而係主管。佢一直咁 {8}，終於行到台前，當面 {7} 佢。董事長信箱突然收到匿名電郵；嗰個 {9} 指向仲坐喺枱邊嘅另一個人。',
  ], success:['佢保住咗證據鏈，準備公開翻案。','對方讓步，公開審查開始。','佢洗清嫌疑，但地下十三層究竟收埋咗啲乜？'] },
  { title:'匿名者嘅鎖匙', teaser:'一封匿名信，帶佢去一層唔存在嘅樓。', scenes:[
    '匿名電郵得一個地址：地庫十三層。但公司大樓明明得十二層。林梔沿防火梯落去，搵到一道冇編號嘅門。門底塞住一份由 {10} 人留下嘅門禁紀錄。樓上突然傳嚟腳步聲。',
    '佢匿入機房，靠手機光逐個 {11} 簽名。最後一個名被塗黑，但筆跡同董事長秘書一樣。要開門，佢首先要確定印章係真定假。',
    '周叔傳來錄音：原檔可以 {12}，但命令寫得非常 {13}。林梔將聲軌放慢，聽到個女人講：「叫實習生頂罪。」呢段聲足以 {14} 董事會最有權嗰位。門鎖突然由入面轉動。',
  ], success:['佢收好紀錄，趕喺腳步聲到之前入咗門。','筆跡對得上，原始伺服器就喺門後。','錄音保住咗。門後嗰個人竟然識叫佢個名。'] },
  { title:'最親近嘅人', teaser:'朋友畀嘅鎖匙，可能同時係把刀。', scenes:[
    '開門嘅係大學室友許遙。三年前，佢哋約好一齊改變公司。許遙話有董事長嘅私人帳本，想同林梔結成 {15}。但佢一路避開走廊鏡頭。',
    '帳本最重要嗰頁被撕走。許遙遮住鏡頭，細聲講：「你一定要信我。」偏偏手機亮起，係主管畀佢嘅轉帳通知。最痛嘅 {16}，通常都嚟自最熟嗰個。',
    '董事長落咗 {17}：天光前交出錄音，否則周叔失業。林梔請許遙當眾留低 {18}。許遙承認收錢係為咗救病重嘅爸爸，真正帳本唔喺佢度。咁邊個要負起 {19}？',
  ], success:['佢哋暫時聯手，但信任仲要靠證據。','林梔冇即刻揭穿佢，想先知背後原因。','證詞錄低咗。更難嘅選擇而家先開始。'], failure:'你當眾指責許遙，佢即刻熄咗伺服器，最重要嘅線索冇咗。', remedy:'補救行動：你搵許遙爸爸攞到原始合約，兩人勉強重新合作。' },
  { title:'全城直播', teaser:'真相一公開，邊個會首先掹線？', scenes:[
    '清晨，許遙傳來一條 {10} 連結，去到公司外部直播控制台。可能係陷阱，亦可能係機會。只要同步放出錄音同帳本，董事長就再刪唔走。',
    '直播倒數開始。技術員話要先 {12} 音頻，免得對方話係合成。許遙帶員工代表趕到，呢個臨時 {15} 只得一次機會。觀看人數不停升。',
    '董事長對住鏡頭落最後 {17}：停播就放過周叔。林梔畀周叔自己揀。佢行到鏡頭前，要求所有管理層負起 {19}。留言區靜咗一秒，跟住全屏都係「證據」。',
  ], success:['佢保留備份，重新掌握直播控制權。','錄音核實咗，今次由佢哋自己講故事。','證據公開咗，但董事長仲有最後一張牌。'] },
  { title:'最後一頁', teaser:'最後證據，一直藏喺故事開頭嗰封電郵。', scenes:[
    '董事長將舊合約投上大屏，話一切都係林梔策劃。佢冇急住反駁，而係重新 {11} 第一章嗰封電郵。簽名下面，有一筆幾乎睇唔見。',
    '嗰筆畫來自許遙爸爸設計嘅內部字體，指向合約入面一條 {13} 條款。林梔明白咗：許遙嘅 {16} 只係被迫演畀董事長睇。真正帳本，一直喺「假電郵」附件。',
    '聽證會重新開始。周叔同許遙先後交出 {18}，所有線索終於接成完整證據鏈。林梔將最後一頁畀員工代表，而唔係畀另一個掌權者。佢要嘅唔只係報仇，而係每個人都有 {19}。門外天光喇。手機收到新訊息：「下一個故事，到你寫。」',
  ], success:['佢搵到所有人都睇漏嘅記號。','背叛原來另有原因。許遙畀咗佢真正嘅鎖匙。','真相公開。林梔唔再係被炒嘅實習生，而係改寫結局嘅人。'] },
]

interface GenreEnhancement {
  title: Record<Lang, string>
  teaser: Record<Lang, string>
  beats: Record<Lang, string[]>
}

const genreEnhancements: GenreEnhancement[] = [
  {
    title: { 'zh-CN': '：黑卡觉醒', 'zh-HK': '：黑卡覺醒', en: ': The Black Card Awakens' },
    teaser: { 'zh-CN': '她被推到最低谷，但一张不该出现在实习生手里的黑卡正在等她翻牌。', 'zh-HK': '佢跌到最低谷，但一張唔應該喺實習生手上嘅黑卡，正等緊佢出牌。', en: 'She is pushed to rock bottom, but a black card no intern should own is waiting to change the game.' },
    beats: {
      'zh-CN': ['会议室门外，一辆没有车牌的黑色跑车停在雨幕里。车门打开，神秘的董事长沈夜只说了一句：“谁准你们动我的人？”', '主管以为她已经无路可走，甚至当众撕碎她的实习合约。林栀没有哭，只把碎纸一片片收好，因为她口袋里的黑卡刚刚发出了一声轻响。', '她把黑卡贴上会议室的终端，屏幕立刻跳出最高权限。刚才还在嘲笑她的人同时闭嘴；沈夜抬眼，像终于确认了一个失踪多年的名字。'],
      'zh-HK': ['會議室出面停咗架冇車牌嘅黑色跑車。車門打開，神秘董事長沈夜只講一句：「邊個准你哋郁我嘅人？」', '主管以為佢已經冇路行，仲喺眾人面前撕爛佢份實習合約。林梔冇喊，只係逐塊執返啲碎紙，因為袋入面嗰張黑卡突然震咗一下。', '佢將黑卡貼上終端，螢幕即刻跳出最高權限。頭先仲笑緊佢嘅人全部收聲；沈夜抬起眼，好似終於認出一個失蹤咗好多年嘅名字。'],
      en: ['Outside the boardroom, a black car with no plates waited in the rain. Its mysterious chairman, Shen Ye, stepped out and asked, “Who gave you permission to touch my person?”', 'The manager tore up her internship contract in front of everyone. Lin Zhi did not cry. She gathered every piece because the black card in her pocket had just clicked awake.', 'She touched the card to the terminal. Highest-level access flashed across the screen. The room fell silent, and Shen Ye looked at her as if he had finally found a name lost for years.'],
    },
  },
  {
    title: { 'zh-CN': '：冰山总裁的赌局', 'zh-HK': '：冰山總裁嘅賭局', en: ": The CEO's Dangerous Bet" },
    teaser: { 'zh-CN': '董事会想把她赶出去，冰山掌权者却把全城的赌注压在她身上。', 'zh-HK': '董事會想趕佢走，冰山掌權者卻將全城賭注壓喺佢身上。', en: 'The board wants her gone, but an icy power broker puts the city’s biggest bet on her.' },
    beats: {
      'zh-CN': ['董事会开门时，沈夜坐在主位，脸色苍白得像从未见过阳光。他把一份新合约推到她面前：“签下它，你不是我的员工，而是我的合伙人。”', '所有人都等她跪下求饶。林栀却提出一个荒唐条件：让全体董事交出手机，接受三分钟公开审查。沈夜嘴角微微上扬，像在欣赏一场危险的表演。', '屏幕上的审计结果一条条亮起，主管的资金流向被当场钉死。沈夜站起来替她挡住所有镜头：“从今天起，谁再叫她废物，就先向我解释。”'],
      'zh-HK': ['董事會開門嗰陣，沈夜坐喺主位，面色白到似未見過陽光。佢將新合約推畀林梔：「簽咗佢，你唔係我員工，而係我合伙人。」', '所有人等緊佢跪低求饒。林梔反而提出一個離譜條件：所有董事交出手機，接受三分鐘公開審查。沈夜嘴角微微一勾，似乎好享受呢場危險表演。', '審計結果逐條彈出，主管嘅資金流向當場被釘死。沈夜企起身擋住所有鏡頭：「由今日開始，邊個再叫佢廢物，就先同我解釋。」'],
      en: ['When the board opened, Shen Ye sat at the head of the table, pale as if sunlight had never touched him. He pushed a new contract toward her. “Sign it. You will not be my employee. You will be my partner.”', 'Everyone expected her to beg. Instead, Lin Zhi demanded that every director surrender a phone for a three-minute public audit. Shen Ye smiled slightly, enjoying the dangerous performance.', 'Audit results flashed across the screen and trapped the manager’s money trail. Shen Ye stood between Lin Zhi and the cameras. “From today, anyone who calls her useless answers to me first.”'],
    },
  },
  {
    title: { 'zh-CN': '：午夜血族', 'zh-HK': '：午夜血族', en: ': Midnight Bloodline' },
    teaser: { 'zh-CN': '地下十三层藏着的不只是服务器，还有沈夜不肯承认的吸血鬼血统。', 'zh-HK': '地庫十三層收埋嘅唔止係伺服器，仲有沈夜唔肯承認嘅吸血鬼血統。', en: 'Basement thirteen hides more than a server: it hides the vampire bloodline Shen Ye refuses to admit.' },
    beats: {
      'zh-CN': ['地下十三层的门一开，冷气里混着铁锈般的气味。沈夜站在黑暗里，瞳孔短暂地闪过猩红：“看见这一切，你还敢留下？”', '林栀还没回答，一个穿校服的男孩从服务器后面探出头来。他叫顾言，是拿奖学金来实习的纯情学生，手里却握着能破解血族档案的旧学生证。', '沈夜终于承认，自己不是普通总裁，而是守着百年秘密的夜族继承人。林栀没有后退，只把证据塞回他手里：“那就用你的黑暗，把真正的怪物照出来。”'],
      'zh-HK': ['地庫十三層道門一開，冷氣入面夾住鐵鏽味。沈夜企喺黑暗入面，瞳孔一閃猩紅：「見到呢一切，你仲敢留低？」', '林梔未答，一個着校服嘅男仔由伺服器後面探出頭。佢叫顧言，係靠獎學金嚟實習嘅純情學生，但手上竟然有張可以破解血族檔案嘅舊學生證。', '沈夜終於承認，自己唔係普通總裁，而係守住百年秘密嘅夜族繼承人。林梔冇退後，只將證據塞返畀佢：「咁就用你嘅黑暗，照出真正嘅怪物。」'],
      en: ['When the door to basement thirteen opened, the cold air smelled of iron. Shen Ye stood in the dark, his pupils flashing red for one second. “Now that you have seen this, will you still stay?”', 'Before Lin Zhi could answer, a boy in a school uniform peeked from behind the server. Gu Yan was a pure-hearted scholarship student, yet his old student card could unlock the vampire archive.', 'Shen Ye admitted he was not an ordinary CEO but the heir to a century-old night clan. Lin Zhi did not step back. “Then use your darkness to expose the real monster.”'],
    },
  },
  {
    title: { 'zh-CN': '：真假千金', 'zh-HK': '：真假千金', en: ': The False Heiress' },
    teaser: { 'zh-CN': '一份亲子鉴定撕开豪门面具：她和许遥，究竟谁才是真正的千金？', 'zh-HK': '一份親子鑑定撕開豪門面具：佢同許遙，到底邊個先係真正千金？', en: 'A DNA report tears through the family mask: which friend is the real heiress?' },
    beats: {
      'zh-CN': ['豪门晚宴上，许遥被推上台，所有人喊她“真正的千金”。下一秒，大屏幕出现另一份鉴定报告：林栀的血型与失踪继承人完全吻合。', '冒牌千金的笑容碎了。她哭着说自己只是被人利用，沈夜却把一把祖传钥匙放到林栀手中：“你可以选择原谅，但不能再把命交给别人。”', '林栀看着曾经最亲近的人，提出第三条路：不让任何一个女孩替家族的罪孽背锅。真正的反派终于从幕后走出，手里拿着她母亲当年的照片。'],
      'zh-HK': ['豪門宴會上，許遙被推上台，人人叫佢「真正千金」。下一秒，大屏幕彈出另一份報告：林梔血型同失蹤繼承人完全吻合。', '冒牌千金個笑容碎晒。佢喊住話自己只係畀人利用，沈夜卻將祖傳鎖匙放入林梔手中：「你可以選擇原諒，但唔可以再將條命交畀人。」', '林梔望住曾經最親近嘅人，提出第三條路：唔好再由任何一個女仔替家族罪孽頂鑊。真正反派終於由幕後行出，手上仲拎住佢媽媽當年嘅相。'],
      en: ['At the family gala, Xu Yao was placed on stage and announced as the “true heiress.” Then a second DNA report filled the screen: Lin Zhi matched the missing heir.', 'The false heiress’s smile shattered. She said she had only been used. Shen Ye placed an heirloom key in Lin Zhi’s hand. “You may forgive her, but never hand your life to someone else again.”', 'Lin Zhi offered a third choice: no girl would carry the family’s crimes alone. The real villain finally stepped from the shadows, holding a photograph of Lin Zhi’s mother.'],
    },
  },
  {
    title: { 'zh-CN': '：全城打脸直播', 'zh-HK': '：全城打臉直播', en: ': The Citywide Slap-Back' },
    teaser: { 'zh-CN': '曾经嘲笑她的人全部在线，林栀决定让他们亲眼看完真相。', 'zh-HK': '以前笑佢嗰班人全部在線，林梔決定要佢哋親眼睇晒真相。', en: 'Everyone who mocked her is watching. Lin Zhi decides they will witness the truth live.' },
    beats: {
      'zh-CN': ['直播间一开，评论区刷满“废物实习生”。林栀把镜头转向沈夜，问他是否愿意公开夜族契约。这个向来高高在上的男人，竟然在全城面前低头：“为了她，我愿意。”', '顾言在后台疯狂敲键盘，纯情学生第一次向全网发出挑战。许遥则站到镜头前承认自己曾经撒谎，所有退婚、陷害和假报告像连环炸弹一样爆开。', '董事长试图切断直播，沈夜抬手打了一个响指，整座城市的备用屏幕同时亮起。曾经羞辱林栀的人开始道歉，但她只说：“迟来的后悔，不是免死金牌。”'],
      'zh-HK': ['直播一開，留言區洗版話「廢物實習生」。林梔將鏡頭轉向沈夜，問佢肯唔肯公開夜族契約。呢個一向高高在上嘅男人，竟然喺全城面前低頭：「為咗佢，我願意。」', '顧言喺後台瘋狂打字，純情學生第一次向全網發出挑戰。許遙企到鏡頭前承認自己講過大話，退婚、陷害同假報告逐件爆出。', '董事長想切斷直播，沈夜一打響指，全城備用螢幕同時亮起。以前羞辱林梔嗰班人開始道歉，但佢只講：「太遲嘅後悔，唔係免死金牌。」'],
      en: ['When the stream opened, the comments filled with “useless intern.” Lin Zhi turned the camera toward Shen Ye and asked if he would reveal the night-clan contract. The untouchable man lowered his head before the city. “For her, I will.”', 'Gu Yan attacked the system from backstage, a pure-hearted student making his first challenge to the entire internet. Xu Yao admitted her lies on camera, and the broken engagement, traps, and false report exploded into one chain.', 'The chairwoman tried to cut the feed. Shen Ye snapped his fingers, and every backup screen in the city lit up. The people who mocked Lin Zhi began apologizing. She only said, “Late regret is not a get-out-of-jail card.”'],
    },
  },
  {
    title: { 'zh-CN': '：终局继承人', 'zh-HK': '：終局繼承人', en: ': The Heir of the Last Page' },
    teaser: { 'zh-CN': '最后一页揭开真正身世：她不是被豪门抛弃的人，而是能决定豪门命运的人。', 'zh-HK': '最後一頁揭開真正身世：佢唔係畀豪門拋棄嘅人，而係可以決定豪門命運嘅人。', en: 'The final page reveals the truth: she was not abandoned by the family; she can decide its fate.' },
    beats: {
      'zh-CN': ['终局听证会开始，真正的反派拿出母亲签名的遗嘱，宣布林栀只是冒牌货。林栀却发现遗嘱纸张上有一滴百年前的血印，那是夜族继承人才能辨认的密码。', '沈夜想替她承担一切，林栀却拒绝躲在霸总身后。她让顾言打开学生证里的隐藏档案，让许遥公开家族交易，自己则把最后一页放到全城屏幕上。', '所有人终于知道，林栀才是这场权力游戏真正的继承人。她没有踩死任何一个被操控的女孩，而是重写规则；沈夜在灯下笑了，城市也迎来了一个不再需要隐藏的黎明。'],
      'zh-HK': ['終局聽證會開始，真正反派拎出有媽媽簽名嘅遺囑，話林梔只係冒牌貨。但林梔發現紙上有滴百年前嘅血印，嗰個係夜族繼承人先睇得明嘅密碼。', '沈夜想替佢孭晒一切，林梔卻拒絕躲喺霸總背後。佢叫顧言打開學生證嘅隱藏檔案，又叫許遙公開家族交易，自己就將最後一頁放上全城螢幕。', '所有人終於知道，林梔先係權力遊戲真正繼承人。佢冇踩低任何一個畀人操控嘅女仔，而係重新寫規則；沈夜喺燈光下笑咗，城市亦迎來一個唔使再隱藏嘅黎明。'],
      en: ['The final hearing began. The true villain produced a will bearing Lin Zhi’s mother’s signature and called her a fake. Lin Zhi noticed a century-old blood mark in the paper—the code only a night-clan heir could read.', 'Shen Ye tried to carry the danger for her, but Lin Zhi refused to hide behind a powerful CEO. She had Gu Yan open the hidden file in his student card, Xu Yao reveal the family deals, and placed the final page on every city screen.', 'Everyone learned that Lin Zhi was the true heir to the power game. She did not destroy the girls who had been manipulated; she rewrote the rules. Shen Ye smiled beneath the lights, and the city met a dawn that no longer needed secrets.'],
    },
  },
]

const longFormScenes: string[][] = [
    [
      'The accusation did not begin with the email. It began three weeks earlier, when Lin Zhi found a sealed folder in the executive elevator and returned it instead of selling it to a rival. Since then, the manager had watched her with the patience of a hunter. Tonight, the hunter finally had a stage. He described her as a poor scholarship student who had mistaken one lucky internship for a place among the powerful. Lin Zhi stood beneath the white lights, listening to laughter move around the room. She remembered her mother’s last warning: when a powerful person is too certain you will lose, ask what they are afraid you will find.',
      'The chairman did not attend the first ten minutes. That absence made the humiliation worse. A termination form appeared on the screen, already signed before Lin Zhi had been questioned. The manager invited her to apologise, then offered to let her leave quietly if she admitted that the file was hers. Every word was designed to make resistance look childish. Lin Zhi lowered her eyes and asked for a glass of water. While everyone watched her hands, she used the reflection in the glass to photograph the access panel behind the manager. A red light blinked twice. Someone had entered the room using a master identity.',
      'When the black card answered her touch, it did not merely unlock the terminal. It opened a private archive carrying the seal of the missing Lin family trust. A voice message played from a woman who sounded exactly like her mother: “If they make you kneel, remember that the room belongs to the person who controls the door.” The projector changed from the forged email to a live map of every login. Gasps broke through the boardroom. Shen Ye finally stepped from the shadows, his expression cold enough to stop the laughter. “You wanted her out,” he said. “Now explain why my successor was framed.”',
    ],
  [
    'The boardroom became a battlefield before anyone admitted there was a war. Shen Ye placed a silver pen beside the contract and told Lin Zhi she had exactly sixty seconds to sign. The directors watched her like spectators at an auction. They wanted the poor intern to believe the offer was mercy. In truth, the contract transferred a failing subsidiary to her name, along with every hidden debt attached to it. Lin Zhi read the final page twice. Then she noticed the signature line was printed in the same unusual ink as the forged email.',
    'She asked Shen Ye why he was helping her. He answered with a question: “If I wanted to save you, would I bring you into a room full of people who hate you?” The manager interrupted and accused her of seducing the chairman for protection. The insult was deliberate; it gave the directors an excuse to ignore the evidence. Lin Zhi let the accusation hang in the air. While they argued, she connected the black card to the meeting system and copied the audit trail into an account no one in the company knew existed.',
    'The reversal arrived in layers. First, the audit showed the manager had moved money through six shell companies. Then the cameras revealed that one director had entered Lin Zhi’s office before the forged email appeared. Finally, the contract’s hidden clause proved the board had planned to make her responsible for the crime. Shen Ye stood, tore the contract in half, and told the room that Lin Zhi was not being rescued. She was being invited to take the throne. Behind the applause, an anonymous message appeared: BASEMENT THIRTEEN IS OPEN.',
  ],
  [
    'The basement had no lift, no security guard, and no record in the building plan. Lin Zhi counted thirteen flights of stairs while Shen Ye walked behind her without making a sound. At the final landing, the temperature dropped. The wall was covered in portraits of the company’s founders, but every face had been scratched out except one. A small plaque carried her mother’s name and a date from before Lin Zhi was born. Shen Ye told her to turn back. She asked why he was afraid of a room he had built.',
    'The answer came from Gu Yan, the scholarship student hiding behind a server rack. He had been hired to sort old records, but he discovered the company had two databases: one for ordinary employees and one for people who did not age normally. He spoke quickly, blushing whenever Lin Zhi looked at him, yet his hands never shook over the keyboard. His old student card opened a vampire archive. Inside it was a list of bloodline contracts, including one signed by a child named Lin Zhi.',
    'Shen Ye’s secret was not a costume or a metaphor. He had inherited a night-clan oath that required him to protect the missing heir until her eighteenth birthday, then surrender the family throne to her. The manager had tried to kill the heir before the transfer could happen. Shen Ye had stayed close by becoming the most feared CEO in the city. Lin Zhi was furious that everyone had decided her life for her. She took the archive, the black card, and Gu Yan’s shaking hand. “No more guardians,” she said. “We investigate together.”',
  ],
  [
    'The gala glittered with diamonds, cameras, and people who had ignored Lin Zhi when she was an intern. Xu Yao arrived in a white dress and was presented as the lost heiress. The family patriarch cried on cue. Guests applauded. A private investigator stood beside the stage holding a DNA report that had been prepared months ago. Lin Zhi recognised the pattern immediately: the same laboratory had authenticated the forged email. The family was not celebrating a daughter. It was staging ownership.',
    'When the second report appeared, the room changed temperature. Lin Zhi’s blood matched the missing heir, while Xu Yao’s test had been altered. Xu Yao did not run. She admitted that the family had threatened her sick father and promised to return his hospital debt if she played the role. Her betrayal was real, but it was also the only shield she had been given. Shen Ye offered Lin Zhi the power to destroy the entire family before midnight. Lin Zhi refused to become another person using fear as a shortcut.',
    'The real villain entered through the service door carrying a photograph of Lin Zhi’s mother. He revealed that the kidnapping had been ordered to hide a secret partnership between the family and the night clan. The black card was not just access; it was proof that Lin Zhi’s mother had planned a peaceful transfer of power. The villain tore the photograph in half. Lin Zhi smiled for the first time that night. She had already scanned it. The gala lights went out, and every emergency screen displayed her mother’s face.',
  ],
  [
    'The livestream began with a countdown and a wall of insults. People called Lin Zhi a fraud, a gold digger, and a girl who had invented a rich man to escape responsibility. She did not answer them. She placed the original files on the table and waited for the viewer count to pass one million. Beside her, Gu Yan adjusted the broadcast code with the seriousness of a student preparing for an exam. Xu Yao stood behind the camera, pale but determined. Shen Ye remained in darkness until Lin Zhi called his name.',
    'She asked him to reveal the night-clan contract, knowing it would turn the case from corporate crime into a citywide scandal. Shen Ye could have stopped the broadcast. Instead, he walked into the light and showed the mark on his wrist. The chat froze. He explained that the family had used the company to traffic identities and that Lin Zhi had been hidden as a child to keep her alive. Every revelation created a new enemy, but every enemy also proved that the old silence had been protecting the wrong people.',
    'The chairwoman ordered the feed cut. Gu Yan redirected it through school networks, public screens, and emergency channels. The city watched the boardroom collapse in real time. The manager begged Lin Zhi to delete the evidence. She refused, but she also refused to humiliate him for entertainment. “A reversal is not justice,” she said. “Justice begins when the record cannot be changed again.” The final file opened by itself. It contained the voice of the person who had ordered her mother’s disappearance.',
  ],
  [
    'The final hearing took place in the same boardroom where Lin Zhi had been called a thief. This time, every chair was occupied by employees, reporters, and investigators. The true villain displayed an old will and declared Lin Zhi a fake heir. Shen Ye reached for her arm, ready to end the hearing with power. Lin Zhi stopped him. She had spent six chapters being protected, accused, traded, and displayed. She would not let the final scene turn her into someone else’s rescued heroine.',
    'She asked Gu Yan to unlock the hidden file in his student card. She asked Xu Yao to read the family payment records aloud. Then she placed the torn photograph, the blood-marked will, and the original audio beside one another. The evidence did not form a perfect line. It formed a choice: preserve a beautiful lie, or expose a truth that would destroy the family’s name. Lin Zhi looked at the employees who had once laughed at her. They did not ask her to forgive them. They only waited for her decision.',
    'She released the final page to every screen in the city. It proved that her mother had chosen exile to stop the night clan from taking control, and that Lin Zhi’s inheritance was a responsibility rather than a crown. The villain was arrested. Xu Yao kept her own name. Gu Yan received a place at the company’s new school. Shen Ye offered Lin Zhi the throne, but she changed the rules instead. At sunrise, she became the first heir to make power answer to the people it ruled.',
  ],
]

const longFormChinese: string[][][] = [
  [
    ['林栀早就知道，今晚的会议不是为了查清真相，而是为了给她安排一个漂亮的罪名。她没有背景，没有姓氏可以依靠，连实习生的位置都是自己一点点争来的。主管故意把她的水杯打翻，让墨水流过那封伪造邮件，仿佛连她的沉默也能成为证据。她忍住眼泪，因为真正的反击从来不是大喊，而是让对方继续相信自己已经赢了。', '会议室的门外传来鞋跟声，所有人以为董事长终于出现，没想到进来的是一位戴银色面具的陌生女人。她把一枚黑色徽章放在桌上，说这是林栀母亲留下的东西。主管马上命人把她赶走，林栀却看见面具女人对自己眨了一下眼。那一刻，她第一次明白，自己被抛弃的人生可能只是有人精心安排的保护。', '终端打开后，母亲留下的影像没有解释身份，只给出一个倒计时：七十二小时。林栀必须在时间结束前找回三份原始档案，否则真正的继承人会永远消失。沈夜站在她身后，告诉她可以选择逃走。林栀抬起黑卡，回答：“我已经被赶出去一次了，这次我要自己走进他们的王座。”'],
  ],
  [
    ['董事会准备把所有债务塞进她名下，再用一场公开签约把她钉成笑话。林栀看完合约，没有马上拒绝，反而问沈夜是否愿意把自己的名字也写进去。冰山董事长第一次露出真正的表情：不是愤怒，而是惊讶。主管以为她在求保护，笑着宣布她终于承认自己只是一个依附权贵的学生。林栀没有解释，她在等投影上的倒计时归零。', '当隐藏账本被投射到大屏幕，六个董事同时站了起来。每个人都以为自己删掉了记录，却不知道黑卡把所有版本都保存下来。沈夜没有替她发言，只将麦克风推到她面前。林栀一条条读出转账、假合约和被逼离职的名单，最后读出自己母亲的名字。她的声音很轻，但整个房间都听见了。', '主管跪下求她关掉直播，刚才嘲笑她的人开始称呼她林小姐。林栀没有享受他们突然改变的态度，因为她知道真正的幕后者还没有出现。沈夜递给她一把旧钥匙，钥匙上刻着“十三”。董事会的最后一扇门打开，里面传来像心跳一样的低沉声音。'],
  ],
  [
    ['地下十三层没有普通电灯，墙上的红色灯管像一排排睁开的眼睛。林栀看见几十个玻璃柜，里面保存着不同身份的档案，有些人的照片已经几十年没有变化。顾言躲在服务器后面，紧张地说自己只是来做奖学金实习，却意外发现这家公司替夜族管理人类身份。纯情的学生说到一半就脸红，手指却已经破解了第三道密码。', '沈夜终于说出真相：他出生在一个不允许失败的吸血鬼家族，必须保护林栀到继承仪式结束。过去几年，他故意表现得冷酷，让所有人以为他只在乎利益。林栀听完只觉得愤怒，因为每个人都以保护为理由替她做决定。她把一份血族契约扔回沈夜胸前，要求他从现在开始只提供证据，不许再替她选择人生。', '档案深处出现一张旧学生证，照片上的女孩与林栀一模一样。顾言说这不是出生证明，而是逃亡名单。门外突然响起爪子刮过金属的声音，真正的血族猎人找到了他们。沈夜的眼睛彻底变红，林栀却握住了黑卡：“你负责挡住怪物，我负责打开真相。”'],
  ],
  [
    ['豪门晚宴的每一道灯都像一只监视的眼睛。许遥穿着白裙站在台上，被所有人称为失踪多年的千金。林栀站在最角落，连侍应生都不愿把菜单递给她。有人故意问她是不是来偷吃的，笑声再次围住她。她没有走，因为她知道真正的亲子报告正在后台上传，而沈夜已经安排好让全城看见。', '报告公布后，许遥没有抢走话筒。她承认自己也被骗了，养大她的家族把她当作一件可以随时更换的装饰。林栀本来可以把所有痛苦还给她，但她看见许遥手腕上有和自己母亲照片里一样的旧伤。两个人终于明白，她们不是天生的敌人，只是同一场骗局里被摆放在两边的棋子。', '真正反派用母亲的遗嘱逼林栀认输，声称血缘不代表能力。林栀当着全场撕掉假遗嘱，却没有撕掉许遥的名牌。她宣布两人都不需要替这个家族继续表演。黑卡打开保险柜，里面不是宝石，而是母亲留下的一句话：继承不是得到皇冠，而是决定皇冠属于谁。'],
  ],
  [
    ['直播开始后，数百万观众看见林栀站在曾经羞辱她的会议室中央。留言区有人叫她拜金，有人说她靠沈夜上位，她一句也没有反驳。她让镜头先拍那张被撕碎的实习合约，再拍主管哭着求饶的脸。顾言在后台提醒她，直播一旦公开就无法撤回。林栀说：“我等的就是一个无法撤回的晚上。”', '沈夜走进灯光时，全城看见他手腕上的血族印记。他承认自己隐藏身份，也承认曾经利用冷酷保护林栀。那一刻，林栀没有站到他身后，而是和他并肩站在镜头前。许遥拿出真正账本，顾言打开学生证里的加密档案。三个年轻人用各自最不被看重的身份，拼出一条无法被删掉的证据链。', '董事长切断电源，城市所有备用屏幕却同时亮起。曾经的同事跪地道歉，曾经的反派说自己只是听命行事。林栀看着他们，没有接受一场廉价的集体忏悔。她要求每一个签字的人承担后果，因为打脸不是结局，真正的结局是以后再也没有人能用权力改写记录。'],
  ],
  [
    ['终局听证会回到故事开始的那间会议室。林栀曾在这里被叫作骗子、穷学生和废物，如今所有座位坐满了员工、记者与调查员。真正反派拿出一份带着母亲签名的遗嘱，宣布她只是冒牌继承人。沈夜想用夜族的力量结束听证会，林栀却挡住了他。她已经不需要任何人替她赢，她要让所有人看见自己如何赢。', '顾言打开隐藏档案，许遥公开家族转账，林栀把血印遗嘱、原始录音和黑卡放在同一张桌上。证据没有自动替她做决定，决定必须由她亲口说出：她可以继承一座靠谎言维持的帝国，也可以毁掉旧规则，让每个人重新获得自己的名字。沈夜问她是否害怕，她回答：“害怕，但我不再把害怕当成命令。”', '最后一页公开后，城市看见母亲当年选择消失，是为了阻止夜族与豪门联手控制所有身份。林栀没有把许遥赶出家族，也没有把沈夜变成新的统治者。她成立公开档案学校，让顾言继续读书，让每一份证词都可以被普通人查阅。天亮时，她站在王座前，却没有坐下，只把王座拆成一张给所有人使用的长桌。'],
  ],
]

const longFormHK: string[][][] = [
  [
    ['林梔一早知道，今晚嘅會議唔係為咗查清真相，而係要幫佢安排一個體面嘅罪名。佢冇背景，冇姓氏可以靠，連實習生個位都係自己一步一步爭返嚟。主管故意打翻佢杯水，等墨水流過嗰封假電郵，好似連佢嘅沉默都可以當成證據。佢忍住眼淚，因為真正嘅反擊從來唔係大嗌，而係要對方繼續以為自己已經贏咗。', '會議室出面傳嚟鞋踭聲，所有人以為董事長終於出現，點知入嚟嘅係一個戴銀色面具嘅陌生女人。佢將一枚黑色徽章放喺枱面，話係林梔媽媽留低嘅嘢。主管即刻叫人趕佢走，林梔卻見到面具女人向自己眨咗吓眼。嗰一刻，佢第一次明白，自己以為被拋棄嘅人生，可能只係有人刻意安排嘅保護。', '終端打開之後，媽媽留低嘅影像冇解釋身份，只係顯示一個倒數：七十二個鐘。林梔要喺時間完之前搵返三份原始檔案，否則真正嘅繼承人會永遠消失。沈夜企喺佢身後，話佢可以選擇逃走。林梔舉起黑卡：「我已經畀人趕走過一次，今次我要自己行入佢哋嘅王座。」'],
  ],
  [
    ['董事會準備將所有債務塞入佢名下，再用一場公開簽約將佢釘死喺笑話入面。林梔睇完合約冇即刻拒絕，反而問沈夜肯唔肯將自己個名都寫落去。冰山董事長第一次露出真正表情：唔係嬲，而係驚訝。主管以為佢求保護，笑住宣布佢終於承認自己只係靠權貴嘅學生。林梔冇解釋，只係等緊投影上嘅倒數歸零。', '隱藏帳本投射到大屏幕嗰刻，六個董事同時企起身。每個人都以為自己刪晒紀錄，卻唔知黑卡保存咗所有版本。沈夜冇替佢講話，只係將咪推到佢面前。林梔逐條讀出轉帳、假合約同被迫離職嘅名單，最後讀出自己媽媽個名。佢把聲好輕，但成間房都聽得清清楚楚。', '主管跪低求佢熄直播，頭先仲笑緊佢嗰班人開始叫佢林小姐。林梔冇享受佢哋突然轉態，因為佢知道真正幕後黑手仲未出現。沈夜畀佢一條舊鎖匙，上面刻住「十三」。董事會最後一道門打開，入面傳出一下又一下、似心跳咁沉嘅聲音。'],
  ],
  [
    ['地庫十三層冇普通電燈，牆上紅色燈管好似一排排睜開嘅眼。林梔見到幾十個玻璃櫃，入面收藏住唔同身份嘅檔案，有啲人嘅相幾十年都冇變過。顧言匿喺伺服器後面，緊張咁講自己只係靠獎學金嚟實習，點知無意中發現公司一直替夜族管理人類身份。呢個純情學生講到一半就面紅，但手指已經破解咗第三道密碼。', '沈夜終於講出真相：佢出身於一個唔容許失敗嘅吸血鬼家族，必須保護林梔直到繼承儀式完結。過去幾年，佢刻意扮到冷酷，等所有人以為佢只在乎利益。林梔聽完只覺得嬲，因為每個人都用保護做理由替佢決定。佢將血族契約掟返畀沈夜，要求由而家開始只提供證據，唔准再替佢選人生。', '檔案深處出現一張舊學生證，相入面個女仔同林梔一模一樣。顧言話呢張唔係出生證明，而係逃亡名單。門外突然傳來爪刮金屬嘅聲，真正嘅血族獵人搵到佢哋。沈夜雙眼完全變紅，林梔卻握實黑卡：「你負責擋住隻怪物，我負責打開真相。」'],
  ],
  [
    ['豪門晚宴每一盞燈都好似一隻監視緊嘅眼。許遙着住白裙企喺台上，人人話佢係失蹤多年嘅千金。林梔企喺最角落，連侍應都唔願意將餐牌畀佢。有人故意問佢係咪嚟偷食，笑聲再次圍住佢。佢冇走，因為真正嘅親子報告正喺後台上載，而沈夜已經安排好畀全城睇到。', '報告公布之後，許遙冇搶咪。佢承認自己都畀人呃，養大佢嗰個家族只係當佢係可以隨時替換嘅裝飾。林梔本來可以將所有痛苦還返畀佢，但見到許遙手腕上有一道同媽媽相片入面一樣嘅舊傷。兩個人終於明白，佢哋唔係天生敵人，只係同一場騙局入面、畀人擺喺兩邊嘅棋。', '真正反派用媽媽份遺囑迫林梔認輸，話血緣唔代表能力。林梔喺全場面前撕爛假遺囑，卻冇撕爛許遙個名牌。佢宣布兩個女仔都唔需要再替呢個家族做戲。黑卡打開保險櫃，入面冇寶石，只有媽媽留低嘅一句話：繼承唔係攞皇冠，而係決定皇冠應該屬於邊個。'],
  ],
  [
    ['直播開始之後，幾百萬觀眾見到林梔企喺以前羞辱過佢嘅會議室中央。留言有人鬧佢拜金，有人話佢靠沈夜上位，佢一句都冇反駁。佢先叫鏡頭影嗰張被撕爛嘅實習合約，再影主管喊住求饒嘅樣。顧言喺後台提醒佢，直播一公開就冇得收返。林梔話：「我等嘅就係一個冇得收返嘅晚上。」', '沈夜行入燈光嗰刻，全城見到佢手腕上嘅血族印記。佢承認自己一直隱藏身份，亦承認曾經用冷酷嚟保護林梔。嗰一刻，林梔冇企喺佢身後，而係同佢並肩企喺鏡頭前。許遙攞出真正帳本，顧言打開學生證入面嘅加密檔案。三個最唔被人睇得起嘅年輕人，砌出一條冇人可以刪走嘅證據鏈。', '董事長切斷電源，但全城備用螢幕同時亮起。以前嘅同事跪低道歉，以前嘅反派話自己只係聽命行事。林梔望住佢哋，冇接受一場廉價嘅集體懺悔。佢要求每個簽名嘅人自己承擔後果，因為打臉唔係結局，真正結局係以後冇人可以再用權力改寫紀錄。'],
  ],
  [
    ['終局聽證會返到故事開始嗰間會議室。林梔以前喺呢度畀人叫騙子、窮學生同廢物，而家每個位都坐滿員工、記者同調查員。真正反派拎出一份有媽媽簽名嘅遺囑，宣布林梔只係冒牌繼承人。沈夜想用夜族力量完結聽證會，林梔卻擋住佢。佢已經唔需要任何人替佢贏，佢要所有人親眼睇住佢點樣贏。', '顧言打開隱藏檔案，許遙公開家族轉帳，林梔將血印遺囑、原始錄音同黑卡放喺同一張枱。證據唔會自動替佢作決定，決定要由佢親口講出：佢可以繼承一個靠大話維持嘅帝國，亦可以摧毀舊規則，畀每個人重新攞返自己個名。沈夜問佢驚唔驚，佢回答：「驚，但我唔會再將恐懼當成命令。」', '最後一頁公開之後，全城見到媽媽當年選擇消失，係為咗阻止夜族同豪門聯手控制所有身份。林梔冇將許遙趕出家族，亦冇將沈夜變成新統治者。佢成立公開檔案學校，畀顧言繼續讀書，亦畀每份證詞都可以由普通人查閱。天光嗰陣，佢企喺王座前面冇坐低，只係將王座拆成一張所有人都用得嘅長枱。'],
  ],
]

function enrichChapter(chapter: Chapter, index: number, lang: Lang): Chapter {
  const enhancement = genreEnhancements[index]
  if (!enhancement) return chapter
  const longForm = lang === 'en' ? longFormScenes[index] : lang === 'zh-HK' ? longFormHK[index]?.[0] : longFormChinese[index]?.[0]
  return { ...chapter, title: `${chapter.title}${enhancement.title[lang]}`, teaser: `${chapter.teaser || ''} ${enhancement.teaser[lang]}`, segments: chapter.segments.map((segment, sceneIndex) => ({ ...segment, text: `${segment.text}\n\n${enhancement.beats[lang][sceneIndex]}\n\n${longForm?.[sceneIndex] || ''}` })) }
}

export function localizeChapter(chapter: Chapter, index: number, lang: Lang, book: Book): Chapter {
  if (lang === 'zh-CN') return enrichChapter(chapter, index, lang)
  const copy = (lang === 'en' ? en : hk)[index]
  if (!copy) return enrichChapter(chapter, index, lang)
  const inject = (line: string) => line.replace(/\{(\d+)\}/g, (_, n: string) => `{${book.words[Number(n)].word}}`)
  const subtitles = lang === 'en' ? ['After Midnight', 'The Price of Truth', 'Basement Thirteen', 'A Test of Trust', 'Live to the City', 'The Final Twist'] : ['午夜之後', '真相嘅代價', '地庫十三層', '信任考驗', '公開一刻', '終局逆轉']
  return enrichChapter({ ...chapter, title: copy.title, teaser: copy.teaser, subtitle: `EPISODE ${String(index + 1).padStart(2, '0')} · ${subtitles[index]}`,
    segments: chapter.segments.map((segment, sceneIndex) => ({ ...segment, text: inject(copy.scenes[sceneIndex]), success: copy.success[sceneIndex],
      hint: lang === 'en' ? `Hint: ${book.words.find((item) => item.word === segment.focus)?.definition}` : `提示：${book.words.find((item) => item.word === segment.focus)?.meaningHK || book.words.find((item) => item.word === segment.focus)?.meaning}`,
      failure: segment.failure ? copy.failure : undefined, remedy: segment.remedy ? copy.remedy : undefined,
    })) }, index, lang)
}

export function trustDecision(lang: Lang): { prompt: string; options: { id: string; label: string; scene: string }[] } {
  if (lang === 'en') return { prompt: 'Xu Yao took the payment. What should Lin Zhi do?', options: [
    { id: 'accuse', label: 'Confront her now', scene: 'Lin Zhi raised the payment notice in front of the camera. Xu Yao went pale and walked away. The server remained online, but their friendship cracked. Lin Zhi would have to finish the investigation without her.' },
    { id: 'listen', label: 'Hear her out first', scene: 'Lin Zhi turned the camera away and asked one quiet question. Xu Yao showed her the hospital bill. Lin Zhi did not excuse the lie, but she kept a fragile ally—and learned where the missing ledger had gone.' },
  ] }
  if (lang === 'zh-HK') return { prompt: '許遙收咗錢。林梔而家應該點做？', options: [
    { id: 'accuse', label: '即刻當面質問', scene: '林梔喺鏡頭前舉起付款通知。許遙面色一白，轉身走咗。伺服器仍然運作，但兩人嘅友情裂開咗。之後嘅調查，林梔要自己頂。' },
    { id: 'listen', label: '先聽佢解釋', scene: '林梔將鏡頭轉開，只係低聲問咗一句。許遙攞出醫院帳單。林梔冇原諒個謊，但保住咗呢個脆弱盟友，亦知道失蹤帳本去咗邊。' },
  ] }
  return { prompt: '许遥收了钱。林栀此刻该怎么做？', options: [
    { id: 'accuse', label: '当场质问她', scene: '林栀在镜头前举起付款通知。许遥脸色惨白，转身离开。服务器仍然在线，但两人的友情彻底出现裂痕。余下的调查，林栀只能独自完成。' },
    { id: 'listen', label: '先听她解释', scene: '林栀把镜头转开，只轻声问了一句。许遥拿出医院账单。林栀没有原谅谎言，却保住了这个脆弱的盟友，也知道了失踪账本的去向。' },
  ] }
}
