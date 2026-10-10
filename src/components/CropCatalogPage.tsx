import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  Droplets,
  Layers,
  MapPin,
  Search,
  Sparkles,
  Sprout,
} from 'lucide-react';
import { BANGLADESH_CROPS, CropVarietyInfo } from '../data/bangladeshAgriData';
import { FieldPlot } from '../types';

interface CropCatalogPageProps {
  activePlot: FieldPlot;
  onBack: () => void;
  onSelectCrop: (crop: CropVarietyInfo) => void;
}

export const CropCatalogPage: React.FC<CropCatalogPageProps> = ({
  activePlot,
  onBack,
  onSelectCrop,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterChips = [
    { id: 'all', label: 'সব ফসল' },
    { id: 'cereal', label: 'দানাশস্য' },
    { id: 'pulse_oil', label: 'ডাল ও তেলবীজ' },
    { id: 'vegetable_spice', label: 'শাকসবজি ও মসলা' },
    { id: 'cash_crop', label: 'অর্থকরী ফসল' },
  ];

  // Dynamic suitability adjustment based on active soil
  const calculatePlotSuitability = (crop: CropVarietyInfo) => {
    let score = crop.baseSuitability;
    const soil = (activePlot.soilClassificationBn || activePlot.soilClassification || '').toLowerCase();

    if (crop.category === 'cereal' && (soil.includes('পলি') || soil.includes('দোআঁশ'))) {
      score = Math.min(99, score + 2);
    }
    if (crop.id === 'crop-potato' && (soil.includes('বেলে') || soil.includes('দোআঁশ'))) {
      score = Math.min(98, score + 3);
    }
    if (crop.id === 'crop-lentil' && soil.includes('এঁটেল')) {
      score = Math.max(82, score - 5);
    }
    return score;
  };

  const filteredCrops = BANGLADESH_CROPS.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.nameBn.includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.scientificName.toLowerCase().includes(q) ||
      c.varieties.some((v) => v.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#F5F6F8] text-[#212121] flex flex-col font-sans pb-12">
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
            <h1 className="text-base font-normal text-[#212121]">উপযুক্ত ফসল ক্যাটালগ</h1>
            <p className="text-[11px] text-slate-500 font-normal">
              মাটি ও আবহাওয়া উপযোগী ফসল নির্বাচন
            </p>
          </div>
        </div>

        <span className="text-[10px] font-normal px-2.5 py-1 rounded-full bg-[#FDE8F1] text-[#E2136E]">
          {filteredCrops.length}টি ফসল তালিকাভুক্ত
        </span>
      </div>

      <div className="max-w-md sm:max-w-lg mx-auto w-full px-3 sm:px-4 py-4 space-y-4">
        {/* Active Plot Soil Context Banner */}
        <div className="bg-gradient-to-r from-[#FDE8F1] to-white border border-[#FAD2E1] rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E2136E] text-white flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-xs font-normal text-[#212121] block">
                সক্রিয় প্লট: {activePlot.nameBn || activePlot.name}
              </span>
              <span className="text-[10px] text-slate-600 block font-normal">
                মাটি: {activePlot.soilClassificationBn || activePlot.soilClassification}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-normal bg-white text-[#E2136E] px-2 py-0.5 rounded-full border border-[#FDE8F1]">
            রিয়েল-টাইম ম্যাচ
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white rounded-2xl px-3.5 py-2.5 border border-[#FDE8F1] shadow-xs focus-within:border-[#E2136E] transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ফসলের নাম বা জাত খুঁজুন (যেমন: ব্রি ধান-২৮, বারি গম-৩৩)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-[#212121] font-normal placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-1 font-normal"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {filterChips.map((chip) => {
            const isSelected = selectedCategory === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedCategory(chip.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-normal whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#E2136E] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-[#FDE8F1] hover:bg-[#FDE8F1] hover:text-[#E2136E]'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Crops List */}
        <div className="space-y-3.5">
          {filteredCrops.map((crop) => {
            const suitability = calculatePlotSuitability(crop);

            return (
              <div
                key={crop.id}
                className="bg-white rounded-3xl border border-[#FDE8F1] shadow-xs overflow-hidden hover:shadow-md transition-all group"
              >
                {/* Crop Hero Banner with Image */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                  <img
                    src={crop.imageUrl}
                    alt={crop.nameBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Season Badge Top Right */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-normal bg-white/90 backdrop-blur-xs text-[#212121] shadow-xs border border-white/40">
                      {crop.season}
                    </span>
                  </div>

                  {/* Suitability Score Pill Top Left */}
                  <div className="absolute top-2.5 left-2.5">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E2136E] text-white text-[11px] font-normal shadow-md">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>উপযোগিতা: {suitability}%</span>
                    </div>
                  </div>

                  {/* Crop Names on Image Bottom */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-base font-normal drop-shadow-sm">{crop.nameBn}</h3>
                      <span className="text-xs text-white/80 font-normal">({crop.nameEn})</span>
                    </div>
                    <span className="text-[10px] text-white/70 italic font-normal block">
                      {crop.scientificName}
                    </span>
                  </div>
                </div>

                {/* Crop Specs & Details */}
                <div className="p-4 space-y-3">
                  {/* Recommended Varieties */}
                  <div>
                    <span className="text-[10px] font-normal text-slate-500 uppercase tracking-wider block mb-1">
                      জনপ্রিয় ও প্রত্যয়িত জাতসমূহ:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {crop.varieties.map((v, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-[#F5F6F8] text-[10px] font-normal text-[#212121] border border-slate-200"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                    <div className="bg-[#F5F6F8] rounded-xl p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-normal mb-0.5">
                        <Clock className="w-3 h-3 text-[#E2136E]" />
                        <span>জীবনকাল</span>
                      </div>
                      <span className="text-[11px] font-normal text-[#212121] block">
                        {crop.durationDays}
                      </span>
                    </div>

                    <div className="bg-[#F5F6F8] rounded-xl p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-normal mb-0.5">
                        <Droplets className="w-3 h-3 text-[#E2136E]" />
                        <span>সেচ চাহিদা</span>
                      </div>
                      <span className="text-[11px] font-normal text-[#212121] block">
                        {crop.waterDemandMm}
                      </span>
                    </div>

                    <div className="bg-[#F5F6F8] rounded-xl p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-normal mb-0.5">
                        <Layers className="w-3 h-3 text-[#E2136E]" />
                        <span>মাটি পছন্দ</span>
                      </div>
                      <span className="text-[10px] font-normal text-[#212121] truncate block">
                        দোআঁশ/পলি
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-1">
                    <button
                      onClick={() => onSelectCrop(crop)}
                      className="w-full py-2.5 rounded-xl bg-[#E2136E] hover:bg-[#C20F5D] text-white text-xs font-normal transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>এই ফসল নির্বাচন ও ধাপভিত্তিক গাইড দেখুন</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
