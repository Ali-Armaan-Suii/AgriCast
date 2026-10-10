import React, { useState } from 'react';
import { KhetDrishtiStatusPill } from './KhetDrishtiStatusPill';
import {
  EarlyWarningItem,
  FieldPlot,
  NasaTelemetry,
  PrescriptiveMitigation,
  TimelineDataPoint,
  WhatIfSimulation,
  WhyRootCauseItem,
} from '../types';
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Droplets,
  Flame,
  HelpCircle,
  Layers,
  LineChart,
  MapPin,
  Radar,
  Sliders,
  Sparkles,
  Sprout,
  Sun,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Waves,
  Wind,
} from 'lucide-react';

interface TheSevenModulesProps {
  plots: FieldPlot[];
  activePlot: FieldPlot;
  onSelectPlot: (plot: FieldPlot) => void;
  telemetry: NasaTelemetry;
  timeline: TimelineDataPoint[];
  earlyWarnings: EarlyWarningItem[];
  whyRootCause: WhyRootCauseItem;
  whatIfSim: WhatIfSimulation;
  onUpdateWhatIf: (tempOffset: number, rainMultiplier: number, delayDays: number) => void;
  prescriptions: PrescriptiveMitigation[];
  activeModuleIndex: number;
  onSelectModuleIndex: (idx: number) => void;
  language?: 'bn' | 'en';
  onOpenMapLocation?: () => void;
  onOpenCropCatalog?: () => void;
  onOpenFarmingRoadmap?: () => void;
}

