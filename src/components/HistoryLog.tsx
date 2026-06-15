/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Calendar, Compass, Clock, BookOpen, ChevronRight, Copy, Check } from 'lucide-react';
import React, { useState } from 'react';

export interface HistoryRecord {
  id: string;
  timestamp: number;
  question: string;
  categoryName: string;
  categoryIcon: string;
  answerText: string;
  interpretation: string;
  luckyColor: string;
  luckyNumber: string;
  hexagram?: string;
}

interface HistoryLogProps {
  isOpen: boolean;
  onClose: () => void;
  records: HistoryRecord[];
  onClearAll: () => void;
  onDeleteRecord: (id: string) => void;
  onViewRecord: (record: HistoryRecord) => void;
}

export default function HistoryLog({
  isOpen,
  onClose,
  records,
  onClearAll,
  onDeleteRecord,
  onViewRecord,
}: HistoryLogProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleCopy = (e: React.MouseEvent, record: HistoryRecord) => {
    e.stopPropagation();
    const textToCopy = `【答案之书】\n🔮 我的问题：${record.question || '默想心中所求'}\n📖 宿命解答：${record.answerText}\n✨ 命运启示：${record.interpretation}\n🎨 幸运色：${record.luckyColor} | 🔢 幸运数：${record.luckyNumber}\n🌟 乾坤卦象：${record.hexagram || '无'}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(record.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 185 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0502] border-l border-white/10 text-slate-100 z-50 flex flex-col shadow-2xl h-full backdrop-blur-md"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full border border-[#ff4e00]/30 flex items-center justify-center animate-spin-slow">
                  <div className="w-1.5 h-1.5 bg-[#ff4e00] rounded-full" />
                </div>
                <span className="font-serif text-lg tracking-wider text-stone-200 font-medium">命运古谱</span>
                <span className="text-[10px] bg-white/5 text-stone-300 font-mono px-2.5 py-0.5 rounded-full border border-white/10">
                  {records.length} 占
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 px-1.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all pointer-events-auto cursor-pointer"
                aria-label="关闭命运古谱"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
              {records.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-500 space-y-4">
                  <BookOpen className="w-12 h-12 text-stone-700 stroke-[1]" />
                  <p className="font-serif text-base text-stone-400 font-light">韶华未染 · 命理空悬</p>
                  <p className="text-xs max-w-xs text-stone-600 font-sans tracking-wide leading-relaxed">
                    您还没有记录过任何困惑。在命运法阵虔诚默想并获取解答后，宿命印痕将永久留存于此。
                  </p>
                </div>
              ) : (
                records.map((rec) => (
                  <motion.div
                    key={rec.id}
                    layoutId={`record-card-${rec.id}`}
                    onClick={() => onViewRecord(rec)}
                    className="group relative p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all cursor-pointer overflow-hidden active:scale-[0.99] flex flex-col"
                  >
                    {/* Background subtle shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#ff4e00]/0 to-[#ff4e00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Top alignment row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 text-stone-300 border border-white/10 font-serif">
                          {rec.categoryName}
                        </span>
                        {rec.hexagram && (
                          <span className="text-[9px] tracking-widest font-serif text-[#ff4e00] bg-[#ff4e00]/10 border border-[#ff4e00]/20 px-2 py-0.5 rounded-full font-bold">
                            卦象 · {rec.hexagram}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-[10px] text-stone-500 font-sans flex items-center tracking-wide">
                          <Clock className="w-3 h-3 mr-1 text-stone-600" />
                          {formatTime(rec.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Question text */}
                    <p className="text-stone-200 font-medium text-sm line-clamp-1 mb-1.5 pr-6 font-serif tracking-wider">
                      问：{rec.question || '默默叩问，未曾诉之于口'}
                    </p>

                    {/* Selected answer snippet */}
                    <div className="p-3 rounded-xl bg-[#0a0502]/60 border-l-2 border-[#ff4e00] text-stone-300 italic font-serif line-clamp-2 my-1.5 text-xs tracking-wide">
                      「 {rec.answerText} 」
                    </div>

                    {/* Interpretation snippet */}
                    <p className="text-stone-500 text-[11px] line-clamp-1 mt-1 font-serif">
                      {rec.interpretation}
                    </p>

                    {/* Interactive overlay shortcuts */}
                    <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-stone-500">
                      <span className="group-hover:text-amber-400 font-serif flex items-center transition-colors text-[10px] tracking-wider">
                        翻开查看详情 <ChevronRight className="w-3 h-3 ml-0.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={(e) => handleCopy(e, rec)}
                          className="p-1 px-2 rounded-full bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer pointer-events-auto"
                          title="复制宿命解答"
                        >
                          {copiedId === rec.id ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRecord(rec.id);
                          }}
                          className="p-1 px-2 rounded-full bg-white/5 text-stone-400 hover:text-[#ff4e00] hover:bg-white/10 transition-all cursor-pointer pointer-events-auto"
                          title="消除此卦"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Clear all footer banner */}
            {records.length > 0 && (
              <div className="p-5 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-stone-600 font-sans tracking-wide max-w-[200px] leading-relaxed">
                  所有乾坤占问均安全加密储存在本手机中。
                </span>
                <button
                  onClick={onClearAll}
                  className="flex items-center text-xs font-serif text-rose-500/90 hover:text-rose-400 pointer-events-auto hover:bg-white/5 px-4 py-2 rounded-full transition-all border border-white/5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  洗牌清空
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
