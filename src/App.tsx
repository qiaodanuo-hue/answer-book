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

export default function App() {
  // --- States ---
  const [category, setCategory] = useState<CategoryId>('love');
  const [question, setQuestion] = useState('');
  const [appState, setAppState] = useState<'cover' | 'attuning' | 'flip' | 'reveal'>('cover');
  const [attuningProgress, setAttuningProgress] = useState(0);
  const [chosenAnswer, setChosenAnswer] = useState<Answer | null>(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showValidationError, setShowValidationError] = useState<string | null>(null);
  
  // History Records
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isViewingPastRecord, setIsViewingPastRecord] = useState(false);
  
  // Audio stop handling
  const stopPadRef = useRef<(() => void) | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Touching sensory locations
  const [touchCoords, setTouchCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchAreaRef = useRef<HTMLDivElement | null>(null);

  // Copy success indicator
  const [copied, setCopied] = useState(false);

  // --- Share Modal & Generation States ---
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Daily Divination Limits & Sharing Bonus ---
  const [usedToday, setUsedToday] = useState(0);
  const [bonusReadings, setBonusReadings] = useState(0);

  const BASELINE_LIMIT = 8;
  const attemptsLeft = Math.max(0, BASELINE_LIMIT + bonusReadings - usedToday);

  // Grant sharing bonus
  const grantShareBonus = () => {
    const nextBonus = bonusReadings + 1;
    setBonusReadings(nextBonus);
    localStorage.setItem('answers_book_daily_bonus', nextBonus.toString());
    showToast('✨ 随缘增福：善因结得善果，感念合十，已为您增添一次问卜机缘。');
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

    // Daily limit initialization configuration
    const today = new Date().toLocaleDateString('zh-CN');
    const savedDate = localStorage.getItem('answers_book_daily_date');
    if (savedDate === today) {
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

  // Speaks active answer with SpeechSynthesis
  const speakAnswer = () => {
    if (!chosenAnswer) return;
    
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setToastMessage('您的浏览器当前不支持语音朗读，请尝试在主流浏览器中打开。');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    try {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      // Stop any pending speech and ensure synthesis is resumed
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const textToSpeak = `答案之书对你的宿命指引是：“${chosenAnswer.text}”。命运之批注显示：${chosenAnswer.interpretation}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance; // Prevent garbage collection bug
      
      utterance.lang = 'zh-CN';
      utterance.rate = 0.95; // Slightly slower, more solemn pace
      utterance.pitch = 1.0;  // Normal pleasant pitch

      // Find a nice Chinese voice if available
      const voices = window.speechSynthesis.getVoices();
      let zhVoice = voices.find(v => 
        (v.lang.toLowerCase().includes('zh') || v.lang.toLowerCase().includes('chn')) && 
        (v.name.includes('Siri') || v.name.includes('Tingting') || v.name.includes('Xiaoxiao') || v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Yating') || v.name.toLowerCase().includes('google'))
      );
      if (!zhVoice) {
        zhVoice = voices.find(v => v.lang.toLowerCase().includes('zh') || v.lang.toLowerCase().includes('chn'));
      }
      
      if (zhVoice) {
        utterance.voice = zhVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (err) => {
        console.warn('Speech synthesis utterance error:', err);
        setIsSpeaking(false);
        utteranceRef.current = null;
        
        // Show context-aware warnings
        if (err.error === 'not-allowed') {
          setToastMessage('因浏览器安全策略，您需要任意点击一下页面后重新点击播放。');
        } else {
          setToastMessage('语音合成受限，部分流览器或预览框架未授权声音通道，可尝试再次点击或使用新窗口。');
        }
        setTimeout(() => setToastMessage(null), 4000);
      };

      // Wrap in a setTimeout to give the browser's asynchronous cancel() time to clear, avoiding immediate cancellation of the new speech.
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
          // Set state immediately to indicate trying to read, in case onstart is delayed
          setIsSpeaking(true);
        } catch (speakErr) {
          console.error('Failed to speak:', speakErr);
          setIsSpeaking(false);
          setToastMessage('语音播放遇到障碍，可以尝试右上方新窗口。');
          setTimeout(() => setToastMessage(null), 3000);
        }
      }, 80);

    } catch (e) {
      console.error('Unexpected error in speakAnswer:', e);
      setIsSpeaking(false);
      setToastMessage('您的浏览器限制了语音播放，请在新窗口打开体验全功能。');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Speech cleanups
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Touch and Hold Attuning Cycle
  const attuneTimerRef = useRef<number | null>(null);
  
  const handleAttuneStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (appState !== 'cover') return;

    if (attemptsLeft <= 0) {
      setShowValidationError('🔮 今日问卜已达上限，点击上方「命理谱」分享记录，续得一次卜问福缘。');
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
    const duration = 1800; // 1.8 seconds to fully unlock

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
      setShowValidationError('「念力不足，法阵散逸」 请按压不低于2秒，虔诚冥想你的问题。');
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
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
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
            ctx.fillText('大德归本位 · 宿命归天枢', 136, badgeCenterY - 4);

            ctx.fillStyle = '#78716c';
            ctx.font = 'bold 9px monospace';
            ctx.fillText('ATTUNEMENT UNSEALED', 136, badgeCenterY + 11);
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
                      className="absolute top-full mt-4 p-3 bg-red-950/40 border border-red-500/20 rounded-xl flex items-center space-x-2 text-rose-300 text-xs font-serif shadow-xl z-20"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{showValidationError}</span>
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
              {/* Floating micro-badge reminding users how to export/save */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={handleOpenShare}
                className="mb-4 flex items-center space-x-2 px-4 py-1.5 bg-amber-500/10 backdrop-blur-md border border-amber-500/20 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)] cursor-pointer hover:bg-amber-500/20 hover:border-amber-500/30 transition-all group shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 active:scale-95 transition-all animate-bounce" />
                <span className="font-serif text-[10.5px] text-amber-200/90 tracking-[0.18em] uppercase select-none font-medium">长按保存至相册 · 导出命运神签</span>
              </motion.div>

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
                  <div className="flex items-center space-x-3 border-t border-stone-300/60 pt-4 text-stone-500">
                    <div className="w-10 h-10 rounded-full border border-stone-400/40 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-amber-800/60" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-serif font-bold text-stone-700 tracking-wider">
                        大德归本位 · 宿命归天枢
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400">
                        ATTUNEMENT {isViewingPastRecord ? 'RECORDED' : 'UNSEALED'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Page: The core answering reveal */}
                <div className="flex-1 p-6 sm:p-9 md:p-12 flex flex-col justify-between min-h-[340px] relative">
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

              {/* Interactive post-read button bar */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
                {/* Immersive Modal Share Trigger - Now styled like the main Immersive UI stark white CTA */}
                <button
                  onClick={handleOpenShare}
                  className="group relative cursor-pointer pointer-events-auto active:scale-95 transition-all text-black"
                >
                  <div className="absolute inset-0 bg-white/10 blur-xl group-hover:bg-white/20 transition-all rounded-full" />
                  <div className="relative px-8 py-3.5 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold rounded-full overflow-hidden flex items-center gap-2 border border-white/50 shadow-2xl">
                    <Share2 className="w-3.5 h-3.5 text-black" />
                    <span>分享命运神签</span>
                  </div>
                </button>

                {/* Speech read button */}
                <button
                  onClick={speakAnswer}
                  className={`flex items-center space-x-2 px-6 py-3.5 rounded-full border text-xs font-serif font-medium tracking-wider transition-all duration-200 cursor-pointer pointer-events-auto shadow-lg active:scale-95 ${
                    isSpeaking
                      ? 'bg-[#ff4e00]/20 text-white border-[#ff4e00]/40'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.08] text-stone-200 hover:text-white'
                  }`}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-[#ff4e00]' : 'text-stone-300'}`} />
                  <span>{isSpeaking ? '正在宣读占卜...' : '听审神婆密念'}</span>
                </button>

                {/* Reset button - Now styled as secondary outline button */}
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-white/[0.03] border border-white/10 hover:border-amber-500/25 hover:bg-amber-500/5 hover:text-amber-200 text-stone-200 text-xs font-serif font-medium tracking-wider transition-all duration-200 cursor-pointer pointer-events-auto shadow-lg active:scale-95 group"
                >
                  <Undo2 className="w-3.5 h-3.5 text-stone-300 group-hover:text-amber-400 group-hover:animate-pulse" />
                  <span>再度占叩心愿</span>
                </button>
              </div>

              {/* Daily remains count badge (moved to results/reveal page to prevent pressure on entrance) */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 flex flex-wrap items-center justify-center gap-2.5 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-full select-none text-stone-400 font-serif text-[10.5px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] shrink-0 z-10"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>
                  今日已占问 {usedToday} 次，天机余量: <span className="font-sans font-semibold text-amber-300">{attemptsLeft}</span> / {BASELINE_LIMIT} 次
                  {bonusReadings > 0 && <span className="text-emerald-400 ml-1 font-sans font-medium">(含结缘赠礼 +{bonusReadings} 次)</span>}
                </span>
                <span className="hidden sm:inline text-white/10 w-[1px] h-3 bg-white/10" />
                <button 
                  onClick={() => {
                    setIsShareModalOpen(true);
                    showToast("🔮 随缘增福：分享当前神签或复制链接，即可再增一次问卜福缘。");
                  }}
                  type="button"
                  className="font-serif text-[10.5px] text-amber-500 hover:text-amber-400 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  分享结缘增福
                </button>
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
            className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] px-5 py-3.5 bg-stone-900 border border-amber-500/30 text-stone-100 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-center space-x-2.5 max-w-[90vw] md:max-w-md pointer-events-auto"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-serif leading-relaxed tracking-wide text-left">{toastMessage}</span>
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
