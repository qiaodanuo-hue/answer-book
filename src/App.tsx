/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  Briefcase,
  Compass,
  Volume2,
  VolumeX,
  History,
  Undo2,
  Fingerprint,
  Share2,
  Check,
  AlertCircle,
  HelpCircle,
  BookOpen,
  X,
  Download,
  Copy,
} from 'lucide-react';
import { ANSWERS, CATEGORIES, CategoryId, Answer } from './data';
import { synth } from './audio';
import ParticleBackground from './components/ParticleBackground';
import HistoryLog, { HistoryRecord } from './components/HistoryLog';
import html2canvas from 'html2canvas';

// Helper to map traditional Chinese color names of the Answer Book to beautiful CSS Hex colors
export function getLuckyColorHex(color: string): string {
  if (!color) return '#f59e0b'; // Dynamic fallback (amber-500)
  
  const trimmed = color.trim();
  
  // High-precision traditional Chinese color dictionary lookup
  const TRADITIONAL_COLORS_MAP: Record<string, string> = {
    '月魄白': '#F7F6F0',
    '琥珀金': '#D97706',
    '竹青色': '#4A7C59',
    '梦碧': '#7BC2B5',
    '绀宇蓝': '#1B2A4A',
    '杏黄光': '#F59E0B',
    '黛青色': '#2B3E42', // Deep aesthetic charcoal mountain-eyebrow blue-grey instead of vibrant green!
    '瓦灰色': '#707070',
    '朱砂红': '#B91C1C',
    '玄黑色': '#171717',
    '薄荷绿': '#34D399',
    '松绿石': '#0D9488',
    '姜黄色': '#D97706',
    '樱草淡黄': '#FDE047',
    '砚台黑': '#262626',
    '晴山青': '#6B8E85',
    '霜天白': '#F1F5F9',
    '栗梅色': '#854D0E',
    '瓷青色': '#84A98C',
    '玄海蓝': '#0F172A',
    '黛紫': '#4C1D95',
    '橘红': '#EA580C',
    '羽烟灰': '#A3A3A3',
    '铅灰': '#64748B',
    '赤金': '#B45309',
    '藕荷粉': '#DBA3A3',
    '桃花绯': '#F43F5E',
    '烟雨灰': '#737373',
    '茶褐色': '#78350F',
    '暖橙色': '#F97316',
    '极光灰': '#8E9AA6',
    '淡湖绿': '#2DD4BF',
    '郁金香黄': '#FBBF24',
    '绛紫红': '#701A24',
    '深黛蓝': '#1E293B',
    '丁香紫': '#C084FC',
    '海棠红': '#E11D48',
    '秋枫橘': '#C2410C',
    '月光蓝': '#60A5FA',
    '雪青': '#A78BFA',
    '藤萝紫': '#7C3AED',
    '嫣红': '#BE123C',
    '青金石': '#1E3A8A',
    '玄朱': '#451A03',
    '绯桃红': '#FDA4AF',
    '钛白金': '#CBD5E1',
    '军羽绿': '#3F6212',
    '胭脂红': '#991B1B',
    '古铜黄': '#A16207',
    '烈火红': '#EF4444',
    '乌金玄': '#1F2937',
    '翠羽青': '#0F766E',
    '深松青': '#064E3B',
    '秋枯黄': '#B45309',
    '白山雪': '#FAFAF9',
    '苍艾绿': '#606F5D',
    '黎色': '#78350F',
    '铬黄': '#FACC15',
    '沉香棕': '#854D0E',
    '薄麦黄': '#FEF08A',
    '鸦青': '#1E242B',
    '焦茶': '#451A03',
    '赭红': '#B45309',
    '明黄': '#F59E0B',
    '墨玉绿': '#022C22',
    '玄武墨': '#1C1917',
    '琉璃黄': '#D97706',
    '赫金红': '#991B1B',
    '幽邃深绿': '#064E3B',
    '竹炭黑': '#262626',
    '月落白': '#FAF9F6',
    '柿红': '#EA580C',
    '檀木棕': '#78350F',
    '松烟绿': '#115E59',
    '太极玉': '#FAF9F6',
    '玄天黑': '#0A0A0A',
    '水墨灰': '#78716C',
    '松香色': '#D97706',
    '夜空蓝': '#1E293B',
    '翠缕青': '#059669',
    '沉香木': '#5C4238',
    '霞光绯': '#F43F5E',
    '绛红色': '#B9121B',
    '月浅灰': '#E2E8F0',
    '翠玉绿': '#059669',
  };

  if (TRADITIONAL_COLORS_MAP[trimmed]) {
    return TRADITIONAL_COLORS_MAP[trimmed];
  }
  
  // Regex category based helper backup
  // 1. Blacks/Charcoals
  if (/黑|墨|玄|夜|乌|夜空|砚台|炭/.test(trimmed)) {
    return '#1c1917'; // stone-900
  }
  // 2. Whites/Silvers
  if (/白|雪|月魄|霜|天白|月落/.test(trimmed)) {
    return '#fafaf9'; // stone-50 with light border
  }
  // 3. Grays/Silvers/Mists
  if (/灰|铅|烟|雨|极光/.test(trimmed)) {
    return '#78716c'; // stone-500
  }
  // 4. Blues
  if (/蓝|宇|海|空|湖/.test(trimmed)) {
    if (/深|暗|黛/.test(trimmed)) return '#1e3a8a'; // deep blue
    return '#3b82f6'; // vibrant sky blue
  }
  // 5. Greens/Teals
  if (/绿|青|翠|竹|艾|碧|松|缕/.test(trimmed)) {
    if (/深|暗|墨/.test(trimmed)) return '#14532d'; // green-900 / forest green
    return '#10b981'; // emerald-500
  }
  // 6. Browns/Warm Earths
  if (/棕|茶|褐|木|檀|沉香|栗|焦|泥|赭|姜/.test(trimmed)) {
    return '#78350f'; // amber-900
  }
  // 7. Yellows/Golds
  if (/黄|金|琥珀|杏|明|玉|光|香|麦/.test(trimmed)) {
    if (/金|琥珀|亮/.test(trimmed)) return '#d97706'; // amber-600 gold
    return '#fbbf24'; // amber-400 yellow
  }
  // 8. Pinks
  if (/粉|绯|桃花|樱|海棠/.test(trimmed)) {
    return '#f43f5e'; // rose-500 pink
  }
  // 9. Reds
  if (/红|赤|霞|朱|绛|胭|赫|烈/.test(trimmed)) {
    return '#dc2626'; // red-600
  }
  // 10. Purples
  if (/紫|萝|黛|丁香|藤/.test(trimmed)) {
    return '#8b5cf6'; // violet-500
  }
  // 11. Oranges
  if (/橙|橘|柿|暖/.test(trimmed)) {
    return '#f97316'; // orange-500
  }

  // Consistent pleasant HSL fallback from color name string hash
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = trimmed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 70%, 55%)`;
}

export interface Attunement {
  id: string;
  title: string;
  english: string;
  intro: string;
  term1: { title: string; desc: string };
  term2: { title: string; desc: string };
}

export const ALL_ATTUNEMENTS: Attunement[] = [
  {
    id: 'cosmic-alignment',
    title: '大德归本位 · 宿命归天枢',
    english: 'COSMIC ALIGNMENT',
    intro: '此印是命运之书的守护宣告与祝福',
    term1: {
      title: '大德归本位',
      desc: '回归本心。喻示历经迷茫洗礼后，终将找回最初的善良、力量与坦荡本位。'
    },
    term2: {
      title: '宿命归天枢',
      desc: '极星指路。意指当下的际遇皆有因果，极星高照，困局终将云开雾散。'
    }
  },
  {
    id: 'transient-balance',
    title: '万物皆过往 · 明月照大江',
    english: 'TRANSIENT BALANCE',
    intro: '此印是顺应自然、泰然自若的智慧',
    term1: {
      title: '万物皆过往',
      desc: '坦然释怀。世间纷纷扰扰，皆为沿途风景，不为执念所困，心境自得宽广。'
    },
    term2: {
      title: '明月照大江',
      desc: '静水深流。任凭波涛汹涌，内心依然如明月江水，澄澈温润，不畏浮尘喧嚣。'
    }
  },
  {
    id: 'spiritual-mirror',
    title: '心如明镜台 · 菩提本无树',
    english: 'SPIRITUAL MIRROR',
    intro: '此印是澄明绝虑、直见本源的关照',
    term1: {
      title: '心如明镜台',
      desc: '反求诸己。时时拂拭内心的尘埃，不被外界虚妄的声音裹挟，保持极佳清醒。'
    },
    term2: {
      title: '菩提本无树',
      desc: '本无挂碍。本来无一物，何处惹尘埃。看轻当下执迷，回归最轻盈的自我。'
    }
  },
  {
    id: 'grand-mastery',
    title: '星汉回日月 · 乾坤入袖中',
    english: 'GRAND MASTERY',
    intro: '此印是乾坤在握、潜能觉醒的昭示',
    term1: {
      title: '星汉回日月',
      desc: '顺应星移。寓意事物发展的客观规律正在朝向对您有利的轨道偏转运行。'
    },
    term2: {
      title: '乾坤入袖中',
      desc: '胸怀格局。代表您内心深处拥有吞吐万物的智慧，只需静心统筹即可破局。'
    }
  },
  {
    id: 'resilient-ascent',
    title: '逆水行扁舟 · 独步万重浪',
    english: 'RESILIENT ASCENT',
    intro: '此印是磨砺锋芒、砥砺前行的守护',
    term1: {
      title: '逆水行扁舟',
      desc: '蓄力克难。哪怕当下的境遇略显逆风孤意，亦是在磨炼心智，积攒蓄能。'
    },
    term2: {
      title: '独步万重浪',
      desc: '披荆斩棘。预示您终将凭借顽强的意志，在风浪交加的历练中蜕变，立于浪头。'
    }
  },
  {
    id: 'zen-peace',
    title: '返景入深林 · 复照青苔上',
    english: 'ZEN PEACEFULNESS',
    intro: '此印是闹中取静、机缘复苏的微光',
    term1: {
      title: '返景入深林',
      desc: '避喧返真。退一步海阔天空，在安静中沉淀心智，避开无谓的纷争与消耗。'
    },
    term2: {
      title: '复照青苔上',
      desc: '生机重现。微弱却笃定的光暖重回生命死角，看似枯竭的心田正悄然复苏。'
    }
  },
  {
    id: 'love-eternal',
    title: '两情若长久 · 朝暮无挂碍',
    english: 'LOVE ETERNAL',
    intro: '此印是超越时空壁垒的契合与笃定',
    term1: {
      title: '两情若长久',
      desc: '心灵契合。灵魂深处的认可不因空间或时间的阻隔而有损，笃定而宁静。'
    },
    term2: {
      title: '朝暮无挂碍',
      desc: '自由舒适。不再执着于时刻的纠葛与博弈，给爱多一分坦然与辽阔空间。'
    }
  },
  {
    id: 'love-spring',
    title: '春水映桃花 · 柔情付东流',
    english: 'SPRING DEVOTION',
    intro: '此印是情感释怀、温柔相待的流转',
    term1: {
      title: '春水映桃花',
      desc: '万象复苏。红尘风月里，您的情感正跨越冰封，迎来全新的温柔春意。'
    },
    term2: {
      title: '柔情付东流',
      desc: '泰然随心。随缘而行，不为过往的遗憾和执念捆绑，让爱像溪流般自在。'
    }
  },
  {
    id: 'love-letgo',
    title: '相濡以沫处 · 江湖相忘时',
    english: 'COMPASSIONATE RELEASE',
    intro: '此印是红尘离合、洒脱豁达的智慧',
    term1: {
      title: '相濡以沫处',
      desc: '感恩际遇。感谢曾有过的温度与同行，每段关系都是塑造自我的不世镜鉴。'
    },
    term2: {
      title: '江湖相忘时',
      desc: '释怀前行。有时松手亦是成全，释怀既是给彼此最深切、最高雅的祝福。'
    }
  },
  {
    id: 'love-resonance',
    title: '同声自相应 · 同气自相求',
    english: 'SPIRITUAL RESONANCE',
    intro: '此印代表磁场相吸、灵犀相通的感应',
    term1: {
      title: '同声自相应',
      desc: '频率一致。您期待的声音正在获得回响，真挚的渴望终会等来温存的回音。'
    },
    term2: {
      title: '同气自相求',
      desc: '灵魂物语。频率相同的人会自动跨越繁密的人群相遇，不需刻意伪装或迎合。'
    }
  },
  {
    id: 'love-reunion',
    title: '月缺终有圆 · 浮云散清风',
    english: 'EXPECTED FULFILLMENT',
    intro: '此印是守得云开、情感复苏的祥兆',
    term1: {
      title: '月缺终有圆',
      desc: '循环有度。感情里的起伏与分别都是圆满前的历练，无须过分惶恐。'
    },
    term2: {
      title: '浮云散清风',
      desc: '误会消融。多一点体贴与释怀，横亘在两心之间的隔阂终将冰破雪消。'
    }
  },
  {
    id: 'career-gold',
    title: '千淘万漉随 · 吹尽狂沙金',
    english: 'GOLDEN PERSISTENCE',
    intro: '此印代表百炼成钢、才干尽显的锤炼',
    term1: {
      title: '千淘万漉随',
      desc: '承压笃行。在工作的重重阻力与琐碎事务中，您在默默夯实不可动摇的底盘。'
    },
    term2: {
      title: '吹尽狂沙金',
      desc: '真金耀眼。外界浮夸的杂音退去时，您积攒的实力自然会让您脱颖而出。'
    }
  },
  {
    id: 'career-soar',
    title: '扶摇九万里 · 乘风破重云',
    english: 'SOARING HEIGHTS',
    intro: '此印是潜能爆发、直上青云的飞跃',
    term1: {
      title: '扶摇九万里',
      desc: '长风得势。厚积薄发的势能已经拉满，当前的平台或机会非常利于您展示才干。'
    },
    term2: {
      title: '乘风破重云',
      desc: '一往无前。凭借极高的胆识去突破繁杂规则与阻碍，将乾坤踏实纳入袖中。'
    }
  },
  {
    id: 'career-jade',
    title: '石中藏美玉 · 璞面待刀工',
    english: 'HIDDEN TREASURE',
    intro: '此印是藏器于身、砥砺精进的修炼',
    term1: {
      title: '石中藏美玉',
      desc: '慧眼独具。当前的您具有极高的内在价值和潜能，只是表层的灰烟还未彻底拂去。'
    },
    term2: {
      title: '璞面待刀工',
      desc: '匠心沉淀。沉下心去经历严苛的项目磨练。雕琢完成后，光芒必将加倍暴涨。'
    }
  },
  {
    id: 'career-solitary',
    title: '独木成茂林 · 孤臣立狂澜',
    english: 'SOLITARY PILLAR',
    intro: '此印代表孤勇当担、砥柱中流的坚守',
    term1: {
      title: '独木成茂林',
      desc: '独当一面。即便无人支持或孤掌难鸣，您内心的气场也足以支撑起一整座大盘。'
    },
    term2: {
      title: '孤臣立狂澜',
      desc: '中流胜局。顶住眼前的困难与惊涛骇浪。只要您不言弃，您就是不可替代的屏障。'
    }
  },
  {
    id: 'career-safety',
    title: '急流勇退处 · 闲庭看花时',
    english: 'STRATEGIC RETREAT',
    intro: '此印是功成免咎、知所进退的通透',
    term1: {
      title: '急流勇退处',
      desc: '分甘自保。高光时刻需主动给他人留有光芒和余地，防微杜渐，避免风口浪头。'
    },
    term2: {
      title: '闲庭看花时',
      desc: '休养生息。在强运中守住本心，享受当下的成功，为下个阶段储备深沉静气。'
    }
  },
  {
    id: 'destiny-chess',
    title: '乾坤未定处 · 孤子落奇局',
    english: 'CHESS MASTER',
    intro: '此印是运筹帷幄、破茧重立的棋路',
    term1: {
      title: '乾坤未定处',
      desc: '变局无穷。未来依旧充满极高的可操作性，任何一小步改变都能让您绝处逢生。'
    },
    term2: {
      title: '孤子落奇局',
      desc: '奇兵破冰。用看似不符合常规的、极其直觉的妙手，打破原本复杂的宿命僵局。'
    }
  },
  {
    id: 'destiny-guide',
    title: '歧路逢知己 · 金石出深渊',
    english: 'GUIDING LIGHT',
    intro: '此印是黑夜指路、贵人托举的守护',
    term1: {
      title: '歧路逢知己',
      desc: '善缘在侧。在迷茫纠结的重大决定关头，会有智者或贵人在暗处为您指引。'
    },
    term2: {
      title: '金石出深渊',
      desc: '福德回响。先前种下的善意在此间结出福缘，命运的引力会拉扯您脱离泥沼。'
    }
  },
  {
    id: 'destiny-epiphany',
    title: '一念花开处 · 执手拨迷雾',
    english: 'DIVINE EPIPHANY',
    intro: '此印是直觉觉醒、尘埃落定的关照',
    term1: {
      title: '一念花开处',
      desc: '福至心灵。顺从灵性最先产生的那一缕颤栗，它比所有理性层面的权衡更真实。'
    },
    term2: {
      title: '执手拨迷雾',
      desc: '自见真相。拨开浮躁喧嚣的大量干扰信息，直视并接纳深层的最终选择吧。'
    }
  },
  {
    id: 'destiny-renewal',
    title: '风雷动地起 · 枯木再逢春',
    english: 'SACRED RENEWAL',
    intro: '此印是破旧立新、生机重现的转折',
    term1: {
      title: '风雷动地起',
      desc: '剧烈洗礼。当下的动荡是扫清旧累赘的清洗风暴，辞旧迎新阶段无须叹息。'
    },
    term2: {
      title: '枯木再逢春',
      desc: '枯木逢春。在看似已无退路和枯竭的心底深处，最顽强的生命绿芽正在悄然苏醒。'
    }
  },
  {
    id: 'destiny-freedom',
    title: '天玄地黄阔 · 孤鹜逐落霞',
    english: 'INFINITE FREEDOM',
    intro: '此印是超脱尘执、生命广袤的胸襟',
    term1: {
      title: '天玄地黄阔',
      desc: '乾坤浩淼。将当下的得失放进浩瀚的人生尺度中，它们不过是渺小微尘罢了。'
    },
    term2: {
      title: '孤鹜逐落霞',
      desc: '随性高飞。用更超越、自由的心态来看待命运起伏，任凭天地开阔、万念皆安。'
    }
  },
  {
    id: 'general-quiet',
    title: '万物生而静 · 虚中纳万象',
    english: 'QUIET RECEPTIVITY',
    intro: '此印是虚怀若谷、消解杂念的清修',
    term1: {
      title: '万物生而静',
      desc: '退热宁神。不要总让自己处于高度紧张与超负荷运转状态，安静能汇聚安详能量。'
    },
    term2: {
      title: '虚中纳万象',
      desc: '包容无碍。放宽容量去纳下世事的荒谬，脑中没有偏执，生命最能澄澈润泽。'
    }
  },
  {
    id: 'general-persistence',
    title: '水滴终穿石 · 日日作春耕',
    english: 'STEADY PROGRESS',
    intro: '此印是持之以恒、蓄力筑堤的庇护',
    term1: {
      title: '水滴终穿石',
      desc: '量变终极。不要气馁于当下的缓慢进展，水流最不起眼，却可轻易融穿最硬的山。'
    },
    term2: {
      title: '日日作春耕',
      desc: '静待时日。默默在自己认准的一席之地上浇水育肥，属于您的收获契机已然在途。'
    }
  },
  {
    id: 'general-solitude',
    title: '踏遍千山雪 · 孤身点晚灯',
    english: 'SOLITARY PILGRIMAGE',
    intro: '此印代表寂静独行、内心高悬的烛光',
    term1: {
      title: '踏遍千山雪',
      desc: '历炼筋骨。灵魂在高度安静的独处中得以极速进化，不与俗人争高下、道短长。'
    },
    term2: {
      title: '孤身点晚灯',
      desc: '自点心灯。您心房深处的高傲极星比任何外界的喧扰更明快，它正照亮着前路之幽。'
    }
  }
];

export const ATTUNEMENTS = ALL_ATTUNEMENTS;

export const ATTUNEMENTS_BY_CATEGORY: Record<CategoryId, Attunement[]> = {
  general: [
    ALL_ATTUNEMENTS[0], // cosmic-alignment
    ALL_ATTUNEMENTS[1], // transient-balance
    ALL_ATTUNEMENTS[2], // spiritual-mirror
    ALL_ATTUNEMENTS[5], // zen-peace
    ALL_ATTUNEMENTS[4], // resilient-ascent
    ALL_ATTUNEMENTS[21], // general-quiet
    ALL_ATTUNEMENTS[22], // general-persistence
    ALL_ATTUNEMENTS[23], // general-solitude
  ],
  love: [
    ALL_ATTUNEMENTS[0], // cosmic-alignment
    ALL_ATTUNEMENTS[1], // transient-balance
    ALL_ATTUNEMENTS[2], // spiritual-mirror
    ALL_ATTUNEMENTS[6], // love-eternal
    ALL_ATTUNEMENTS[7], // love-spring
    ALL_ATTUNEMENTS[8], // love-letgo
    ALL_ATTUNEMENTS[9], // love-resonance
    ALL_ATTUNEMENTS[10], // love-reunion
  ],
  career: [
    ALL_ATTUNEMENTS[3], // grand-mastery
    ALL_ATTUNEMENTS[4], // resilient-ascent
    ALL_ATTUNEMENTS[0], // cosmic-alignment
    ALL_ATTUNEMENTS[11], // career-gold
    ALL_ATTUNEMENTS[12], // career-soar
    ALL_ATTUNEMENTS[13], // career-jade
    ALL_ATTUNEMENTS[14], // career-solitary
    ALL_ATTUNEMENTS[15], // career-safety
  ],
  destiny: [
    ALL_ATTUNEMENTS[0], // cosmic-alignment
    ALL_ATTUNEMENTS[2], // spiritual-mirror
    ALL_ATTUNEMENTS[1], // transient-balance
    ALL_ATTUNEMENTS[16], // destiny-chess
    ALL_ATTUNEMENTS[17], // destiny-guide
    ALL_ATTUNEMENTS[18], // destiny-epiphany
    ALL_ATTUNEMENTS[19], // destiny-renewal
    ALL_ATTUNEMENTS[20], // destiny-freedom
  ]
};

export const CATEGORY_PSYCHOLOGY: Record<CategoryId, { summary: string; context: string }> = {
  love: {
    summary: "渴望情感依托与心灵共鸣，在执爱纠结与放手释怀间寻回内心自洽",
    context: "红尘问卜，大大关乎「执恋与释怀」之自省。当下您的心境印记，精准折射了对于人情羁绊、关系冷暖的强烈在乎或清醒解脱。此印指引您在爱意交织的关口，安放属于自我的那份宁静，照见内在的真相。"
  },
  career: {
    summary: "确立自我意志，在社会价值追求、外界强大承压与长期蛰伏磨砺中谋求突破",
    context: "功名问卜，大抵关乎「自我意志与外在承压」之博弈。当下您的心境印记，映射着您在工作、学业或事业航道上面临的重重考验亦或进取之姿。以此印提醒您：在喧乱泥沙之下守住恒心，方能不磨灭本真锋芒。"
  },
  destiny: {
    summary: "身处人生变革的风暴或抉择渡口，直感与灵性指引已被悄然唤醒",
    context: "宿命问卜，大抵关乎「直觉觉醒与方向抉择」之较量。当下您的心境印记，捕获了您在人生新旧剧变、处于十字路口那一刻的强烈内在张力。未来的无常中，此处的意念皆在启示您：当勇敢破茧，或学着超脱俗尘。"
  },
  general: {
    summary: "渴望降噪去焦、平衡身心节奏，在复杂世事中重建沉稳专注的精神底牌",
    context: "修心问卜，大抵归于「洗尽杂念与本源自省」之清修。当下您的心境印记，倒映出了您身心有所疲竭、渴望清凉超脱的深层呼唤。这是一叶小舟，引导您在此刻梳理步调，重新凝聚起笃定与坚韧的气场。"
  }
};

export const ATTUNEMENT_MINDSET_MAP: Record<string, string> = {
  'cosmic-alignment': "历经重重尘雾与外界纷扰后，您正重新连接本真自我，寻回归本位坦荡与底气的心境",
  'transient-balance': "厌倦内耗执着，心境正极力将得失化为过眼云烟，并在大江大河般的辽阔中寻求平抚",
  'spiritual-mirror': "渴望屏绝红尘喧嚣杂音，拂拭去对错算计，进入一种自审、极度纯粹且澄澈的精神澄明",
  'grand-mastery': "内心的破局意识已然觉醒，不为一时纷争迷眼，正以极高明的心智整合当下琐屑的大格局",
  'resilient-ascent': "正经历心智重铸的沙场，虽面临逆潮挤压，内心却涌动着逆流而上的坚白之气与自立意志",
  'zen-peace': "身心极度疲惫而本能开启自我防御，迫切渴望屏蔽琐碎耗损、寻到一息清凉的新生温存",
  
  // 情感 (Love)
  'love-eternal': "在俗尘纷繁中对一份真挚的爱意怀抱至深信念，渴望实现超越朝暮与时空阻隔的灵魂共鸣",
  'love-spring': "情感在沉寂冰封中重逢冰雪消融的暖阳，沉寂心弦正试探着重新泛起润泽的温柔波澜",
  'love-letgo': "对过往印记心存感恩，已做好体面放手与告别纠葛的心理准备，带着清醒的释然奔向新生",
  'love-resonance': "内心渴望真诚、赤裸无饰的表达，正在发出宁缺毋滥的振频，召唤与自己天然相契的灵魂",
  'love-reunion': "阅尽情缘曲折而更知圆满不易，内心已拂去重重执拗误解，正以最温润的和解期盼彼心重温",
  
  // 功名 (Career)
  'career-gold': "在高压琐碎的学业或事业大局中，咬紧牙关稳住核心基本盘，相信真金必能在乱局中淘沙而出",
  'career-soar': "破圈势能已积蓄至极点，不肯再屈就无望的教条，迫切渴望一展主见、实现跨越飞跃的大斗志",
  'career-jade': "处于蜕变前夕，对自身的长线价值怀有笃定直感，正积极渴望在一场高强度的历练中玉成锋芒",
  'career-solitary': "无惧四周支撑匮乏或冷漠被动，在孤立之境里，依靠心底的高傲与强大自立拉起坚定的风月",
  'career-safety': "深谙明哲保身、藏锋于钝的博弈智慧，能主动让渡眼前高光，把核心力量收纳回安详的日常里",

  // 宿命 (Destiny)
  'destiny-chess': "面对未来混沌的命运之锁，不甘听任摆布，随时准备用敏锐心流出其不意地走出一招活路",
  'destiny-guide': "身处方向性动荡或心神不安的十字路口，心生预兆，正在呼唤并准备顺应冥冥中的贵人指引",
  'destiny-epiphany': "不再随从繁复、令人焦虑的利弊得失算计，正决定重返本能直觉、以极大魄力一锤定音",
  'destiny-renewal': "处于破旧立新、洗髓换骨的痛感交接期，心神有强力自我更新机制，已在枯萎处孕育绿芽",
  'destiny-freedom': "以宏大的天地、时空尺度来消解局部的蝇营狗苟，体验着自我超越、随处自在的旷达悠游",

  // 修心 (General)
  'general-quiet': "身心负重前行后渴望重返最初安详，极力平息情绪波澜，试图在和光同尘中治愈一切焦灼",
  'general-persistence': "在看似温吞或停滞局势下持守定力，不贪功近利，正以脚踏实地的高纯度专注重拾沉稳步调",
  'general-solitude': "享受彻底静止的孤悬，主动与外界喧杂作切割，在高度独立的独处之野凝聚绝对清醒的力量"
};

export const getSeekerFriendlyDesc = (id: string, index: number, originalDesc: string): string => {
  const customMap: Record<string, [string, string]> = {
    'cosmic-alignment': [
      "您心灵深处有种返璞归真的力量，表明历经重重疑虑后，您正重新找回属于自己最本真、最坦荡的原动力与底气。",
      "当下即便境遇仍有变动，但您内心深处已被本命之极星照亮，那些无形的因果脉络正顺应天枢，逐步消融眼前的重重困局。"
    ],
    'transient-balance': [
      "您开始厌倦无休止的内耗执念，心灵正极力学着将过往得失化为过眼云烟，渴望放过自己，寻回难得的释怀与宽广。",
      "不管外界的环境如何风起云涌，您当下都在寻求或已经找到了一片如同大江般宽广宁静的心理安全岛，能够平静包容一切。"
    ],
    'spiritual-mirror': [
      "您渴望将浮尘杂音、纷繁对错全部拂拭干净，重回一种高纯度的直觉状态，时时反求诸己，不随任何虚无的声音起舞。",
      "代表您正处于放下一切挂碍、彻底接纳自己不完美的重要关口。本来无一物，那些极度困扰您的执着此刻正在被您消解。"
    ],
    'grand-mastery': [
      "您内心的破局意识正在悄然苏醒，感受到身边的客观势能与事物发展的规律，正在往最为适合您的正面方向发生着偏转。",
      "当下您拥有吞吐局部的心理广阔性。这不是一时的意气，而是您深层次的智慧在支持着您，能举重若轻地统筹一切纷争。"
    ],
    'resilient-ascent': [
      "您正处在一场心智重铸的磨砺中。虽然面临逆风，但您内心充满了逆流而上的坚白之气，每一步艰难跋涉都是在积聚反转之势。",
      "表明您有着一种独自对抗巨大不确定性的傲骨。那种敢在风浪里蜕变、独占风头、立克艰难的坚韧意志已在此次祈愿中显现。"
    ],
    'zen-peace': [
      "您渴望在当下最紧绷的生活噪音中按下一个暂停键，从那些纠葛且毫无滋养的琐碎耗损中抽离出来，以此深呼吸重建秩序。",
      "预示着您心底某个枯竭干枯、长期得不到滋润的角落，正重新照射进温存坚实的新生微光，内在的生机已经开始悄然复苏。"
    ],
    'love-eternal': [
      "表明您对于一段真挚的关系具有无比深厚的笃定信念，渴望两颗心灵实现超越世俗限制的灵魂共振，平静而充实。",
      "您当下渴望一种自由自洽的舒适距离。不再纠缠于朝夕的患得患失和感情中的权衡博弈，以极大胸襟给予爱最松弛的态度。"
    ],
    'love-spring': [
      "表明您在感情的荒野或迷阵中正迎来冰雪初融、万物萌生的温柔契机，压抑压伏多时的敏感真情开始重新温润焕生。",
      "您正尝试着与过往一切旧伤、旧情结与求而不得的人事物達成和解，像溪水奔向平野一样，带着爱而自由的心奔涌前行。"
    ],
    'love-letgo': [
      "表明您心存感恩，愿意承认那份交往或曾经的交叠在您生命里刻下的美好印记，以此作为您继续向前的重要养分与心理基石。",
      "您已经做好了洒脱抽身的心理准备。明白有时候放过对方、给对方自由亦是给自己的救赎。您正带着最体面的清醒告别困惑。"
    ],
    'love-resonance': [
      "您心中那份真挚的表达与强烈的需要，正经历着前所未有的频率共振。您的磁场正在呼唤着并终能等来那个真诚相合的共鸣。",
      "表明您不再愿意在情感中伪装、迎合或委曲求全。您极度渴望找到完全原生态、自然流动且不需要刻意解释的灵魂相契者。"
    ],
    'love-reunion': [
      "您深知世事无常、感情中的缺憾都是修行的一环。您当下正满怀希冀，对经历了一番曲折磨难之后的圆满带有强大的信念感。",
      "您正试图用理性而温润的清风拂散那些横亘在两颗心之间的重重误会和偏见。起念之际，您内心的温柔已经战胜了执拗娇蛮。"
    ],
    'career-gold': [
      "表明您在极其繁冗、高压的工作与学业琐碎之下，依然坚持不懈地稳住自我的核心基本盘，正在经历一场去浮华的磨炼过程。",
      "您坚信付出的微小努力都不会白费。这股深沉的耐力表明，当大浪淘沙、泡沫吹散之时，您不可替代的真金才干必然惊艳四方。"
    ],
    'career-soar': [
      "表明您长久蛰伏的破圈势能已经蓄势待发。面对极佳的机会，您渴望大张旗鼓地展示主见，实现生命和事业地位上的飞跃变迁。",
      "您对困难和繁杂的教条规则拥有一种破局一战的昂扬斗志。坚决不再受无谓束缚，誓要执掌自我职业与学业大盘的绝对主权。"
    ],
    'career-jade': [
      "您能清醒且谦逊地预感到自己正孕育着极为庞大的成器潜能，只是表层粗石尚未雕刻。您对自我的长远价值有着极其敏锐的认知。",
      "表明您非常渴望通过一场深刻、高强度的真刀真枪历练来促成自我的跨越式转型，在千锤百炼后让自身的能量得到爆发式升华。"
    ],
    'career-solitary': [
      "哪怕四周缺乏有力的支持或陷入某种孤立无援的僵局，您内心的自傲与自立依然能拉起一道不可撼动的生命支柱。",
      "您拥有顶住惊涛骇浪、力挽狂澜的精神底盘。这说明您在危机关头的冷静与不可替代性，是您此时叩问仕途最锋利的铠甲。"
    ],
    'career-safety': [
      "当下的您具有高明的心灵克制与政治成熟。在繁华或高光之下，您能克制欲望、主动让渡锋芒，追求自保与明哲的通透局境。",
      "表明您渴望把宝贵的注意力收回到自己真实的日常和家庭中，通过在巅峰时刻守住平和静气，来为下一次复出提供长线势能。"
    ],
    'destiny-chess': [
      "在未来的命运局境面前，您认为人生的大局仍有无限可能。即便棋至绝路，每一小步理智勇敢的微调依然能让您绝地逢生。",
      "表明您对当下混沌棘手的抉择难题，做好了不按常理出牌、遵循强大灵性直觉一招制胜的魄力。这正是您打破僵局的关键契机。"
    ],
    'destiny-guide': [
      "在面对重大十字路口的迷茫时刻，您能敏锐察觉到某种来自本能的觉醒指引。有一双不期而遇的明灯之手正在您的前路上接应。",
      "您长久以来在人世间种下的善意正在此时发挥巨大的因果拉引力。冥冥中的贵人星照，正托举您摆脱长久缠绕的无形精神之痛。"
    ],
    'destiny-epiphany': [
      "您当下极其顺从灵性在最初所发生的那一缕微颤。您意识到相比于一万种思前想后的利弊算计，纯粹的心流直觉才算得上真言。",
      "您在叩心祈愿中做好了大刀阔斧拨乱反正的准备。排除掉干扰您心智的所有琐碎意见，让内心深处早已确立的真相全然彰显。"
    ],
    'destiny-renewal': [
      "您正面临着辞旧迎新、新旧剧烈交接的心境洗礼。您明白那些原本不属于您的负担，正在被一场看似无情的变局清扫殆尽。",
      "您对命运拥有一种不可摧毁的自我更新与修复力。在看似枯萎到极点的局面下，深层潜意识里最生机蓬勃的绿芽已悄然出土。"
    ],
    'destiny-freedom': [
      "您懂得用极富灵性的宏大天地尺度来看待当下的琐碎烦忧。将纠葛一时的爱恨名利放诸无限时空，让它们瞬间释去压力。",
      "代表您正处于极具超脱性与开阔性的心灵状态，如落霞之旁的孤鹜般任意遨游不为锁闭所困，体会到自我内心和天地共鸣的辽远。"
    ],
    'general-quiet': [
      "您对自己长期的心理超载感到了明确的疲倦，渴望通过全然退热的温存，将自己的心率和思维拉回到一个极其安详健康的基点。",
      "代表您对复杂的矛盾有了一种宏大、无有执偏的容纳度。不去做任何刻意的辩解，以一种厚重的水火不侵的包容感治愈自己。"
    ],
    'general-persistence': [
      "您当前虽然觉得前路有些温吞甚至停滞，但内心的信念却正以一种极其沉稳的方式进行筑堤积蓄，您比任何人都知道专注的可贵。",
      "代表您重获脚踏土地、春种秋收的笃定心理节奏。您当下最想做的是专注做好手头最确定的小事，静候因缘果实的不期而遇。"
    ],
    'general-solitude': [
      "您享受或极度渴望一种完全静止、与外界喧杂主动隔离的高纯度独处。在这份崇高的雪原里，您内心的敏锐觉知正在经历蜕变升华。",
      "您正在自己的心室深处燃起一盏代表对自我绝对自信、永不屈服的晚灯。这道高悬的内心烛火将比任何言语抚慰都更具指引力量。"
    ]
  };

  return customMap[id]?.[index] || originalDesc;
};

export default function App() {
  // --- States ---
  const [category, setCategory] = useState<CategoryId>('love');
  const [question, setQuestion] = useState('');
  const [appState, setAppState] = useState<'cover' | 'attuning' | 'flip' | 'reveal'>('cover');
  const [attuningProgress, setAttuningProgress] = useState(0);
  const [chosenAnswer, setChosenAnswer] = useState<Answer | null>(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [showValidationError, setShowValidationError] = useState<string | null>(null);
  
  // History Records
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isViewingPastRecord, setIsViewingPastRecord] = useState(false);
  
  // Audio stop handling
  const stopPadRef = useRef<(() => void) | null>(null);
  
  // Touching sensory locations
  const [touchCoords, setTouchCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchAreaRef = useRef<HTMLDivElement | null>(null);

  // Copy success indicator
  const [copied, setCopied] = useState(false);

  // --- Share Modal & Generation States ---
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showAttunementModal, setShowAttunementModal] = useState(false);
  const [activeAttunement, setActiveAttunement] = useState<Attunement>(ATTUNEMENTS[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States for generating card image for native long-press saving
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  // Auto-generate high-res card image when user gets a revelation
  useEffect(() => {
    if (appState === 'reveal' && chosenAnswer) {
      setGeneratedImg(null);
      
      // Wait for the text animation to fully complete (approx 20 chars * 0.08 = 1.6s)
      const delayMs = Math.max(1200, Math.min(2200, chosenAnswer.text.length * 80 + 200));
      const timer = setTimeout(() => {
        const element = document.getElementById('destiny-book-card');
        if (element) {
          setIsGeneratingImg(true);
          html2canvas(element, {
            useCORS: true,
            scale: 2, // 2x high-resolution crispness for long-press saving
            backgroundColor: '#fbf8eb', // parchment background tone
            logging: false,
          }).then((canvas) => {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            setGeneratedImg(dataUrl);
            setIsGeneratingImg(false);
          }).catch((err) => {
            console.error('Html2canvas error:', err);
            setIsGeneratingImg(false);
          });
        }
      }, delayMs);

      return () => clearTimeout(timer);
    } else {
      setGeneratedImg(null);
    }
  }, [appState, chosenAnswer]);

  // --- Daily Divination Limits & Sharing Bonus ---
  const [usedToday, setUsedToday] = useState(0);
  const [bonusReadings, setBonusReadings] = useState(0);

  const BASELINE_LIMIT = 3;
  const attemptsLeft = Math.max(0, BASELINE_LIMIT + bonusReadings - usedToday);

  // Grant sharing bonus (up to 2 times per day)
  const grantShareBonus = () => {
    if (bonusReadings >= 2) {
      showToast('✨ 今日增福已达上限：每日分享增加祈愿上限为两次，感谢您的虔诚分享！');
      return;
    }
    const nextBonus = bonusReadings + 1;
    setBonusReadings(nextBonus);
    localStorage.setItem('answers_book_daily_bonus', nextBonus.toString());
    showToast(`✨ 随缘增福：善因结得善果，感念合十，已为您额外增添一次问卜机缘。(今日第 ${nextBonus}/2 次分享赠礼)`);
  };

  // Load history & daily limits from localStorage on mount
  useEffect(() => {
    const cached = localStorage.getItem('answers_book_records');
    if (cached) {
      try {
        setHistoryRecords(JSON.parse(cached));
      } catch (e) {
        console.error('Failed to parse history records', e);
      }
    }

    // Force clear/reset to 0 used today for current design iteration session
    const resetDone = localStorage.getItem('answers_book_reset_to_3_v4');
    if (!resetDone) {
      localStorage.setItem('answers_book_daily_used', '0');
      localStorage.setItem('answers_book_daily_bonus', '0');
      localStorage.setItem('answers_book_reset_to_3_v4', 'true');
    }

    // Daily limit initialization configuration
    const today = new Date().toLocaleDateString('zh-CN');
    const savedDate = localStorage.getItem('answers_book_daily_date');
    if (savedDate === today && resetDone) {
      const u = localStorage.getItem('answers_book_daily_used');
      const b = localStorage.getItem('answers_book_daily_bonus');
      setUsedToday(u ? parseInt(u, 10) : 0);
      setBonusReadings(b ? parseInt(b, 10) : 0);
    } else {
      localStorage.setItem('answers_book_daily_date', today);
      localStorage.setItem('answers_book_daily_used', '0');
      localStorage.setItem('answers_book_daily_bonus', '0');
      setUsedToday(0);
      setBonusReadings(0);
    }
  }, []);

  // Sync history to localStorage
  const saveRecords = (newRecords: HistoryRecord[]) => {
    setHistoryRecords(newRecords);
    localStorage.setItem('answers_book_records', JSON.stringify(newRecords));
  };

  // Touch and Hold Attuning Cycle
  const attuneTimerRef = useRef<number | null>(null);
  
  const handleAttuneStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (appState !== 'cover') return;

    if (attemptsLeft <= 0) {
      if (bonusReadings < 2) {
        setShowValidationError('🔮 今日天机已竭。\n点击「命理谱」分享记录，可额外获赠福缘。');
      } else {
        setShowValidationError('🔮 今日问卜已达上限，天机暂避。收藏本页链接，明天准时续缘~');
      }
      setTimeout(() => setShowValidationError(null), 8000);
      return;
    }
    
    setShowValidationError(null);
    setAppState('attuning');
    setAttuningProgress(0);

    // Get position to draw particles
    if (touchAreaRef.current) {
      const rect = touchAreaRef.current.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;
      
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      setTouchCoords({
        x: clientX,
        y: clientY,
      });
    }

    // Play synthesized warm swelling drone
    if (!isMuted) {
      synth.playChime();
      stopPadRef.current = synth.startSwellingPad();
    }

    const startTime = Date.now();
    const duration = 2300; // 2.3 seconds to fully unlock

    attuneTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setAttuningProgress(pct);

      if (pct >= 100) {
        handleAttuneComplete();
      }
    }, 30);
  };

  const handleAttuneEnd = () => {
    if (appState !== 'attuning') return;

    // Clear timing interval
    if (attuneTimerRef.current) {
      clearInterval(attuneTimerRef.current);
      attuneTimerRef.current = null;
    }

    // Stop swelling audio drone
    if (stopPadRef.current) {
      stopPadRef.current();
      stopPadRef.current = null;
    }

    if (attuningProgress < 100) {
      // Failed to attune long enough
      setAppState('cover');
      setAttuningProgress(0);
      setShowValidationError('「念力不足，法阵散逸」\n请持续按压，虔诚静心冥想。');
      setTimeout(() => setShowValidationError(null), 4000);
    }
  };

  const handleAttuneComplete = () => {
    if (attuneTimerRef.current) {
      clearInterval(attuneTimerRef.current);
      attuneTimerRef.current = null;
    }

    if (stopPadRef.current) {
      stopPadRef.current();
      stopPadRef.current = null;
    }

    // Pick a random answer in selected category
    const pool = ANSWERS[category];
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedAnswer = pool[randomIndex];
    setChosenAnswer(selectedAnswer);

    // Pick a random Attunement Seal status corresponding to selected category
    const attunementPool = ATTUNEMENTS_BY_CATEGORY[category] || ATTUNEMENTS_BY_CATEGORY['general'];
    const randomAttunement = attunementPool[Math.floor(Math.random() * attunementPool.length)];
    setActiveAttunement(randomAttunement);

    // Increment used count for new divination
    const nextUsed = usedToday + 1;
    setUsedToday(nextUsed);
    localStorage.setItem('answers_book_daily_used', nextUsed.toString());

    // Log this reading into local records
    const newRecord: HistoryRecord = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      question: question.trim(),
      categoryName: CATEGORIES.find(c => c.id === category)?.name || '万象',
      categoryIcon: CATEGORIES.find(c => c.id === category)?.icon || 'Sparkles',
      answerText: selectedAnswer.text,
      interpretation: selectedAnswer.interpretation,
      luckyColor: selectedAnswer.luckyColor,
      luckyNumber: selectedAnswer.luckyNumber,
      hexagram: selectedAnswer.hexagram,
      attunementId: randomAttunement.id,
    };

    saveRecords([newRecord, ...historyRecords]);

    // Page flip simulation time
    setTimeout(() => {
      setAppState('reveal');
      if (!isMuted) {
        synth.playReveal();
      }
    }, 1200);
  };

  // Reset Book back to question mode
  const handleReset = () => {
    setAppState('cover');
    setQuestion('');
    setChosenAnswer(null);
    setAttuningProgress(0);
    setShowValidationError(null);
    setIsViewingPastRecord(false);
  };

  // Display previous records inside the book
  const handleViewRecord = (rec: HistoryRecord) => {
    setCategory(CATEGORIES.find(c => c.name === rec.categoryName)?.id || 'general');
    setQuestion(rec.question);
    
    const virtualAnswer: Answer = {
      id: rec.id,
      text: rec.answerText,
      interpretation: rec.interpretation,
      luckyColor: rec.luckyColor,
      luckyNumber: rec.luckyNumber,
      hexagram: rec.hexagram,
    };
    
    // Find the saved attunement or fall back to the default one if not found
    const savedAttunement = ATTUNEMENTS.find(att => att.id === rec.attunementId) || ATTUNEMENTS[0];
    setActiveAttunement(savedAttunement);
    
    setChosenAnswer(virtualAnswer);
    setIsViewingPastRecord(true);
    setAppState('reveal');
    setIsHistoryOpen(false);

    if (!isMuted) {
      synth.playChime();
    }
  };

  // Delete previous readings
  const handleDeleteRecord = (id: string) => {
    const updated = historyRecords.filter(r => r.id !== id);
    saveRecords(updated);
  };

  // Clear all history list
  const handleClearHistory = () => {
    if (confirm('确定要洗牌星盘，清空所有宿命占问记录吗？此操作不可逆。')) {
      saveRecords([]);
    }
  };

  // Copy current details
  const handleCopyCurrent = () => {
    if (!chosenAnswer) return;
    const shareText = `【答案之书】\n🔮 占问之事：${question || '精诚所至，默默叩问'}\n📖 宿命解答：${chosenAnswer.text}\n✨ 命运启示：${chosenAnswer.interpretation}\n🎨 幸运色：${chosenAnswer.luckyColor} | 🔢 幸运数：${chosenAnswer.luckyNumber}\n🌟 乾坤卦象：${chosenAnswer.hexagram || '无'}`;
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      showToast('🔮 精美命理签语已成功复制到剪贴板！');
      setTimeout(() => setCopied(false), 2000);
      grantShareBonus(); // Get bonus from copywriting share
    });
  };

  // Modern Toast Utility function
  const showToast = (message: string) => {
    setToastMessage(message);
    // Auto clear with generous reading window
    setTimeout(() => {
      setToastMessage(prev => prev === message ? null : prev);
    }, 4000);
  };

  // Open and render HTML to Canvas share screen
  const handleOpenShare = () => {
    if (!chosenAnswer) return;
    setIsShareModalOpen(true);
    setIsGenerating(true);
    setGeneratedImage(null);

    const categoryName = CATEGORIES.find(c => c.id === category)?.name || '万象';

    // Fast, robust local native Canvas drawing - 100% reliable in iframe/sandbox environments!
    setTimeout(() => {
      try {
        const drawAllContents = (ctx: CanvasRenderingContext2D, isRealRun: boolean, canvasHeight = 1120) => {
          // --- 1. Background (only on real run) ---
          if (isRealRun) {
            ctx.fillStyle = '#f6efe2'; // Warm parchment
            ctx.fillRect(0, 0, 800, canvasHeight);

            // Subtle gradient vignette feel
            const gradient = ctx.createRadialGradient(400, canvasHeight / 2, 100, 400, canvasHeight / 2, 650);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
            gradient.addColorStop(1, 'rgba(139, 90, 43, 0.08)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 800, canvasHeight);

            // Draw beautiful dotted backdrop grid matching result page
            ctx.fillStyle = 'rgba(120, 53, 15, 0.04)'; // faint gold dots
            const dotSpacing = 16;
            for (let x = 32; x < 768; x += dotSpacing) {
              for (let y = 32; y < canvasHeight - 32; y += dotSpacing) {
                ctx.fillRect(x, y, 1.5, 1.5);
              }
            }

            // Outer borders
            ctx.strokeStyle = 'rgba(139, 92, 26, 0.15)';
            ctx.lineWidth = 1;
            ctx.strokeRect(32, 32, 736, canvasHeight - 64);

            ctx.strokeStyle = 'rgba(139, 92, 26, 0.35)';
            ctx.lineWidth = 2;
            ctx.strokeRect(40, 40, 720, canvasHeight - 80);

            // Ancient Chinese elegant corner brackets
            const drawCornerBracket = (cx: number, cy: number, dx: number, dy: number) => {
              ctx.beginPath();
              ctx.moveTo(cx, cy + dy * 20);
              ctx.lineTo(cx, cy);
              ctx.lineTo(cx + dx * 20, cy);
              ctx.strokeStyle = '#b45309'; // amber-700
              ctx.lineWidth = 3;
              ctx.stroke();
            };
            drawCornerBracket(40, 40, 1, 1);
            drawCornerBracket(760, 40, -1, 1);
            drawCornerBracket(40, canvasHeight - 40, 1, -1);
            drawCornerBracket(760, canvasHeight - 40, -1, -1);
          }

          // Wrap text helper (returns next baseline Y coordinate)
          const drawWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number, limitLines = 6) => {
            const chars = text.split('');
            let currentLine = '';
            let lineY = y;
            let printedLinesCount = 0;

            for (let i = 0; i < chars.length; i++) {
              const testLine = currentLine + chars[i];
              const metrics = ctx.measureText(testLine);
              if (metrics.width > maxWidth) {
                if (isRealRun) {
                  ctx.fillText(currentLine, x, lineY);
                }
                currentLine = chars[i];
                lineY += lineHeight;
                printedLinesCount++;
                if (printedLinesCount >= limitLines - 1 && i < chars.length - 1) {
                  if (isRealRun) {
                    ctx.fillText(currentLine + '...', x, lineY);
                  }
                  return lineY + lineHeight;
                }
              } else {
                currentLine = testLine;
              }
            }
            if (isRealRun) {
              ctx.fillText(currentLine, x, lineY);
            }
            return lineY + lineHeight;
          };

          // Sparkle shape helper
          const drawSparkle = (cx: number, cy: number, r: number) => {
            if (!isRealRun) return;
            ctx.beginPath();
            ctx.moveTo(cx, cy - r);
            ctx.quadraticCurveTo(cx, cy, cx + r, cy);
            ctx.quadraticCurveTo(cx, cy, cx, cy + r);
            ctx.quadraticCurveTo(cx, cy, cx - r, cy);
            ctx.quadraticCurveTo(cx, cy, cx, cy - r);
            ctx.fillStyle = '#d97706'; // gold/amber
            ctx.fill();
          };

          // --- 2. Top Heading ornament block ---
          if (isRealRun) {
            ctx.textAlign = 'center';
            ctx.fillStyle = '#78350f'; // amber-900 / ancient copper ink
            ctx.font = 'bold 15px Georgia, serif';
            ctx.fillText('CELESTIAL REVELATION // 答案之书', 400, 75);

            // Gilded horizontal divider line
            ctx.strokeStyle = 'rgba(120, 53, 15, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(120, 100);
            ctx.lineTo(680, 100);
            ctx.stroke();

            // Diamond at center of default layout
            ctx.fillStyle = '#d97706'; // amber-gold
            ctx.beginPath();
            ctx.moveTo(400, 94);
            ctx.lineTo(406, 100);
            ctx.lineTo(400, 106);
            ctx.lineTo(394, 100);
            ctx.closePath();
            ctx.fill();
          }

          // --- 3. Section 1: QUERY LOG // 问心册 ---
          if (isRealRun) {
            ctx.textAlign = 'left';
            ctx.fillStyle = '#78350f';
            ctx.font = 'bold 14px Georgia, "PingFang SC", "Songti SC", serif';
            ctx.fillText('QUERY LOG // 问心册', 70, 140);

            ctx.textAlign = 'right';
            ctx.fillStyle = '#78716c';
            ctx.font = 'bold 13px monospace';
            ctx.fillText(`№ ${chosenAnswer.id.toUpperCase()}`, 730, 140);

            // Divider under section header
            ctx.strokeStyle = 'rgba(120, 53, 15, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(70, 156);
            ctx.lineTo(730, 156);
            ctx.stroke();
          }

          // Category & Question texts
          if (isRealRun) {
            ctx.textAlign = 'left';
            ctx.fillStyle = '#b45309'; // amber-700
            ctx.font = 'bold 12px "PingFang SC", "Songti SC", serif';
            ctx.fillText(`所求领域 · ${categoryName}`, 70, 192);
          }

          ctx.font = 'italic bold 21px Georgia, "PingFang SC", "Songti SC", serif';
          const questText = `「 ${question.trim() || '默默叩问，未曾诉之于口。'} 」`;
          ctx.textAlign = 'left';
          ctx.fillStyle = '#1c1917'; // stone-900
          
          const nextYAfterQuestion = drawWrappedText(questText, 70, 230, 660, 32, 2);

          if (isRealRun) {
            ctx.fillStyle = '#78716c';
            ctx.font = 'italic 12px "PingFang SC", "Songti SC", serif';
            ctx.fillText('诚心起意，字句虽短。天道微鸣，宿命感召。', 70, nextYAfterQuestion + 4);
          }

          let currentY = nextYAfterQuestion + 32;

          // --- 4. Unsealed Stamp Badge ---
          const badgeCenterY = currentY + 28;
          if (isRealRun) {
            ctx.strokeStyle = 'rgba(180, 83, 9, 0.25)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(104, badgeCenterY, 20, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(180, 83, 9, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(104, badgeCenterY, 16, 0, Math.PI * 2);
            ctx.stroke();

            drawSparkle(104, badgeCenterY, 7);

            ctx.textAlign = 'left';
            ctx.fillStyle = '#44403c';
            ctx.font = 'bold 12px "PingFang SC", "Songti SC", serif';
            ctx.fillText(activeAttunement.title, 136, badgeCenterY - 4);

            ctx.fillStyle = '#78716c';
            ctx.font = 'bold 9px monospace';
            ctx.fillText(activeAttunement.english, 136, badgeCenterY + 11);
          }

          currentY = badgeCenterY + 50;

          // --- 5. Main Dashed Divider ---
          if (isRealRun) {
            ctx.strokeStyle = 'rgba(120, 53, 15, 0.25)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(70, currentY);
            ctx.lineTo(730, currentY);
            ctx.stroke();
            ctx.setLineDash([]); // reset template state
          }

          currentY = currentY + 42;

          // --- 6. Section 2: CELESTIAL REVELATION // 宿命判词 ---
          if (isRealRun) {
            ctx.textAlign = 'left';
            ctx.fillStyle = '#78350f';
            ctx.font = 'bold 14px Georgia, "PingFang SC", "Songti SC", serif';
            ctx.fillText('CELESTIAL REVELATION // 宿命判词', 70, currentY);

            // Stamp/badge on the right side
            if (chosenAnswer.hexagram) {
              const stampText = `卦象 · ${chosenAnswer.hexagram}`;
              ctx.font = 'bold 11px "PingFang SC", "Songti SC", serif';
              ctx.textAlign = 'right';
              const textWidth = ctx.measureText(stampText).width;

              const stampX = 730;
              const stampY = currentY - 14;
              const stampW = textWidth + 16;
              const stampH = 22;

              ctx.fillStyle = 'rgba(251, 191, 36, 0.1)';
              ctx.fillRect(stampX - stampW, stampY, stampW, stampH);

              ctx.strokeStyle = 'rgba(180, 83, 9, 0.4)';
              ctx.lineWidth = 1;
              ctx.strokeRect(stampX - stampW, stampY, stampW, stampH);

              ctx.fillStyle = '#78350f';
              ctx.textAlign = 'center';
              ctx.fillText(stampText, stampX - stampW / 2, stampY + 15);
            }

            // Divider under section header
            ctx.strokeStyle = 'rgba(120, 53, 15, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(70, currentY + 16);
            ctx.lineTo(730, currentY + 16);
            ctx.stroke();
          }

          currentY = currentY + 48;

          // --- 7. Core Answer with Vertical Accent Bar ---
          const barX = 70;
          const answerTextX = 88;
          const answerY = currentY;

          ctx.font = 'bold 23px Georgia, "PingFang SC", "Songti SC", serif';
          ctx.textAlign = 'left';
          ctx.fillStyle = '#451a03'; // deep warm ink

          const nextYAfterAnswer = drawWrappedText(chosenAnswer.text, answerTextX, answerY, 630, 36, 3);

          if (isRealRun) {
            ctx.fillStyle = '#b45309'; // amber-700
            const barHeight = nextYAfterAnswer - answerY;
            ctx.fillRect(barX, answerY - 20, 4, barHeight + 4);
          }

          currentY = nextYAfterAnswer + 24;

          // --- 8. Commentary Section ---
          if (isRealRun) {
            ctx.textAlign = 'left';
            ctx.fillStyle = '#78350f';
            ctx.font = 'bold 14px "PingFang SC", "Songti SC", serif';
            ctx.fillText('【命之批注】', 70, currentY);
          }

          ctx.fillStyle = '#44403c'; // stone-700
          ctx.font = '15px "PingFang SC", "Songti SC", serif';
          const commentStartY = currentY + 24;
          const commentEndY = drawWrappedText(chosenAnswer.interpretation, 70, commentStartY, 660, 25, 6);

          currentY = commentEndY + 36;

          // --- 9. Bottom Guides Divider ---
          if (isRealRun) {
            ctx.strokeStyle = 'rgba(120, 53, 15, 0.12)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(70, currentY);
            ctx.lineTo(730, currentY);
            ctx.stroke();
          }

          const guideY = currentY + 26;

          if (isRealRun) {
            const colorHex = getLuckyColorHex(chosenAnswer.luckyColor);

            // Left Column (lucky color)
            ctx.textAlign = 'left';
            ctx.font = '11px "PingFang SC", "Songti SC", serif';
            ctx.fillStyle = '#78716c';
            ctx.fillText('助运之引 · 幸运色', 70, guideY);

            // Draw color swatch circle
            const circleX = 76;
            const swatchY = guideY + 20;
            ctx.beginPath();
            ctx.arc(circleX, swatchY, 6, 0, Math.PI * 2);
            ctx.fillStyle = colorHex;
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.font = 'bold 13px "PingFang SC", "Songti SC", serif';
            ctx.fillStyle = '#1c1917';
            ctx.fillText(chosenAnswer.luckyColor, circleX + 15, swatchY + 4);

            // Right Column (lucky number)
            const rightColumnX = 420;
            ctx.textAlign = 'left';
            ctx.font = '11px "PingFang SC", "Songti SC", serif';
            ctx.fillStyle = '#78716c';
            ctx.fillText('辟邪之引 · 契合数字', rightColumnX, guideY);

            ctx.font = 'bold 14px monospace';
            ctx.fillStyle = '#1c1917';
            ctx.fillText(chosenAnswer.luckyNumber, rightColumnX, guideY + 24);
          }

          currentY = guideY + 48;

          // --- 10. Bottom Seal / Signature ---
          if (isRealRun) {
            ctx.textAlign = 'center';
            ctx.font = 'italic 12px Georgia, "Songti SC", serif';
            ctx.fillStyle = '#a8a29e';
            ctx.fillText('— 大德归本位 · 宿命归天枢 —', 400, canvasHeight - 56);
          }

          return currentY;
        };

        // Step 1: Pre-run on a temporary canvas to measure the required dynamic height
        const draftCanvas = document.createElement('canvas');
        draftCanvas.width = 800;
        draftCanvas.height = 1500; // safe maximum
        const draftCtx = draftCanvas.getContext('2d');
        if (!draftCtx) throw new Error('Canvas 2D draft context unavailable');

        // Dry-run measuring
        const finalContentY = drawAllContents(draftCtx, false);

        // Step 2: Create real canvas with a snug height wrapping content perfectly!
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = Math.round(finalContentY + 90); // 90px padding at bottom
        
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D real context unavailable');

        // Draw everything beautifully on the exact layout height
        drawAllContents(ctx, true, canvas.height);

        // Save generated URL
        const dataUrl = canvas.toDataURL('image/png');
        setGeneratedImage(dataUrl);
        setIsGenerating(false);
      } catch (err) {
        console.error('Failed drawing canvas custom oracle sign', err);
        setIsGenerating(false);
        // Direct text copy fallback
        showToast('⚠️ 绘制天命画像遇到阻碍，系统已自动复制文本结果。');
        handleCopyCurrent();
        setIsShareModalOpen(false);
      }
    }, 450);
  };

  // Categorize helper icons
  const renderCategoryIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Heart': return <Heart className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'Compass': return <Compass className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 font-sans overflow-x-hidden select-none flex flex-col justify-between">
      {/* Dynamic Cosmic Starfield Canvas */}
      <ParticleBackground
        attuneActive={appState === 'attuning'}
        touchX={touchCoords.x}
        touchY={touchCoords.y}
        category={category}
      />

      {/* Floating starry orbs/nebula blobs for gorgeous high-contrast ambient depth */}
      <div 
        className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none animate-pulse-slow transition-all duration-700" 
        style={{
          backgroundColor: 
            category === 'general' ? 'rgba(99, 102, 241, 0.12)' :
            category === 'love' ? 'rgba(244, 63, 94, 0.12)' :
            category === 'career' ? 'rgba(16, 185, 129, 0.12)' :
            'rgba(255, 78, 0, 0.12)'
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none animate-pulse-slow [animation-delay:2s] transition-all duration-700" 
        style={{
          backgroundColor: 
            category === 'general' ? 'rgba(139, 92, 246, 0.05)' :
            category === 'love' ? 'rgba(251, 113, 133, 0.05)' :
            category === 'career' ? 'rgba(52, 211, 153, 0.05)' :
            'rgba(245, 158, 11, 0.05)'
        }}
      />

      {/* --- Top Global Bar --- */}
      <header className="relative w-full max-w-6xl mx-auto px-6 py-6 sm:px-12 sm:pt-12 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center relative bg-white/[0.02]">
            <div 
              className="w-2.5 h-2.5 rounded-full animate-pulse transition-all duration-500" 
              style={{
                backgroundColor: 
                  category === 'general' ? '#6366f1' :
                  category === 'love' ? '#f43f5e' :
                  category === 'career' ? '#34d399' :
                  '#ff4e00'
              }}
            />
          </div>
          <span className="text-[11px] font-sans uppercase tracking-[0.3em] font-semibold text-stone-200">The Book of Answers</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Sounds Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 sm:p-2.5 rounded-full bg-white/[0.02] hover:bg-white/[0.07] border border-white/10 text-stone-300 hover:text-white transition-all cursor-pointer pointer-events-auto"
            title={isMuted ? '开启妙音' : '闭合妙音'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center space-x-1.5 p-1.5 px-3 rounded-full bg-white/[0.02] hover:bg-white/[0.07] border border-white/10 text-stone-300 hover:text-white font-serif text-xs transition-all cursor-pointer pointer-events-auto"
          >
            <History className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-wider font-sans font-medium">命理谱</span>
            {historyRecords.length > 0 && (
              <span className="w-4 h-4 bg-[#ff4e00] text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                {historyRecords.length}
              </span>
            )}
          </button>

          <span className="hidden md:inline text-[11px] font-sans uppercase tracking-[0.3em] text-white/30 italic">
            Since MCMXCVIII
          </span>
        </div>
      </header>

      {/* --- App Core Workspace Container --- */}
      <main className="relative flex-1 flex items-center justify-center py-6 px-4 sm:px-8 z-10 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* STATE 1 & 2: Front Cover Setup & Energy Gathering */}
          {(appState === 'cover' || appState === 'attuning') && (
            <motion.div
              key="setup-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center max-w-2xl mx-auto text-center"
            >
              {/* Elegant minimalist header title */}
              <div className="mb-8">
                <h2 className="text-4xl sm:text-6xl font-serif font-light mb-4 tracking-tight text-white leading-tight">
                  默念你的<span 
                    className="italic font-normal transition-all duration-500"
                    style={{
                      color: 
                        category === 'general' ? '#6366f1' :
                        category === 'love' ? '#f43f5e' :
                        category === 'career' ? '#34d399' :
                        '#ff4e00'
                    }}
                  >困惑</span>
                </h2>
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/25 to-transparent mx-auto mb-4" />
                <p className="text-[12px] sm:text-xs leading-relaxed text-stone-400 max-w-md mx-auto font-sans tracking-wide">
                  闭上双眼，在心中反复思索你的占问。然后长按命运法阵注能启封。
                </p>
              </div>

              {/* Dynamic Attune Interface - Immersive Portal Touchpad */}
              <div className="relative mb-8 flex flex-col items-center">
                {/* Glowing category-specific nebula circle behind */}
                <div 
                  className="absolute inset-0 blur-[100px] rounded-full transition-all duration-700 pointer-events-none" 
                  style={{ 
                    backgroundColor: 
                      category === 'general' ? '#6366f1' :
                      category === 'love' ? '#f43f5e' :
                      category === 'career' ? '#34d399' :
                      '#ff4e00',
                    opacity: appState === 'attuning' ? 0.35 + (attuningProgress * 0.003) : 0.12 
                  }}
                />
 
                {/* Concentric glass-ring portal of destiny */}
                <div
                  ref={touchAreaRef}
                  onMouseDown={handleAttuneStart}
                  onMouseUp={handleAttuneEnd}
                  onMouseLeave={handleAttuneEnd}
                  onTouchStart={handleAttuneStart}
                  onTouchEnd={handleAttuneEnd}
                  className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden backdrop-blur-md bg-white/[0.02] cursor-pointer touch-none pointer-events-auto select-none transition-all duration-300 ${
                    appState === 'attuning' ? 'scale-105 border-amber-500/40' : 'hover:scale-102 hover:border-white/15'
                  }`}
                >
                  {/* Internal concentric gold-hint decorative lines */}
                  <div className="absolute w-[210px] h-[210px] sm:w-[230px] sm:h-[230px] rounded-full border border-white/5 flex items-center justify-center pointer-events-none">
                    <div className="absolute w-[170px] h-[170px] sm:w-[190px] sm:h-[190px] rounded-full border border-white/5 pointer-events-none" />
                  </div>
 
                  {/* Spinning radial svg progress ring */}
                  <svg className="absolute w-full h-full transform -rotate-90 pointer-events-none">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="42%"
                      className="stroke-white/5 fill-none"
                      strokeWidth="2.5"
                    />
                    <motion.circle
                      cx="50%"
                      cy="50%"
                      r="42%"
                      className="fill-none"
                      animate={{
                        stroke:
                          category === 'general' ? '#6366f1' :
                          category === 'love' ? '#f43f5e' :
                          category === 'career' ? '#34d399' :
                          '#ff4e00'
                      }}
                      transition={{ duration: 0.3 }}
                      strokeWidth="3.5"
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * attuningProgress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
 
                  {/* Center Fingerprint / attuning focal trigger */}
                  <div className="relative text-center z-10 flex flex-col items-center justify-center p-6">
                    <motion.div
                      animate={{
                        scale: appState === 'attuning' ? [1, 0.94, 1] : 1,
                      }}
                      transition={{
                        repeat: appState === 'attuning' ? Infinity : 0,
                        duration: 1.2,
                        ease: 'easeInOut',
                      }}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300"
                      style={
                        appState === 'attuning' 
                          ? {
                              backgroundColor: 
                                category === 'general' ? 'rgba(99, 102, 241, 0.25)' :
                                category === 'love' ? 'rgba(244, 63, 94, 0.25)' :
                                category === 'career' ? 'rgba(16, 185, 129, 0.25)' :
                                'rgba(255, 78, 0, 0.25)',
                              border: 
                                category === 'general' ? '1px solid rgba(165, 180, 252, 0.5)' :
                                category === 'love' ? '1px solid rgba(253, 164, 175, 0.5)' :
                                category === 'career' ? '1px solid rgba(110, 231, 183, 0.5)' :
                                '1px solid rgba(251, 191, 36, 0.5)',
                              boxShadow: 
                                category === 'general' ? '0 0 25px rgba(99, 102, 241, 0.35)' :
                                category === 'love' ? '0 0 25px rgba(244, 63, 94, 0.35)' :
                                category === 'career' ? '0 0 25px rgba(16, 185, 129, 0.35)' :
                                '0 0 25px rgba(255, 78, 0, 0.35)'
                            }
                          : {
                              backgroundColor: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }
                      }
                    >
                      <Fingerprint 
                        className={`w-8 h-8 ${appState === 'attuning' ? 'animate-pulse' : ''}`} 
                        style={{
                          color: 
                            appState !== 'attuning' ? '#d6d3d1' : (
                              category === 'general' ? '#a5b4fc' :
                              category === 'love' ? '#fda4af' :
                              category === 'career' ? '#6ee7b7' :
                              '#fcd34d'
                            )
                        }}
                      />
                    </motion.div>
                    
                    <span className="font-serif italic text-sm block mt-3.5 font-normal text-stone-200">
                      {appState === 'attuning' ? '念力注入中...' : '按住不放开启'}
                    </span>
                    <span 
                      className="text-[9px] uppercase font-mono tracking-[0.2em] mt-1 font-bold block transition-all duration-500"
                      style={{
                        color: 
                          category === 'general' ? '#a5b4fc' :
                          category === 'love' ? '#fda4af' :
                          category === 'career' ? '#6ee7b7' :
                          '#ff4e00'
                      }}
                    >
                      {appState === 'attuning' ? `${Math.floor(attuningProgress)}%` : 'Touch & Hold'}
                    </span>
                  </div>
                </div>
 
                {/* Validation Warnings */}
                <AnimatePresence>
                  {showValidationError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full mt-4 p-3 bg-red-950/40 border border-red-500/20 rounded-xl flex items-start space-x-2.5 text-rose-300 text-xs font-serif shadow-xl z-20"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span className="whitespace-pre-line text-left leading-normal">{showValidationError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
 
                {!showValidationError && (
                  <p className="text-[11px] text-stone-500 text-center font-serif mt-4 tracking-widest max-w-[280px]">
                    「命运不可戏弄」蓄满力量，答案随念而现。
                  </p>
                )}
              </div>

              {/* Calligraphy questions input pill */}
              <div className="w-full max-w-md mb-6 relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  maxLength={120}
                  placeholder="在此虔诚输入你面临的困惑或心愿 (留空亦可直接占问)..."
                  className="w-full p-4 px-6 rounded-full bg-white/[0.02] backdrop-blur-md border border-white/10 text-stone-200 placeholder-stone-600 text-xs sm:text-sm focus:outline-hidden focus:border-[#ff4e00]/50 focus:ring-1 focus:ring-amber-500/10 hover:border-white/15 transition-all text-center tracking-wider font-serif"
                  id="user-destination-question-input"
                />
              </div>

              {/* Destiny category horizontal pills */}
              <div className="w-full max-w-md mb-4 px-4 sm:px-0">
                <div className="flex flex-col space-y-3 items-center">
                  {/* Row 1: 三个具体领域一排 */}
                  <div className="w-full grid grid-cols-3 gap-2">
                    {CATEGORIES.filter(c => c.id !== 'general').map((cat) => {
                      const isActive = category === cat.id;
                      let activeStyles = '';
                      if (cat.id === 'love') {
                        activeStyles = 'bg-rose-600/90 text-white border-rose-500 font-bold shadow-lg shadow-rose-500/15';
                      } else if (cat.id === 'career') {
                        activeStyles = 'bg-emerald-600/90 text-white border-emerald-500 font-bold shadow-lg shadow-emerald-500/15';
                      } else if (cat.id === 'destiny') {
                        activeStyles = 'bg-[#ff4e00] text-white border-[#ff4e00]/80 font-bold shadow-lg shadow-[#ff4e00]/15';
                      }

                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setCategory(cat.id);
                            if (!isMuted) synth.playChime();
                          }}
                          className={`py-2 px-1 sm:px-3 rounded-full border transition-all duration-300 text-[10px] sm:text-xs font-serif tracking-wider whitespace-nowrap cursor-pointer text-center ${
                            isActive
                              ? activeStyles
                              : 'bg-white/[0.03] border-white/10 text-stone-400 hover:border-white/20 hover:text-white hover:scale-[1.02]'
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Row 2: 万象单独一排 */}
                  <div className="w-full flex justify-center">
                    {(() => {
                      const cat = CATEGORIES.find(c => c.id === 'general')!;
                      const isActive = category === 'general';
                      const activeStyles = 'bg-indigo-600/90 text-white border-indigo-500 font-bold shadow-lg shadow-indigo-500/15';
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setCategory(cat.id);
                            if (!isMuted) synth.playChime();
                          }}
                          className={`w-full sm:w-2/3 py-2 px-6 rounded-full border transition-all duration-300 text-xs sm:text-sm font-serif tracking-widest whitespace-nowrap cursor-pointer text-center ${
                            isActive
                              ? activeStyles
                              : 'bg-white/[0.03] border-white/10 text-stone-400 hover:border-white/20 hover:text-white hover:scale-[1.02]'
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })()}
                  </div>
                </div>
                <p className="text-center text-[10px] sm:text-[11px] text-stone-500 mt-4 font-serif italic tracking-wide">
                  {CATEGORIES.find((c) => c.id === category)?.desc}
                </p>
              </div>
            </motion.div>
          )}

          {/* STATE 3: Book Page Flips simulation */}
          {appState === 'flip' && (
            <motion.div
              key="flip-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="relative w-48 h-48 flex items-center justify-center mb-4">
                {/* 3D spinning star map circles */}
                <div className="absolute inset-0 rounded-full border border-dashed border-amber-500/20 animate-spin-slow" />
                <div className="absolute inset-4 rounded-full border border-double border-amber-500/10 [animation-direction:reverse] animate-spin-slow" />
                
                {/* Dynamic floating page silhouettes flipping */}
                <motion.div
                  animate={{ rotateY: [0, 180, 360] }}
                  transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
                  className="w-20 h-28 bg-amber-500/10 rounded-r border-y border-r border-amber-500/40 divide-y divide-amber-500/15 p-2 flex flex-col justify-between origin-left-center"
                >
                  <div className="h-2 bg-amber-500/20 rounded w-full" />
                  <div className="h-2 bg-amber-500/20 rounded w-5/6" />
                  <div className="h-2 bg-amber-500/20 rounded w-11/12" />
                  <div className="h-2 bg-amber-500/20 rounded w-4/6" />
                </motion.div>
              </div>

              <h3 className="font-serif text-lg tracking-[0.25em] text-amber-200">
                翻阅命运篇章...
              </h3>
              <p className="text-slate-500 text-xs font-serif mt-1.5 tracking-wider">
                乾坤运转，宿命之轮为您遴选最切实的警诫。
              </p>
            </motion.div>
          )}

          {/* STATE 4: Revelations open book layout */}
          {appState === 'reveal' && chosenAnswer && (
            <motion.div
              key="reveal-screen"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full flex flex-col items-center"
            >
              {/* Double page ancient book layouts */}
              <div id="destiny-book-card" className="w-full max-w-4xl parchment-paper text-slate-900 rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_10px_30px_rgba(212,175,55,0.1)] border border-amber-500/20 flex flex-col md:flex-row relative">
                {/* Spine crease strip */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-black/0 via-black/15 to-black/0 pointer-events-none z-10 border-x border-black/5" />

                {/* Left Page: The inquiry query context */}
                <div className="flex-1 p-6 sm:p-9 md:p-12 border-b md:border-b-0 md:border-r border-stone-300/60 flex flex-col justify-between min-h-[280px] relative">
                  {/* Classical exquisite double border frame */}
                  <div className="absolute inset-2 border-2 border-amber-800/10 pointer-events-none rounded-xl" />
                  <div className="absolute inset-3 border border-dashed border-amber-800/15 pointer-events-none rounded-lg" />
                  <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-amber-800/40 pointer-events-none" />
                  <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-amber-800/40 pointer-events-none" />
                  <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-amber-800/40 pointer-events-none" />
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-amber-800/40 pointer-events-none" />

                  {/* Header metadata */}
                  <div className="flex items-center justify-between border-b border-stone-300 pb-3">
                    <span className="font-serif text-xs font-bold tracking-widest text-slate-700">
                      QUERY LOG // 问心册
                    </span>
                    <span className="font-mono text-xs text-slate-500 uppercase tracking-widest font-semibold flex items-center">
                      № {chosenAnswer.id.toUpperCase()}
                    </span>
                  </div>

                  {/* Main Enquiry Content */}
                  <div className="my-8 flex-1 flex flex-col justify-center">
                    <p className="text-[11px] font-serif text-amber-800 tracking-widest uppercase mb-1 font-bold">
                      所求领域 · {CATEGORIES.find(c => c.id === category)?.name || '万象'}
                    </p>
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-stone-800 leading-relaxed italic">
                      「 {question.trim() || '默默叩问，未曾诉之于口。'} 」
                    </h4>
                    <p className="text-xs text-slate-500 font-serif mt-3 italic">
                      诚心起意，字句虽短。天道微鸣，宿命感召。
                    </p>
                  </div>

                  {/* Ancient graphic seal design */}
                  <div 
                    onClick={() => setShowAttunementModal(true)}
                    className="flex items-center space-x-3 border-t border-stone-300/60 pt-4 text-stone-500 cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all duration-200 select-none group"
                    title="点击解读此句释义"
                  >
                    <div className="w-10 h-10 rounded-full border border-stone-400/40 flex items-center justify-center group-hover:border-amber-700/60 group-hover:bg-amber-105/30 transition-all">
                      <Sparkles className="w-4 h-4 text-amber-800/60 group-hover:text-amber-700 group-hover:scale-110 transition-all" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] font-serif font-bold text-stone-700 tracking-wider group-hover:text-amber-800 transition-colors">
                          {activeAttunement.title}
                        </span>
                        <HelpCircle className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 transition-all shrink-0 animate-pulse" />
                      </div>
                      <span className="text-[9px] text-stone-500 font-serif leading-relaxed mt-0.5 group-hover:text-amber-800 transition-colors">
                        叩心祈愿凝灵印 • 起念占问映心神
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Page: The core answering reveal */}
                <div className="flex-1 p-6 sm:p-9 md:p-12 flex flex-col justify-between min-h-[340px] relative">
                  {/* Overlay image for native browser/WeChat long-press saving */}
                  {generatedImg && (
                    <img
                      src={generatedImg}
                      alt="长按保存命运神签"
                      className="absolute inset-0 w-full h-full opacity-0 pointer-events-auto z-20 cursor-default select-none"
                      style={{ WebkitTouchCallout: 'default' }}
                    />
                  )}
                  {/* Classical exquisite double border frame */}
                  <div className="absolute inset-2 border-2 border-amber-800/10 pointer-events-none rounded-xl" />
                  <div className="absolute inset-3 border border-dashed border-amber-800/15 pointer-events-none rounded-lg" />
                  <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-amber-800/40 pointer-events-none" />
                  <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-amber-800/40 pointer-events-none" />
                  <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-amber-800/40 pointer-events-none" />
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-amber-800/40 pointer-events-none" />

                  {/* Header metadata */}
                  <div className="flex items-center justify-between border-b border-stone-300 pb-3">
                    <span className="font-serif text-xs font-bold tracking-widest text-slate-700">
                      CELESTIAL REVELATION // 宿命判词
                    </span>
                    {chosenAnswer.hexagram && (
                      <span className="font-serif text-xs px-2.5 py-0.5 border border-amber-600/30 rounded bg-amber-400/10 text-amber-900 font-bold">
                        卦象 · {chosenAnswer.hexagram}
                      </span>
                    )}
                  </div>

                  {/* The central ambiguous, elegant quote */}
                  <div className="my-8 flex-1 flex flex-col justify-center">
                    {/* Animated answer text to fade letter-by-letter */}
                    <div className="text-xl sm:text-2xl font-serif font-black text-amber-950 leading-relaxed tracking-wider mb-4 border-l-3 border-amber-700/60 pl-3">
                      {chosenAnswer.text.split('').map((char, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.08, duration: 0.3 }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: chosenAnswer.text.length * 0.08 + 0.1, duration: 0.5 }}
                      className="text-stone-700 text-xs sm:text-sm font-serif leading-relaxed"
                    >
                      <span className="font-bold text-amber-900 block mb-1">【命之批注】</span>
                      {chosenAnswer.interpretation}
                    </motion.div>
                  </div>

                  {/* Lucky guides details row */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: chosenAnswer.text.length * 0.06 + 0.4 }}
                    className="grid grid-cols-2 gap-3 border-t border-stone-300/60 pt-4"
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-serif">助运之引 · 幸运色</span>
                      <span className="text-xs font-serif font-bold text-slate-800 mt-0.5 flex items-center">
                        <span 
                          className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 shadow-sm border border-black/10" 
                          style={{ backgroundColor: getLuckyColorHex(chosenAnswer.luckyColor) }}
                        />
                        {chosenAnswer.luckyColor}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-serif">辟邪之引 · 契合数字</span>
                      <span className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                        {chosenAnswer.luckyNumber}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Floating micro-badge reminding users how to export/save */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={handleOpenShare}
                className="mt-6 -mb-2 flex items-center space-x-2 px-4 py-1.5 bg-amber-500/10 backdrop-blur-md border border-amber-500/20 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)] cursor-pointer hover:bg-amber-500/20 hover:border-amber-500/30 transition-all group shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 active:scale-95 transition-all animate-bounce" />
                <span className="font-serif text-[10.5px] text-amber-200/90 tracking-[0.14em] uppercase select-none font-medium">
                  {isGeneratingImg ? "候天机凝聚画卷中..." : "长按页面部分可直接保存至相册"}
                </span>
              </motion.div>

              {/* Interactive post-read button bar */}
              <div className="mt-8 flex flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-md mx-auto px-4">
                {/* Immersive Modal Share Trigger - Now styled like the main Immersive UI stark white CTA */}
                <button
                  onClick={handleOpenShare}
                  className="flex-1 group relative cursor-pointer pointer-events-auto active:scale-95 transition-all text-black"
                >
                  <div className="absolute inset-0 bg-white/10 blur-xl group-hover:bg-white/20 transition-all rounded-full" />
                  <div className="relative w-full h-11 bg-white text-black text-[11px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold rounded-full overflow-hidden flex items-center justify-center gap-1.5 border border-white/50 shadow-2xl">
                    <Share2 className="w-3.5 h-3.5 text-black shrink-0" />
                    <span>分享命运神签</span>
                  </div>
                </button>

                {/* Reset button - Now styled as secondary outline button */}
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center h-11 space-x-1.5 rounded-full bg-white/[0.03] border border-white/10 hover:border-amber-500/25 hover:bg-amber-500/5 hover:text-amber-200 text-stone-200 text-[11px] sm:text-xs font-serif font-medium tracking-wider transition-all duration-200 cursor-pointer pointer-events-auto shadow-lg active:scale-95 group"
                >
                  <Undo2 className="w-3.5 h-3.5 text-stone-300 group-hover:text-amber-400 group-hover:animate-pulse shrink-0" />
                  <span>再度占叩心愿</span>
                </button>
              </div>

              {/* Daily remains count badge (moved to results/reveal page to prevent pressure on entrance) */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className={`mt-6 flex items-center justify-center gap-2 px-5 py-2 rounded-full select-none font-serif text-[10.5px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] shrink-0 z-10 ${
                  attemptsLeft <= 0 
                  ? "bg-amber-950/20 border border-amber-500/20 text-amber-200/90" 
                  : "bg-white/[0.02] border border-white/5 text-stone-400"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                {attemptsLeft <= 0 ? (
                  bonusReadings < 2 ? (
                    <span className="text-center whitespace-nowrap">今日天机已竭，「分享命运神签」重获卜问福缘 (今日已赠: +{bonusReadings}/2次)</span>
                  ) : (
                    <span className="text-amber-300/90 font-medium text-center whitespace-nowrap">今日问卜已达上限，天机暂避。收藏本页链接，明天准时续缘~</span>
                  )
                ) : (
                  <span className="whitespace-nowrap">
                    今日占问 {usedToday} 次，天机余量 <span className="font-sans font-semibold text-amber-300">{attemptsLeft}</span>/{BASELINE_LIMIT + bonusReadings} 次
                    {bonusReadings < 2 ? (
                      <span className="text-amber-400/90 ml-1.5 font-sans font-normal">(分享本页可增次数)</span>
                    ) : (
                      <span className="text-emerald-400 ml-1 font-sans font-medium">(已获赠福缘)</span>
                    )}
                  </span>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- Footer Signature Segment --- */}
      <footer className="relative w-full text-center py-5 px-6 z-10 border-t border-slate-900 bg-slate-950/40">
        <p className="text-[10px] text-slate-600 tracking-widest font-serif uppercase">
          「 答案随缘而现, 念由心生, 不染尘泥。 」
        </p>
        <p className="text-[9px] text-stone-700/80 mt-1 font-mono">
          &copy; 2026 THE BOOK OF ANSWERS. PERSISTED LOCALLY. ALL INK ENCRYPTED.
        </p>
      </footer>

      {/* --- Share Modal UI Overlay --- */}
      <AnimatePresence>
        {isShareModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto"
            onClick={() => setIsShareModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-stone-950/95 border border-amber-500/20 rounded-3xl w-full max-w-xl shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col p-4 sm:p-5 space-y-4 relative max-h-[96vh] scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Title with Gilded Line */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="font-serif text-sm sm:text-base text-amber-200 tracking-wider">
                    命数画印 · 承影留念
                  </h3>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="rounded-full p-1.5 bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Central Content Area */}
              <div className="flex-1 flex flex-col items-center justify-center p-1 overflow-visible">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    {/* Exquisite Celestial Spinner */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/20 animate-spin-slow" />
                      <div className="absolute inset-2 rounded-full border border-double border-amber-500/40 animate-pulse" />
                      <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
                    </div>
                    <div className="text-center space-y-1.5">
                      <p className="font-serif text-sm tracking-widest text-amber-200">
                        正在极尽描摹命运画卷...
                      </p>
                      <p className="text-[11px] font-sans text-stone-400 tracking-wider">
                        汇聚灵念印字，请稍作静待
                      </p>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="flex flex-col items-center space-y-3 w-full">
                    {/* High-fidelity Visual Preview Frame */}
                    <div className="relative max-w-full group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/20 via-[#ff4e00]/20 to-amber-500/20 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt pointer-events-none" />
                      <img
                        referrerPolicy="no-referrer"
                        src={generatedImage}
                        alt="命运印记"
                        className="relative max-w-full max-h-[58vh] sm:max-h-[62vh] rounded-xl object-contain border border-amber-500/20 shadow-2xl transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                        title="💡 手机端：可在此图片上长按保存到相册；电脑端：可右键另存为图片"
                      />
                    </div>
                    
                    {/* Prompt banner to long press to save image */}
                    <div className="flex items-center space-x-1.5 px-4 py-1.5 bg-amber-500/5 border border-amber-500/20 rounded-full text-center">
                      <Fingerprint className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
                      <span className="text-[10px] sm:text-[11px] font-serif text-amber-200 tracking-wider">
                        手机用户：在上方图片「长按」可保存至相册
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-stone-400 text-xs py-8 text-center">
                    未能生成画屏印记，请重试或直接复制结果
                  </div>
                )}
              </div>

              {/* Bottom Multi-channel Share Grid */}
              <div className="space-y-3 border-t border-white/5 pt-3">
                <p className="text-[9px] sm:text-[10px] text-stone-400 tracking-widest font-serif text-center uppercase">
                  一键快捷保存或分享
                </p>

                {/* Grid of round styled channels */}
                <div className="flex justify-center items-center gap-5 sm:gap-7 pt-1 flex-wrap">
                  {/* Copy Link */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href).then(() => {
                          showToast('✨ 占问链接复制成功！快分享给有缘人吧~');
                          grantShareBonus();
                        }).catch(() => {
                          showToast('❌ 复制失败，请从浏览器地址栏手动复制。');
                        });
                      }}
                      className="w-11 h-11 rounded-full flex items-center justify-center bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-amber-400 transition-all duration-200 shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <Copy className="w-4.5 h-4.5" />
                    </button>
                    <span className="text-[9px] sm:text-[10px] font-serif text-stone-400">复制链接</span>
                  </div>

                  {/* WeChat Friend */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => {
                        showToast('💡 微信分享提示：已为您绘制精美神签！请长按上方卡片保存至相册，再前往微信选择发送给好友~');
                        grantShareBonus();
                      }}
                      className="w-11 h-11 rounded-full flex items-center justify-center bg-[#07C160]/10 border border-[#07C160]/20 hover:bg-[#07C160] hover:text-white text-[#07C160] transition-all duration-200 shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M8.5 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm5.5 0c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-3-4.5C6.182 7.5 2.5 10.355 2.5 13.875c0 1.97.106 3.755 2.455 4.88l-.614 1.838 2.05-.98c1.332.378 2.394.512 3.609.512 4.818 0 8.5-2.855 8.5-6.375S14.818 7.5 11 7.5zm7.25 7c.414 0 .75-.336.75-.75s-.336-.75-.75-.75-.75.336-.75.75.336.75.75.75zm-3.5 0c.414 0 .75-.336.75-.75s-.336-.75-.75-.75-.75.336-.75.75.336.75.75.75zm4.75-2c2.485 0 4.5-1.79 4.5-4s-2.015-4-4.5-4-4.5 1.79-4.5 4c0 .485.1 1 .286 1.48C13.23 6.945 11.23 6.5 9 6.5c-.346 0-.687.01-1.022.03C8.618 4.52 11.09 3 14.5 3c4.694 0 8.5 2.686 8.5 6 0 1.85-.102 3.528-2.385 4.587l.59 1.765-1.97-.94c-1.28.355-2.333.488-3.485.488v2z"/>
                      </svg>
                    </button>
                    <span className="text-[9px] sm:text-[10px] font-serif text-stone-400">微信好友</span>
                  </div>

                  {/* Moments */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => {
                        showToast('💡 朋友圈分享提示：请长按上方绘制生成的命运图保存，再前往微信朋友圈手动发布分享~');
                        grantShareBonus();
                      }}
                      className="w-11 h-11 rounded-full flex items-center justify-center bg-[#07D160]/10 border border-[#07D160]/20 hover:bg-[#07D160] hover:text-white text-[#07D160] transition-all duration-200 shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm4.25-3.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zm.75-3.5A1 1 0 1 1 16 9a1 1 0 0 1 2 0zm-11 7A1.25 1.25 0 1 1 5 15.5a1.25 1.25 0 0 1 2.5 0zM7 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                      </svg>
                    </button>
                    <span className="text-[9px] sm:text-[10px] font-serif text-stone-400">朋友圈</span>
                  </div>

                  {/* Xiaohongshu */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => {
                        showToast('💡 小红书分享提示：请长按上方神签图保存，再打开小红书发布精美占考成果。可添加 #答案之书 #今日占卜 标签~');
                        grantShareBonus();
                      }}
                      className="w-11 h-11 rounded-full flex items-center justify-center bg-[#FF2442]/10 border border-[#FF2442]/20 hover:bg-[#FF2442] hover:text-white text-[#FF2442] transition-all duration-200 shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <span className="font-serif text-xs font-black tracking-tighter select-none">书</span>
                    </button>
                    <span className="text-[9px] sm:text-[10px] font-serif text-stone-400">小红书</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Toast Alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] px-5 py-3.5 bg-stone-900 border border-amber-500/30 text-stone-100 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-center space-x-2.5 w-[calc(100%-2.5rem)] sm:w-max max-w-md pointer-events-auto"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-serif leading-relaxed tracking-wide text-left">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Attunement Info Modal (大德归本位 · 宿命归天枢 释义弹窗) --- */}
      <AnimatePresence>
        {showAttunementModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setShowAttunementModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="parchment-paper border-2 border-amber-800/20 rounded-2xl w-full max-w-[315px] sm:max-w-[350px] shadow-[0_15px_40px_rgba(139,92,26,0.25)] flex flex-col p-5 sm:p-6 space-y-4 relative text-slate-800 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Classical Double Frame Accents */}
              <div className="absolute inset-1.5 border border-amber-800/10 pointer-events-none rounded-xl" />
              <div className="absolute inset-2 border border-dashed border-amber-800/10 pointer-events-none rounded-lg" />
              <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-amber-800/30 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-amber-800/30 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-amber-800/30 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-amber-800/30 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setShowAttunementModal(false)}
                className="absolute top-2.5 right-2.5 rounded-full p-1 bg-stone-800/5 hover:bg-stone-800/10 text-stone-600 transition-all cursor-pointer z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Header Title */}
              <div className="text-center pb-1 border-b border-amber-800/10 flex flex-col items-center">
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-800/10 border border-amber-800/15 mb-1 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                </div>
                <h3 className="font-serif text-[13px] font-bold text-amber-950 tracking-wide">
                  {activeAttunement.title}
                </h3>
                <p className="text-[8px] font-mono uppercase tracking-widest text-amber-800/70 mt-0.5 mb-1.5">
                  {activeAttunement.english}
                </p>
                <div className="text-[9.5px] font-serif leading-relaxed text-amber-900 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-800/15 select-none w-full text-left font-medium">
                  ✨ <strong>心境映射：</strong>{ATTUNEMENT_MINDSET_MAP[activeAttunement.id] || CATEGORY_PSYCHOLOGY[category]?.summary || "静心观照当下心念状态"}
                </div>
              </div>

              {/* Meaning Core Content */}
              <div className="space-y-4 text-xs font-serif leading-normal text-left text-slate-700">
                {/* Imprint Quote - Centered and italicized, more concise */}
                <p className="text-[10.5px] text-amber-900/80 text-center italic tracking-wider py-1.5 border-t border-b border-dashed border-amber-800/10 my-1 select-none w-full font-serif font-medium leading-relaxed">
                  “ {activeAttunement.intro.replace(/^此印是/, '').replace(/^此印代表/, '')} ”
                </p>

                {/* Classic separated formatting */}
                <div className="space-y-4 select-none pt-1">
                  {/* Term 1 */}
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-amber-950 text-[12px] tracking-wide">
                      {activeAttunement.term1.title}
                    </h4>
                    <p className="text-[10.5px] text-slate-600 leading-relaxed font-sans">
                      {getSeekerFriendlyDesc(activeAttunement.id, 0, activeAttunement.term1.desc)}
                    </p>
                  </div>

                  {/* Term 2 */}
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-amber-950 text-[12px] tracking-wide">
                      {activeAttunement.term2.title}
                    </h4>
                    <p className="text-[10.5px] text-slate-600 leading-relaxed font-sans">
                      {getSeekerFriendlyDesc(activeAttunement.id, 1, activeAttunement.term2.desc)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Action */}
              <div className="pt-1 text-center">
                <button
                  onClick={() => setShowAttunementModal(false)}
                  className="px-5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-amber-50 font-serif text-[10px] font-medium tracking-wider transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98"
                >
                  合十感念
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- History Archive Log Drawer Component --- */}
      <HistoryLog
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        records={historyRecords}
        onClearAll={handleClearHistory}
        onDeleteRecord={handleDeleteRecord}
        onViewRecord={handleViewRecord}
      />
    </div>
  );
}
