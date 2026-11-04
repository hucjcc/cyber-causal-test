/* ===================== 题库与数据 ===================== */
const QUESTIONS = [
  // 情债：关系里放不下、怕失去
  {d:"qing", t:"和前任分开很久了，刷到对方动态我还是会点进去，脑子里自动回放以前的事"},
  {d:"qing", t:"在一段关系里我总付出得更多，明明已经累得不行，却还是停不下来"},
  {d:"qing", t:"被人辜负之后，我会记很久，甚至过了很久比当时还生气"},
  {d:"qing", t:"谈恋爱特别怕对方突然冷淡，宁可委屈自己、降低底线，也不想搞砸这段关系"},
  // 自由债：活成别人期待的版本
  {d:"zi",   t:"做个决定前，我习惯性先想“我妈 / 我对象 / 领导会怎么看”"},
  {d:"zi",   t:"刷到别人“裸辞去旅行”“说走就走”的视频，我一边羡慕一边觉得自己被什么绑着"},
  {d:"zi",   t:"别人让我帮忙，我很难说“不”，答应了之后又在内心里后悔很久"},
  {d:"zi",   t:"经常觉得自己不像“真正的自己”，更像在生活里演一个大家喜欢的角色"},
  // 志债：我本可以
  {d:"zhi",  t:"总觉得现在的工作是“将就”，不是自己真心想干的那件事"},
  {d:"zhi",  t:"深夜刷手机经常会冒出“我本可以……”的念头，对“平庸”这两个字有点羞耻"},
  {d:"zhi",  t:"看到同龄人“发光”会暗暗不服：我也行，只是没遇到机会"},
  {d:"zhi",  t:"给自己定的目标，往往悄悄就放弃了，因为怕认真了还是不行"},
  // 安债：求稳求安全感
  {d:"an",   t:"工资一到手就想先存起来、留后路，哪怕暂时用不上也安心"},
  {d:"an",   t:"对象晚回消息我就会脑补一堆，忍不住想发“在干嘛”确认一下"},
  {d:"an",   t:"看到“裁员”“降薪”这类新闻会不自觉代入自己，慌好一阵"},
  {d:"an",   t:"很难真的“裸辞”或“冒险”，哪怕现在过得挺痛苦，也先忍着求个稳"},
  // 历债：等以后
  {d:"li",   t:"总说“等忙完这阵”再去玩、去见想见的人，结果永远在忙"},
  {d:"li",   t:"收藏夹里攒了一堆攻略和想去的店，真去的次数屈指可数"},
  {d:"li",   t:"羡慕那种“周末说走就走”的人，自己总被日程和计划绑着"},
  {d:"li",   t:"怕老了回头后悔“白活了”，可今天具体干了啥又说不太清"},
  // 诚债：不敢做自己、戴面具
  {d:"cheng",t:"群里别人发啥我都回“都行 / 好呀”，其实我心里根本不是这么想的"},
  {d:"cheng",t:"想说的话到嘴边又咽回去，怕得罪人、怕把气氛搞尴尬"},
  {d:"cheng",t:"在外人面前游刃有余、八面玲珑，只有一个人独处时才敢松口气"},
  {d:"cheng",t:"很少主动说出自己真正喜欢什么，怕被说“矫情”“作”"}
];
const OPTIONS = ["完全符合","比较符合","不太符合","完全不符合"];
const SCORE   = [3,2,1,0];

const DIM = {qing:"情债",zi:"自由债",zhi:"志债",an:"安债",li:"历债",cheng:"诚债"};

