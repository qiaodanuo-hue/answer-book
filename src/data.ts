/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Answer {
  id: string;
  text: string;
  interpretation: string; // Detailed guidance / translation
  luckyColor: string; // Lucky color suggestion
  luckyNumber: string; // Lucky number suggestion
  hexagram?: string; // Optional classic ancient symbol / trigram name
}

export const CATEGORIES = [
  { id: 'general', name: '万象 (综合)', icon: 'Sparkles', desc: '问万事万物，寻万千解法' },
  { id: 'love', name: '红尘 (情感)', icon: 'Heart', desc: '问风月因果，看爱恨离合' },
  { id: 'career', name: '浮沉 (事业)', icon: 'Briefcase', desc: '问功名利禄，探青云前程' },
  { id: 'destiny', name: '宿命 (抉择)', icon: 'Compass', desc: '问歧路关隘，指乾坤方向' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

export const ANSWERS: Record<CategoryId, Answer[]> = {
  general: [
    {
      id: 'g1',
      text: '顺其自然，静待风来。',
      interpretation: '有些事情无法强求，当下的执着或许只是徒增烦恼，放开双手，自然会有最好的安排。',
      luckyColor: '月魄白',
      luckyNumber: '7',
      hexagram: '无妄'
    },
    {
      id: 'g2',
      text: '答案在最显眼的地方，只是你视而不见。',
      interpretation: '抛开复杂的迷雾吧，其实真相一直明明白白摆在你面前，顺从直觉。',
      luckyColor: '琥珀金',
      luckyNumber: '3',
      hexagram: '离'
    },
    {
      id: 'g3',
      text: '现在并不是最好的时机，退一步海阔天空。',
      interpretation: '急于求成往往适得其反，暂停脚步，休养生息，等待时轮流转。',
      luckyColor: '竹青色',
      luckyNumber: '9',
      hexagram: '屯'
    },
    {
      id: 'g4',
      text: '大胆走下去，群星在暗中为你指路。',
      interpretation: '不要心怀恐惧，哪怕路途黑暗，你内心的力量与命运的加持也会助你破茧成蝶。',
      luckyColor: '绀宇蓝',
      luckyNumber: '1',
      hexagram: '乾'
    },
    {
      id: 'g5',
      text: '换一个方向思考，死局也会变成生机。',
      interpretation: '不要试图去撞那堵坚硬的墙。侧身而过，或是换条小径，你会发现全新的世界。',
      luckyColor: '杏黄光',
      luckyNumber: '6',
      hexagram: '中孚'
    },
    {
      id: 'g6',
      text: '倾听心底最微弱的声音，那是真的渴望。',
      interpretation: '外界喧嚣嘈杂，但最深处的声音一直很清晰。别让功利和理性吞噬了你的本心。',
      luckyColor: '黛青色',
      luckyNumber: '4',
      hexagram: '复'
    },
    {
      id: 'g7',
      text: '别急着作决定，时间会过滤出真正的黄金。',
      interpretation: '尘埃尚未落定，保持中立观望是最高明的策略，静若处子可避风浪。',
      luckyColor: '瓦灰色',
      luckyNumber: '12',
      hexagram: '坤'
    },
    {
      id: 'g8',
      text: '是的，你最渴望的那个结果终会到来。',
      interpretation: '坚定你的信念，种子已经播下，虽然发芽需要过程，但丰收是注定的事情。',
      luckyColor: '朱砂红',
      luckyNumber: '8',
      hexagram: '大有'
    },
    {
      id: 'g9',
      text: '放弃一些多余的负累，你才能轻装远行。',
      interpretation: '你抓得太紧、想要得太多了。尝试舍弃一些非必须的琐碎，方能腾出手拥抱美好。',
      luckyColor: '玄黑色',
      luckyNumber: '2',
      hexagram: '损'
    },
    {
      id: 'g10',
      text: '你会得到帮助，只需开口说出你的请求。',
      interpretation: '不要孤军奋斗、固步自封。身边有人正默默关注你，你的求助对他们而言是信任的勋章。',
      luckyColor: '薄荷绿',
      luckyNumber: '11',
      hexagram: '泰'
    },
    {
      id: 'g11',
      text: '事情的发展超出了你的预料，但不必焦虑。',
      interpretation: '失舵之船并不一定会触礁，随风漂流或许能靠岸在一个意料之外的繁花岛屿。',
      luckyColor: '松绿石',
      luckyNumber: '5',
      hexagram: '随'
    },
    {
      id: 'g12',
      text: '相信你的第一直觉，那便是正解。',
      interpretation: '多余的分析和博弈只会增加决策熵增，灵魂的声音在最初的零点一秒就已经给出了抉择。',
      luckyColor: '姜黄色',
      luckyNumber: '18',
      hexagram: '震'
    },
    {
      id: 'g13',
      text: '与其纠结过去，不如把视线移向明天。',
      interpretation: '昨天的遗憾如沉入海底的美梦，不可打捞。请带着它赋予你的风骨，走入清晨。',
      luckyColor: '樱草淡黄',
      luckyNumber: '21',
      hexagram: '大过'
    },
    {
      id: 'g14',
      text: '保持沉默，沉默是当下最坚实的铠甲。',
      interpretation: '辩解只会引来更多尘埃，此时无声胜有声，用沉默作为你和世界深层次的无形周旋。',
      luckyColor: '砚台黑',
      luckyNumber: '0',
      hexagram: '师'
    },
    {
      id: 'g15',
      text: '风暴过后，一切都会更加明澈。',
      interpretation: '不要害怕现在的摇晃和震颤，唯有狂风刮去脆弱的表象，坚韧的基石才能脱颖而出。',
      luckyColor: '晴山青',
      luckyNumber: '27',
      hexagram: '坎'
    },
    {
      id: 'g16',
      text: '云开雾散时，最刺眼的往往是真相。',
      interpretation: '有时候我们拒绝承认真相，是因为它不符合我们的期望。鼓起勇气直面真实，才是痛苦解脱的开始。',
      luckyColor: '霜天白',
      luckyNumber: '13',
      hexagram: '夬'
    },
    {
      id: 'g17',
      text: '大智若愚，不妨装糊涂一次。',
      interpretation: '看得太透、算得太精容易伤人伤己。适时地抱起‘难得糊涂’的心态，往往能得到最好的保护。',
      luckyColor: '栗梅色',
      luckyNumber: '45',
      hexagram: '蒙'
    },
    {
      id: 'g18',
      text: '水滴石穿，当下的重复并非毫无意义。',
      interpretation: '你可能会感到日复一日的枯燥。但正是那些看似微不足道的量变，在暗中铸造最坚固的质变长堤。',
      luckyColor: '瓷青色',
      luckyNumber: '28',
      hexagram: '渐'
    },
    {
      id: 'g19',
      text: '这是一声警钟，拉住跑偏的马缰。',
      interpretation: '命运当前在猛烈地拉车，试图提醒你有些偏离了航线。慢下来，校对你生命的北极星。',
      luckyColor: '朱砂红',
      luckyNumber: '9',
      hexagram: '离'
    },
    {
      id: 'g20',
      text: '向最远方望去，现在的曲折只是微尘。',
      interpretation: '如果把时间跨度拉长到五年十年，当前的烦恼甚至不值得你付出一分钟叹息。昂起面庞，阔步前进。',
      luckyColor: '玄海蓝',
      luckyNumber: '55',
      hexagram: '丰'
    },
    {
      id: 'g21',
      text: '有些东西，正是因为得不到，才显得格外美丽。',
      interpretation: '距离产生崇高。对完美和遗憾抱持一种观赏而非占有的态度，会让你更加幸福圆满。',
      luckyColor: '黛紫',
      luckyNumber: '8',
      hexagram: '比'
    },
    {
      id: 'g22',
      text: '别在深夜下决定，白昼更有理性的光芒。',
      interpretation: '夜晚的心绪容易被潮汐牵引，产生过于激烈和悲观的情绪。安然睡去吧，太阳升起后，白昼自然豁然开朗。',
      luckyColor: '橘红',
      luckyNumber: '36',
      hexagram: '明夷'
    },
    {
      id: 'g23',
      text: '换一个游戏规则，你或许能成为赢家。',
      interpretation: '如果这个战局里的评判标准不适合你，与其勉力钻营，不如去创造一个属于你擅长的新赛道。',
      luckyColor: '羽烟灰',
      luckyNumber: '62',
      hexagram: '小过'
    },
    {
      id: 'g24',
      text: '此时正是无求之时，无求便无可失之理。',
      interpretation: '人一旦放下功利执念，就不再被任何枷锁所束缚。当你在心中说‘不’时，你就夺回了绝对的主动权。',
      luckyColor: '铅灰',
      luckyNumber: '0',
      hexagram: '谦'
    },
    {
      id: 'g25',
      text: '贵人就在不远处，留意那些不经意的善意。',
      interpretation: '你不需要孤军奋斗。只要你展露微笑，发出清晰的信息，就会有一些温暖的力量向你靠拢。',
      luckyColor: '赤金',
      luckyNumber: '15',
      hexagram: '同人'
    },
    {
      id: 'g26',
      text: '缓步慢行，看一朵花的盛开。',
      interpretation: '现在的你太匆忙了，灵魂都快落下了。慢下脚步，留意日常生活的琐碎微光。',
      luckyColor: '粉白',
      luckyNumber: '11',
      hexagram: '渐'
    },
    {
      id: 'g27',
      text: '不要在深夜做决定，清晨自有其理性之光。',
      interpretation: '夜晚的情绪容易被阴冷潮湿的思绪笼罩。吃一顿温热的早餐，沐浴在晨光中，答案自然而然就会浮现。',
      luckyColor: '向日葵黄',
      luckyNumber: '6',
      hexagram: '明夷'
    },
    {
      id: 'g28',
      text: '你所担心的最坏情况，其实永远不会发生。',
      interpretation: '我们的大脑往往是制造焦虑的工厂。那九成让你彻夜不眠的灾难，在现实中甚至都找不到发生的温床。松一口气吧。',
      luckyColor: '石青',
      luckyNumber: '32',
      hexagram: '无妄'
    },
    {
      id: 'g29',
      text: '去有风的地方坐坐，风会带走多余的尘埃。',
      interpretation: '不要总是把自己闷在封闭的理性死胡同里。走向自然，任凭清风吹拂，大自然强大的清理气场会带走你的杂念。',
      luckyColor: '天青色',
      luckyNumber: '8',
      hexagram: '涣'
    },
    {
      id: 'g30',
      text: '有些错配，只是为了在下一站遇到完美的契合。',
      interpretation: '不要指责当下的分离与拧巴，拼图的边缘如果完美重叠，那一定是因为有人做了修整。多一点耐心，好事多磨。',
      luckyColor: '若草色',
      luckyNumber: '25',
      hexagram: '旅'
    },
    {
      id: 'g31',
      text: '这不只是一个阻碍，也是命运在检验你的决心。',
      interpretation: '轻易得到的东西往往弃之可惜。难关的出现，是为了筛选出那些真心渴望的朝圣者。你是否有勇气再迈一步？',
      luckyColor: '古金色',
      luckyNumber: '14',
      hexagram: '坎'
    },
    {
      id: 'g32',
      text: '不言不语，才是最高明的修行。',
      interpretation: '解释往往会让原本清晰的事态变得混乱，让流言随着风沙自然沉淀。保持冷峻，用行动充当最大的底牌。',
      luckyColor: '墨灰',
      luckyNumber: '0',
      hexagram: '颐'
    },
    {
      id: 'g33',
      text: '给自己放个假，休整三天再出发。',
      interpretation: '引擎过度运转会磨损轴承。当前你需要的是彻底的断联与休息，而非不知疲倦的透支。睡个好觉。',
      luckyColor: '粉青',
      luckyNumber: '9',
      hexagram: '屯'
    },
    {
      id: 'g34',
      text: '是的，你真正走在正确的轨道上。',
      interpretation: '不需要惶恐身边的寂静，那是因为你已经走在了人迹罕至却直达终点的小路上。笃定信念，行而不辍。',
      luckyColor: '琥珀橘',
      luckyNumber: '88',
      hexagram: '乾'
    },
    {
      id: 'g35',
      text: '换一种眼光，遗憾也是另一种成全。',
      interpretation: '如果你在懊悔错过了最末班车，或许你只是避开了一场途中的泥石流。相信命运拥有比你更宏大的安全网。',
      luckyColor: '月魄白',
      luckyNumber: '13',
      hexagram: '咸'
    },
    {
      id: 'g36',
      text: '你以为的失去，其实只是物归原主。',
      interpretation: '本不属于你的行李，再怎么执着打捞，也只会沉入海底。松开双手，把背包腾空，更好的礼物已经在路上。',
      luckyColor: '茶褐',
      luckyNumber: '4',
      hexagram: '剥'
    },
    {
      id: 'g37',
      text: '大智若愚，不妨难得糊涂一次。',
      interpretation: '看太懂、说太穿，会割破温润的气场。适时收起锋芒，展现一两分憨厚，反而是最好的防身神物。',
      luckyColor: '缃叶黄',
      luckyNumber: '12',
      hexagram: '坤'
    },
    {
      id: 'g38',
      text: '勇敢表达你的不悦，设立你的边界。',
      interpretation: '一味的退让只会被得寸进尺。温柔但坚定地画出你的底线，真正的尊重是从你说‘不’的那一刻开始建立的。',
      luckyColor: '丹蔻红',
      luckyNumber: '7',
      hexagram: '震'
    },
    {
      id: 'g39',
      text: '与其去求别人的认可，不如自己拥抱自己。',
      interpretation: '外界风刮来吹去，没有一刻是绝对安静的。当你不再用他人的量尺测量自己的高度时，你便彻底无敌。',
      luckyColor: '鸦青',
      luckyNumber: '3',
      hexagram: '中孚'
    },
    {
      id: 'g40',
      text: '一粒种子的萌发，需要忍受最深的黑暗。',
      interpretation: '现在你感到举步维艰、不见天日，正是你向上突破外壳、破土而出的前夜。撑住，晨光最容易在此时降临。',
      luckyColor: '郁金色',
      luckyNumber: '5',
      hexagram: '复'
    }
  ],
  love: [
    {
      id: 'l1',
      text: '若是执念太深，只会落得两败俱伤。',
      interpretation: '红尘有缘，强求不得。松一松手中线，属于你的飞鸟终究会回到你的手心。',
      luckyColor: '藕荷粉',
      luckyNumber: '2',
      hexagram: '小过'
    },
    {
      id: 'l2',
      text: '他/她此刻正在默默地挂念着你。',
      interpretation: '风里捎带着某人心中的悸动，尽管没有明言，但心电感应之线未曾剪断。',
      luckyColor: '桃花绯',
      luckyNumber: '5',
      hexagram: '咸'
    },
    {
      id: 'l3',
      text: '尘缘本就虚幻，不妨看淡。',
      interpretation: '爱意如同水中探月，执念于完美反而易碎。接受不圆满，反倒是一种大自在。',
      luckyColor: '烟雨灰',
      luckyNumber: '9',
      hexagram: '丰'
    },
    {
      id: 'l4',
      text: '相见不如怀念，放手是最高尚的成全。',
      interpretation: '有些故事写到这里就是最美妙的绝唱。若硬要生生拉扯，反而会磨灭最初残留的芬芳。',
      luckyColor: '茶褐色',
      luckyNumber: '14',
      hexagram: '遁'
    },
    {
      id: 'l5',
      text: '真挚坦诚地交流，能化解所有的隔阂。',
      interpretation: '猜测与试探是爱情最大的内耗。不如挑一个温柔的月夜，把你的软肋无设防地展示给对方。',
      luckyColor: '暖橙色',
      luckyNumber: '3',
      hexagram: '兑'
    },
    {
      id: 'l6',
      text: '不属于你的，终究要归还命运。',
      interpretation: '不要因为在不属于你的港口等一艘船，而错过了载你前往碧海蓝天的风帆。',
      luckyColor: '极光灰',
      luckyNumber: '8',
      hexagram: '剥'
    },
    {
      id: 'l7',
      text: '你们需要给彼此一些自由流动的空间。',
      interpretation: '拥抱太紧会勒断呼吸。让彼此成为对等的两棵树，枝叶在空中纠缠，底下的根须各自独立。',
      luckyColor: '淡湖绿',
      luckyNumber: '7',
      hexagram: '巽'
    },
    {
      id: 'l8',
      text: '对的人会穿越人群，在对的时刻拥抱你。',
      interpretation: '不需要刻意讨好，更不用委曲求全。你只需开成一朵璀璨的花，蝴蝶自然会因香气而至。',
      luckyColor: '郁金香黄',
      luckyNumber: '10',
      hexagram: '临'
    },
    {
      id: 'l9',
      text: '这是一场宿命的修行，不要轻言放弃。',
      interpretation: '磨合虽痛，但却是彼此灵魂修剪毛刺、逐渐镶嵌进对方拼图拼版的过程。再坚持一步。',
      luckyColor: '绛紫红',
      luckyNumber: '13',
      hexagram: '恒'
    },
    {
      id: 'l10',
      text: '回首往昔，那人已逐渐淡出你的命盘。',
      interpretation: '时光的列车已经开远，对方在上一站已经悄然下车。允许自己伤心一会，然后平静抬头看窗外。',
      luckyColor: '深黛蓝',
      luckyNumber: '4',
      hexagram: '损'
    },
    {
      id: 'l11',
      text: '一厢情愿的救赎，终究只是一种自恋的幻觉。',
      interpretation: '你无法改变一个不想改变的人，更不必扮演救世主的角色。爱他，或者放手，但绝不要试图重塑他。',
      luckyColor: '丁香紫',
      luckyNumber: '19',
      hexagram: '颐'
    },
    {
      id: 'l12',
      text: '看似偶然的相遇，实际上是跨越轮回的久别重逢。',
      interpretation: '缘分之奇妙就在于无形中的引力。当你们在某个角落不期而遇，不要怀疑，这就是最温柔的宿命安排。',
      luckyColor: '海棠红',
      luckyNumber: '77',
      hexagram: '咸'
    },
    {
      id: 'l13',
      text: '该去道个别了，别让遗憾发霉。',
      interpretation: '未完成的情结会在灵魂深处产生负累。亲口、亲笔，或者在心中庄严地说一声再见，给这段历史烙上休止符。',
      luckyColor: '秋枫橘',
      luckyNumber: '12',
      hexagram: '离'
    },
    {
      id: 'l14',
      text: '真正的爱，是看透了对方所有的破损仍留下来温存。',
      interpretation: '世俗的结合充满权衡，但灵魂的爱意却能穿透残缺。不要介意他的脆弱，正是那些裂缝在吸纳微光。',
      luckyColor: '月光蓝',
      luckyNumber: '3',
      hexagram: '中孚'
    },
    {
      id: 'l15',
      text: '有些喜欢，只能止于齿尖、掩于岁月。',
      interpretation: '并非每一场盛开的风花雪月都必须结成果实。深深地把他收纳进你的灵魂暗格里，也是一种绝伦的浪漫。',
      luckyColor: '雪青',
      luckyNumber: '45',
      hexagram: '艮'
    },
    {
      id: 'l16',
      text: '别用考验来求证爱，它经不起显微镜的审判。',
      interpretation: '人性是复杂的，在极端的假设下任何人都会动摇。珍惜眼前的温度，比隔着迷局试探更加踏实有益。',
      luckyColor: '藤萝紫',
      luckyNumber: '22',
      hexagram: '贲'
    },
    {
      id: 'l17',
      text: '大胆把你的爱意喊出来，风会帮你吹到他耳畔。',
      interpretation: '羞涩或许是美德，但坦白却能救赎时间。哪怕没有结果，你的勇敢也会为你自己的命盘增添一抹高亢的烈火。',
      luckyColor: '嫣红',
      luckyNumber: '5',
      hexagram: '震'
    },
    {
      id: 'l18',
      text: '先学会爱自己的残缺，才能接纳另一个不完美。',
      interpretation: '如果你连自己的软弱都在痛恨，又如何能包容爱人身上的疲态。先给自己一个结实的拥抱，温润的气场最动人。',
      luckyColor: '青金石',
      luckyNumber: '33',
      hexagram: '坤'
    },
    {
      id: 'l19',
      text: '当断不断，必受其乱。斩断烂桃花吧。',
      interpretation: '那些拖泥带水、含糊不清的纠葛，正在无休止地消耗你的气运福报。狠狠一刀切断，明朗的世界才能回归。',
      luckyColor: '玄朱',
      luckyNumber: '0',
      hexagram: '夬'
    },
    {
      id: 'l20',
      text: '你们的红线还在延长，只是需要跨过几道急弯。',
      interpretation: '没有平坦不息的河流。当下的争吵和距离只是命运设立的试金石。只要两心依然相向，星芒就不会熄灭。',
      luckyColor: '绯桃红',
      luckyNumber: '9',
      hexagram: '恒'
    },
    {
      id: 'l21',
      text: '心如古井，不泛微澜。当下的平淡才是对你的护佑。',
      interpretation: '不要总是贪恋烈火烹油的激情。那些过分炙热的往往也最容易烫伤手指。温吞的茶水，能陪伴你走得更遥远。',
      luckyColor: '晚香玉白',
      luckyNumber: '11',
      hexagram: '静'
    },
    {
      id: 'l22',
      text: '在爱里扮演拯救者，注定是要被溺亡的。',
      interpretation: '不要试图去改变一个人，也不要觉得你的爱能抚平所有的残损。先把自己抱紧、爱护好，才是爱情里最核心的法门。',
      luckyColor: '竹青',
      luckyNumber: '8',
      hexagram: '噬嗑'
    },
    {
      id: 'l23',
      text: '两只刺猬，在寒风中需要找到合适的距离。',
      interpretation: '靠得太近会被彼此的毛刺扎伤，离得太远又会觉得严寒刺骨。多一次试探，多一分尊重，距离产生美。',
      luckyColor: '雾霭蓝',
      luckyNumber: '6',
      hexagram: '萃'
    },
    {
      id: 'l24',
      text: '尘封的旧信就随他去吧，不要在废墟上重建高楼。',
      interpretation: '过去的痛楚已成不可打捞的淤泥。让那段故事留在泛黄的时间里，你的列车正在驶入明亮鲜活的群山中。',
      luckyColor: '茶墨',
      luckyNumber: '25',
      hexagram: '剥'
    },
    {
      id: 'l25',
      text: '与其千百次地暗中揣摩，不如坦诚相见吃一顿火锅。',
      interpretation: '所有的暧昧与博弈往往都是思维的过滤器。把事情摊在桌面上，看着对方清澈的眼眸，答案会豁然开朗。',
      luckyColor: '琥珀金',
      luckyNumber: '3',
      hexagram: '离'
    },
    {
      id: 'l26',
      text: '不要害怕爱错，每一次错付都是为了给真爱铺路。',
      interpretation: '没有完美的命盘，也没有一次就能通关的恋情。每次心碎都是岁月为你雕琢锋芒与气度的过程。',
      luckyColor: '珊瑚红',
      luckyNumber: '15',
      hexagram: '晋'
    },
    {
      id: 'l27',
      text: '你退缩的一小步，其实是命运在保护你的柔软。',
      interpretation: '直觉正告诫你前方是个过于刺眼的战局。不要勉强深陷，适时的礼貌与退让不是懦弱，而是极高的自保。',
      luckyColor: '粉青',
      luckyNumber: '4',
      hexagram: '艮'
    },
    {
      id: 'l28',
      text: '心电感应尚未散去，只是时间在打个小小的呵欠。',
      interpretation: '当下的冷淡或没有回音并不是终局。不需要过度惶恐，安静做回自己的事情，流云自会再次聚拢。',
      luckyColor: '月魄白',
      luckyNumber: '7',
      hexagram: '咸'
    },
    {
      id: 'l29',
      text: '别去摘那朵容易枯萎的花，去种一棵常青的树。',
      interpretation: '不要执着于瞬间的、虚幻的诺言。寻找可以共同成长、能在岁月中沉淀下来的踏实关系，才是真正的彼岸。',
      luckyColor: '黛绿',
      luckyNumber: '18',
      hexagram: '恒'
    },
    {
      id: 'l30',
      text: '对方其实比你想象的更在乎你，只是他有口难开。',
      interpretation: '尘世人大多身被重重锁链，害羞或是骄傲让我们紧闭心扉。多给对方一点温柔的包容，冰雪自会消融。',
      luckyColor: '胭脂粉',
      luckyNumber: '2',
      hexagram: '兑'
    },
    {
      id: 'l31',
      text: '放下掌控欲吧，爱就像沙子，抓得越紧流得越快。',
      interpretation: '不需要知道他每一秒的行踪，更不用试图霸占他所有的思绪。给他空间，便是给他一张可以随时回头的飞毯。',
      luckyColor: '松绿',
      luckyNumber: '9',
      hexagram: '巽'
    },
    {
      id: 'l32',
      text: '你以为是错过了，其实是正好避开了一生纠结。',
      interpretation: '东北有些看似无缘的遗憾，如果走下去，其实是走钢丝式的苦海无边。命运在这里猛踩刹车，实际上是在放生你。',
      luckyColor: '铅灰色',
      luckyNumber: '33',
      hexagram: '泰'
    },
    {
      id: 'l33',
      text: '一次真诚的流泪，胜过一万句伪装的誓言。',
      interpretation: '别再用坚硬的外壳包装软肋。在最亲密的人面前展露真实的不安，不仅不会折损你，反而能构筑最深的结合。',
      luckyColor: '海棠红',
      luckyNumber: '5',
      hexagram: '咸'
    },
    {
      id: 'l34',
      text: '红尘的风，终究会吹散那些虚妄的迷雾。',
      interpretation: '不要被甜言蜜语蒙蔽，也不用执着于对方当下的承诺。看看他是否为你拂去衣落的微尘，真实生活的微小体贴最珍贵。',
      luckyColor: '杏黄',
      luckyNumber: '12',
      hexagram: '中孚'
    },
    {
      id: 'l35',
      text: '去一个从未去过的新地方散散心，那有新的气场。',
      interpretation: '不要总是和同一个人在老地方兜兜转转。换一个城市、走一条林荫道，微风会带给你全新的情感契机。',
      luckyColor: '天青色',
      luckyNumber: '21',
      hexagram: '旅'
    },
    {
      id: 'l36',
      text: '若爱是束缚，不妨温柔而庄严地解开它。',
      interpretation: '不平等的迁就只能产出怨气，而无法浇灌出幸福的花朵。如果你感到日渐干枯窒息，收回你的丝线也未尝不可。',
      luckyColor: '黛紫色',
      luckyNumber: '0',
      hexagram: '夬'
    },
    {
      id: 'l37',
      text: '两情若是久长时，又岂在朝朝暮暮。',
      interpretation: '距离和分离是命运设下的熔炉。如果两颗心确实烙印在同一个频段，哪怕隔着万水千山，也无损金石之坚。',
      luckyColor: '晴山蓝',
      luckyNumber: '88',
      hexagram: '同人'
    },
    {
      id: 'l38',
      text: '现在的争吵只是岁月的毛刺，打磨平整依然美丽。',
      interpretation: '不要因为一时的争执而全盘否定。亲密关系的建立就是一门在磕碰中寻找默契的艺术，多一些倾听。',
      luckyColor: '竹炭黑',
      luckyNumber: '14',
      hexagram: '丰'
    },
    {
      id: 'l39',
      text: '他的世界太挤了，退出来你才能重获呼吸。',
      interpretation: '如果那个战局里有太多不明不白的影子，你的委曲求全只会让自己日益退化。转过头，迎接灿烂的清晨。',
      luckyColor: '玄黑色',
      luckyNumber: '13',
      hexagram: '否'
    },
    {
      id: 'l40',
      text: '你就是那朵盛放的花，不必向野草诉说你的芬芳。',
      interpretation: '有些人的频率太温吞或低迷，注定无法读不懂你的绚烂。做好你自己，高雅的蝴蝶终会将落定在你的肩头。',
      luckyColor: '郁金色',
      luckyNumber: '99',
      hexagram: '中孚'
    }
  ],
  career: [
    {
      id: 'c1',
      text: '眼前看似是危机，实则是转型的良机。',
      interpretation: '舒适圈正在崩塌，但这也是最好的催化剂。抛弃过时的旧模式，迎着风沙高飞吧。',
      luckyColor: '钛白金',
      luckyNumber: '8',
      hexagram: '革'
    },
    {
      id: 'c2',
      text: '孤掌难鸣，你需要寻找可靠的同行者。',
      interpretation: '个人的英雄时代已经过去，一个有默契、优势互补的团队，将为你叩开不可估量的新起点。',
      luckyColor: '军羽绿',
      luckyNumber: '6',
      hexagram: '同人'
    },
    {
      id: 'c3',
      text: '方向错了，停下来便是最好的前进。',
      interpretation: '不要因为已经投入的资本而犹豫不决（沉没成本）。及时止损是一门极其宝贵的智慧储备。',
      luckyColor: '胭脂红',
      luckyNumber: '15',
      hexagram: '睽'
    },
    {
      id: 'c4',
      text: '潜龙勿用，默默累积才是王道。',
      interpretation: '现在不是张扬才华、争抢聚光灯的节点。继续磨砺锋芒，待时机成熟时一剑惊人。',
      luckyColor: '古铜黄',
      luckyNumber: '1',
      hexagram: '乾'
    },
    {
      id: 'c5',
      text: '勇敢地争取，你应得的就在触手。',
      interpretation: '不要因为谦逊而错失良机。挺起脊梁，直视你的野心，并大声宣告这就是你的舞台。',
      luckyColor: '烈火红',
      luckyNumber: '9',
      hexagram: '大有'
    },
    {
      id: 'c6',
      text: '谨防耳边的蜜语，那是包裹白糖的毒药。',
      interpretation: '在涉及重要利益、协议签字时，多一份警觉和法理校核。不要被天衣无缝的利益大饼迷惑。',
      luckyColor: '乌金玄',
      luckyNumber: '4',
      hexagram: '姤'
    },
    {
      id: 'c7',
      text: '财水充沛，但需提防水盈则溢。',
      interpretation: '运势呈现明显上升期，财务方面有不错的斩获。切记落袋为安，避免投机操作陷入死局。',
      luckyColor: '翠羽青',
      luckyNumber: '88',
      hexagram: '鼎'
    },
    {
      id: 'c8',
      text: '专注主干，裁撤不必要的旁根枝杈。',
      interpretation: '精力过于分散是无法破局的主因。选择最强的一线发起总攻，其他旁支全部停摆。',
      luckyColor: '深松青',
      luckyNumber: '5',
      hexagram: '履'
    },
    {
      id: 'c9',
      text: '当下环境虽恶劣，唯有坚守者方获大胜。',
      interpretation: '你正处于最艰难的瓶颈期，大多数人都选择放弃的时候。只要你能挺过这段黑暗，光明只属于你.。。',
      luckyColor: '秋枯黄',
      luckyNumber: '22',
      hexagram: '明夷'
    },
    {
      id: 'c10',
      text: '是时候抽身离开，寻找另一片肥饶土壤了。',
      interpretation: '这口井已经枯歇了，继续深掘也是徒劳。勇敢走向未知的荒原，你会发现遍地清泉。',
      luckyColor: '白山雪',
      luckyNumber: '33',
      hexagram: '剥'
    },
    {
      id: 'c11',
      text: '不要被一时的利益蒙蔽，眼光要放得更远。',
      interpretation: '此时看似有一笔丰厚但短视、甚至带有些许风险的操作在诱惑你。想想三年后的立足之地，不要捡了芝麻丢了西瓜。',
      luckyColor: '苍艾绿',
      luckyNumber: '4',
      hexagram: '颐'
    },
    {
      id: 'c12',
      text: '你的才华正处于积攒期，无需自我怀疑。',
      interpretation: '没有哪个春天是突然到来的。你当前看似没有成效的每一天，都在深挖你职业基石的深度。沉住气。',
      luckyColor: '黎色',
      luckyNumber: '45',
      hexagram: '渐'
    },
    {
      id: 'c13',
      text: '是时候跳脱常规，进行一次冒险了。',
      interpretation: '因循守旧只能确保基本温饱，但也绝不能让你傲立群雄。看准那个几乎无人敢涉足的新赛道，破水而出吧。',
      luckyColor: '铬黄',
      luckyNumber: '13',
      hexagram: '革'
    },
    {
      id: 'c14',
      text: '功成名就后，切记要急流勇退，免遭不悦。',
      interpretation: '当你风光无限时，有些眼光已经在暗里揣摩挑刺。大获全胜之后，适时分出一部分利益或光芒，可以为你筑起护身的高墙。',
      luckyColor: '沉香棕',
      luckyNumber: '62',
      hexagram: '涣'
    },
    {
      id: 'c15',
      text: '换个老板或换个跑道，对你是更好的解脱。',
      interpretation: '如果一棵植物在贫瘠的水硬碱土里叶片泛黄，施肥是没用的，唯一的生路是移栽。寻找真正赏识你风骨的领地吧。',
      luckyColor: '薄麦黄',
      luckyNumber: '38',
      hexagram: '大壮'
    },
    {
      id: 'c16',
      text: '用实力说话，无谓的社交在消耗你的精力。',
      interpretation: '虚伪的觥筹交错并不能置换真正的行业硬实力。回到书桌或工作室前，把自己打磨到极致，那就是最昂贵的话语权。',
      luckyColor: '鸦青',
      luckyNumber: '7',
      hexagram: '师'
    },
    {
      id: 'c17',
      text: '有些事需要低调谋划，防人之心不可无。',
      interpretation: '害人之心不可有，防人之心不可无。在维持和气的同时，为自己设立一道后备方案。',
      luckyColor: '焦茶',
      luckyNumber: '9',
      hexagram: '小畜'
    },
    {
      id: 'c18',
      text: '这是一场艰苦的拉锯战，拼的是气血和体魄。',
      interpretation: '在技术上大家旗鼓相当，接下来唯一的比拼就是看谁的意志更强，谁能撑过黎明前的最后一秒。照顾好身体，继续前行。',
      luckyColor: '赭红',
      luckyNumber: '5',
      hexagram: '乾'
    },
    {
      id: 'c19',
      text: '运势渐入佳境，不要吝啬对下属 or 同僚的奖掖。',
      interpretation: '一枝独秀不是春。当你处于强运时，慷慨地分享机会并提拔新人，会让你的气场形成一座坚如磐石的众星拱卫之城。',
      luckyColor: '明黄',
      luckyNumber: '88',
      hexagram: '泰'
    },
    {
      id: 'c20',
      text: '哪怕跌倒，也要抓起一把泥沙再站起来。',
      interpretation: '在挫折中寻找学习的价值，让每一次失误都成为你简历上最生动的战绩勋章。战跨逆境才是真正的大器。',
      luckyColor: '墨玉绿',
      luckyNumber: '3',
      hexagram: '屯'
    },
    {
      id: 'c21',
      text: '积土成山，非一日功。现在的重复是在垫高底盘。',
      interpretation: '不要因为看不见飞跃而沮丧。基础重复的意义，在于给即将到来的惊雷提供一个足够结实、不会崩塌的基座。',
      luckyColor: '缃叶黄',
      luckyNumber: '11',
      hexagram: '渐'
    },
    {
      id: 'c22',
      text: '有舍方有得，斩断低效副业，专注于主战场。',
      interpretation: '你有些太贪心，想把所有外在商机都握在手里。这只会分散你的神识，让你在核心赛道上落了后。',
      luckyColor: '赤金',
      luckyNumber: '14',
      hexagram: '损'
    },
    {
      id: 'c23',
      text: '你正受到一股隐秘善意的托举，留意身边沉稳的长辈。',
      interpretation: '你不需要一个人承担所有的风沙。只要展现真诚、保持谦和，有德高望重之士正在暗中为你引路。',
      luckyColor: '松柏绿',
      luckyNumber: '12',
      hexagram: '坤'
    },
    {
      id: 'c24',
      text: '不要把委屈憋在心里，用温和理性的契约作为防线。',
      interpretation: '职场不相信眼泪，只相信契约与底气。白字黑字的协议比空口博弈有益一万倍，为自己的未来把好关。',
      luckyColor: '朱砂红',
      luckyNumber: '7',
      hexagram: '讼'
    },
    {
      id: 'c25',
      text: '此时多看、多学，少说、少争，保持最佳中立。',
      interpretation: '当下的局局势有些混沌，各种风声鹤唳都在试图博人站队。保持中正温和，等尘埃落定你才是最终赢家。',
      luckyColor: '羽烟灰',
      luckyNumber: '25',
      hexagram: '谦'
    },
    {
      id: 'c26',
      text: '你以为的上升通道，其实布满了别人设下的陷阱。',
      interpretation: '看起来极其美妙的提拔或合伙计划，背后可能隐藏着虚高的业绩背书或大饼。冷静分析，避其风口。',
      luckyColor: '玄黑色',
      luckyNumber: '6',
      hexagram: '姤'
    },
    {
      id: 'c27',
      text: '换一组工具或工作方法，你会瞬间破局。',
      interpretation: '用钝刀砍柴只会徒增疲惫。停下繁忙的工作，升级一下你的知识系统，或是更换高效的手段，生产力加倍。',
      luckyColor: '薄荷绿',
      luckyNumber: '9',
      hexagram: '大过'
    },
    {
      id: 'c28',
      text: '野心需要实力的托举。别把精修当成钻营。',
      interpretation: '急于展现成果容易粗制滥造。回到案几前，把你的方案细节精雕细琢，真正的认可会不请自来。',
      luckyColor: '姜黄',
      luckyNumber: '10',
      hexagram: '贲'
    },
    {
      id: 'c29',
      text: '离开那个令你精神内耗的老板，他无法成全你的高度。',
      interpretation: '一个只会压榨和打压你价值的管理者，只会让你变得卑微。寻找一个愿意看你长成参天大树的地方。',
      luckyColor: '竹青色',
      luckyNumber: '33',
      hexagram: '剥'
    },
    {
      id: 'c30',
      text: '你的福报与气运正在暗中上涨，一则喜讯将在近期到来。',
      interpretation: '之前的暗中积累、为他人撑伞的好报正在形成高能磁场。保持你明朗的干劲，接住扑向你的机会。',
      luckyColor: '柿红',
      luckyNumber: '18',
      hexagram: '晋'
    },
    {
      id: 'c31',
      text: '守住现金流，当下的盲目扩张会导致满盘皆输。',
      interpretation: '运势进入暂时的休整时，防守就是最好的进攻。压缩不必要的非刚性支出，稳扎稳打。',
      luckyColor: '水墨灰',
      luckyNumber: '0',
      hexagram: '蹇'
    },
    {
      id: 'c32',
      text: '职场的聚散如同云朵。别为离职的同伴抱憾。',
      interpretation: '列车有人上车自然有人到站。人际的离散在职场再正常不过，保留情义，在顶峰相见。',
      luckyColor: '晚香白',
      luckyNumber: '4',
      hexagram: '小过'
    },
    {
      id: 'c33',
      text: '你的核心堡垒极其坚固，不要被道听途说的流言吓退。',
      interpretation: '对方的狂轰滥炸，往往是因为他们内心的焦虑和底气散尽。保持你的定力和步伐，任凭风浪翻滚。',
      luckyColor: '绀宇蓝',
      luckyNumber: '28',
      hexagram: '中孚'
    },
    {
      id: 'c34',
      text: '试着去用温和的方式收买人心，锋芒不要太刺骨。',
      interpretation: '才华横溢固然是底气，但也容易让人感到被威胁。多请教一下同僚，多一句暖心问候，阻力悄然消失。',
      luckyColor: '粉白',
      luckyNumber: '13',
      hexagram: '谦'
    },
    {
      id: 'c35',
      text: '这是一个需要全力以赴的战役。关掉一切无谓的打扰。',
      interpretation: '接下来是核心破局点。推掉不必要的闲谈，屏蔽碎片化信息的侵袭，给自己留一片专注。',
      luckyColor: '琥珀金',
      luckyNumber: '1',
      hexagram: '乾'
    },
    {
      id: 'c36',
      text: '方向对了，千万不要因为慢而中途调头。',
      interpretation: '好比挖井，你已经能温热闻到湿润泥土。如果此时因为看不到水就换地方，永远也挖不到甘泉。',
      luckyColor: '茶墨',
      luckyNumber: '41',
      hexagram: '屯'
    },
    {
      id: 'c37',
      text: '在细节处提防财务纰漏，切勿贪图眼前的眼前便宜。',
      interpretation: '哪怕很信任的合作伙伴，在涉及利益分配、细节合约时也要一丝不苟。一笔糊涂账可能带来后患。',
      luckyColor: '绛红色',
      luckyNumber: '3',
      hexagram: '巽'
    },
    {
      id: 'c38',
      text: '你的一项非核心技能，有朝一日会成为你破局转型的支点。',
      interpretation: '不要觉得那些随手做的副业或爱好无用。未来你最能闪耀的赛道，极有可能是它们交织出的新大陆。',
      luckyColor: '淡湖绿',
      luckyNumber: '22',
      hexagram: '大过'
    },
    {
      id: 'c39',
      text: '大胆索要属于你的晋升与报酬，你不欠任何人。',
      interpretation: '别再不好意思。用你扎实的业绩报告作为武器，坚定沟通，拿回属于你奋斗的累累硕果。',
      luckyColor: '焦茶色',
      luckyNumber: '5',
      hexagram: '震'
    },
    {
      id: 'c40',
      text: '去进修一门新的手艺，它可以为你挡下岁月的侵蚀。',
      interpretation: '时代在飞速更迭，现有的红利终有退去的时候。花时间扎实打磨一项可以作为护身法宝的真本事。',
      luckyColor: '黛青色',
      luckyNumber: '99',
      hexagram: '复'
    }
  ],
  destiny: [
    {
      id: 'd1',
      text: '前路艰险，然逆流而上必成大器。',
      interpretation: '避重就轻只能得到中庸，去爬最险峻的高山，去喝最凛冽的烈酒。你的命盘适合大开大合。',
      luckyColor: '玄武墨',
      luckyNumber: '19',
      hexagram: '蹇'
    },
    {
      id: 'd2',
      text: '回归最初，问问七岁时你的誓言。',
      interpretation: '在俗世迷失太久，你可能忘了最初为什么上路。试着剥离所有的修饰，回归最纯真的选择。',
      luckyColor: '琉璃黄',
      luckyNumber: '7',
      hexagram: '蒙'
    },
    {
      id: 'd3',
      text: '此去经年，风雨兼程，万勿彷徨。',
      interpretation: '一旦跨出那一步，就没有回头路。这并非坏事，唯有破釜沉舟，才能斩断纠缠的梦魇。',
      luckyColor: '赫金红',
      luckyNumber: '41',
      hexagram: '萃'
    },
    {
      id: 'd4',
      text: '偏偏是你最不喜欢的那个选项。',
      interpretation: '良药苦口，正义常磨。真正对你灵性成长有益的路，往往布满你理智上排斥的荆棘。',
      luckyColor: '幽邃深绿',
      luckyNumber: '11',
      hexagram: '颐'
    },
    {
      id: 'd5',
      text: '两败俱伤中的一条窄道便是活路。',
      interpretation: '不要试图寻找完美的双赢，那是幻象。在两难之中坚守良善的底线，你会发现一个新窗口。',
      luckyColor: '竹炭黑',
      luckyNumber: '81',
      hexagram: '解'
    },
    {
      id: 'd6',
      text: '缘分已尽，从此萧郎是路人。',
      interpretation: '宿命中属于彼此的剧情已经拉下帷幕，不必再纠缠因果。微笑拂衣去，相忘于江湖。',
      luckyColor: '月落白',
      luckyNumber: '24',
      hexagram: '剥'
    },
    {
      id: 'd7',
      text: '你可以相信命数的慷慨，惊喜就在数日内。',
      interpretation: '你之前历经的苦难，已经在无形中点亮了福德之星。请安心等待，一桩圆满的果实即将落地。',
      luckyColor: '柿红',
      luckyNumber: '16',
      hexagram: '晋'
    },
    {
      id: 'd8',
      text: '不可贪，不可傲，持身中正，自然避灾。',
      interpretation: '运势高涨时容易种下傲慢树。低调做人，施恩于人，才能在你高飞之时将风力稳固。',
      luckyColor: '檀木棕',
      luckyNumber: '50',
      hexagram: '谦'
    },
    {
      id: 'd9',
      text: '抛弃计划，跟着直觉去流浪一天。',
      interpretation: '过度的脑力计算已经变成了思维牢笼。走出大门，立于风口，惊喜在未知的路途。',
      luckyColor: '松烟绿',
      luckyNumber: '17',
      hexagram: '随'
    },
    {
      id: 'd10',
      text: '乾坤颠倒，唯有放下胜负心，方能不败。',
      interpretation: '执着于争输赢已经把你引向危险。当你真心不在乎高低贵贱时，世界将再也没有能刺痛你的枪。',
      luckyColor: '太极玉',
      luckyNumber: '99',
      hexagram: '泰'
    },
    {
      id: 'd11',
      text: '命中注定有此一捷，挺过去便是海阔天空。',
      interpretation: '这是你宿命图谱里的转折性关隘，避开关门是没用的。唯有迎上前，让浪潮冲垮所有伪装，获得重生的钢筋铁骨。',
      luckyColor: '玄天黑',
      luckyNumber: '3',
      hexagram: '坎'
    },
    {
      id: 'd12',
      text: '顺天者昌，逆天者痛。该向命运低头一次了。',
      interpretation: '这里的低头并不是妥协，而是审时度势的韧性。像水一样顺应河道，流过最险峻的峡谷，总能奔向汪洋之境。',
      luckyColor: '水墨灰',
      luckyNumber: '6',
      hexagram: '讼'
    },
    {
      id: 'd13',
      text: '舍得，舍得，不舍何来得？',
      interpretation: '你正陷于两手都想抓的魔障里。如果必须割舍，松开那个耗费你最多能量却不见光亮的、沉重的执念，全新生命力即刻降临。',
      luckyColor: '松香色',
      luckyNumber: '11',
      hexagram: '损'
    },
    {
      id: 'd14',
      text: '这是一条极其孤独的路，你准备好了吗？',
      interpretation: '高处不胜寒。如果你要做不世出的伟业，哪怕是亲人知己也无法完全读懂你。准备好在这段寒风中独行，星斗自会垂向你。',
      luckyColor: '夜空蓝',
      luckyNumber: '99',
      hexagram: '剥'
    },
    {
      id: 'd15',
      text: '大象无形，命运的笔迹往往藏在巧合中。',
      interpretation: '有些看似无关的碎片、不经意的偶遇，拼起来恰好就是你未来的通天坦途。留意最近三周内所有不同寻常的偶然细节。',
      luckyColor: '翠缕青',
      luckyNumber: '1',
      hexagram: '巽'
    },
    {
      id: 'd16',
      text: '莫向外求，答案早已写在你的来路。',
      interpretation: '你之前所有的阅历、遇到的人、吃过的亏，实际上已经给你备齐了破解眼前终极困局的钥匙。静下来回想，福祸早已自招自解。',
      luckyColor: '沉香木',
      luckyNumber: '7',
      hexagram: '复'
    },
    {
      id: 'd17',
      text: '大难不死，有大福临。你的吉星已在苏醒。',
      interpretation: '最困难、最黑暗、甚至让你产生沮丧情绪的时刻已经逐渐归零。你命中暗淡的流年正悄然退去，一轮崭新的大吉向你靠拢。',
      luckyColor: '霞光绯',
      luckyNumber: '16',
      hexagram: '晋'
    },
    {
      id: 'd18',
      text: '看似是不幸的开端，结局却惊艳了世人。',
      interpretation: '命运喜欢用粗糙的麻袋包装最绝美的珍宝。当下的狼狈和失去，只是为了腾空你的背包，去捡拾接下来更闪耀的名器。',
      luckyColor: '绛红色',
      luckyNumber: '4',
      hexagram: '困'
    },
    {
      id: 'd19',
      text: '你所坚守的固执，其实是一扇早已锁死的空门。',
      interpretation: '不要试图劝说一个不爱你的人，或者挽救一个夕阳的局势。把绳索扔掉，当你愿意转过身去，背后的汪洋大海上正好有客船鸣笛。',
      luckyColor: '月浅灰',
      luckyNumber: '80',
      hexagram: '否'
    },
    {
      id: 'd20',
      text: '去靠近那些气场干净、温润强大的人。',
      interpretation: '命运不仅是因果，更是共体。与带有积极高能频段的人同行，你自身的纠葛也会在瞬间被共振瓦解。换一个温和的环境休养生息。',
      luckyColor: '翠玉绿',
      luckyNumber: '28',
      hexagram: '渐'
    },
    {
      id: 'd21',
      text: '大树之所以挺拔，是因为它默默忍受了狂风的撕扯。',
      interpretation: '每一次命运把你的生活搅得天翻地覆，都是为了抖落你身上不合时宜的藤蔓，让你站得更高，触及更真实的天宇。',
      luckyColor: '岩灰色',
      luckyNumber: '11',
      hexagram: '大过'
    },
    {
      id: 'd22',
      text: '宿命在这里踩了刹车，不是为了绊倒你，而是让你等等灵魂。',
      interpretation: '急功近利地冲向悬崖，是最容易失控的。当下的停滞，让你有机会静思反省，看清生命的来路与去向。',
      luckyColor: '杏黄光',
      luckyNumber: '4',
      hexagram: '蒙'
    },
    {
      id: 'd23',
      text: '去靠近那些回归自然的人，土地的力量会治愈你。',
      interpretation: '你的命盘当前太焦躁火热，急需厚德载物的泥土与苍翠的绿意来平喘。休假一天，踩踩松软的树叶，答案都在风中。',
      luckyColor: '若草色',
      luckyNumber: '8',
      hexagram: '坤'
    },
    {
      id: 'd24',
      text: '尘封的旧信已经不需要回应，让往事留在落日后。',
      interpretation: '揪着已经散场的怨恨不放手，实际上就是在拿别人的错误反复惩罚自己。原谅曾经的失算，放自己回温暖的现实。',
      luckyColor: '黛青色',
      luckyNumber: '25',
      hexagram: '剥'
    },
    {
      id: 'd25',
      text: '命中注定你有此一炼，但也注定大放异彩。',
      interpretation: '不需要对当下的狼狈感到羞耻。这是凤凰涅槃必须承受的温高烈火。走过去，你身上的浮华会退去，只留下最坚固的金石之骨。',
      luckyColor: '烈火红',
      luckyNumber: '9',
      hexagram: '乾'
    },
    {
      id: 'd26',
      text: '别总是在别人的命局里扮演悲壮的配角。',
      interpretation: '收回你过度泛滥的责任心，每个人都有自己的宿命剧本。先演好自己的绝对主角，才是对世俗宇宙最好的交待。',
      luckyColor: '晚香玉',
      luckyNumber: '12',
      hexagram: '颐'
    },
    {
      id: 'd27',
      text: '相信巧合，巧合通常是神明无遮的呼唤。',
      interpretation: '留意最近每一个不经意的重逢、偶然的对视、失误，那不是错误，而是命运为你画好的、通往另一个繁花岛屿的支线。',
      luckyColor: '粉白',
      luckyNumber: '3',
      hexagram: '渐'
    },
    {
      id: 'd28',
      text: '抛弃所有的理性计算，你的第六感在第一秒就已经明了。',
      interpretation: '如果再计算下去，理性只会把你绕进无限套利的思维怪圈。闭上眼，在那个直觉显现的零点零一秒，答案极度清晰。',
      luckyColor: '天青色',
      luckyNumber: '1',
      hexagram: '中孚'
    },
    {
      id: 'd29',
      text: '命中注定你有一场远行，换个城市你将重获新生。',
      interpretation: '当前这个老旧的磁场已经限制了你的气运。去寻找那个气候温润、包容性强的新疆域，你会瞬间破局、海阔天空。',
      luckyColor: '月魄白',
      luckyNumber: '77',
      hexagram: '旅'
    },
    {
      id: 'd30',
      text: '一时的失去，实际上是命运在为你腾挪拥抱未来的双手。',
      interpretation: '如果你一直抓着老旧脆弱的树枝哭泣，你如何有手去接下神明赐予你的更闪耀的金叶。松开，宇宙拥有更伟大的丰饶。',
      luckyColor: '琥珀橘',
      luckyNumber: '88',
      hexagram: '泰'
    },
    {
      id: 'd31',
      text: '守口如瓶，不要把你的宏图大志透露给身边的闲杂之人。',
      interpretation: '伟大的谋划需要宁静、不受杂念打扰的气场滋养。别人的冷嘲或好言建议会无形中折损你的决心，默默做成即可。',
      luckyColor: '深松青',
      luckyNumber: '0',
      hexagram: '小畜'
    },
    {
      id: 'd32',
      text: '你失去的那个角色，其实本来就不在你的宏大叙事里。',
      interpretation: '别再纠结那场没有拿到的邀约 or 没有走入圆满的旧梦。对于你未来要去的险峻风光，那点残破行李只是下坡的累赘。',
      luckyColor: '砚台黑',
      luckyNumber: '14',
      hexagram: '遁'
    },
    {
      id: 'd33',
      text: '放下吧，那些曾经伤害你的人，会有属于他们的因缘重力。',
      interpretation: '不需要你亲自去当那柄冷酷的审判之剑，那只会弄脏你的气运与气场。把一切交还给宇宙平衡，你只需迎向属于你的清香。',
      luckyColor: '春水绿',
      luckyNumber: '6',
      hexagram: '丰'
    },
    {
      id: 'd34',
      text: '你的吉星已然在命盘一角微微发亮。好吉接踵而至。',
      interpretation: '之前默默付出的每一缕善念、做的每一次撑伞之举，已经在无形中抵消了你的陈年运势漏洞。保持你内心的善与坦率。',
      luckyColor: '海棠红',
      luckyNumber: '21',
      hexagram: '晋'
    },
    {
      id: 'd35',
      text: '去河边 or 湖畔走走，流动的活水会洗去你心头的尘土。',
      interpretation: '你的心思已经被干燥的利益琐碎和职场喧闹蒙蔽了。去听听风声水响，看着溪流向前，你的灵性灵光会瞬间复苏。',
      luckyColor: '淡湖绿',
      luckyNumber: '7',
      hexagram: '随'
    },
    {
      id: 'd36',
      text: '现在的退却与蜷缩，只是为了下一阶段更恐怖的反弹。',
      interpretation: '拉弓拉到最满、退到最深处时，外表看起来是完全静止的。积蓄力量，对准靶心，一旦放手你将撕裂漫天乌云。',
      luckyColor: '赭红色',
      luckyNumber: '15',
      hexagram: '震'
    },
    {
      id: 'd37',
      text: '接纳自己的不完美，裂缝恰是微光透进来的唯物入口。',
      interpretation: '世界上没有无瑕的完美。接纳自己的软弱和一时的退缩，因为不完美本身，就是你与这个繁华尘世共振的底色。',
      luckyColor: '月浅灰',
      luckyNumber: '2',
      hexagram: '咸'
    },
    {
      id: 'd38',
      text: '你的名姓正被写在即将到来的命运金书首页。无畏前突。',
      interpretation: '不要理会那些不屑的冷眼 or 酸涩的流言。只要你朝着心中的金光笃定前行，漫天群星自然会在终点站成列阵。',
      luckyColor: '古金色',
      luckyNumber: '99',
      hexagram: '乾'
    },
    {
      id: 'd39',
      text: '此关极难，但这正是你晋升大德之位、功德圆满的通关阶梯。',
      interpretation: '若每个关卡都轻而易举，胜利将毫无含金量。把这当作命运对你的一次终极加冕仪式，抬起头，跨过荆棘。',
      luckyColor: '朱砂红',
      luckyNumber: '45',
      hexagram: '夬'
    },
    {
      id: 'd40',
      text: '答案其实在你翻开的第一页。你第一天叩问时就已经明白了。',
      interpretation: '反复的摇摆与求证只是为了逃避当下的痛。那个最先浮现出的强烈选择，那条无畏一切的路，正是你的本心宿命。',
      luckyColor: '太极玄',
      luckyNumber: '13',
      hexagram: '中孚'
    }
  ]
};

export const INSPIRATIONAL_QUOTES = [
  "凡是过往，皆为序章。答案一直在你心里。",
  "如果命运是风，那你就是帆。风虽不可测，然而帆能御水。",
  "你今天的选择，都在书写明天那一页神秘的签诗。",
  "不要在迷茫中虚度。答案也许是一座山，必须要你亲自去攀登。"
];