export const TheSevenModules: React.FC<TheSevenModulesProps> = ({
  plots,
  activePlot,
  onSelectPlot,
  telemetry,
  timeline,
  earlyWarnings,
  whyRootCause,
  whatIfSim,
  onUpdateWhatIf,
  prescriptions,
  activeModuleIndex,
  onSelectModuleIndex,
  language = 'bn',
  onOpenMapLocation,
  onOpenCropCatalog,
  onOpenFarmingRoadmap,
}) => {
  const isBn = language === 'bn';

  // Local state for what-if sliders
  const [sliderTemp, setSliderTemp] = useState(2.0);
  const [sliderRain, setSliderRain] = useState(-30);
  const [sliderDelay, setSliderDelay] = useState(3);

  const handleSliderChange = (temp: number, rain: number, delay: number) => {
    setSliderTemp(temp);
    setSliderRain(rain);
    setSliderDelay(delay);
    onUpdateWhatIf(temp, rain, delay);
  };

  // 7 Core Modules Clean Navigation Tabs
  const moduleTabs = [
    { id: 0, label: isBn ? 'আমার জমি' : 'My Field', icon: Sprout },
    { id: 1, label: isBn ? 'জমির স্বাস্থ্য' : 'Field Health', icon: Activity },
    { id: 2, label: isBn ? 'টাইমলাইন ও নিসার' : 'Timeline & Radar', icon: LineChart },
    {
      id: 3,
      label: isBn ? 'জরুরি পূর্বাভাস' : 'Early Warning',
      icon: AlertTriangle,
      badge: earlyWarnings.length > 0 ? (isBn ? 'সতর্কতা' : 'Alert') : undefined,
    },
    { id: 4, label: isBn ? 'কেন? কারণ' : 'Why? Root-Cause', icon: HelpCircle },
    { id: 5, label: isBn ? 'হোয়াট-ইফ' : 'What-If Sim', icon: Sliders },
    { id: 6, label: isBn ? 'করণীয় পরামর্শ' : 'Actions & Roadmap', icon: CheckCircle2 },
  ];

  return (
    <div className="bg-white border border-[#FDE8F1] rounded-3xl p-3.5 sm:p-5 shadow-sm space-y-4 text-[#212121]">
      {/* 1. Clean Scrollable Module Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 border-b border-[#FDE8F1]">
        {moduleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModuleIndex === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectModuleIndex(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#E2136E] text-white font-medium shadow-xs'
                  : 'bg-[#F5F6F8] text-slate-700 hover:bg-[#FDE8F1] hover:text-[#E2136E]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Module Content Panels */}
      <div className="pt-1">
        {/* ========================================================
            MODULE 0: MY FIELD (আমার জমি ও সক্রিয় প্লট বিবরণী)
           ======================================================== */}
        {activeModuleIndex === 0 && (
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <h3 className="text-base sm:text-lg text-[#212121] flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FDE8F1] text-[#E2136E] flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-[#E2136E]" />
                </div>
                <span>{isBn ? 'জমির প্লট ও কৃষি বিবরণী' : 'Field Plots & Agronomic Profile'}</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {isBn
                  ? 'নাসার স্যাটেলাইট ফুটপ্রিন্ট এবং ফসলের ডেটা রিফ্রেশ করতে সক্রিয় প্লট সিলেক্ট করুন।'
                  : 'Select active plot to refresh NASA satellite telemetry and crop phenology models.'}
              </p>
            </div>

            {/* স্থানান্তরকৃত বাটনদ্বয়: ১. জমির অবস্থা দেখুন & ২. মাটির আর্দ্রতা ও স্যাটেলাইট স্কোর */}
            <div className="bg-gradient-to-br from-[#FFF5F8] via-white to-[#FDE8F1]/40 border-2 border-[#FAD2E1] rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col items-center justify-center text-center mb-3">
                <span className="text-[11px] text-[#E2136E] tracking-wider flex items-center gap-1.5 mb-1 font-normal">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isBn ? 'সরাসরি উপগ্রহ টেলিমেট্রি ও জমির স্ট্যাটাস' : 'Live Satellite Telemetry & Field Status'}
                </span>
                <h4 className="text-sm sm:text-base text-[#212121] font-normal">
                  {isBn ? 'আমার জমির তাৎক্ষণিক অবস্থা ও আর্দ্রতা সূচক' : 'Instant Field Soil Moisture & Health'}
                </h4>
              </div>

              {/* The Two Buttons Component */}
              <div className="flex justify-center w-full">
                <KhetDrishtiStatusPill
                  moisturePercent={
                    Math.round(
                      telemetry.smapSurfaceMoisture > 1
                        ? telemetry.smapSurfaceMoisture
                        : telemetry.smapSurfaceMoisture * 100
                    ) || 22
                  }
                  isSafe={
                    telemetry.smapMoistureStatus === 'OPTIMAL' ||
                    telemetry.smapMoistureStatus === 'MODERATE'
                  }
                  language={language}
                  variant="light"
                />
              </div>
            </div>

            {/* Plot Chips (Interactive state updates active plot on click) */}
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
              {plots.map((p) => {
                const isCurrent = p.id === activePlot.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPlot(p)}
                    className={`px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer border ${
                      isCurrent
                        ? 'bg-[#E2136E] text-white border-[#E2136E] shadow-md shadow-[#E2136E]/20 scale-102'
                        : 'bg-[#FDE8F1] text-[#E2136E] border-[#FAD2E1] hover:bg-[#FCE4EC]'
                    }`}
                  >
                    {isBn ? p.nameBn || p.name : p.name}
                  </button>
                );
              })}
            </div>

            {/* 3 Overview Bento Cards in Pure White & Soft Pink */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Card 1: ফসল ও জাত */}
              <div className="p-4 bg-white rounded-2xl border border-[#FDE8F1] shadow-xs hover:border-[#E2136E]/40 transition-colors">
                <div className="flex items-center justify-between text-[11px] text-[#E2136E]">
                  <span>{isBn ? 'ফসল ও জাত' : 'CROP & VARIETY'}</span>
                  <Sprout className="w-4 h-4 text-[#E2136E]" />
                </div>
                <div className="text-sm text-[#212121] mt-2">
                  {isBn ? activePlot.cropVarietyBn || activePlot.cropVariety : activePlot.cropVariety}
                </div>
                <div className="text-xs text-[#E2136E] mt-0.5">
                  {activePlot.cropType}
                </div>
                <div className="text-xs text-slate-600 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>{isBn ? 'বর্তমান পর্যায়:' : 'Growth Stage:'}</span>
                  <span className="text-[#212121]">
                    {isBn ? activePlot.growthStageBn || activePlot.growthStage : activePlot.growthStage}
                  </span>
                </div>
              </div>

              {/* Card 2: জমির আয়তন ও মাটির ধরন */}
              <div className="p-4 bg-white rounded-2xl border border-[#FDE8F1] shadow-xs hover:border-[#E2136E]/40 transition-colors">
                <div className="flex items-center justify-between text-[11px] text-[#E2136E]">
                  <span>{isBn ? 'জমির আয়তন ও মাটির ধরন' : 'LAND & SOIL TYPE'}</span>
                  <MapPin className="w-4 h-4 text-[#E2136E]" />
                </div>
                <div className="text-sm text-[#212121] mt-2">
                  {isBn ? activePlot.areaDisplayBn || `${activePlot.areaAcres} শতাংশ` : `${activePlot.areaAcres} Acres`}
                </div>
                <div className="text-xs text-slate-700 mt-0.5">
                  {isBn ? activePlot.soilClassificationBn || activePlot.soilClassification : activePlot.soilClassification}
                </div>
                <div className="text-xs text-slate-600 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>{isBn ? 'ক্যানোপি NDVI সূচক:' : 'Canopy NDVI:'}</span>
                  <span className="text-emerald-600 font-mono">
                    {activePlot.currentNdvi} ({isBn ? 'উচ্চ ফলনশীল' : 'Healthy'})
                  </span>
                </div>
              </div>

              {/* Card 3: বপন ও সম্ভাব্য কর্তন সময়সূচি */}
              <div className="p-4 bg-white rounded-2xl border border-[#FDE8F1] shadow-xs hover:border-[#E2136E]/40 transition-colors">
                <div className="flex items-center justify-between text-[11px] text-[#E2136E]">
                  <span>{isBn ? 'বপন ও কর্তন সময়সূচি' : 'CROP CYCLE SCHEDULE'}</span>
                  <Calendar className="w-4 h-4 text-[#E2136E]" />
                </div>
                <div className="text-xs text-slate-700 mt-2 flex items-center justify-between">
                  <span>{isBn ? 'বপনের তারিখ:' : 'Sown Date:'}</span>
                  <span className="text-[#212121] font-mono">{activePlot.sowingDate}</span>
                </div>
                <div className="text-xs text-slate-700 mt-1.5 flex items-center justify-between">
                  <span>{isBn ? 'সম্ভাব্য কর্তন:' : 'Projected Harvest:'}</span>
                  <span className="text-[#E2136E] font-mono">{activePlot.harvestProjected}</span>
                </div>
                <div className="text-xs text-slate-600 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>{isBn ? 'অবস্থান:' : 'Geo Perimeter:'}</span>
                  <span className="text-slate-800 truncate max-w-[130px]">
                    {activePlot.coordinates.locationName}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions for Module 0 */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {onOpenMapLocation && (
                <button
                  onClick={onOpenMapLocation}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#E2136E] hover:bg-[#C20F5D] text-white text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>ইন্টারেক্টিভ ম্যাপে জমি নির্ধারণ ও জিপিএস সেটআপ</span>
                </button>
              )}

              {onOpenCropCatalog && (
                <button
                  onClick={onOpenCropCatalog}
                  className="py-3 px-4 rounded-2xl bg-[#FDE8F1] hover:bg-[#FCE4EC] text-[#E2136E] text-xs transition-all border border-[#FAD2E1] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sprout className="w-4 h-4" />
                  <span>উপযুক্ত ফসল ক্যাটালগ দেখুন</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 1: FIELD HEALTH (জমির স্বাস্থ্য ও স্যাটেলাইট টেলিমেট্রি)
           ======================================================== */}
        {activeModuleIndex === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg text-[#212121] flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FDE8F1] text-[#E2136E] flex items-center justify-center">
                  <Layers className="w-5 h-5 text-[#E2136E]" />
                </div>
                <span>{isBn ? 'জমির স্বাস্থ্য ও উপগ্রহ পর্যবেক্ষণ' : 'Field Health & Satellite Telemetry'}</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {isBn
                  ? 'NASA SMAP, ECOSTRESS, GPM ও NISAR থেকে প্রাপ্ত সরাসরি সমন্বিত কৃষি ডেটা।'
                  : 'Consolidated real-time observations from NASA SMAP, ECOSTRESS, GPM, and NISAR.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* SMAP */}
              <div className="p-4 bg-white rounded-2xl border border-[#FDE8F1] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#E2136E]">
                  <span>{isBn ? 'মাটির আর্দ্রতা (SMAP)' : 'SOIL MOISTURE (SMAP)'}</span>
                  <Droplets className="w-4 h-4 text-[#E2136E]" />
                </div>
                <div className="text-2xl text-[#212121] mt-2 font-mono">
                  {(telemetry.smapSurfaceMoisture * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {isBn ? 'মূল অঞ্চল:' : 'Root-zone:'} {(telemetry.smapRootZoneMoisture * 100).toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  {isBn ? 'NASA L4 Radiometer 9km' : 'NASA L4 Radiometer 9km'}
                </div>
              </div>

              {/* ECOSTRESS */}
              <div className="p-4 bg-white rounded-2xl border border-[#FDE8F1] shadow-xs">
                <div className="flex items-center justify-between text-xs text-amber-600">
                  <span>{isBn ? 'ক্যানোপি তাপমাত্রা' : 'CANOPY TEMP'}</span>
                  <Thermometer className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl text-[#212121] mt-2 font-mono">
                  {telemetry.ecostressCanopyTempC}°C
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  ESI সূচক: {telemetry.ecostressEsi}
                </div>
                <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  ECOSTRESS ISS 70m
                </div>
              </div>

              {/* GPM */}
              <div className="p-4 bg-white rounded-2xl border border-[#FDE8F1] shadow-xs">
                <div className="flex items-center justify-between text-xs text-sky-600">
                  <span>{isBn ? 'বৃষ্টিপাত (GPM)' : 'RAINFALL (GPM)'}</span>
                  <Waves className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-2xl text-[#212121] mt-2 font-mono">
                  {telemetry.gpmAccumulated24hMm} মিমি
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  হার: {telemetry.gpmPrecipRateMmHr} মিমি/ঘণ্টা
                </div>
                <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  GPM IMERG Early Run
                </div>
              </div>

              {/* NISAR */}
              <div className="p-4 bg-white rounded-2xl border border-[#FDE8F1] shadow-xs">
                <div className="flex items-center justify-between text-xs text-purple-600">
                  <span>{isBn ? 'নিসার রাডার কোহেরেন্স' : 'NISAR RADAR'}</span>
                  <Radar className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl text-[#212121] mt-2 font-mono">
                  {(telemetry.nisarLbandCoherence * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {isBn ? 'ভূগর্ভস্থ:' : 'Subsurface:'} {telemetry.nisarSubsurfaceMoisturePct}%
                </div>
                <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  NISAR 12-Day SAR Cycle
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 2: TIMELINE & NISAR (টাইমলাইন ও নিসার রাডার প্রবণতা)
           ======================================================== */}
        {activeModuleIndex === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg text-[#212121] flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FDE8F1] text-[#E2136E] flex items-center justify-center">
                  <LineChart className="w-5 h-5 text-[#E2136E]" />
                </div>
                <span>{isBn ? 'টাইমলাইন ও নিসার রাডার প্রবণতা' : 'Field Timeline & NISAR Trend Tracking'}</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {isBn
                  ? 'বিগত ৭ দিনের মাটির আর্দ্রতা, বৃষ্টিপাত এবং নিসার এল-ব্যান্ড রাডার পরিবর্তনের ধারা।'
                  : '7-day historical soil moisture, rainfall events, and NISAR L-band subsurface tracking.'}
              </p>
            </div>

            {/* Timeline bars */}
            <div className="p-4 bg-white rounded-2xl border border-[#FDE8F1] shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                <span>{isBn ? 'তারিখ' : 'Date'}</span>
                <span>{isBn ? 'আর্দ্রতা (%)' : 'Moisture (%)'}</span>
                <span>{isBn ? 'বৃষ্টিপাত' : 'Rain'}</span>
                <span>{isBn ? 'নিসার কোহেরেন্স' : 'NISAR Coherence'}</span>
              </div>

              {timeline.map((point) => (
                <div key={point.date} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-none">
                  <span className="text-slate-700">{point.date.slice(5)}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#E2136E] h-full rounded-full"
                        style={{ width: `${Math.min(100, point.smapMoisture * 2.5)}%` }}
                      />
                    </div>
                    <span className="text-[#212121] font-mono">{point.smapMoisture}%</span>
                  </div>
                  <span className="text-slate-600 font-mono">{point.gpmRainfall} মিমি</span>
                  <span className="text-purple-700 font-mono">{point.nisarSubsurfacePct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 3: EARLY WARNING (সতর্কবার্তা ও ঝুঁকি বিশ্লেষণ)
           ======================================================== */}
        {activeModuleIndex === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg text-[#212121] flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <span>{isBn ? 'সতর্কবার্তা ও আগাম ঝুঁকি বিশ্লেষণ' : 'Early Warning & Risk Alerts'}</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {isBn
                  ? 'কৃষি ক্ষতি রোধে নাসা আর্থ সায়েন্স ভিত্তিক আগাম সতর্কবার্তা।'
                  : 'Actionable distress cards for drought, heat stress, disease, and nearby fires.'}
              </p>
            </div>

            <div className="space-y-3">
              {/* Highlighted localized alerts */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 shadow-xs flex items-start gap-3">
                <div className="p-2 bg-rose-500 text-white rounded-xl shrink-0 mt-0.5">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-600 text-white">
                      {isBn ? 'উচ্চ ঝুঁকি' : 'HIGH RISK'}
                    </span>
                    <h4 className="text-sm text-rose-950">
                      {isBn ? 'পানি ঘাটতির ঝুঁকি বাড়ছে (Water Stress Risk)' : 'Water Deficit Stress Emerging'}
                    </h4>
                  </div>
                  <p className="text-xs text-rose-800 mt-1">
                    {isBn
                      ? 'মাটির আর্দ্রতা: ১৮% (সেচ প্রয়োজন)। শিকড় অঞ্চলে পানির পরিমাণ হ্রাস পেয়েছে।'
                      : 'Soil moisture is at 18% (Irrigation needed). Root-zone water content depleted.'}
                  </p>
                  <p className="text-xs text-rose-700 mt-0.5">
                    {isBn
                      ? '⚠️ আগামী ৪৮ ঘণ্টায় বৃষ্টির সম্ভাবনা নেই - তিস্তা সেচ ক্যানেল বা ড্রিপ সেচ দিন।'
                      : '⚠️ No precipitation expected in the next 48 hours - Initiate irrigation cycle.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs flex items-start gap-3">
                <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-600 text-white">
                      {isBn ? 'মাঝারি ঝুঁকি' : 'MODERATE'}
                    </span>
                    <h4 className="text-sm text-amber-950">
                      {isBn ? 'উচ্চ ক্যানোপি তাপমাত্রা ও বাষ্পীভবন' : 'High Canopy Heat & Evaporative Loss'}
                    </h4>
                  </div>
                  <p className="text-xs text-amber-800 mt-1">
                    {isBn
                      ? 'ECOSTRESS পরিমাপ অনুসারে গাছের উপরিভাগের তাপমাত্রা ৩১.৫°সে ছাড়িয়েছে।'
                      : 'Canopy surface temperatures approaching threshold during midday.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs flex items-start gap-3">
                <div className="p-2 bg-emerald-500 text-white rounded-xl shrink-0 mt-0.5">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                      {isBn ? 'স্বাভাবিক' : 'SAFE'}
                    </span>
                    <h4 className="text-sm text-emerald-950">
                      {isBn ? 'খড় পোড়ানো / আগুন ঝুঁকি: নিরাপদ' : 'MODIS/VIIRS Active Fire Hotspots: Clear'}
                    </h4>
                  </div>
                  <p className="text-xs text-emerald-800 mt-1">
                    {isBn
                      ? 'প্লটের ৫ কিমি ব্যাসার্ধে কোনো সক্রিয় আগুন বা নাড়া পোড়ানোর ঘটনা নেই।'
                      : 'Zero thermal anomalies detected within a 5km radius by Suomi-NPP VIIRS.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 4: WHY? ROOT CAUSE (কেন? কারণ বিশ্লেষণ)
           ======================================================== */}
        {activeModuleIndex === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg text-[#212121] flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FDE8F1] text-[#E2136E] flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-[#E2136E]" />
                </div>
                <span>{isBn ? 'কেন? কারণ বিশ্লেষণ (Root-Cause)' : 'Why? Multi-Satellite Explainability'}</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {isBn
                  ? 'একাধিক স্যাটেলাইটের সমন্বিত ডেটা বিশ্লেষণ করে ফসলের সমস্যার মূল কারণ নির্ণয়।'
                  : 'Automated diagnostic tree correlating weather, moisture, and vegetation stress.'}
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#FDE8F1] shadow-xs space-y-3">
              <div className="p-3 bg-[#FDE8F1] rounded-xl text-xs text-[#E2136E]">
                {isBn
                  ? 'প্রাথমিক নির্ণয়: কম বৃষ্টিপাত (GPM ০ মিমি) + উচ্চ তাপমাত্রা = মাটির আর্দ্রতা ঘাটতি (SMAP ১৮%)'
                  : 'Primary Diagnosis: Zero Rainfall (GPM 0mm) + Heat = Volumetric Soil Moisture Deficit'}
              </div>

              <div className="text-xs text-slate-700 leading-relaxed space-y-2 pt-1">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[#E2136E] shrink-0 text-[10px]">১</span>
                  <p>
                    {isBn
                      ? 'NASA GPM উপগ্রহ গত ৫ দিনে তিস্তা ও বরেন্দ্র অববাহিকায় কোনো উল্লেখযোগ্য বৃষ্টিপাত রেকর্ড করেনি।'
                      : 'NASA GPM recorded 0mm cumulative rainfall over the past 5 days in the region.'}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[#E2136E] shrink-0 text-[10px]">২</span>
                  <p>
                    {isBn
                      ? 'ECOSTRESS থেকে প্রাপ্ত ক্যানোপি তাপমাত্রা বেশি থাকায় পানির বাষ্পীভবনের হার বেড়েছে।'
                      : 'ECOSTRESS shows elevated leaf transpiration exceeding the soil recharge rate.'}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[#E2136E] shrink-0 text-[10px]">৩</span>
                  <p>
                    {isBn
                      ? 'NISAR এল-ব্যান্ড রাডারে মাটির গভীরে আর্দ্রতা এখনও ২৪% থাকায় গাছ বেঁচে আছে, তবে উপরের স্তর শুষ্ক।'
                      : 'NISAR L-band confirms root-zone reserves remain at 24%, buffering against immediate wilt.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 5: WHAT-IF SIMULATOR (সিমুলেশন ও ভবিষ্যতের পূর্বাভাস)
           ======================================================== */}
        {activeModuleIndex === 5 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg text-[#212121] flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FDE8F1] text-[#E2136E] flex items-center justify-center">
                  <Sliders className="w-5 h-5 text-[#E2136E]" />
                </div>
                <span>{isBn ? 'হোয়াট-ইফ সিমুলেটর (What-If Simulation)' : 'What-If Interactive Climate Simulator'}</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {isBn
                  ? 'স্লাইডার ঘুরিয়ে তাপমাত্রা, বৃষ্টি এবং সেচ দেরির প্রভাব তাৎক্ষণিক পরীক্ষা করুন।'
                  : 'Slide weather deviations to project future moisture depletion and crop stress index.'}
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#FDE8F1] shadow-xs space-y-4">
              {/* Sliders */}
              <div className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#212121] mb-1">
                    <span>{isBn ? 'তাপমাত্রা বাড়লে (+৩°C)' : 'Temperature Offset (+3°C)'}</span>
                    <span className="text-[#E2136E] font-mono">+{sliderTemp}°C</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="0.5"
                    value={sliderTemp}
                    onChange={(e) => handleSliderChange(parseFloat(e.target.value), sliderRain, sliderDelay)}
                    className="w-full accent-[#E2136E] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-[#212121] mb-1">
                    <span>{isBn ? 'বৃষ্টিপাত কমলে (-৫০%)' : 'Rainfall Variation (-50%)'}</span>
                    <span className="text-[#E2136E] font-mono">{sliderRain}%</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    step="10"
                    value={sliderRain}
                    onChange={(e) => handleSliderChange(sliderTemp, parseFloat(e.target.value), sliderDelay)}
                    className="w-full accent-[#E2136E] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-[#212121] mb-1">
                    <span>{isBn ? 'সেচ দিতে বিলম্ব' : 'Irrigation Delay Days'}</span>
                    <span className="text-[#E2136E] font-mono">{sliderDelay} {isBn ? 'দিন' : 'Days'}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="7"
                    step="1"
                    value={sliderDelay}
                    onChange={(e) => handleSliderChange(sliderTemp, sliderRain, parseInt(e.target.value, 10))}
                    className="w-full accent-[#E2136E] cursor-pointer"
                  />
                </div>
              </div>

              {/* Dynamic ঝুঁকি মিটার (Risk Meter) */}
              <div className="p-4 rounded-xl bg-[#FDE8F1] border border-[#FAD2E1] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-[#E2136E] uppercase tracking-wide">
                    {isBn ? 'ঝুঁকি মিটার (Risk Meter)' : 'Risk Meter'}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] ${
                      sliderTemp > 3 || sliderRain < -40 || sliderDelay > 3
                        ? 'bg-rose-600 text-white'
                        : sliderTemp > 1.5 || sliderRain < -20 || sliderDelay > 1
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {sliderTemp > 3 || sliderRain < -40 || sliderDelay > 3
                      ? isBn ? 'উচ্চ পানি ঘাটতি (High Stress)' : 'High Stress'
                      : sliderTemp > 1.5 || sliderRain < -20 || sliderDelay > 1
                      ? isBn ? 'মাঝারি ঝুঁকি (Moderate)' : 'Moderate'
                      : isBn ? 'নিরাপদ (Safe)' : 'Safe'}
                  </span>
                </div>

                {/* Visual bar */}
                <div className="w-full bg-white h-3 rounded-full overflow-hidden p-0.5 border border-[#FAD2E1]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      sliderTemp > 3 || sliderRain < -40 || sliderDelay > 3
                        ? 'bg-rose-600'
                        : sliderTemp > 1.5 || sliderRain < -20 || sliderDelay > 1
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(15, (sliderTemp * 10 - sliderRain * 0.4 + sliderDelay * 8))
                      )}%`,
                    }}
                  />
                </div>

                <div className="text-xs text-[#212121] flex justify-between pt-1">
                  <span>{isBn ? 'প্রত্যাশিত মাটির আর্দ্রতা:' : 'Projected Moisture:'}</span>
                  <span className="text-[#E2136E] font-mono">
                    {Math.max(8, Math.min(38, +(22 - sliderTemp * 1.1 + sliderRain * 0.08 - sliderDelay * 1.2).toFixed(1)))}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 6: WHAT SHOULD I DO? (করণীয় ও প্রেসক্রিপশন)
           ======================================================== */}
        {activeModuleIndex === 6 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg text-[#212121] flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FDE8F1] text-[#E2136E] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#E2136E]" />
                </div>
                <span>{isBn ? 'করণীয় পরামর্শ ও কৃষি প্রেসক্রিপশন' : 'Actionable Prescriptions (What Should I Do?)'}</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {isBn
                  ? 'মাটির আর্দ্রতা ও আবহাওয়ার ভিত্তিতে বিজ্ঞানসম্মত করণীয় পদক্ষেপ।'
                  : 'Tailored agronomic mitigation actions prioritized by NASA soil risk level.'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-[#FDE8F1] shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#FDE8F1] text-[#E2136E] shrink-0 mt-0.5">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#E2136E] text-white">
                      {isBn ? 'জরুরি' : 'CRITICAL'}
                    </span>
                    <h4 className="text-sm text-[#212121]">
                      {isBn ? 'আজ সূর্যাস্তের পর ১৮ মিমি ড্রিপ বা নিয়ন্ত্রিত সেচ দিন' : 'Deliver 18mm Irrigation After Sundown'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {isBn
                      ? 'বাষ্পীভবন এড়াতে রাতে সেচ দিন। তিস্তা নদী ও বরেন্দ্র অঞ্চলে পানি অপচয় রোধে প্লাবন সেচ এড়িয়ে চলুন।'
                      : 'Irrigate during low-evaporative evening hours to conserve water.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#FDE8F1] shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#FDE8F1] text-[#E2136E] shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#FDE8F1] text-[#E2136E]">
                      {isBn ? 'পরামর্শ' : 'ADVICE'}
                    </span>
                    <h4 className="text-sm text-[#212121]">
                      {isBn ? 'পটাশ ও দস্তা স্প্রে করে হিট স্ট্রেস হ্রাস করুন' : 'Apply MOP Foliar Spray For Heat Tolerance'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {isBn
                      ? 'দানা গঠন পর্যায়ে উচ্চ তাপমাত্রা মোকাবিলায় ১% মিউরেট অব পটাশ স্প্রে ফসলের প্রতিরোধ ক্ষমতা বাড়াবে।'
                      : 'Foliar potassium application stabilizes plant stomatal conductance under high VPD.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#FDE8F1] shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#FDE8F1] text-[#E2136E] shrink-0 mt-0.5">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#FDE8F1] text-[#E2136E]">
                      {isBn ? 'সতর্কতা' : 'NOTE'}
                    </span>
                    <h4 className="text-sm text-[#212121]">
                      {isBn ? 'পানি নিষ্কাশন নালা পরিষ্কার রাখুন' : 'Inspect Drainage Ditches'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {isBn
                      ? 'আগামী সপ্তাহে কালবৈশাখীর সম্ভাব্য বৃষ্টিপাত বিবেচনায় নিষ্কাশন ব্যবস্থা প্রস্তুত রাখুন।'
                      : 'Ensure drainage canals are cleared before potential convective storms.'}
                  </p>
                </div>
              </div>

              {onOpenFarmingRoadmap && (
                <div className="pt-2">
                  <button
                    onClick={onOpenFarmingRoadmap}
                    className="w-full py-3 px-4 rounded-2xl bg-[#E2136E] hover:bg-[#C20F5D] text-white text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ধাপভিত্তিক চাষাবাদ ইঞ্জিন ও সুষম সার ক্যালকুলেটর খুলুন</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