const DEBTS = {
  qing:{name:"情债",title:"红尘未了人",short:"情",color:"#ff2a6d",
    story:"上辈子你曾亏欠或过度纠缠某个人，那段缘分没结清就散了。今生你带着这笔“情债”投胎，所以总在关系里反复回头、替别人操心。",
    present:"你重感情、念旧，分手很久还会想起；在关系里容易付出过多、放不下、怕被辜负；别人早翻篇了，你还在心里重播。",
    theory:"心理学里有“依恋理论”（Bowlby），说人成年后的相处模式，大多来自早年和重要之人的联结习惯。还有个“格式塔未完成事件”——没结清的事会像钩子一样一直拽着你。不是你“想不开”，是大脑还没给它画句号。",
    advice:["给那段关系写一封“不寄出的信”，把没说的话说完，帮大脑画句号。",
            "区分“我爱他”和“我只是没放下”：前者值得，后者只是惯性。",
            "把对别人的耐心，分三成给自己。"],
    quote:"我上辈子欠的，是还不清的【情债】。这辈子，我先学会放过自己。"},
  zi:{name:"自由债",title:"笼中寻光者",short:"由",color:"#05d9e8",
    story:"上辈子你被安排好了人生（婚事、仕途、身份），从没为自己活过一天。今生你带着“讨回自由”的课题，总想挣脱别人写的剧本。",
    present:"你做决定先想别人怎么看；不敢拒绝、怕让父母失望；羡慕活得松弛的人；常觉得自己像在演戏，真正的自己藏起来了。",
    theory:"人本心理学家罗杰斯说过“真实自我”和“理想自我”——两者越近，人越踏实。后来的研究（Sheldon 的“自我一致性”）发现：你做的事越贴近“你真正想要的”，幸福感越高、内耗越低。你累，往往是因为活成了“别人期待的版本”。",
    advice:["每天做一件“没人要求、只因我想”的小事，找回掌控感。",
            "练习说“我考虑一下”代替立刻答应，给自己留缝。",
            "把“别人会怎么看”换成“三年后我回看，会后悔吗”。"],
    quote:"我上辈子欠的，是还不了的【自由债】。这辈子，我想活成自己。"},
  zhi:{name:"志债",title:"怀才未遇客",short:"志",color:"#f9f871",
    story:"上辈子你胸怀大志却壮志未酬，中途折戟或怀才不遇。今生你带着一股“我本可以”的不甘，总觉得自己还能发光。",
    present:"你觉得现在是将就；深夜冒出“我本可以”；羡慕发光的人又觉得自己也行；常定目标又悄悄放弃，怕努力了还是不行。",
    theory:"麦克利兰提出“成就动机”——有人天生渴望把事做好、超越自己。而“自我设限”是个保护机制：怕“努力了还不行”会伤自尊，就先不努力、先拖延，这样失败了也能怪“我没认真”。你不是不行，是太怕“认真了还是不行”。",
    advice:["把“大目标”拆成“小到不可能失败”的一步，先动起来。",
            "允许自己“先完成再完美”，完成本身就在还债。",
            "找一个“看见你发光”的小圈子，反馈会断奶你的自我怀疑。"],
    quote:"我上辈子欠的，是未酬的【志债】。这辈子，我不当怀才不遇的客。"},
  an:{name:"安债",title:"抱薪驱寒人",short:"安",color:"#b388ff",
    story:"上辈子你颠沛流离、朝不保夕，从来不知“稳”字怎么写。今生你拼命想抓牢安全，却像抱着柴火取暖，越抱越慌。",
    present:"你爱存钱留后路；伴侣晚回消息就脑补；裁员新闻能慌一天；很难裸辞冒险，哪怕痛苦也要先求稳。",
    theory:"《稀缺》一书讲“稀缺心态”：人越缺什么，越会死死盯住它，结果视野变窄、反而更缺（没钱的人更易借高利贷就是这个理）。你的焦虑不是“胆子小”，是大脑把“安全”调成了最高优先级，挤掉了别的念头。",
    advice:["给焦虑设“专门时间”（如周三晚 8 点），其他时候它来敲门你告诉它“周三见”。",
            "做一件“可控的小冒险”（换条路回家、聊句真心话），训练安全感不靠死抓。",
            "把存款当成“工具”不是“护身符”，它够用就好。"],
    quote:"我上辈子欠的，是求而不得的【安债】。这辈子，我学着把柴放下。"},
  li:{name:"历债",title:"待启程旅人",short:"历",color:"#39ff14",
    story:"上辈子你活得规规矩矩、错失太多风景，临走才发现好多事没做。今生你总在“等以后”，把日子过成了待办清单。",
    present:"你总说“等忙完这阵”；收藏等于去过；羡慕说走就走的人；怕老了后悔“白活”，却又说不清今天干了啥。",
    theory:"心理学有个“体验回避”——人为了不焦虑，会躲开当下真实的感受，结果越躲越空。而康奈尔大学 Gilovich 的研究发现：花钱买“体验”（旅行、看演、见面）比买“东西”更幸福，因为体验会变成记忆，陪你更久。你不是没时间，是把“体验”排在了“等以后”。",
    advice:["本周就做一件“不用等”的小体验（去没去过的巷子、给老友打电话）。",
            "把收藏夹变成“行动清单”，每条加一个“本周做”的期限。",
            "问自己“如果今天是我最后一天，我会后悔没做哪件小事”——现在就做。"],
    quote:"我上辈子欠的，是错过的【历债】。这辈子，我不想再等以后。"},
  cheng:{name:"诚债",title:"戴面具说书人",short:"诚",color:"#d300c5",
    story:"上辈子你习惯了戴面具、说了太多违心话，没说出口的真心话积成了债。今生你总在“不敢做自己”，把真心咽回肚子。",
    present:"你群里总回“都行”；有话到嘴边咽回去；在外人面前游刃有余，独处才敢松气；怕表达喜好被说“矫情 / 作”。",
    theory:"社会学家 Goffman 的“拟剧理论”说：人都在“人前表演”。但心理学研究也证明：适度自我表露（说出真实想法）反而让人关系更近、压力更小——你越藏，越累；你说出一句真心话，对的人会靠近，错的人会离开，都是好事。",
    advice:["今天说一句“其实我不太想”，从小事、安全的人开始。",
            "把“都行”换成“我更想要……”，练习表达偏好。",
            "找到 1–2 个“可以不戴面具”的人，定期说真话。"],
    quote:"我上辈子欠的，是没说出口的【诚债】。这辈子，我想好好说真话。"}
};

const COMBO = {
  "an|qing":"患得患失的痴情人",
  "cheng|zi":"戴着笑脸的叛逆者",
  "zi|zhi":"被困住的天生野心家",
  "li|zi":"想飞却不敢请假的鸟",
  "an|cheng":"表面稳、心里慌的体面人",
  "li|zhi":"既后悔没拼、又后悔没玩的人"
};
function comboText(a,b){
  const k=[a,b].sort().join("|");
  if(COMBO[k]) return COMBO[k];
  return DEBTS[a].title+" × "+DEBTS[b].title+"：你身上既有"+DEBTS[a].name+"的牵绊，也有"+DEBTS[b].name+"的执念，是个层次很丰富的人。";
}

