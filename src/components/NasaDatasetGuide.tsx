import React from 'react';
import { BookOpen, CheckCircle, Database, ExternalLink, Globe2, Radio, Satellite, Zap } from 'lucide-react';

export const NasaDatasetGuide: React.FC = () => {
  const datasets = [
    {
      name: 'NASA POWER Agroclimatology',
      badge: 'Daily Point API',
      sensor: 'GMAO MERRA-2 & GEOS FP-IT Assimilation',
      parameters: 'T2M, T2M_MAX, T2M_MIN, PRECTOTCORR, RH2M, ALLSKY_SFC_SW_DWN, WS10M',
      purpose: 'স্থানীয় ৭-দিনের পৃষ্ঠতল আবহাওয়ার পূর্বাভাস, সৌর বিকিরণ ও উদ্ভিদের ডিগ্রি-ডে হিসাব সরবরাহ করে।',
      url: 'https://power.larc.nasa.gov/',
    },
    {
      name: 'NASA SMAP L4',
      badge: 'Soil Moisture Active Passive',
      sensor: 'L-Band Radiometer (1.4 GHz) + Land Surface Model',
      parameters: 'Surface Soil Moisture (0-5cm), Root-Zone Soil Moisture (0-100cm) in m³/m³',
      purpose: 'মাটিতে গাছের গ্রহণযোগ্য পানির পরিমাণ (PAW) এবং সেচের উপযুক্ত সময় আগাম নির্ধারণ করে।',
      url: 'https://smap.jpl.nasa.gov/',
    },
    {
      name: 'NASA ECOSTRESS',
      badge: 'ISS Thermal Radiometer',
      sensor: 'Multispectral Thermal Infrared (TIR) on International Space Station (70m)',
      parameters: 'Land Surface Temperature (LST), Evaporative Stress Index (ESI), Water Use Efficiency (WUE)',
      purpose: 'পাতা শুকিয়ে যাওয়ার কয়েক ঘণ্টা আগেই বাষ্পীভবন হ্রাস ও তাপীয় চাপ সনাক্ত করে।',
      url: 'https://ecostress.jpl.nasa.gov/',
    },
    {
      name: 'NASA GPM IMERG',
      badge: 'Global Precipitation Measurement',
      sensor: 'Dual-frequency Precipitation Radar (DPR) + Multi-satellite Microwave/IR',
      parameters: 'Calibrated Precipitation Rate (mm/hr), 24-hr & 72-hr Accumulation',
      purpose: 'প্রতি ৩০ মিনিটে বৈশ্বিক বৃষ্টিপাত পরিমাপ করে জলাবদ্ধতা রোধ এবং স্প্রে করার উপযুক্ত সময় নির্ধারণ করে।',
      url: 'https://gpm.nasa.gov/',
    },
    {
      name: 'NASA-ISRO NISAR',
      badge: 'Dual-Frequency SAR',
      sensor: 'L-Band (24 cm) & S-Band (9 cm) SweepSAR Radar',
      parameters: 'Interferometric Coherence, Soil Penetration Radar, Land Deformation',
      purpose: 'ঘন উদ্ভিদের মধ্য দিয়ে মাটির গভীরে ভেদন করে সাবসারফেস আর্দ্রতা ও জমির অবনমন ট্র্যাক করে।',
      url: 'https://nisar.jpl.nasa.gov/',
    },
    {
      name: 'NASA FIRMS (MODIS & VIIRS)',
      badge: 'Thermal Hotspots',
      sensor: 'Suomi-NPP VIIRS (375m) & Terra/Aqua MODIS (1km)',
      parameters: 'Brightness Temperature (K), Fire Radiative Power (MW), Confidence Score (%)',
      purpose: 'প্লটের ৫ কিমি ব্যাসার্ধে খড় বা নাড়া পোড়ানোর অগ্নিকাণ্ড তাৎক্ষণিক সনাক্ত করে এবং এসএমটিপি অ্যালার্ট পাঠায়।',
      url: 'https://firms.modaps.eosdis.nasa.gov/',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="p-5 bg-white border border-[#FDE8F1] rounded-2xl shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-[#FDE8F1] text-[#E2136E]">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base text-[#212121]">
              NASA Earth Science মিশন স্পেসিফিকেশন ও অ্যালগরিদম
            </h2>
            <p className="text-xs text-slate-500">
              AgriCast সিস্টেমে ব্যবহৃত নাসার কৃত্রিম উপগ্রহ ডেটাসেট বিবরণী
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {datasets.map((item) => (
          <div
            key={item.name}
            className="p-5 bg-white border border-[#FDE8F1] rounded-2xl shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#E2136E]">{item.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FDE8F1] text-[#E2136E] border border-[#FAD2E1] font-mono">
                  {item.badge}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-1">সেন্সর: {item.sensor}</div>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed">{item.purpose}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]">
                {item.parameters}
              </span>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-[#E2136E] hover:underline"
              >
                <span>নাসা পোর্টাল</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
