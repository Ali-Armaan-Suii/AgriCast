import React from 'react';

// ============================================================================
// 8 BENGALI AGRO-BKASH COLORFUL VECTOR SVGS
// Hand-crafted multi-color vector illustrations matching bKash 'অন্যান্য সেবাসমূহ'
// ============================================================================

/** 1. আমার জমি (My Field / Terraced Land & Sprout) */
export const SvgMyField: React.FC<{ className?: string }> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="mf_soil" x1="24" y1="30" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9A5B32" />
        <stop offset="1" stopColor="#6D3B1E" />
      </linearGradient>
      <linearGradient id="mf_furrow" x1="12" y1="28" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#16A34A" />
        <stop offset="1" stopColor="#15803D" />
      </linearGradient>
      <linearGradient id="mf_leafL" x1="16" y1="8" x2="24" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4ADE80" />
        <stop offset="1" stopColor="#16A34A" />
      </linearGradient>
      <linearGradient id="mf_leafR" x1="32" y1="12" x2="24" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#86EFAC" />
        <stop offset="1" stopColor="#22C55E" />
      </linearGradient>
    </defs>
    {/* Sun halo in background */}
    <circle cx="36" cy="12" r="5" fill="#FDE047" fillOpacity="0.85" />
    <circle cx="36" cy="12" r="8" fill="#FACC15" fillOpacity="0.25" />
    {/* Soil Base with Terraces */}
    <path d="M4 38C10 35 18 35 24 37C30 39 38 39 44 36V42C44 44 42 45 40 45H8C5.8 45 4 43.2 4 41V38Z" fill="url(#mf_soil)" />
    {/* Green Paddy Furrow / Terraces */}
    <path d="M4 34C11 31 18 31 24 33C30 35 37 35 44 32V37C38 40 30 40 24 38C18 36 11 36 4 39V34Z" fill="url(#mf_furrow)" />
    <path d="M4 30C12 28 18 28 24 30C31 32 37 32 44 29V33C37 36 30 36 24 34C18 32 11 32 4 35V30Z" fill="#22C55E" />
    {/* Central Stem */}
    <path d="M24 34V18" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
    {/* Left Leaf */}
    <path d="M24 24C17 24 12 17 14 11C20 10 24 16 24 24Z" fill="url(#mf_leafL)" />
    {/* Right Leaf */}
    <path d="M24 20C31 20 36 14 34 8C28 7 24 13 24 20Z" fill="url(#mf_leafR)" />
    {/* Dewdrop sparkle */}
    <circle cx="16" cy="13" r="1.5" fill="#E0F2FE" />
  </svg>
);

/** 2. স্বাস্থ্য স্কোর (Field Health Score / NDVI Diagnostic Pulse) */
export const SvgHealthScore: React.FC<{ className?: string }> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="hs_leaf" x1="12" y1="6" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981" />
        <stop offset="1" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="hs_pulse" x1="4" y1="26" x2="44" y2="26" gradientUnits="userSpaceOnUse">
        <stop stopColor="#06B6D4" />
        <stop offset="0.5" stopColor="#38BDF8" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    {/* Healthy Green Leaf Silhouette */}
    <path d="M24 6C14 6 8 16 9 28C10 37 18 42 24 42C30 42 38 37 39 28C40 16 34 6 24 6Z" fill="url(#hs_leaf)" fillOpacity="0.25" />
    <path d="M24 8C16 8 11 17 12 27C13 35 19 39 24 39C29 39 35 35 36 27C37 17 32 8 24 8Z" fill="url(#hs_leaf)" />
    {/* Central Leaf Vein */}
    <path d="M24 12V36" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 20L18 16" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 24L30 20" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 28L18 24" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" />
    {/* ECG Pulse Heartbeat Overlay Ribbon */}
    <rect x="6" y="24" width="36" height="12" rx="6" fill="#0B132B" fillOpacity="0.9" />
    <path d="M8 30H15L18 25L22 35L26 27L29 32L32 30H40" stroke="url(#hs_pulse)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Badge Gold Star */}
    <circle cx="36" cy="12" r="6" fill="#F59E0B" />
    <path d="M36 8.5L37.2 11.2L40.1 11.4L37.9 13.3L38.6 16.1L36 14.6L33.4 16.1L34.1 13.3L31.9 11.4L34.8 11.2L36 8.5Z" fill="#FFF" />
  </svg>
);