/* ===================== 算命先生（沉浸式 SVG，矢量 / 即时渲染 / 零下载） ===================== */
/* 说明：此前用羽化视频(fortune-teller.mp4)做人物，但视频体积大(>1MB)导致首屏很慢，
   且自动播放被拦截或遮罩(ft-mask.png)偶发加载失败时人物会“消失”。
   改为内联 SVG 算命先生后：即时显示、不依赖大文件、自带浮动/罗盘旋转/光晕/上升符文动画，
   天然透明、无需 mask。 */
const FT_FIG = '<img class="ft-fig" src="fortune-teller-art.png" alt="赛博道士" draggable="false">';

function mountFt(el, uid){
  if(!el) return;
  el.innerHTML = FT_FIG;
}

/* ===================== 赛博角色 SVG ===================== */
function cyberAvatarSVG(color){
  return `<svg class="cyber-avatar" viewBox="0 0 200 210" style="--c:${color}">
    <g class="float">
      <circle class="halo"  cx="100" cy="92" r="82" fill="none" stroke="var(--c)" stroke-width="1.5"/>
      <circle class="halo2" cx="100" cy="92" r="70" fill="none" stroke="var(--c)" stroke-width="1"/>
      <path d="M50 202 Q100 150 150 202" fill="none" stroke="var(--c)" stroke-width="2" opacity=".6"/>
      <path d="M62 198 Q100 168 138 198" fill="none" stroke="var(--c)" stroke-width="1" opacity=".35"/>
      <path class="head" d="M64 60 Q64 28 100 28 Q136 28 136 60 L136 96 Q136 128 100 128 Q64 128 64 96 Z"
            fill="rgba(255,255,255,.05)" stroke="var(--c)" stroke-width="2"/>
      <rect x="70" y="63" width="60" height="22" rx="11" fill="rgba(255,255,255,.07)" stroke="var(--c)" stroke-width="1.4"/>
      <circle class="eye" cx="86"  cy="74" r="5.5" fill="var(--c)"/>
      <circle class="eye" cx="114" cy="74" r="5.5" fill="var(--c)"/>
      <path d="M88 102 H112 M94 98 V110 M100 98 V110 M106 98 V110" stroke="var(--c)" stroke-width="1" opacity=".55"/>
      <circle class="node" cx="62"  cy="76" r="3" fill="#f9f871"/>
      <circle class="node" cx="138" cy="76" r="3" fill="#f9f871"/>
      <rect class="scan" x="64" y="46" width="72" height="2.5" fill="var(--c)" opacity=".9"/>
    </g>
  </svg>`;
}

