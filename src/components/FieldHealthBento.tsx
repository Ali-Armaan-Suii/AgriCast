import React from 'react';
import { NasaTelemetry } from '../types';
import { Activity, AlertCircle, Droplets, Gauge, Layers, Radar, Thermometer, Waves } from 'lucide-react';

interface FieldHealthBentoProps {
  telemetry: NasaTelemetry;
  onSelectMetric?: (metricKey: string) => void;
}

export const FieldHealthBento: React.FC<FieldHealthBentoProps> = ({
  telemetry,
  onSelectMetric,
}) => {
  const smapPercent = Math.round(telemetry.smapSurfaceMoisture * 100);
  const smapRootPercent = Math.round(telemetry.smapRootZoneMoisture * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="tracking-wider text-[#E2136E]">
          জমির স্বাস্থ্য টেলিমেট্রি · নাসা স্যাটেলাইট গ্রিড
        </span>
        <span className="text-emerald-700 text-[11px]">
          NASA EOS সিঙ্ক: সক্রিয়
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5">
        {/* BENTO CARD 1: NASA SMAP (4 cols) */}
        <div
          onClick={() => onSelectMetric?.('SMAP')}
          className="lg:col-span-4 p-5 bg-white border border-[#FDE8F1] hover:border-[#E2136E]/40 rounded-2xl cursor-pointer transition-all shadow-xs flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#E2136E]">
                মাটির আর্দ্রতা · SMAP L4
              </span>
              <div className="p-2 rounded-xl bg-[#FDE8F1] text-[#E2136E] group-hover:scale-110 transition-transform">
                <Droplets className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl text-[#212121] tracking-tight font-mono">
                {smapPercent}%
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {telemetry.smapSurfaceMoisture.toFixed(2)} m³/m³
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>শিকড় অঞ্চল:</span>
                <span className="text-[#212121]">{smapRootPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#E2136E] h-full rounded-full transition-all"
                  style={{ width: `${smapPercent}%` }}
                />
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
            র‍্যাডিওমিটার ৯ কিমি রেজোলিউশন
          </div>
        </div>

        {/* BENTO CARD 2: ECOSTRESS (4 cols) */}
        <div
          onClick={() => onSelectMetric?.('ECOSTRESS')}
          className="lg:col-span-4 p-5 bg-white border border-[#FDE8F1] hover:border-amber-400/40 rounded-2xl cursor-pointer transition-all shadow-xs flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-amber-700">
                ক্যানোপি তাপমাত্রা · ECOSTRESS
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <Thermometer className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl text-[#212121] tracking-tight font-mono">
                {telemetry.ecostressCanopyTempC}°C
              </span>
              <span className="text-xs text-amber-700">
                ESI {telemetry.ecostressEsi}
              </span>
            </div>

            <div className="mt-3 text-xs text-slate-600">
              <p>বাষ্পীভবন চাপ সূচক উদ্ভিদের পানির চাহিদা নির্দেশ করে।</p>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
            আন্তর্জাতিক মহাকাশ স্টেশন ৭০ মিটার রেজোলিউশন
          </div>
        </div>

        {/* BENTO CARD 3: NISAR & GPM (4 cols) */}
        <div
          onClick={() => onSelectMetric?.('NISAR')}
          className="lg:col-span-4 p-5 bg-white border border-[#FDE8F1] hover:border-purple-400/40 rounded-2xl cursor-pointer transition-all shadow-xs flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-purple-700">
                নিসার রাডার · L-BAND SAR
              </span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                <Radar className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl text-[#212121] tracking-tight font-mono">
                {(telemetry.nisarLbandCoherence * 100).toFixed(0)}%
              </span>
              <span className="text-xs text-purple-700">
                সাবসারফেস {telemetry.nisarSubsurfaceMoisturePct}%
              </span>
            </div>

            <div className="mt-3 text-xs text-slate-600">
              <p>মাটির গভীর স্তরের আর্দ্রতা এবং ডিফরমেশন ট্র্যাকিং।</p>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
            নাসা-ইসরো সার ১২ দিনের সাইকেল
          </div>
        </div>
      </div>
    </div>
  );
};