/** 3. নিসার রাডার (NISAR Satellite Radar / Soil Moisture) */
export const SvgNisarRadar: React.FC<{ className?: string }> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="nr_panel" x1="6" y1="14" x2="16" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0284C7" />
        <stop offset="1" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="nr_dish" x1="24" y1="16" x2="38" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
    {/* Earth curvature below */}
    <path d="M4 42C14 36 34 36 44 42" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
    <path d="M8 44C16 40 32 40 40 44" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
    {/* Microwave radar wavefront pulses */}
    <path d="M19 28C22 31 27 33 32 33" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
    <path d="M22 32C25 35 29 36 33 36" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M25 36C27 38 30 39 34 39" stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
    {/* Radar Dish */}
    <path d="M18 16C23 11 33 13 36 21C37 25 35 29 31 31C25 32 19 26 18 20" stroke="url(#nr_dish)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="28" cy="20" r="3" fill="#F59E0B" />
    <line x1="28" y1="20" x2="36" y2="28" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
    {/* Solar panel wing */}
    <rect x="7" y="15" width="9" height="7" rx="1.5" fill="url(#nr_panel)" stroke="#38BDF8" strokeWidth="1" />
    <line x1="11.5" y1="15" x2="11.5" y2="22" stroke="#BAE6FD" strokeWidth="0.8" />
    <line x1="7" y1="18.5" x2="16" y2="18.5" stroke="#BAE6FD" strokeWidth="0.8" />
    <line x1="16" y1="18.5" x2="21" y2="18.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** 4. জরুরি সতর্কতা (Early Warnings & Disaster Alerts) */
export const SvgEarlyWarning: React.FC<{ className?: string }> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="ew_hazard" x1="24" y1="6" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FB923C" />
        <stop offset="1" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    {/* Warning Triangle Shield */}
    <path d="M21.4 7.5C22.6 5.5 25.4 5.5 26.6 7.5L43.1 36.1C44.3 38.2 42.8 41 40.5 41H7.5C5.2 41 3.7 38.2 4.9 36.1L21.4 7.5Z" fill="url(#ew_hazard)" />
    {/* Inner Border Contrast */}
    <path d="M22.7 10C23.3 9 24.7 9 25.3 10L40.9 37C41.5 38 40.7 39.5 39.5 39.5H8.5C7.3 39.5 6.5 38 7.1 37L22.7 10Z" fill="#FFF" fillOpacity="0.15" />
    {/* Thunder Lightning Bolt */}
    <path d="M25 15L17 27H24L22 36L31 24H24L25 15Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.2" strokeLinejoin="round" />
    {/* Exclamation point mark */}
    <circle cx="36" cy="32" r="4.5" fill="#EF4444" stroke="#FFF" strokeWidth="1.5" />
    <path d="M36 30V31.5" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="36" cy="34" r="0.8" fill="#FFF" />
  </svg>
);

/** 5. হোয়াট-ইফ (What-If Climate & Farm Simulation) */
export const SvgWhatIfSim: React.FC<{ className?: string }> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="wi_track1" x1="10" y1="16" x2="38" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#818CF8" />
        <stop offset="1" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="wi_track2" x1="10" y1="32" x2="38" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    {/* Upper Slider Track */}
    <rect x="8" y="14" width="32" height="6" rx="3" fill="#E0E7FF" />
    <rect x="8" y="14" width="22" height="6" rx="3" fill="url(#wi_track1)" />
    {/* Upper Slider Thumb (Sun temperature) */}
    <circle cx="30" cy="17" r="7" fill="#F59E0B" stroke="#FFF" strokeWidth="2" />
    <circle cx="30" cy="17" r="3.5" fill="#FEF08A" />
    {/* Lower Slider Track */}
    <rect x="8" y="28" width="32" height="6" rx="3" fill="#E0F2FE" />
    <rect x="8" y="28" width="16" height="6" rx="3" fill="url(#wi_track2)" />
    {/* Lower Slider Thumb (Rain droplet) */}
    <circle cx="24" cy="31" r="7" fill="#0284C7" stroke="#FFF" strokeWidth="2" />
    <path d="M24 27C24 27 21.5 30 21.5 31.5C21.5 32.8 22.6 34 24 34C25.4 34 26.5 32.8 26.5 31.5C26.5 30 24 27 24 27Z" fill="#E0F2FE" />
  </svg>
);