/* ===================== 透明背景动画：中式算命先生 ===================== */
function fortuneTellerSVG(uid){
  const u = uid ? '_'+uid : '';
  return `<svg class="ft-svg" viewBox="0 0 360 440" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    <defs>
      <radialGradient id="ftAura${u}" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stop-color="#05d9e8" stop-opacity="0.30"/>
        <stop offset="55%" stop-color="#9b5cff" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#ff2a6d" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="ftRobe${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#33205e"/>
        <stop offset="55%" stop-color="#180d34"/>
        <stop offset="100%" stop-color="#0a0618"/>
      </linearGradient>
      <linearGradient id="ftGold${u}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffe9a8"/>
        <stop offset="50%" stop-color="#f9c84b"/>
        <stop offset="100%" stop-color="#b8842a"/>
      </linearGradient>
      <radialGradient id="ftFace${u}" cx="50%" cy="40%" r="62%">
        <stop offset="0%" stop-color="#ffe6cb"/>
        <stop offset="100%" stop-color="#e3ad84"/>
      </radialGradient>
      <filter id="ftGlow${u}" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.4" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <ellipse cx="180" cy="238" rx="152" ry="170" fill="url(#ftAura${u})">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="5s" repeatCount="indefinite"/>
    </ellipse>

    <!-- 背后旋转光环 -->
    <g opacity="0.5">
      <circle cx="180" cy="226" r="140" fill="none" stroke="url(#ftGold${u})" stroke-width="1.1" opacity="0.4"/>
      <circle cx="180" cy="226" r="124" fill="none" stroke="#05d9e8" stroke-width="0.8" opacity="0.3"/>
      <g fill="#f9f871">
        <animateTransform attributeName="transform" type="rotate" values="0 180 226;360 180 226" dur="50s" repeatCount="indefinite"/>
        <circle cx="180" cy="100" r="2.4"/><circle cx="273" cy="134" r="2.4"/>
        <circle cx="313" cy="226" r="2.4"/><circle cx="273" cy="318" r="2.4"/>
        <circle cx="180" cy="352" r="2.4"/><circle cx="87" cy="318" r="2.4"/>
        <circle cx="47" cy="226" r="2.4"/><circle cx="87" cy="134" r="2.4"/>
      </g>
    </g>

    <g id="ftFigure${u}">
      <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="5.5s"
        calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" repeatCount="indefinite"/>

      <!-- 道袍 -->
      <path d="M180 206 C146 208 124 224 112 252 L88 332 Q80 368 104 380 L138 368 L138 302 Q180 314 222 302 L222 368 L256 380 Q280 368 272 332 L248 252 C236 224 214 208 180 206 Z"
            fill="url(#ftRobe${u})" stroke="#4a356e" stroke-width="2"/>
      <!-- 腰带 + 飘带 -->
      <rect x="118" y="300" width="124" height="17" rx="8.5" fill="url(#ftGold${u})"/>
      <path d="M150 317 Q146 358 152 404" stroke="url(#ftGold${u})" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M210 317 Q214 358 208 404" stroke="url(#ftGold${u})" stroke-width="4" fill="none" stroke-linecap="round"/>

      <!-- 双手捧八卦盘 -->
      <g transform="translate(180 300)">
        <circle r="27" fill="#0a0618" stroke="url(#ftGold${u})" stroke-width="2.5" filter="url(#ftGlow${u})">
          <animate attributeName="opacity" values="0.85;1;0.85" dur="3.4s" repeatCount="indefinite"/>
        </circle>
        <g font-size="12" fill="#f9f871" text-anchor="middle" dominant-baseline="central" font-family="serif">
          <animateTransform attributeName="transform" type="rotate" values="0;360" dur="22s" repeatCount="indefinite"/>
          <text x="0" y="-15">☰</text><text x="10.6" y="-10.6">☱</text>
          <text x="15" y="0">☲</text><text x="10.6" y="10.6">☳</text>
          <text x="0" y="15">☴</text><text x="-10.6" y="10.6">☵</text>
          <text x="-15" y="0">☶</text><text x="-10.6" y="-10.6">☷</text>
        </g>
        <circle r="6" fill="none" stroke="#05d9e8" stroke-width="1.4"/>
        <circle cx="0" cy="-3" r="1.6" fill="#05d9e8"/><circle cx="0" cy="3" r="1.6" fill="#ff2a6d"/>
      </g>
      <!-- 双手 -->
      <path d="M150 300 Q166 288 180 296 Q172 305 156 309 Z" fill="url(#ftFace${u})" stroke="#caa46a" stroke-width="1"/>
      <path d="M210 300 Q194 288 180 296 Q188 305 204 309 Z" fill="url(#ftFace${u})" stroke="#caa46a" stroke-width="1"/>

      <!-- 头 -->
      <g>
        <ellipse cx="180" cy="160" rx="36" ry="41" fill="url(#ftFace${u})"/>
        <ellipse cx="144" cy="162" rx="5" ry="9" fill="url(#ftFace${u})"/>
        <ellipse cx="216" cy="162" rx="5" ry="9" fill="url(#ftFace${u})"/>
        <rect x="167" y="194" width="26" height="16" rx="8" fill="url(#ftFace${u})"/>
        <path d="M158 148 Q170 140 183 147" fill="none" stroke="#6b4a2a" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M177 147 Q190 140 202 148" fill="none" stroke="#6b4a2a" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M160 158 Q171 152 182 158" fill="none" stroke="#3a2a2a" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M178 158 Q189 152 200 158" fill="none" stroke="#3a2a2a" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M180 160 L175 174 Q180 178 185 174" fill="none" stroke="#bd8a63" stroke-width="2" stroke-linecap="round"/>
        <path d="M171 184 Q180 190 189 184" fill="none" stroke="#a85a4a" stroke-width="2" stroke-linecap="round"/>
        <path d="M148 140 Q142 170 152 200" fill="none" stroke="#dcd2c0" stroke-width="2" opacity="0.75"/>
        <path d="M212 140 Q218 170 208 200" fill="none" stroke="#dcd2c0" stroke-width="2" opacity="0.75"/>
        <g fill="none" stroke="#f3efe6" stroke-width="2.2" stroke-linecap="round" opacity="0.95">
          <animateTransform attributeName="transform" type="rotate" values="-1.5 180 190;1.5 180 190;-1.5 180 190" dur="5s"
            calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" repeatCount="indefinite"/>
          <path d="M167 186 Q159 214 166 256 Q170 280 163 312"/>
          <path d="M180 188 Q180 224 180 274 Q180 300 180 332"/>
          <path d="M193 186 Q201 214 194 256 Q190 280 197 312"/>
        </g>
      </g>

      <!-- 交领右衽 -->
      <path d="M150 212 L180 252 L210 212 L196 206 L180 238 L164 206 Z" fill="#0a0618" stroke="url(#ftGold${u})" stroke-width="1.6"/>
      <path d="M150 212 L180 252 L210 212" fill="none" stroke="url(#ftGold${u})" stroke-width="3" stroke-linecap="round"/>

      <!-- 道冠（混元巾）-->
      <g>
        <path d="M150 122 Q150 86 180 86 Q210 86 210 122 Z" fill="url(#ftRobe${u})" stroke="url(#ftGold${u})" stroke-width="2"/>
        <rect x="150" y="112" width="60" height="22" rx="10" fill="url(#ftRobe${u})" stroke="url(#ftGold${u})" stroke-width="1.4"/>
        <circle cx="180" cy="84" r="6" fill="url(#ftGold${u})" filter="url(#ftGlow${u})">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2.6s" repeatCount="indefinite"/>
        </circle>
        <g transform="translate(180 124)">
          <circle r="11" fill="#0a0618" stroke="url(#ftGold${u})" stroke-width="1.4"/>
          <path d="M0,-11 A11,11 0 0,1 0,11 A5.5,5.5 0 0,1 0,0 A5.5,5.5 0 0,0 0,-11 Z" fill="#05d9e8"/>
          <path d="M0,-11 A11,11 0 0,0 0,11 A5.5,5.5 0 0,0 0,0 A5.5,5.5 0 0,1 0,-11 Z" fill="#ff2a6d"/>
          <circle cx="0" cy="-5.5" r="1.6" fill="#fff"/><circle cx="0" cy="5.5" r="1.6" fill="#fff"/>
        </g>
      </g>

      <!-- 上升符文 -->
      <g fill="none" stroke="#cfe9ff" stroke-width="3" stroke-linecap="round">
        <path d="M180 210 q-10 -30 4 -55 q12 -22 -2 -50">
          <animate attributeName="opacity" values="0;0.55;0.55;0" keyTimes="0;0.2;0.7;1" dur="6s" begin="0s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0 0;-6 -120" dur="6s" begin="0s" repeatCount="indefinite"/>
        </path>
        <path d="M170 214 q12 -28 -4 -52 q-10 -20 6 -46">
          <animate attributeName="opacity" values="0;0.45;0.45;0" keyTimes="0;0.2;0.7;1" dur="6s" begin="2s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0 0;8 -120" dur="6s" begin="2s" repeatCount="indefinite"/>
        </path>
        <path d="M190 214 q-8 -26 6 -50 q10 -18 -4 -44">
          <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.2;0.7;1" dur="6s" begin="4s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0 0;4 -120" dur="6s" begin="4s" repeatCount="indefinite"/>
        </path>
      </g>
    </g>
  </svg>`;
}

