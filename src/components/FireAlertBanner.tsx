import React from 'react';
import { FireHotspotAlert } from '../types';
import { AlertTriangle, Flame, ShieldAlert, Wind } from 'lucide-react';

interface FireAlertBannerProps {
  alert: FireHotspotAlert;
  onSimulateFireToggle: () => void;
}

export const FireAlertBanner: React.FC<FireAlertBannerProps> = ({
  alert,
  onSimulateFireToggle,
}) => {
  if (!alert.detected) {
    return (
      <div className="p-4 bg-white border border-[#FDE8F1] rounded-2xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-[#212121]">
              NASA FIRMS ৫ কিমি থার্মাল স্ক্যান: নিরাপদ
            </div>
            <div className="text-[11px] text-slate-500">
              প্লটের সীমানায় কোনো সক্রিয় আগুন বা নাড়া পোড়ানোর ঘটনা নেই।
            </div>
          </div>
        </div>
        <button
          onClick={onSimulateFireToggle}
          className="px-3 py-1.5 text-xs rounded-xl bg-[#FDE8F1] hover:bg-[#FCE4EC] text-[#E2136E] border border-[#FAD2E1] transition-colors cursor-pointer"
        >
          আগুন সিমুলেশন
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl shadow-sm relative overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 relative z-10">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500 text-white animate-pulse">
            <Flame className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-700 font-mono tracking-wider">
                জরুরি সতর্কতা · NASA {alert.satellite} FIRMS
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {alert.detectedAt}
              </span>
            </div>

            <h3 className="text-base text-rose-950 mt-0.5">
              সক্রিয় আগুন সনাক্ত: {alert.distanceKm} কিমি দূরত্বে ({alert.direction})
            </h3>

            <div className="flex flex-wrap gap-4 text-xs text-rose-800 mt-2">
              <div>উষ্ণতা: <span className="text-rose-950 font-mono">{alert.brightnessTempKelvin} K</span></div>
              <div>নির্ভুলতা: <span className="text-rose-950 font-mono">{alert.confidencePct}%</span></div>
              <div>ক্ষমতা (FRP): <span className="text-rose-950 font-mono">{alert.fireRadiativePowerMw} MW</span></div>
            </div>
          </div>
        </div>

        <button
          onClick={onSimulateFireToggle}
          className="px-3 py-1.5 rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
        >
          সতর্কতা রিসেট
        </button>
      </div>
    </div>
  );
};