/** 6. আগুন সতর্কতা (Thermal FIRMS Satellite Fire Alert) */
export const SvgFireAlert: React.FC<{ className?: string }> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="fa_outer" x1="24" y1="8" x2="24" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EF4444" />
        <stop offset="1" stopColor="#B91C1C" />
      </linearGradient>
      <linearGradient id="fa_mid" x1="24" y1="14" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F97316" />
        <stop offset="1" stopColor="#EA580C" />
      </linearGradient>
      <linearGradient id="fa_inner" x1="24" y1="24" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE047" />
        <stop offset="1" stopColor="#EAB308" />
      </linearGradient>
    </defs>
    {/* Thermal Target Crosshair Rings */}
    <circle cx="24" cy="28" r="16" stroke="#FECDD3" strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="24" cy="28" r="11" stroke="#FDA4AF" strokeWidth="1.5" strokeOpacity="0.6" />
    {/* Outer Red Flame */}
    <path d="M24 8C27 15 35 18 35 28C35 34.5 30 40 24 40C18 40 13 34.5 13 28C13 21 19 14 24 8Z" fill="url(#fa_outer)" />
    {/* Middle Orange Flame */}
    <path d="M24 16C26 21 31 23 31 29C31 33.5 28 38 24 38C20 38 17 33.5 17 29C17 24 21 20 24 16Z" fill="url(#fa_mid)" />
    {/* Inner Yellow Core */}
    <path d="M24 24C25 27 28 29 28 32C28 35 26 36.5 24 36.5C22 36.5 20 35 20 32C20 29 22.5 26 24 24Z" fill="url(#fa_inner)" />
  </svg>
);

/** 7. ফসল রোডম্যাপ (Crop Roadmap / ধান ও ফসল গাইড) */
export const SvgCropRoadmap: React.FC<{ className?: string }> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="cr_gold" x1="24" y1="6" x2="24" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="cr_leaf" x1="14" y1="20" x2="34" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#22C55E" />
        <stop offset="1" stopColor="#15803D" />
      </linearGradient>
    </defs>
    {/* Rice Sheaf Central Stem */}
    <path d="M24 40V12" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
    {/* Golden Grains (ধানের শিষ) */}
    <ellipse cx="24" cy="9" rx="3.2" ry="4.5" fill="url(#cr_gold)" />
    <ellipse cx="19" cy="14" rx="3" ry="4.2" transform="rotate(-30 19 14)" fill="url(#cr_gold)" />
    <ellipse cx="17" cy="21" rx="3" ry="4.2" transform="rotate(-35 17 21)" fill="url(#cr_gold)" />
    <ellipse cx="16" cy="28" rx="3" ry="4.2" transform="rotate(-40 16 28)" fill="url(#cr_gold)" />
    <ellipse cx="29" cy="14" rx="3" ry="4.2" transform="rotate(30 29 14)" fill="url(#cr_gold)" />
    <ellipse cx="31" cy="21" rx="3" ry="4.2" transform="rotate(35 31 21)" fill="url(#cr_gold)" />
    <ellipse cx="32" cy="28" rx="3" ry="4.2" transform="rotate(40 32 28)" fill="url(#cr_gold)" />
    {/* Green Arching Leaves */}
    <path d="M24 30C16 30 10 34 8 40C12 36 18 34 24 33" fill="url(#cr_leaf)" />
    <path d="M24 28C32 28 38 32 40 38C36 34 30 32 24 31" fill="url(#cr_leaf)" />
    {/* Roadmap Checkmark Badge */}
    <circle cx="36" cy="36" r="6" fill="#10B981" stroke="#FFF" strokeWidth="1.5" />
    <path d="M33.5 36L35.2 37.8L38.8 34.2" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 8. মাটি স্ক্যান (Smart AI Soil & Mineral Scanner) */