/* ===================== 状态 ===================== */
let idx = 0;
let answers = new Array(QUESTIONS.length).fill(null);
let currentResult = null;
let isShared = false;

/* ===================== 门禁 ===================== */
function unlock(){
  const pw = document.getElementById('pwInput').value.trim();
  const err = document.getElementById('pwErr');
  if(!pw){ err.textContent = '请输入测试密码'; return; }
  err.textContent = '校验中…';
  const cfg = window.APP_CONFIG || {};
  const useSb = !!(cfg.USE_SUPABASE && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
  // 配置了 Supabase → 走 REST RPC attempt_unlock；否则回退到同源 /api/unlock（本地调试）
  const req = useSb
    ? fetch(cfg.SUPABASE_URL.replace(/\/$/,'') + '/rest/v1/rpc/attempt_unlock', {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'apikey': cfg.SUPABASE_ANON_KEY,
          'Authorization':'Bearer ' + cfg.SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ pw: pw, max_n: cfg.MAX_TESTS || 3 })
      }).then(r=>r.json())
    : fetch('/api/unlock',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})}).then(r=>r.json());
  req.then(data=>{
      if(data && data.ok){ startTest(); }
      else { err.textContent = (data && data.reason) || '校验失败，请重试'; }
    })
    .catch(()=>{ err.textContent = '网络异常，请重试'; });
}

/* ===================== 答题 ===================== */
function startTest(){
  isShared = false;
  idx = 0; answers = new Array(QUESTIONS.length).fill(null);
  history.replaceState(null,'',location.pathname);
  show('quiz'); renderQ();
}
function renderQ(){
  const q = QUESTIONS[idx];
  document.getElementById('qcount').textContent = "SCAN "+(idx+1)+" / "+QUESTIONS.length;
  document.getElementById('bar').style.width = (idx/QUESTIONS.length*100)+"%";
  document.getElementById('qtext').innerHTML = `<span class="q-tag">${DIM[q.d]}</span>`+q.t;
  const box = document.getElementById('opts'); box.innerHTML = "";
  OPTIONS.forEach((o,i)=>{
    const b = document.createElement('button');
    b.className = 'opt'+(answers[idx]===i?' sel':'');
    b.textContent = o;
    b.onclick = ()=>{ answers[idx]=i; renderQ(); };
    box.appendChild(b);
  });
  document.getElementById('prevBtn').style.visibility = idx===0 ? 'hidden':'visible';
  document.getElementById('nextBtn').textContent = idx===QUESTIONS.length-1 ? '解 码 结 果 ✦' : '下一题';
}
function prevQ(){ if(idx>0){ idx--; renderQ(); } }
function nextQ(){
  if(answers[idx]===null){ toast('先选一个答案哦～'); return; }
  if(idx<QUESTIONS.length-1){ idx++; renderQ(); }
  else { document.getElementById('bar').style.width='100%'; compute(); }
}

/* ===================== 计分 ===================== */
function compute(){
  const sum = {qing:0,zi:0,zhi:0,an:0,li:0,cheng:0};
  answers.forEach((a,i)=>{ if(a!==null) sum[QUESTIONS[i].d]+=SCORE[a]; });
  const total = Object.values(sum).reduce((x,y)=>x+y,0)||1;
  const ranked = Object.keys(sum).sort((a,b)=>sum[b]-sum[a]);
  const primary = ranked[0], secondary = ranked[1];
  const tie = (sum[primary]-sum[secondary])<=1;
  const pct = {}; Object.keys(sum).forEach(k=>pct[k]=Math.round(sum[k]/total*100));
  const weight = Math.round(total/72*100);
  const weightTag = weight<40 ? '轻（你这辈子债最轻，活得通透）'
                 : weight<=65 ? '中（正常人类，执着但不被困）'
                 : '重（你是个重情重义重执念的人，课题明显）';
  currentResult = {sum,pct,primary,secondary,tie,weight,weightTag,total};
  renderResult(currentResult);
}

