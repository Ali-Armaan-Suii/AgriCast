import React from 'react';
import { BestFarmingWindow, GeoCoordinates, NasaPowerDayForecast } from '../types';
import { CloudRain, Compass, Droplets, MapPin, RefreshCw, Sun, Wind, Zap } from 'lucide-react';

interface WeatherHeaderProps {
  coordinates: GeoCoordinates;
  forecast: NasaPowerDayForecast[];
  bestTime: BestFarmingWindow;
  isLoading: boolean;
  onRefresh: () => void;
  onDetectGps: () => void;
  isGpsDetecting: boolean;
}

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  coordinates,
  forecast,
  bestTime,
  isLoading,
  onRefresh,
  onDetectGps,
  isGpsDetecting,
}) => {
  const today = forecast[0] || {
    tempMaxC: 31.4,
    tempMinC: 19.2,
    tempAvgC: 25.3,
    precipMm: 0,
    humidityRh2m: 54,
    solarInsolation: 19.8,
    windSpeed10m: 3.2,
    farmingSuitabilityScore: 92,
  };

  const getStatusColor = (status: BestFarmingWindow['status']) => {
    switch (status) {
      case 'OPTIMAL':
        return 'text-emerald-700 border-emerald-200 bg-emerald-50';
      case 'FAIR':
        return 'text-amber-700 border-amber-200 bg-amber-50';
      case 'RESTRICTED':
        return 'text-rose-700 border-rose-200 bg-rose-50';
      default:
        return 'text-[#E2136E] border-[#FAD2E1] bg-[#FDE8F1]';
    }
  };

  return (
    <div className="space-y-4">
      {/* Location & GPS Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-[#FDE8F1] rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#FDE8F1] text-[#E2136E]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[#212121] text-base tracking-tight">
                {coordinates.locationName}
              </h2>
              <span className="text-xs text-slate-500">
                ({coordinates.region}, {coordinates.country})
              </span>
            </div>
            <div className="text-xs font-mono text-[#E2136E] mt-0.5">
              LAT {coordinates.latitude.toFixed(4)}° · LON {coordinates.longitude.toFixed(4)}° · FusedLocationProvider
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDetectGps}
            disabled={isGpsDetecting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-[#FDE8F1] hover:bg-[#FCE4EC] text-[#E2136E] border border-[#FAD2E1] transition-colors disabled:opacity-50 cursor-pointer"
            title="Auto-detect current GPS using Android FusedLocationProviderClient simulation"
          >
            <Compass className={`w-3.5 h-3.5 text-[#E2136E] ${isGpsDetecting ? 'animate-spin' : ''}`} />
            {isGpsDetecting ? 'অটো-জিপিএস...' : 'অটো-জিপিএস'}
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-[#E2136E] hover:bg-[#C20F5D] text-white transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            title="Sync latest NASA POWER & SMAP telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            নাসা সিঙ্ক
          </button>
        </div>
      </div>

      {/* 2-Column Bento: Today's Weather & Best Time to Farm Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Today's NASA POWER Core Stats */}
        <div className="lg:col-span-5 p-5 bg-white border border-[#FDE8F1] rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="text-[#E2136E] text-[11px]">NASA POWER এগ্রোক্লাইমাটোলজি</span>
              <span className="text-slate-400 font-mono text-[10px]">2m AGL Sensor</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl text-[#212121] tracking-tight">
                {today.tempAvgC}°C
              </span>
              <span className="text-sm text-slate-600">
                সর্বোচ্চ {today.tempMaxC}° · সর্বনিম্ন {today.tempMinC}°
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-4 mt-4 border-t border-slate-100">
            <div className="text-center">
              <div className="flex items-center justify-center text-sky-600 mb-1">
                <CloudRain className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#212121]">{today.precipMm} মিমি</div>
              <div className="text-[10px] text-slate-500">বৃষ্টিপাত</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-teal-600 mb-1">
                <Droplets className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#212121]">{today.humidityRh2m}%</div>
              <div className="text-[10px] text-slate-500">আর্দ্রতা</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-amber-600 mb-1">
                <Sun className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#212121]">{today.solarInsolation}</div>
              <div className="text-[10px] text-slate-500">MJ/m²</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-purple-600 mb-1">
                <Wind className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#212121]">{today.windSpeed10m} m/s</div>
              <div className="text-[10px] text-slate-500">বাতাস</div>
            </div>
          </div>
        </div>

        {/* Automated "Best Time to Farm" Calculator */}
        <div className="lg:col-span-7 p-5 bg-white border border-[#FDE8F1] rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#E2136E]" />
                <span className="text-xs tracking-wider text-[#E2136E]">
                  সেচ ও চাষাবাদের উপযুক্ত সময় ক্যালকুলেটর
                </span>
              </div>
              <div
                className={`px-2.5 py-1 text-xs rounded-lg border ${getStatusColor(
                  bestTime.status
                )}`}
              >
                {bestTime.status}
              </div>
            </div>

            <div className="mt-2">
              <h3 className="text-base text-[#212121] mb-1">
                {bestTime.recommendedAction}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {bestTime.rationale}
              </p>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="text-[#E2136E]">
              উইন্ডো: <span className="text-[#212121]">{bestTime.windowDays}</span>
            </div>
            <div className="text-slate-500">
              ভারসাম্য: <span className="text-slate-700">{bestTime.moistureVsRainBalance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