export const SvgSoilScanner: React.FC<{ className?: string }> = ({ className = 'w-7 h-7 sm:w-8 sm:h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="ss_body" x1="14" y1="6" x2="34" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1E293B" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
    </defs>
    {/* Smartphone Outline */}
    <rect x="14" y="6" width="20" height="34" rx="4.5" fill="url(#ss_body)" stroke="#475569" strokeWidth="1.2" />
    {/* Phone Screen */}
    <rect x="16" y="10" width="16" height="25" rx="2" fill="#020617" />
    {/* Camera Viewfinder Reticle Corners */}
    <path d="M18 14H20M18 14V16" stroke="#E2136E" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M30 14H28M30 14V16" stroke="#E2136E" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18 30H20M18 30V28" stroke="#E2136E" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M30 30H28M30 30V28" stroke="#E2136E" strokeWidth="1.5" strokeLinecap="round" />
    {/* Soil Strata Layer inside Viewfinder */}
    <path d="M18 26C21 24 25 27 30 25V30H18V26Z" fill="#A16207" />
    <path d="M18 28C22 27 26 29 30 28V31H18V28Z" fill="#713F12" />
    <circle cx="21" cy="27" r="0.8" fill="#FACC15" />
    <circle cx="27" cy="29" r="0.8" fill="#FACC15" />
    {/* Laser Scan Line */}
    <line x1="17" y1="22" x2="31" y2="22" stroke="#22D3EE" strokeWidth="1.8" strokeLinecap="round" />
    {/* AI Sparkle */}
    <circle cx="36" cy="10" r="2" fill="#E2136E" />
    <path d="M36 6V8M36 12V14M32 10H34M38 10H40" stroke="#E2136E" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// ============================================================================
// MAIN COMPONENT: AgroServicesGrid
// bKash 'অন্যান্য সেবাসমূহ' Style Card with 8 Colorful Vector SVG Icons
// ============================================================================

interface AgroServicesGridProps {
  onSelectService: (serviceKey: string, moduleIndex: number) => void;
  activeModuleIndex: number;
  fireHotspotCount: number;
  earlyWarningCount: number;
  language: 'bn' | 'en';
}

export const AgroServicesGrid: React.FC<AgroServicesGridProps> = ({
  onSelectService,
  activeModuleIndex,
  fireHotspotCount,
  earlyWarningCount,
  language,
}) => {
  const isBn = language === 'bn';

  // 8 Services with distinctive soft-tinted backgrounds and custom multi-color SVGs
  const services = [
    {
      id: 'my_field',
      label: isBn ? 'আমার জমি' : 'My Field',
      SvgIcon: SvgMyField,
      bgTint: 'bg-[#EBF8EE] group-hover:bg-[#DCFCE7]',
      ringColor: 'ring-emerald-400/40',
      moduleIndex: 0,
    },
    {
      id: 'field_health',
      label: isBn ? 'স্বাস্থ্য স্কোর' : 'Health Score',
      SvgIcon: SvgHealthScore,
      bgTint: 'bg-[#ECFDF5] group-hover:bg-[#D1FAE5]',
      ringColor: 'ring-teal-400/40',
      moduleIndex: 1,
    },
    {
      id: 'nisar',
      label: isBn ? 'নিসার রাডার' : 'NISAR Radar',
      SvgIcon: SvgNisarRadar,
      bgTint: 'bg-[#E0F2FE] group-hover:bg-[#BAE6FD]',
      ringColor: 'ring-sky-400/40',
      moduleIndex: 2,
    },
    {
      id: 'early_warning',
      label: isBn ? 'জরুরি সতর্কতা' : 'Urgent Alert',
      SvgIcon: SvgEarlyWarning,
      bgTint: 'bg-[#FFF7ED] group-hover:bg-[#FFEDD5]',
      ringColor: 'ring-amber-400/40',
      moduleIndex: 3,
      badge: earlyWarningCount > 0 ? (isBn ? 'সতর্কতা' : 'Alert') : undefined,
    },
    {
      id: 'what_if',
      label: isBn ? 'হোয়াট-ইফ' : 'What-If Sim',
      SvgIcon: SvgWhatIfSim,
      bgTint: 'bg-[#EEF2FF] group-hover:bg-[#E0E7FF]',
      ringColor: 'ring-indigo-400/40',
      moduleIndex: 5,
    },
    {
      id: 'fire_alert',
      label: isBn ? 'আগুন সতর্কতা' : 'Fire Alert',
      SvgIcon: SvgFireAlert,
      bgTint: 'bg-[#FFF1F2] group-hover:bg-[#FFE4E6]',
      ringColor: 'ring-rose-400/40',
      moduleIndex: 3,
      badge: fireHotspotCount > 0 ? (isBn ? 'হটস্পট' : 'Hotspot') : undefined,
    },
    {
      id: 'farming_roadmap',
      label: isBn ? 'ফসল রোডম্যাপ' : 'Crop Roadmap',
      SvgIcon: SvgCropRoadmap,
      bgTint: 'bg-[#FEFCE8] group-hover:bg-[#FEF9C3]',
      ringColor: 'ring-yellow-400/40',
      moduleIndex: -1, // Opens roadmap or catalog
    },
    {
      id: 'soil_scanner',
      label: isBn ? 'মাটি স্ক্যান' : 'Soil Scanner',
      SvgIcon: SvgSoilScanner,
      bgTint: 'bg-[#FDF2F8] group-hover:bg-[#FCE7F3]',
      ringColor: 'ring-pink-400/40',
      moduleIndex: -1, // Opens camera modal
    },
  ];

  return (
    <div className="relative z-20 -mt-14 sm:-mt-16 mx-3 sm:mx-4 bg-white/98 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-md border border-slate-100 p-3.5 sm:p-4 transition-all">
      {/* Header matching bKash 'অন্যান্য সেবাসমূহ' with notification dot */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight font-sans">
            {isBn ? 'অন্যান্য সেবাসমূহ' : 'Other Services'}
          </h3>
          <span className="text-[10px] text-slate-400 font-normal">
            ({services.length})
          </span>
        </div>
        <span
          className="w-2.5 h-2.5 rounded-full bg-[#E2136E] animate-pulse shadow-xs"
          title={isBn ? 'নতুন স্মার্ট সেবা সক্রিয়' : 'Smart Services Active'}
        />
      </div>

      {/* 4x2 Grid of 8 Services with Colorful SVGs matching bKash UI */}
      <div className="grid grid-cols-4 gap-y-3.5 gap-x-1 sm:gap-x-2.5">
        {services.map((item) => {
          const SvgIcon = item.SvgIcon;
          const isSelected = item.moduleIndex >= 0 && activeModuleIndex === item.moduleIndex;

          return (
            <button
              key={item.id}
              onClick={() => onSelectService(item.id, item.moduleIndex)}
              className="flex flex-col items-center text-center group cursor-pointer focus:outline-none select-none transition-transform active:scale-95"
            >
              {/* Circular Soft-Tinted Background with SVG */}
              <div className="relative mb-1">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xs ${item.bgTint} ${
                    isSelected
                      ? `ring-3 sm:ring-4 ${item.ringColor} scale-105 shadow-sm`
                      : 'group-hover:scale-105'
                  }`}
                >
                  <SvgIcon className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
                </div>

                {/* Optional Dynamic Alert Badge */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-medium bg-[#E2136E] text-white shadow-xs font-sans animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Bengali / English Label */}
              <span
                className={`text-[11px] sm:text-xs leading-tight transition-colors font-sans max-w-[80px] truncate ${
                  isSelected
                    ? 'text-[#E2136E] font-semibold'
                    : 'text-slate-800 font-medium group-hover:text-[#E2136E]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