function renderResult(r){
  const D = DEBTS;
  const main = D[r.primary], sec = D[r.secondary];
  const color = main.color;
  // 让结果页整体采用该债种的霓虹色
  const resEl = document.getElementById('result');
  resEl.style.setProperty('--cyan', color);
  const headTitle = r.tie ? (main.name+" + "+sec.name) : main.name;
  const headSub = r.tie ? comboText(r.primary,r.secondary) : main.title;
  const order = Object.keys(r.sum).sort((a,b)=>r.sum[b]-r.sum[a]);
  let bars = "";
  order.forEach(k=>{
    bars += `<div class="row"><div class="lab"><span>${D[k].name} · ${D[k].title}</span><b>${r.pct[k]}%</b></div>
      <div class="track"><i style="width:${r.pct[k]}%"></i></div></div>`;
  });
  const adviceHtml = main.advice.map((a,i)=>`<p>${i+1}. ${a}</p>`).join("");
  const banner = isShared ? `<div class="share-banner">这是好友分享的测评结果 · 你也来测一测 →</div>` : "";

  document.getElementById('result').innerHTML = `
    ${banner}
    <div class="result-avatar">${FT_FIG}</div>
    <h2>${headTitle}</h2>
    <div class="ptag">${headSub}</div>
    <div class="panel bars">
      <h3>你的六债信号占比</h3>${bars}
      <p style="margin-top:10px;color:var(--sub);font-size:13px;">因果总负载：${r.weight}%（${r.weightTag}）</p>
    </div>
    ${r.tie?`<div class="combo">副债加成：${comboText(r.primary,r.secondary)}</div>`
           :`<div class="combo">你的副债是【${sec.name} · ${sec.title}】，给主债添了一层牵绊。</div>`}
    <div class="panel"><h3>前世数据残影</h3><p>${main.story}</p></div>
    <div class="panel"><h3>今生表现（说的是你吗）</h3><p>${main.present}</p></div>
    <div class="panel"><h3>理论依据 · 学点新东西</h3><p>${main.theory}</p></div>
    <div class="panel"><h3>今生课题 · 怎么还这笔债</h3>${adviceHtml}</div>
    <div class="quote">「${main.quote}」</div>
    <div class="actions">
      <button class="btn" onclick="saveImage()">保存结果长图</button>
      <button class="btn" onclick="copyLink()">复制结果链接</button>
      <button class="btn ghost" onclick="retest()">再测一次</button>
      <button class="btn ghost" onclick="openReview()">好评有礼</button>
    </div>
    <div class="footer-note" style="text-align:center;font-size:11px;color:#6f685c;margin-top:8px;line-height:1.6;">
      本测试为娱乐向自陈量表，灵感来自依恋、自我一致性、稀缺心态、体验回避、印象管理等心理学概念，非临床诊断。
    </div>`;
  show('result');
}

function retest(){ show('gate'); document.getElementById('pwInput').value=''; document.getElementById('pwErr').textContent=''; document.getElementById('pwInput').focus(); }

