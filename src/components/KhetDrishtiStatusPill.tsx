import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Droplets,
  Eye,
  EyeOff,
  Gauge,
  Leaf,
  Satellite,
  Sparkles,
} from 'lucide-react';

interface KhetDrishtiStatusPillProps {
  moisturePercent?: number;
  isSafe?: boolean;
  language?: 'bn' | 'en';
  variant?: 'light' | 'hero';
  onDetailsClick?: () => void;
}

export const KhetDrishtiStatusPill: React.FC<KhetDrishtiStatusPillProps> = ({
  moisturePercent = 22,
  isSafe = true,
  language = 'bn',
  variant = 'light',
  onDetailsClick,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Exact 4-second auto-collapse mechanic for the status pill
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (isRevealed) {
      setRevealProgress(100);
      const start = Date.now();
      const duration = 4000;

      progressInterval = setInterval(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setRevealProgress(remaining);
      }, 40);

      timer = setTimeout(() => {
        setIsRevealed(false);
        setRevealProgress(0);
      }, duration);
    } else {
      setRevealProgress(0);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [isRevealed]);

  const handleToggle = () => {
    setIsRevealed((prev) => !prev);
  };

  const handleToggleDetails = () => {
    if (onDetailsClick) {
      onDetailsClick();
    }
    setIsDetailsExpanded((prev) => !prev);
  };

  const isBn = language === 'bn';
  const defaultText = isBn ? 'জমির অবস্থা দেখুন' : 'Check Field Status';
  const revealedText = isBn
    ? `আর্দ্রতা: ${moisturePercent}% | ${isSafe ? 'ঝুঁকি নেই' : 'মাঝারি ঝুঁকি'}`
    : `Moisture: ${moisturePercent}% | ${isSafe ? 'Low Risk' : 'Moderate Stress'}`;

  const isHero = variant === 'hero';

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* ----------------------------------------------------
          BUTTON 1: জমির অবস্থা দেখুন (Status Pill with 4-sec auto-collapse)
         ---------------------------------------------------- */}
      <button
        onClick={handleToggle}
        className={`relative group flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm overflow-hidden cursor-pointer select-none max-w-full ${
          isHero
            ? isRevealed
              ? 'bg-white text-[#E2136E] border-2 border-white/95 w-[280px] sm:w-[320px]'
              : 'bg-white hover:bg-pink-50 text-[#E2136E] border-2 border-white/95 w-[230px] sm:w-[260px]'
            : isRevealed
            ? 'bg-gradient-to-r from-[#E2136E] to-[#C20F5D] text-white border-2 border-[#E2136E] shadow-md shadow-[#E2136E]/20 w-[280px] sm:w-[320px]'
            : 'bg-white hover:bg-[#FDE8F1]/60 text-[#E2136E] border-2 border-[#E2136E]/40 hover:border-[#E2136E] w-[230px] sm:w-[260px]'
        }`}
        title={isBn ? 'ট্যাপ করে জমির অবস্থা দেখুন' : 'Tap to reveal field status'}
      >
        {/* Progress bar line showing 4-second collapse timeout */}
        {isRevealed && (
          <div
            className={`absolute bottom-0 left-0 h-[3px] transition-all duration-75 ${
              isHero ? 'bg-[#E2136E]' : 'bg-white'
            }`}
            style={{ width: `${revealProgress}%` }}
          />
        )}

        {/* Left circular primary icon */}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
            isHero
              ? isRevealed
                ? 'bg-[#E2136E] text-white'
                : 'bg-[#FDE8F1] text-[#E2136E]'
              : isRevealed
              ? 'bg-white text-[#E2136E]'
              : 'bg-[#FDE8F1] text-[#E2136E]'
          }`}
        >
          {isRevealed ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <Leaf className="w-3.5 h-3.5" />
          )}
        </div>

        {/* Revealed or Collapsed Text */}
        <div
          className={`flex items-center gap-1.5 text-center font-normal text-xs sm:text-sm tracking-tight font-sans ${
            !isHero && isRevealed ? 'text-white' : 'text-[#E2136E]'
          }`}
        >
          {isRevealed ? (
            <span className="animate-fadeIn">{revealedText}</span>
          ) : (
            <div className="flex items-center gap-2">
              <span>{defaultText}</span>
              <span className="text-[10px] tracking-widest text-[#E2136E]/60 font-mono">••••••</span>
            </div>
          )}
        </div>

        {/* Right Arrow / Eye toggle icon */}
        <div
          className={`pl-1 shrink-0 ${
            !isHero && isRevealed ? 'text-white' : 'text-[#E2136E]'
          }`}
        >
          {isRevealed ? (
            <EyeOff className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          )}
        </div>
      </button>

      {/* ----------------------------------------------------
          BUTTON 2: মাটির আর্দ্রতা ও স্যাটেলাইট স্কোর দেখতে ট্যাপ করুন
         ---------------------------------------------------- */}
      <button
        onClick={handleToggleDetails}
        className={`group mt-2 py-1.5 px-3.5 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer max-w-full ${
          isHero
            ? 'text-[11px] text-white hover:text-pink-100 bg-black/15 hover:bg-black/25 border border-white/20'
            : isDetailsExpanded
            ? 'text-xs text-[#E2136E] bg-[#FDE8F1] border border-[#E2136E] shadow-2xs'
            : 'text-xs text-[#E2136E] hover:text-[#B80F58] bg-white hover:bg-[#FDE8F1] border border-[#FAD2E1] shadow-2xs'
        }`}
        title={isBn ? 'স্যাটেলাইট মেট্রিক্স দেখতে ট্যাপ করুন' : 'Tap to toggle metrics'}
      >
        <Sparkles className="w-3.5 h-3.5 text-[#E2136E] shrink-0" />
        <span className="font-normal truncate">
          {isRevealed
            ? isBn
              ? 'NASA SMAP L4 উপগ্রহ সরাসরি টেলিমেট্রি'
              : 'NASA SMAP L4 Satellite Live Telemetry'
            : isBn
            ? 'মাটির আর্দ্রতা ও স্যাটেলাইট স্কোর দেখতে ট্যাপ করুন'
            : 'Tap to view soil moisture & satellite score'}
        </span>
        {isDetailsExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-[#E2136E] shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-[#E2136E] shrink-0 group-hover:translate-y-0.5 transition-transform" />
        )}
      </button>

      {/* ----------------------------------------------------
          EXPANDABLE PANEL: মাটির আর্দ্রতা ও স্যাটেলাইট স্কোর বিস্তারিত
         ---------------------------------------------------- */}
      {isDetailsExpanded && (
        <div className="w-full mt-3 p-3.5 bg-white border border-[#FDE8F1] rounded-2xl shadow-sm text-left animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-[#E2136E]">
              <Satellite className="w-3.5 h-3.5 text-[#E2136E]" />
              <span className="font-normal">
                {isBn ? 'নাসা স্যাটেলাইট আর্দ্রতা স্কোর ও বিবরণী' : 'NASA Satellite Moisture & Score'}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
              {isBn ? 'সরাসরি সক্রিয়' : 'Live Synced'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2.5">
            {/* Metric 1 */}
            <div className="p-2.5 rounded-xl bg-[#FDE8F1]/40 border border-[#FAD2E1]/60">
              <div className="text-[10px] text-slate-500 font-normal">
                {isBn ? 'মাটির উপরিভাগ আর্দ্রতা' : 'Surface Moisture'}
              </div>
              <div className="text-sm text-[#E2136E] font-normal mt-0.5 flex items-center justify-between">
                <span>{moisturePercent}%</span>
                <Droplets className="w-3.5 h-3.5 text-[#E2136E]" />
              </div>
              <div className="text-[10px] text-emerald-600 font-normal mt-0.5">
                {isSafe ? (isBn ? 'ঝুঁকিমুক্ত ও উর্বর' : 'Optimal') : (isBn ? 'সেচ প্রয়োজন' : 'Stress')}
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
              <div className="text-[10px] text-slate-500 font-normal">
                {isBn ? 'স্যাটেলাইট স্বাস্থ্য সূচক' : 'Field Health Score'}
              </div>
              <div className="text-sm text-[#212121] font-normal mt-0.5 flex items-center justify-between">
                <span>৮৬ / ১০০</span>
                <Gauge className="w-3.5 h-3.5 text-[#E2136E]" />
              </div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                {isBn ? 'উচ্চ ফলন সম্ভাবনাময়' : 'High Yield Quality'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
