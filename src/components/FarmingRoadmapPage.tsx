import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Calculator,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  Flame,
  Home,
  Info,
  MapPin,
  Pill,
  ShieldAlert,
  Sparkles,
  Sprout,
  Volume2,
} from 'lucide-react';
import { CropVarietyInfo } from '../data/bangladeshAgriData';
import { FieldPlot, NasaTelemetry } from '../types';

interface FarmingRoadmapPageProps {
  crop: CropVarietyInfo;
  activePlot: FieldPlot;
  telemetry: NasaTelemetry;
  onBack: () => void;
  onGoHome: () => void;
  onSpeak: (text: string) => void;
}

export const FarmingRoadmapPage: React.FC<FarmingRoadmapPageProps> = ({
  crop,
  activePlot,
  telemetry,
  onBack,
  onGoHome,
  onSpeak,
}) => {
  const [activeStageTab, setActiveStageTab] = useState<number>(0);
  const [landBigha, setLandBigha] = useState<number>(1.0);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleTask = (taskKey: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskKey]: !prev[taskKey],
    }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const currentStage = crop.stages[activeStageTab] || crop.stages[0];

  // Dynamic fertilizer calculation based on land size
  const fert = crop.fertilizerPerBigha;
  const calcUrea = (fert.ureaKg * landBigha).toFixed(1);
  const calcTsp = (fert.tspKg * landBigha).toFixed(1);
  const calcMop = (fert.mopKg * landBigha).toFixed(1);
  const calcGypsum = (fert.gypsumKg * landBigha).toFixed(1);
  const calcZinc = (fert.zincKg * landBigha).toFixed(1);
  const calcBoron = fert.boronKg ? (fert.boronKg * landBigha).toFixed(1) : null;
  const calcCowdung = (fert.cowdungKg * landBigha).toFixed(0);

  const handleSpeakCurrentStage = () => {
    const text = `${crop.nameBn} চাষের ধাপ ${activeStageTab + 1}: ${currentStage.titleBn}। ${currentStage.descriptionBn}। সেচ পরামর্শ: ${currentStage.irrigationNoteBn}`;
    onSpeak(text);
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F6F8] text-[#212121] flex flex-col font-sans pb-16">
      {/* 1. Header with bKash Pink Accent & Back Button */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#FDE8F1] shadow-xs px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-[#FDE8F1] text-[#E2136E] flex items-center justify-center hover:bg-[#FCE4EC] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-[#E2136E]" />
          </button>
          <div>
            <h1 className="text-base font-normal text-[#212121] flex items-center gap-1.5">
              ধাপভিত্তিক চাষাবাদ ও কৃষি পরামর্শ
            </h1>
            <p className="text-[11px] text-slate-500 font-normal">
              {crop.nameBn} • বৈজ্ঞানিক এগ্রোনমিক রোডম্যাপ
            </p>
          </div>
        </div>

        <button
          onClick={handleSpeakCurrentStage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDE8F1] text-[#E2136E] text-xs font-normal hover:bg-[#FCE4EC] transition-all cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-[#E2136E]" />
          <span className="hidden sm:inline">ভয়েস গাইড</span>
        </button>
      </div>

      <div className="max-w-md sm:max-w-lg mx-auto w-full px-3 sm:px-4 py-4 space-y-4">
        {/* Selected Crop Profile Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#FDE8F1] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={crop.imageUrl}
              alt={crop.nameBn}
              className="w-14 h-14 rounded-2xl object-cover border border-[#FDE8F1] shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-normal text-[#212121]">{crop.nameBn}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FDE8F1] text-[#E2136E] font-normal">
                  {crop.season}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                প্লট: {activePlot.nameBn || activePlot.name} • {crop.durationDays}
              </p>
              <p className="text-[10px] text-slate-400 font-normal">
                মাটি: {activePlot.soilClassificationBn || activePlot.soilClassification}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-normal block">উপযোগিতা স্কোর</span>
            <span className="text-base font-normal text-[#E2136E]">
              {crop.baseSuitability}%
            </span>
          </div>
        </div>

        {/* 6 Stage Navigation Horizontal Pills */}
        <div className="bg-white rounded-3xl p-3 border border-[#FDE8F1] shadow-xs space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-normal text-[#E2136E] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E2136E] animate-ping" />
              ফসলের ৬টি প্রধান ধাপ
            </span>
            <span className="text-[11px] text-slate-500 font-normal">ধাপ {activeStageTab + 1} / ৬</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {crop.stages.map((stage, idx) => {
              const isActive = activeStageTab === idx;
              return (
                <button
                  key={stage.stageNumber}
                  onClick={() => setActiveStageTab(idx)}
                  className={`px-3 py-2 rounded-2xl text-xs font-normal whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#E2136E] text-white shadow-xs'
                      : 'bg-[#F5F6F8] text-slate-700 hover:bg-[#FDE8F1] hover:text-[#E2136E]'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-normal ${
                      isActive ? 'bg-white text-[#E2136E]' : 'bg-slate-300 text-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span>{stage.titleBn.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detail Container */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#FDE8F1] shadow-xs space-y-4">
          {/* Stage Header */}
          <div className="border-b border-[#FDE8F1] pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-normal text-[#E2136E] bg-[#FDE8F1] px-2.5 py-0.5 rounded-full">
                ধাপ {currentStage.stageNumber}: {currentStage.dayRange}
              </span>
              <span className="text-[10px] font-normal text-slate-500">
                সময়সীমা: {currentStage.dayRange}
              </span>
            </div>
            <h3 className="text-base font-normal text-[#212121] mt-1">
              {currentStage.titleBn}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
              {currentStage.descriptionBn}
            </p>
          </div>

          {/* Actionable Tasks Checklist */}
          <div>
            <h4 className="text-xs font-normal text-[#212121] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#E2136E]" />
              এই ধাপের করণীয় কাজসমূহ (চেকলিস্ট)
            </h4>

            <div className="space-y-2">
              {currentStage.tasksBn.map((task, tIdx) => {
                const key = `${crop.id}-s${activeStageTab}-t${tIdx}`;
                const isChecked = !!completedTasks[key];

                return (
                  <button
                    key={tIdx}
                    onClick={() => toggleTask(key)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-700'
                        : 'bg-[#F5F6F8] border-[#FDE8F1] hover:border-[#E2136E] text-[#212121]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs leading-relaxed ${
                        isChecked ? 'line-through text-slate-400' : 'font-normal'
                      }`}
                    >
                      {task}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* NASA Weather Synchronized Irrigation Advisory */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-3.5 border border-blue-200/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-normal text-blue-900">
                    স্মার্ট সেচ সূচি (NASA SMAP সিঙ্ক)
                  </h4>
                  <span className="text-[10px] text-blue-700 font-normal">
                    মাটির বর্তমান আর্দ্রতা: {Math.round(telemetry.smapSurfaceMoisture * 100)}% (SMAP)
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                {telemetry.smapSurfaceMoisture < 0.2 ? 'সেচ প্রয়োজন' : 'পর্যাপ্ত আর্দ্রতা'}
              </span>
            </div>
            <p className="text-xs text-blue-950 leading-relaxed font-normal">
              {currentStage.irrigationNoteBn}
            </p>
          </div>

          {/* Pest & Disease Scouting Warning */}
          <div className="bg-gradient-to-br from-rose-50 to-amber-50/40 rounded-2xl p-3.5 border border-rose-200 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xs font-normal text-rose-900">
                বালাই ও রোগবালাই প্রতিরোধ ব্যবস্থা
              </h4>
            </div>

            <ul className="space-y-1 text-xs text-rose-950 font-normal">
              {currentStage.pestWarningsBn.map((pest, pIdx) => (
                <li key={pIdx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>{pest}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dynamic Balanced Fertilizer Calculator Container */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#FDE8F1] shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#FDE8F1] pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FDE8F1] text-[#E2136E] flex items-center justify-center">
                <Calculator className="w-4 h-4 text-[#E2136E]" />
              </div>
              <div>
                <h3 className="text-xs font-normal text-[#212121]">
                  সুষম সার ক্যালকুলেটর (বিঘাভিত্তিক ডোজ)
                </h3>
                <p className="text-[10px] text-slate-500 font-normal">
                  BARC ও ব্রি/বারি অনুমোদিত সুষম সার সুপারিশ
                </p>
              </div>
            </div>
          </div>

          {/* Land Size Input Slider & Number Input */}
          <div className="bg-[#F5F6F8] rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-normal text-[#212121]">
                জমির পরিমাণ (বিঘা হিসেবে)
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="50"
                  value={landBigha}
                  onChange={(e) => setLandBigha(Math.max(0.1, Number(e.target.value)))}
                  className="w-16 bg-white border border-[#FDE8F1] rounded-lg px-2 py-1 text-xs font-normal text-center text-[#E2136E] focus:outline-none"
                />
                <span className="text-xs font-normal text-slate-600">বিঘা</span>
              </div>
            </div>

            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={landBigha}
              onChange={(e) => setLandBigha(Number(e.target.value))}
              className="w-full accent-[#E2136E] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono font-normal">
              <span>০.৫ বিঘা</span>
              <span>৫ বিঘা</span>
              <span>১০ বিঘা</span>
            </div>
          </div>

          {/* Calculated Fertilizer Doses Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="bg-[#FDE8F1]/40 border border-[#FAD2E1] rounded-2xl p-2.5 text-center">
              <span className="text-[10px] font-normal text-slate-600 block">ইউরিয়া (Urea)</span>
              <span className="text-sm font-normal text-[#E2136E] mt-0.5 block">
                {calcUrea} কেজি
              </span>
              <span className="text-[9px] text-slate-500 font-normal">৩ কিস্তিতে প্রয়োগ</span>
            </div>

            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-2.5 text-center">
              <span className="text-[10px] font-normal text-slate-600 block">টিএসপি / ডিএপি</span>
              <span className="text-sm font-normal text-amber-800 mt-0.5 block">
                {calcTsp} কেজি
              </span>
              <span className="text-[9px] text-slate-500 font-normal">শেষ চাষের সময়</span>
            </div>

            <div className="bg-red-50/50 border border-red-200 rounded-2xl p-2.5 text-center">
              <span className="text-[10px] font-normal text-slate-600 block">এমওপি (পটাশ)</span>
              <span className="text-sm font-normal text-red-800 mt-0.5 block">
                {calcMop} কেজি
              </span>
              <span className="text-[9px] text-slate-500 font-normal">শিকড় ও রোগ প্রতিরোধ</span>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-2.5 text-center">
              <span className="text-[10px] font-normal text-slate-600 block">জিপসাম (গন্ধক)</span>
              <span className="text-sm font-normal text-emerald-800 mt-0.5 block">
                {calcGypsum} কেজি
              </span>
              <span className="text-[9px] text-slate-500 font-normal">মাটির ক্ষার নিয়ন্ত্রণ</span>
            </div>

            <div className="bg-purple-50/50 border border-purple-200 rounded-2xl p-2.5 text-center">
              <span className="text-[10px] font-normal text-slate-600 block">জিংক সালফেট</span>
              <span className="text-sm font-normal text-purple-800 mt-0.5 block">
                {calcZinc} কেজি
              </span>
              <span className="text-[9px] text-slate-500 font-normal">দস্তা ঘাটতি রোধে</span>
            </div>

            <div className="bg-slate-100 rounded-2xl p-2.5 text-center">
              <span className="text-[10px] font-normal text-slate-600 block">পচা গোবর/কম্পোস্ট</span>
              <span className="text-sm font-normal text-slate-800 mt-0.5 block">
                {calcCowdung} কেজি
              </span>
              <span className="text-[9px] text-slate-500 font-normal">মাটির স্বাস্থ্য সুরক্ষা</span>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="space-y-2 pt-2">
          <div className="flex gap-2">
            <button
              onClick={() => showToast('আজকের ৩টি করণীয় কাজের রিমাইন্ডার সক্রিয় করা হয়েছে!')}
              className="flex-1 py-3 rounded-2xl bg-[#E2136E] hover:bg-[#C20F5D] text-white font-normal text-xs shadow-md shadow-[#E2136E]/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>আজকের করণীয় চেক করুন</span>
            </button>

            <button
              onClick={() => showToast('আগামী ২৪ ঘণ্টার সেচ নোটিফিকেশন এসএমএস/ইনবক্সে যুক্ত হয়েছে!')}
              className="px-4 py-3 rounded-2xl bg-[#FDE8F1] hover:bg-[#FCE4EC] text-[#E2136E] font-normal text-xs border border-[#FAD2E1] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Droplets className="w-4 h-4" />
              <span>সেচ রিমাইন্ডার</span>
            </button>
          </div>

          <button
            onClick={onGoHome}
            className="w-full py-2.5 rounded-2xl bg-white border border-[#FDE8F1] hover:bg-[#FDE8F1] text-slate-700 hover:text-[#E2136E] font-normal text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>মূল ড্যাশবোর্ডে ফিরে যান</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-[#212121] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-normal border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