/* ===================== 长图生成（赛博朋克） ===================== */
function roundRect(c,x,y,w,h,r){
  if(w<2*r)r=w/2; if(h<2*r)r=h/2;
  c.beginPath();
  c.moveTo(x+r,y);
  c.arcTo(x+w,y,x+w,y+h,r);
  c.arcTo(x+w,y+h,x,y+h,r);
  c.arcTo(x,y+h,x,y,r);
  c.arcTo(x,y,x+w,y,r);
  c.closePath();
}
function wrapText(c,text,maxW){
  const lines=[]; let line='';
  for(const ch of String(text)){
    const test=line+ch;
    if(c.measureText(test).width>maxW && line){ lines.push(line); line=ch; }
    else line=test;
  }
  if(line) lines.push(line);
  return lines;
}
function sectionTitle(c,title,y){
  c.save();
  c.fillStyle='#05d9e8'; c.shadowColor='#05d9e8'; c.shadowBlur=10;
  c.fillRect(46-14,y-22,4,26);
  c.font='700 28px "Rajdhani","Microsoft YaHei",sans-serif';
  c.fillText(title,46,y);
  c.restore();
  return y+42;
}
function paragraph(c,title,text,y){
  y=sectionTitle(c,title,y);
  c.fillStyle='#dbe7ff'; c.font='25px -apple-system,"PingFang SC",sans-serif';
  String(text).split('\n').forEach(block=>{
    wrapText(c,block,658).forEach(ln=>{ c.fillText(ln,46,y); y+=42; });
  });
  return y+12;
}
function drawDivider(c,y){
  c.strokeStyle='rgba(255,42,109,.4)'; c.lineWidth=1;
  c.beginPath(); c.moveTo(46,y); c.lineTo(704,y); c.stroke();
  return y+30;
}
function quoteBlock(c,quote,y,color){
  const pad=20;
  c.font='30px "Rajdhani","Microsoft YaHei",sans-serif';
  const lines=wrapText(c,'「'+quote+'」',658-2*pad);
  const h=lines.length*48+2*pad;
  c.fillStyle='rgba(255,255,255,.04)'; roundRect(c,46,y,658,h,14); c.fill();
  c.strokeStyle=color; c.lineWidth=1.5; c.shadowColor=color; c.shadowBlur=12;
  roundRect(c,46,y,658,h,14); c.stroke(); c.shadowBlur=0;
  c.fillStyle='#ffffff'; c.textAlign='center';
  lines.forEach((ln,i)=> c.fillText(ln,375,y+pad+34+i*48));
  c.textAlign='left';
  return y+h+20;
}
function drawAvatarCanvas(c, cx, cy, color){
  c.save();
  c.strokeStyle=color; c.lineWidth=2; c.shadowColor=color; c.shadowBlur=16;
  c.beginPath(); c.arc(cx,cy,52,0,Math.PI*2); c.stroke();
  c.globalAlpha=.5; c.beginPath(); c.arc(cx,cy,42,0,Math.PI*2); c.stroke(); c.globalAlpha=1;
  c.beginPath();
  c.moveTo(cx-26,cy-4);
  c.quadraticCurveTo(cx-26,cy-34,cx,cy-34);
  c.quadraticCurveTo(cx+26,cy-34,cx+26,cy-4);
  c.lineTo(cx+26,cy+22);
  c.quadraticCurveTo(cx+26,cy+48,cx,cy+48);
  c.quadraticCurveTo(cx-26,cy+48,cx-26,cy+22);
  c.closePath(); c.globalAlpha=.15; c.fillStyle=color; c.fill(); c.globalAlpha=1; c.stroke();
  c.fillStyle='rgba(255,255,255,.08)'; c.fillRect(cx-18,cy-12,36,12); c.strokeRect(cx-18,cy-12,36,12);
  c.fillStyle=color; c.shadowColor=color; c.shadowBlur=12;
  c.beginPath(); c.arc(cx-9,cy-6,4,0,7); c.arc(cx+9,cy-6,4,0,7); c.fill();
  c.shadowBlur=0;
  c.beginPath(); c.moveTo(cx-30,cy+70); c.quadraticCurveTo(cx,cy+44,cx+30,cy+70);
  c.globalAlpha=.6; c.stroke(); c.globalAlpha=1;
  c.restore();
}

function generateLongImage(r, avatarImg){
  const W=750, PAD=46, CW=658;
  const color = DEBTS[r.primary].color;
  const big=document.createElement('canvas'); big.width=W; big.height=6200;
  const c=big.getContext('2d');
  const g=c.createLinearGradient(0,0,0,6200);
  g.addColorStop(0,'#180a30'); g.addColorStop(.5,'#0d0420'); g.addColorStop(1,'#07060f');
  c.fillStyle=g; c.fillRect(0,0,W,6200);
  const gl=c.createRadialGradient(W/2,120,0,W/2,120,420);
  gl.addColorStop(0, hexA(color,.35)); gl.addColorStop(1, hexA(color,0));
  c.fillStyle=gl; c.fillRect(0,0,W,520);
  const barGrad=c.createLinearGradient(PAD,0,W-PAD,0);
  barGrad.addColorStop(0,color); barGrad.addColorStop(1,'#ff2a6d');

  let y=0;
  c.textAlign='center'; c.textBaseline='alphabetic';
  c.fillStyle='#05d9e8'; c.font='600 22px "Rajdhani","Microsoft YaHei",sans-serif';
  c.fillText('C Y B E R   因 果   ·   测 评 结 果', W/2, y+34); y+=78;
  c.save(); c.fillStyle='#ffffff'; c.shadowColor=color; c.shadowBlur=18;
  c.font='900 46px "Rajdhani","Microsoft YaHei",sans-serif';
  c.fillText('你上辈子欠了哪种债？', W/2, y); c.restore(); y+=52;
  c.fillStyle='#8aa0c8'; c.font='24px -apple-system,"PingFang SC",sans-serif';
  c.fillText('24 题因果扫描 · 看见你的执念', W/2, y); y+=54;
  if(avatarImg){
    const aw=210, ah=210, ax=W/2-aw/2, ay=y;
    c.save(); c.shadowColor=color; c.shadowBlur=26;
    c.drawImage(avatarImg, ax, ay, aw, ah); c.restore();
    y+=ah+34;
  } else {
    drawAvatarCanvas(c, W/2, y+58, color); y+=150;
  }
  c.textAlign='left';
  y=drawDivider(c,y);

  const headTitle = r.tie ? (DEBTS[r.primary].name+' + '+DEBTS[r.secondary].name) : DEBTS[r.primary].name;
  const headSub = r.tie ? comboText(r.primary,r.secondary) : DEBTS[r.primary].title;
  c.textAlign='center';
  c.save(); c.fillStyle='#ffffff'; c.shadowColor=color; c.shadowBlur=16;
  c.font='900 54px "Rajdhani","Microsoft YaHei",sans-serif';
  c.fillText(headTitle, W/2, y); c.restore(); y+=58;
  c.fillStyle='#8aa0c8'; c.font='26px -apple-system,"PingFang SC",sans-serif';
  c.fillText(headSub, W/2, y); y+=56;
  c.textAlign='left'; y+=6;

  const order=Object.keys(r.sum).sort((a,b)=>r.sum[b]-r.sum[a]);
  y=sectionTitle(c,'你的六债信号占比',y);
  order.forEach(k=>{
    const label=DEBTS[k].name+' · '+DEBTS[k].title;
    c.fillStyle='#8aa0c8'; c.font='24px -apple-system,"PingFang SC",sans-serif'; c.textAlign='left';
    c.fillText(label,PAD,y);
    c.fillStyle='#f9f871'; c.font='700 24px "Rajdhani",sans-serif'; c.textAlign='right';
    c.fillText(r.pct[k]+'%', W-PAD, y);
    c.textAlign='left';
    const by=y+12, bh=13;
    c.fillStyle='rgba(255,255,255,.08)'; roundRect(c,PAD,by,CW,bh,6); c.fill();
    c.fillStyle=barGrad; c.shadowColor=color; c.shadowBlur=8;
    roundRect(c,PAD,by,CW*r.pct[k]/100,bh,6); c.fill(); c.shadowBlur=0;
    y=by+bh+30;
  });
  y+=10;

  y=paragraph(c,'前世数据残影', DEBTS[r.primary].story, y);
  y=paragraph(c,'今生表现（说的是你吗）', DEBTS[r.primary].present, y);
  y=paragraph(c,'理论依据 · 学点新东西', DEBTS[r.primary].theory, y);
  y=paragraph(c,'今生课题 · 怎么还这笔债', DEBTS[r.primary].advice.map((a,i)=>(i+1)+'. '+a).join('\n'), y);
  y=quoteBlock(c, DEBTS[r.primary].quote, y, color);

  c.fillStyle='#6f685c'; c.font='22px -apple-system,"PingFang SC",sans-serif'; c.textAlign='center';
  c.fillText('来自「你上辈子欠了哪种债」赛博测评 · 截图保存分享', W/2, y+24);
  c.textAlign='left';
  const endY=y+60;

  const out=document.createElement('canvas'); out.width=W; out.height=endY;
  const oc=out.getContext('2d');
  oc.drawImage(big,0,0,W,endY,0,0,W,endY);
  return out;
}
function hexA(hex,a){
  const n=parseInt(hex.slice(1),16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
}

function saveImage(){
  if(!currentResult){ toast('请先完成测试'); return; }
  const img = new Image();
  img.onload = ()=>{ renderLongAndShow(img); };
  img.onerror = ()=>{ renderLongAndShow(null); };
  img.src = 'fortune-teller.feather.png';
}
function renderLongAndShow(avatarImg){
  const out = generateLongImage(currentResult, avatarImg);
  const url = out.toDataURL('image/png');
  document.getElementById('imgPreview').src = url;
  document.getElementById('imgModal').classList.add('active');
  document.getElementById('dlBtn').onclick = ()=>{
    const a=document.createElement('a');
    a.href=url; a.download='我的前世债测评.png'; document.body.appendChild(a); a.click(); a.remove();
    toast('已开始下载');
  };
}

/* ===================== 分享链接 ===================== */
function safeB64encode(str){ return btoa(unescape(encodeURIComponent(str))); }
function safeB64decode(b64){ return decodeURIComponent(escape(atob(b64))); }
function buildShareLink(){
  const enc = safeB64encode(JSON.stringify(answers));
  return location.origin + location.pathname + '?r=' + enc;
}
function copyLink(){
  if(!currentResult){ toast('请先完成测试'); return; }
  const link = buildShareLink();
  copyText(link);
  toast('结果链接已复制，去分享吧');
}
function copyText(t){
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(t).catch(()=>fallbackCopy(t));
  } else fallbackCopy(t);
}
function fallbackCopy(t){
  const ta=document.createElement('textarea');
  ta.value=t; ta.style.position='fixed'; ta.style.opacity='0'; ta.style.top='0';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try{ document.execCommand('copy'); }catch(e){}
  document.body.removeChild(ta);
}

/* ===================== 弹窗 / 提示 ===================== */
function openReview(){ document.getElementById('reviewModal').classList.add('active'); }
function closeReview(){ document.getElementById('reviewModal').classList.remove('active'); }
function closeImg(){ document.getElementById('imgModal').classList.remove('active'); }
function toast(msg){
  const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),2000);
}
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}

/* ===================== 初始化 ===================== */
window.addEventListener('load',()=>{
  mountFt(document.getElementById('coverAvatar'), 'cover');
  mountFt(document.getElementById('guideAvatar'), 'guide');
  document.getElementById('unlockBtn').onclick = unlock;
  document.getElementById('pwInput').addEventListener('keydown',e=>{ if(e.key==='Enter') unlock(); });
  document.getElementById('reviewModal').addEventListener('click',e=>{ if(e.target.id==='reviewModal') closeReview(); });
  document.getElementById('imgModal').addEventListener('click',e=>{ if(e.target.id==='imgModal') closeImg(); });

  // 分享链接：直接展示结果（无需密码）
  const r = new URLSearchParams(location.search).get('r');
  if(r){
    try{
      const ans = JSON.parse(safeB64decode(r));
      if(Array.isArray(ans) && ans.length===24 && ans.every(a=>a>=0&&a<=3)){
        answers = ans; isShared = true; compute(); return;
      }
    }catch(e){}
  }
  document.getElementById('gate').classList.add('active');
});
