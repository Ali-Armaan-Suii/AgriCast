import React, { useState } from 'react';
import { GeoCoordinates, NasaTelemetry } from '../types';
import {
  Camera,
  LogOut,
  MapPin,
  RefreshCw,
  Search,
  Volume2,
} from 'lucide-react';

interface AgroHeroHeaderProps {
  farmerName?: string;
  userEmail?: string | null;
  userPhoto?: string | null;
  coordinates: GeoCoordinates;
  telemetry: NasaTelemetry;
  language: 'bn' | 'en';
  onLanguageToggle: () => void;
  onRefresh: () => void;
  onSonifyToggle: () => void;
  onSearchClick?: () => void;
  onScanClick?: () => void;
  onLogout?: () => void;
}

export type WeatherAtmosphere = 'night_thunderstorm' | 'night_clear' | 'day_sunrise';

export const AgroHeroHeader: React.FC<AgroHeroHeaderProps> = ({
  farmerName = 'আলী আরমান',
  userEmail,
  userPhoto,
  coordinates,
  telemetry,
  language,
  onLanguageToggle,
  onRefresh,
  onSonifyToggle,
  onSearchClick,
  onScanClick,
  onLogout,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBalanceRevealed, setIsBalanceRevealed] = useState(false);
  // Default to Night Thunderstorm with Light Rain according to client's area nature
  const [weatherMode, setWeatherMode] = useState<WeatherAtmosphere>('night_thunderstorm');

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Determine dynamic Bengali greeting based on weather and time
  const getGreeting = () => {
    if (weatherMode === 'night_thunderstorm') return 'বৃষ্টিভেজা রাত,';
    if (weatherMode === 'night_clear') return 'শুভ রাত্রি,';
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'শুভ সকাল,';
    if (hour >= 12 && hour < 16) return 'শুভ দুপুর,';
    if (hour >= 16 && hour < 19) return 'শুভ অপরাহ্ন,';
    return 'শুভ সন্ধ্যা,';
  };

  const defaultAvatar =
    userPhoto ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';

  const isStorm = weatherMode === 'night_thunderstorm';
  const isNightClear = weatherMode === 'night_clear';
  const isNight = isStorm || isNightClear;

  // Background container gradient based on weather mode
  const bgGradient = isStorm
    ? 'bg-gradient-to-b from-[#0B0616] via-[#1A0827] via-[#330833] to-[#830C46]'
    : isNightClear
    ? 'bg-gradient-to-b from-[#080B1A] via-[#101D38] via-[#2A0C35] to-[#7B0D47]'
    : 'bg-gradient-to-b from-[#A50A4E] via-[#C91060] to-[#E2136E]';

  return (
    <div
      className={`relative text-white pt-2.5 sm:pt-3.5 pb-2.5 sm:pb-3.5 px-3 sm:px-5 rounded-b-[24px] sm:rounded-b-[30px] min-h-[135px] sm:min-h-[150px] shadow-md overflow-hidden transition-colors duration-1000 ${bgGradient} flex flex-col justify-between`}
    >
      {/* ========================================================
          1. ANIMATED BENGALI RURAL NATURE (তিস্তা ও বরেন্দ্র অঞ্চলের প্রকৃতি)
          Night Thunderstorm & Light Rain / কালবৈশাখী ও বর্ষার রাতের নিসর্গ:
          - Dynamic Sky Lightning Flash & Branching Bolts (বজ্রপাত ও বিজলি)
          - Angled Light Rain Showers (ঝিরিঝিরি বৃষ্টিপাত)
          - River Water Ripples & Lightning Shimmer (নদীর জলের তরঙ্গ)
          - Traditional Bengal Hut with Warm Lantern Light (কুপি বাতির আলো)
          - Swaying Palm & Coconut Trees in Storm Winds (ঝড়ো বাতাসে দোলা)
          - Fireflies (জোনাকি পোকা) over Nocturnal Paddy Terraces
          - NASA Radar Satellite penetrating rain clouds
         ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Soft atmospheric gradient backdrop */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            isStorm
              ? 'bg-gradient-to-t from-transparent via-[#0B0616]/30 to-[#02010A]/50'
              : 'bg-gradient-to-t from-transparent via-[#E2136E]/15 to-black/20'
          }`}
        />

        <svg
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1000 480"
        >
          <defs>
            {/* Sunrise radial glow */}
            <radialGradient id="villageSunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF275" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#FFB03A" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#E2136E" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#E2136E" stopOpacity="0" />
            </radialGradient>

            {/* Night Moon Halo Glow */}
            <radialGradient id="moonHaloGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#BAE6FD" stopOpacity="0.25" />
              <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </radialGradient>

            {/* Daytime Cloud Gradients */}
            <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#FDE8F1" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="cloudGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#FCE4EC" stopOpacity="0.05" />
            </linearGradient>

            {/* Dark Storm Cloud Gradients (ঘন মেঘমালা) */}
            <linearGradient id="stormCloudGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#312E81" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#1E1B4B" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="stormCloudGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4338CA" stopOpacity="0.65" />
              <stop offset="60%" stopColor="#1E1B4B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0B0F19" stopOpacity="0.9" />
            </linearGradient>

            {/* River Gradients */}
            <linearGradient id="riverGradDay" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="riverGradNight" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0369A1" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
            </linearGradient>

            {/* Paddy field gradients */}
            <linearGradient id="paddyGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isNight ? '#064E3B' : '#4ADE80'} stopOpacity={isNight ? '0.45' : '0.32'} />
              <stop offset="100%" stopColor={isNight ? '#022C22' : '#15803D'} stopOpacity={isNight ? '0.65' : '0.45'} />
            </linearGradient>

            <linearGradient id="paddyGradMid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isNight ? '#047857' : '#86EFAC'} stopOpacity={isNight ? '0.5' : '0.38'} />
              <stop offset="100%" stopColor={isNight ? '#064E3B' : '#166534'} stopOpacity={isNight ? '0.7' : '0.55'} />
            </linearGradient>

            <linearGradient id="paddyGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isNight ? '#059669' : '#BBF7D0'} stopOpacity={isNight ? '0.45' : '0.3'} />
              <stop offset="100%" stopColor={isNight ? '#065F46' : '#14532D'} stopOpacity={isNight ? '0.7' : '0.5'} />
            </linearGradient>

            {/* Orbit / Radar Glow */}
            <linearGradient id="orbitLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="50%" stopColor={isStorm ? '#38BDF8' : '#FFFFFF'} stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>

            {/* NASA Radar Cone Beam */}
            <linearGradient id="radarBeamGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#0284C7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0.02" />
            </linearGradient>

            {/* Lightning Glow Filter */}
            <filter id="lightningGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Firefly Glow Filter */}
            <filter id="fireflyGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ================= THUNDERSTORM SKY FLASHES ================= */}
          {isStorm && (
            <>
              {/* Primary Thunder Flash over the whole sky */}
              <rect
                x="0"
                y="0"
                width="1000"
                height="480"
                fill="#C7D2FE"
                className="animate-[skyLightningFlash_7.5s_ease-out_infinite]"
              />
              {/* Secondary Distant Horizon Flash */}
              <rect
                x="0"
                y="0"
                width="1000"
                height="480"
                fill="#E0F2FE"
                className="animate-[skyLightningFlashSecondary_11s_ease-out_infinite_3.8s]"
              />
            </>
          )}

          {/* ================= CELESTIAL BODIES ================= */}
          {/* A. Sunrise Sun in Day mode */}
          {!isNight && (
            <g className="animate-[sunPulse_6s_ease-in-out_infinite]">
              <circle cx="780" cy="140" r="110" fill="url(#villageSunGlow)" />
              <circle cx="780" cy="140" r="32" fill="#FFF9C4" fillOpacity="0.85" />
              <circle cx="780" cy="140" r="42" fill="#FEF08A" fillOpacity="0.35" />
            </g>
          )}

          {/* B. Crescent Moon & Night Mist in Night Modes */}
          {isNight && (
            <g transform="translate(800, 75)">
              <circle cx="24" cy="24" r="50" fill="url(#moonHaloGrad)" />
              {/* Crescent Moon */}
              <path
                d="M 36,10 A 24,24 0 1,0 36,44 A 18,18 0 0,1 36,10 Z"
                fill="#FEF08A"
                fillOpacity="0.9"
                filter="drop-shadow(0 0 10px #FDE047)"
              />
            </g>
          )}

          {/* Twinkling Stars in Night Skies */}
          {isNight && (
            <g opacity={isStorm ? '0.45' : '0.85'}>
              <circle cx="120" cy="45" r="1.5" fill="#FFFFFF" className="animate-pulse" />
              <circle cx="210" cy="30" r="1.2" fill="#BAE6FD" />
              <circle cx="360" cy="50" r="1.8" fill="#FFFFFF" className="animate-pulse" />
              <circle cx="480" cy="35" r="1.3" fill="#FEF08A" />
              <circle cx="620" cy="40" r="1.5" fill="#FFFFFF" className="animate-pulse" />
              <circle cx="740" cy="25" r="1.4" fill="#BAE6FD" />
              <circle cx="910" cy="55" r="1.6" fill="#FFFFFF" />
            </g>
          )}

          {/* ================= THUNDERSTORM LIGHTNING BOLTS ================= */}
          {isStorm && (
            <>
              {/* Bolt 1: Jagged lightning cutting through thunderclouds to distant hills */}
              <g
                className="animate-[lightningBoltStrike1_7.5s_ease-out_infinite]"
                filter="url(#lightningGlow)"
              >
                {/* Core Bolt Line */}
                <path
                  d="M 310,25 L 295,75 L 325,90 L 305,145 L 335,165 L 315,220 L 330,255 L 320,305"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Outer Electric Aura */}
                <path
                  d="M 310,25 L 295,75 L 325,90 L 305,145 L 335,165 L 315,220 L 330,255 L 320,305"
                  fill="none"
                  stroke="#7DD3FC"
                  strokeWidth="5"
                  strokeOpacity="0.45"
                  strokeLinecap="round"
                />
                {/* Secondary Branches */}
                <path
                  d="M 295,75 L 270,105 L 260,135"
                  fill="none"
                  stroke="#BAE6FD"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M 305,145 L 285,175 L 275,195"
                  fill="none"
                  stroke="#BAE6FD"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M 335,165 L 360,195 L 375,225"
                  fill="none"
                  stroke="#BAE6FD"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                {/* Ground Impact Flash */}
                <circle cx="320" cy="305" r="16" fill="#E0F2FE" fillOpacity="0.75" />
              </g>

              {/* Bolt 2: Secondary lightning branch over the river horizon */}
              <g
                className="animate-[lightningBoltStrike2_11s_ease-out_infinite_3.8s]"
                filter="url(#lightningGlow)"
              >
                <path
                  d="M 710,35 L 730,80 L 705,110 L 735,160 L 715,195 L 740,245 L 730,290"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 710,35 L 730,80 L 705,110 L 735,160 L 715,195 L 740,245 L 730,290"
                  fill="none"
                  stroke="#DDD6FE"
                  strokeWidth="4.5"
                  strokeOpacity="0.4"
                  strokeLinecap="round"
                />
                <path
                  d="M 705,110 L 685,135 L 675,160"
                  fill="none"
                  stroke="#DDD6FE"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 735,160 L 760,190 L 775,215"
                  fill="none"
                  stroke="#DDD6FE"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="730" cy="290" r="14" fill="#DDD6FE" fillOpacity="0.7" />
              </g>
            </>
          )}

          {/* ================= SATELLITE ORBIT PATH ================= */}
          <path
            d="M -100,180 Q 450,10 1100,160"
            fill="none"
            stroke="url(#orbitLineGrad)"
            strokeWidth="1.5"
            strokeDasharray="5 6"
          />

          {/* ================= DRIFTING CLOUDS ================= */}
          {/* Cloud Layer 1 */}
          <g
            className="animate-[villageCloudsSlow_36s_linear_infinite]"
            opacity={isStorm ? '0.88' : '0.75'}
          >
            <path
              d="M 40,85 Q 85,35 150,60 Q 210,30 270,68 Q 320,45 365,80 Q 380,110 340,125 L 50,125 Z"
              fill={isStorm ? 'url(#stormCloudGrad1)' : 'url(#cloudGrad1)'}
            />
            <path
              d="M 480,55 Q 530,15 600,42 Q 670,10 735,50 Q 780,32 820,68 Q 835,100 795,112 L 490,112 Z"
              fill={isStorm ? 'url(#stormCloudGrad2)' : 'url(#cloudGrad2)'}
            />
          </g>

          {/* Cloud Layer 2 */}
          <g
            className="animate-[villageCloudsFast_25s_linear_infinite]"
            opacity={isStorm ? '0.8' : '0.6'}
          >
            <path
              d="M -100,115 Q -55,70 10,95 Q 65,70 120,105 Q 160,90 190,120 L -80,120 Z"
              fill={isStorm ? 'url(#stormCloudGrad2)' : 'url(#cloudGrad2)'}
            />
            <path
              d="M 320,95 Q 370,60 430,85 Q 485,55 540,92 Q 580,78 610,105 L 340,105 Z"
              fill={isStorm ? 'url(#stormCloudGrad1)' : 'url(#cloudGrad1)'}
            />
          </g>

          {/* ================= BIRDS IN CLEAR WEATHER ================= */}
          {!isStorm && (
            <g className="animate-[birdsFly_20s_linear_infinite]">
              <path
                d="M 220,90 Q 228,82 236,90 Q 244,82 252,90 Q 244,86 236,92 Q 228,86 220,90 Z"
                fill="#FFFFFF"
                fillOpacity="0.75"
              />
              <path
                d="M 245,102 Q 251,96 257,102 Q 263,96 269,102 Q 263,99 257,104 Q 251,99 245,102 Z"
                fill="#FFFFFF"
                fillOpacity="0.7"
              />
              <path
                d="M 200,104 Q 206,98 212,104 Q 218,98 224,104 Q 218,101 212,106 Q 206,101 200,104 Z"
                fill="#FFFFFF"
                fillOpacity="0.65"
              />
              <path
                d="M 268,114 Q 273,109 278,114 Q 283,109 288,114 Q 283,111 278,116 Q 273,111 268,114 Z"
                fill="#FFFFFF"
                fillOpacity="0.6"
              />
            </g>
          )}

          {/* ================= DISTANT HORIZON & HILLS ================= */}
          <path
            d="M 0,330 Q 120,305 240,320 Q 380,295 520,325 Q 680,298 840,320 Q 940,310 1000,325 L 1000,480 L 0,480 Z"
            fill={isNight ? '#14051D' : '#5E082C'}
            fillOpacity={isNight ? '0.75' : '0.45'}
          />

          {/* Distant Paddy Fields - Layer 1 */}
          <path
            d="M 0,345 Q 160,315 360,340 Q 560,315 760,345 Q 890,330 1000,350 L 1000,480 L 0,480 Z"
            fill="url(#paddyGradBack)"
          />

          {/* ================= BENGAL VILLAGE COTTAGES (কুঁড়েঘর) ================= */}
          <g transform="translate(680, 260) scale(0.95)" className="opacity-85">
            {/* Hut 1 Roof */}
            <polygon
              points="40,25 0,55 80,55"
              fill={isNight ? '#312E81' : '#FCE4EC'}
              fillOpacity="0.85"
            />
            {/* Hut 1 Wall */}
            <rect
              x="10"
              y="55"
              width="60"
              height="35"
              rx="3"
              fill={isNight ? '#1E1B4B' : '#FFE082'}
              fillOpacity="0.7"
            />
            {/* Hut 1 Door */}
            <rect
              x="30"
              y="65"
              width="18"
              height="25"
              rx="2"
              fill={isNight ? '#0F172A' : '#880E4F'}
              fillOpacity="0.8"
            />

            {/* Warm Glowing Kerosene Lantern in the Window (কুপি বাতির আলো) during Night Rain */}
            {isNight ? (
              <>
                <rect
                  x="52"
                  y="62"
                  width="12"
                  height="12"
                  rx="2"
                  fill="#F59E0B"
                  className="animate-[lanternFlicker_3s_ease-in-out_infinite]"
                />
                <circle
                  cx="58"
                  cy="68"
                  r="14"
                  fill="#FDE68A"
                  fillOpacity="0.3"
                  className="animate-[lanternFlicker_3s_ease-in-out_infinite]"
                />
              </>
            ) : null}

            {/* Hut 2 (adjacent cottage) */}
            <polygon
              points="105,35 75,58 135,58"
              fill={isNight ? '#1E1B4B' : '#F8BBD0'}
              fillOpacity="0.8"
            />
            <rect
              x="82"
              y="58"
              width="46"
              height="32"
              rx="3"
              fill={isNight ? '#0F172A' : '#FFD54F'}
              fillOpacity="0.65"
            />
            <rect
              x="98"
              y="68"
              width="14"
              height="22"
              rx="2"
              fill={isNight ? '#090D16' : '#880E4F'}
              fillOpacity="0.8"
            />
            {isNight && (
              <rect
                x="86"
                y="64"
                width="8"
                height="8"
                rx="1.5"
                fill="#FBBF24"
                className="animate-[lanternFlicker_2.4s_ease-in-out_infinite_0.6s]"
              />
            )}
          </g>

          {/* ================= PALM & COCONUT TREES (তাল ও নারিকেল গাছ) ================= */}
          {/* Group 1: Rightside Palm Trees (Swaying dynamically with storm wind) */}
          <g
            className={
              isStorm
                ? 'animate-[stormWindSway_5s_ease-in-out_infinite]'
                : 'animate-[swayTrees_7s_ease-in-out_infinite]'
            }
            style={{ transformOrigin: '760px 350px' }}
          >
            {/* Palm Trunk 1 */}
            <path
              d="M 765,350 Q 762,300 760,240"
              stroke={isNight ? '#D97706' : '#FFE082'}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              opacity="0.75"
            />
            {/* Palm Fronds 1 */}
            <path
              d="M 760,240 Q 735,225 715,245"
              stroke={isNight ? '#059669' : '#86EFAC'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 760,240 Q 745,210 730,225"
              stroke={isNight ? '#047857' : '#4ADE80'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 760,240 Q 765,205 765,220"
              stroke={isNight ? '#10B981' : '#22C55E'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M 760,240 Q 785,210 800,228"
              stroke={isNight ? '#059669' : '#86EFAC'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 760,240 Q 800,228 815,250"
              stroke={isNight ? '#047857' : '#4ADE80'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Second Palm Tree */}
            <path
              d="M 795,350 Q 798,305 802,255"
              stroke={isNight ? '#D97706' : '#FFE082'}
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M 802,255 Q 780,240 765,258"
              stroke={isNight ? '#059669' : '#86EFAC'}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M 802,255 Q 810,230 812,245"
              stroke={isNight ? '#10B981' : '#22C55E'}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 802,255 Q 830,240 845,260"
              stroke={isNight ? '#047857' : '#4ADE80'}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>

          {/* Group 2: Leftside Coconut Trees */}
          <g
            className={
              isStorm
                ? 'animate-[stormWindSway_5.5s_ease-in-out_infinite_0.8s]'
                : 'animate-[swayTrees_8s_ease-in-out_infinite_1s]'
            }
            style={{ transformOrigin: '120px 360px' }}
          >
            <path
              d="M 115,360 Q 112,310 110,250"
              stroke={isNight ? '#D97706' : '#FFE082'}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M 110,250 Q 85,235 65,255"
              stroke={isNight ? '#059669' : '#86EFAC'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M 110,250 Q 95,220 80,235"
              stroke={isNight ? '#047857' : '#4ADE80'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M 110,250 Q 115,215 115,230"
              stroke={isNight ? '#10B981' : '#22C55E'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 110,250 Q 135,220 150,238"
              stroke={isNight ? '#059669' : '#86EFAC'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M 110,250 Q 150,238 165,260"
              stroke={isNight ? '#047857' : '#4ADE80'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>

          {/* ================= WINDING VILLAGE RIVER (আঁকাবাঁকা নদী) ================= */}
          <path
            d="M 320,350 Q 420,380 470,420 Q 510,455 540,480 L 410,480 Q 380,450 340,420 Q 280,385 240,365 Z"
            fill={isNight ? 'url(#riverGradNight)' : 'url(#riverGradDay)'}
          />

          {/* Lightning Reflection on River Water */}
          {isStorm && (
            <path
              d="M 320,350 Q 420,380 470,420 Q 510,455 540,480 L 410,480 Q 380,450 340,420 Q 280,385 240,365 Z"
              fill="#38BDF8"
              className="animate-[riverLightningShimmer_7.5s_ease-out_infinite]"
              opacity="0"
            />
          )}

          {/* Expanding Rain Ripples on the River Surface (বৃষ্টির ফোঁটায় তৈরি তরঙ্গ) */}
          {isStorm && (
            <g opacity="0.8">
              <ellipse
                cx="370"
                cy="405"
                rx="14"
                ry="4"
                stroke="#7DD3FC"
                strokeWidth="1.2"
                fill="none"
                className="animate-[rippleExpand_2.8s_ease-out_infinite]"
                style={{ transformOrigin: '370px 405px' }}
              />
              <ellipse
                cx="440"
                cy="435"
                rx="18"
                ry="5"
                stroke="#BAE6FD"
                strokeWidth="1"
                fill="none"
                className="animate-[rippleExpand_3.2s_ease-out_infinite_1.2s]"
                style={{ transformOrigin: '440px 435px' }}
              />
              <ellipse
                cx="350"
                cy="450"
                rx="12"
                ry="3.5"
                stroke="#7DD3FC"
                strokeWidth="1"
                fill="none"
                className="animate-[rippleExpand_2.5s_ease-out_infinite_0.6s]"
                style={{ transformOrigin: '350px 450px' }}
              />
              <ellipse
                cx="480"
                cy="460"
                rx="15"
                ry="4.5"
                stroke="#38BDF8"
                strokeWidth="1.2"
                fill="none"
                className="animate-[rippleExpand_3s_ease-out_infinite_1.8s]"
                style={{ transformOrigin: '480px 460px' }}
              />
            </g>
          )}

          {/* ================= MIDGROUND PADDY FIELDS ================= */}
          <path
            d="M 0,385 Q 180,350 380,385 Q 580,355 780,388 Q 900,370 1000,395 L 1000,480 L 0,480 Z"
            fill="url(#paddyGradMid)"
          />

          {/* ================= FOREGROUND GREEN TERRACES ================= */}
          <path
            d="M 0,420 Q 220,380 460,425 Q 700,390 1000,430 L 1000,480 L 0,480 Z"
            fill="url(#paddyGradFront)"
          />

          {/* Swaying Rice Stalks Silhouettes on the lower border (ধানের শীষ) */}
          <g
            opacity={isNight ? '0.35' : '0.45'}
            className={
              isStorm
                ? 'animate-[swayGrass_2.8s_ease-in-out_infinite]'
                : 'animate-[swayGrass_4s_ease-in-out_infinite]'
            }
          >
            <path
              d="M 80,480 Q 90,445 105,435 M 105,435 Q 115,445 120,480"
              stroke={isNight ? '#34D399' : '#BBF7D0'}
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M 140,480 Q 148,450 160,440 M 160,440 Q 170,452 175,480"
              stroke={isNight ? '#34D399' : '#BBF7D0'}
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M 720,480 Q 730,448 745,438 M 745,438 Q 755,450 760,480"
              stroke={isNight ? '#34D399' : '#BBF7D0'}
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M 880,480 Q 890,445 905,435 M 905,435 Q 915,448 920,480"
              stroke={isNight ? '#34D399' : '#BBF7D0'}
              strokeWidth="2.5"
              fill="none"
            />
          </g>

          {/* ================= GLOWING FIREFLIES (জোনাকি পোকা) ================= */}
          {/* Characteristic of rural Bengal riverine landscape at night */}
          {isNight && (
            <g>
              <circle
                cx="280"
                cy="380"
                r="2.5"
                fill="#CCFF00"
                className="animate-[fireflyFloat_4s_ease-in-out_infinite]"
                filter="url(#fireflyGlow)"
              />
              <circle
                cx="340"
                cy="360"
                r="2"
                fill="#A3E635"
                className="animate-[fireflyFloat_3.5s_ease-in-out_infinite_1s]"
                filter="url(#fireflyGlow)"
              />
              <circle
                cx="630"
                cy="370"
                r="2.2"
                fill="#CCFF00"
                className="animate-[fireflyFloat_4.2s_ease-in-out_infinite_2s]"
                filter="url(#fireflyGlow)"
              />
              <circle
                cx="710"
                cy="340"
                r="2.5"
                fill="#A3E635"
                className="animate-[fireflyFloat_3.8s_ease-in-out_infinite_0.5s]"
                filter="url(#fireflyGlow)"
              />
              <circle
                cx="860"
                cy="390"
                r="2"
                fill="#CCFF00"
                className="animate-[fireflyFloat_4.5s_ease-in-out_infinite_1.5s]"
                filter="url(#fireflyGlow)"
              />
              <circle
                cx="160"
                cy="400"
                r="2.2"
                fill="#A3E635"
                className="animate-[fireflyFloat_3.2s_ease-in-out_infinite_2.5s]"
                filter="url(#fireflyGlow)"
              />
            </g>
          )}

          {/* ================= LIGHT RAIN SHOWER STREAKS (ঝিরিঝিরি বৃষ্টিপাত) ================= */}
          {isStorm && (
            <>
              {/* Rain Layer 1 - Drift loop */}
              <g className="animate-[rainFallLoop_1.1s_linear_infinite]" opacity="0.65">
                {[
                  { x: 60, y: 30 },
                  { x: 140, y: 70 },
                  { x: 220, y: 20 },
                  { x: 310, y: 80 },
                  { x: 390, y: 40 },
                  { x: 470, y: 90 },
                  { x: 550, y: 30 },
                  { x: 630, y: 75 },
                  { x: 720, y: 25 },
                  { x: 800, y: 85 },
                  { x: 890, y: 45 },
                  { x: 960, y: 90 },
                  { x: 100, y: 160 },
                  { x: 180, y: 210 },
                  { x: 270, y: 170 },
                  { x: 360, y: 230 },
                  { x: 440, y: 180 },
                  { x: 530, y: 220 },
                  { x: 610, y: 175 },
                  { x: 700, y: 235 },
                  { x: 780, y: 190 },
                  { x: 860, y: 240 },
                  { x: 940, y: 185 },
                  { x: 50, y: 290 },
                  { x: 150, y: 330 },
                  { x: 240, y: 300 },
                  { x: 330, y: 345 },
                  { x: 420, y: 310 },
                  { x: 520, y: 350 },
                  { x: 610, y: 315 },
                  { x: 710, y: 360 },
                  { x: 810, y: 320 },
                  { x: 900, y: 365 },
                  { x: 970, y: 325 },
                ].map((drop, idx) => (
                  <line
                    key={`rain-l1-${idx}`}
                    x1={drop.x}
                    y1={drop.y}
                    x2={drop.x - 14}
                    y2={drop.y + 38}
                    stroke="#BAE6FD"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeOpacity="0.6"
                  />
                ))}
              </g>

              {/* Rain Layer 2 - Fast loop & offset for natural depth */}
              <g
                className="animate-[rainFallLoopFast_0.85s_linear_infinite_0.35s]"
                opacity="0.55"
              >
                {[
                  { x: 90, y: 50 },
                  { x: 180, y: 20 },
                  { x: 260, y: 65 },
                  { x: 350, y: 30 },
                  { x: 430, y: 70 },
                  { x: 510, y: 25 },
                  { x: 600, y: 80 },
                  { x: 680, y: 35 },
                  { x: 760, y: 60 },
                  { x: 850, y: 20 },
                  { x: 930, y: 75 },
                  { x: 130, y: 190 },
                  { x: 220, y: 240 },
                  { x: 310, y: 195 },
                  { x: 400, y: 250 },
                  { x: 490, y: 205 },
                  { x: 580, y: 245 },
                  { x: 660, y: 200 },
                  { x: 750, y: 260 },
                  { x: 830, y: 215 },
                  { x: 920, y: 255 },
                  { x: 80, y: 340 },
                  { x: 190, y: 370 },
                  { x: 290, y: 330 },
                  { x: 390, y: 375 },
                  { x: 490, y: 340 },
                  { x: 580, y: 380 },
                  { x: 680, y: 345 },
                  { x: 780, y: 390 },
                  { x: 870, y: 350 },
                  { x: 950, y: 385 },
                ].map((drop, idx) => (
                  <line
                    key={`rain-l2-${idx}`}
                    x1={drop.x}
                    y1={drop.y}
                    x2={drop.x - 16}
                    y2={drop.y + 42}
                    stroke="#E0F2FE"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeOpacity="0.75"
                  />
                ))}
              </g>
            </>
          )}

          {/* ================= NASA SATELLITE (SAR RADAR BEAM) ================= */}
          <g
            transform="translate(420, 65) scale(0.65)"
            className="animate-[satelliteFloat_5s_ease-in-out_infinite]"
          >
            {/* Microwave SAR Radar Beam Penetrating Rain Clouds */}
            {isStorm && (
              <path
                d="M 50,76 L -35,360 L 135,360 Z"
                fill="url(#radarBeamGrad)"
                opacity="0.38"
                className="animate-[radarPulse_3s_ease-in-out_infinite]"
              />
            )}

            <polygon points="50,12 82,42 50,58" fill="#FFFFFF" fillOpacity="0.95" />
            <polygon
              points="50,12 18,42 50,58"
              fill={isStorm ? '#38BDF8' : '#FFF275'}
              fillOpacity="0.9"
            />
            <polygon
              points="50,58 82,42 66,86"
              fill={isStorm ? '#0284C7' : '#FCE4EC'}
              fillOpacity="0.85"
            />
            <polygon points="50,58 18,42 34,86" fill="#FFFFFF" fillOpacity="0.9" />
            <polygon
              points="50,58 66,86 50,76"
              fill={isStorm ? '#E0F2FE' : '#F8BBD0'}
              fillOpacity="0.9"
            />
            <polygon
              points="50,58 34,86 50,76"
              fill={isStorm ? '#38BDF8' : '#F48FB1'}
              fillOpacity="0.9"
            />
            <polygon points="82,42 96,32 92,54" fill="#FFFFFF" fillOpacity="0.95" />
            <polygon
              points="18,42 4,32 8,54"
              fill={isStorm ? '#38BDF8' : '#FFF9C4'}
              fillOpacity="0.9"
            />
            {/* Satellite Beacon Blinker */}
            <circle cx="50" cy="12" r="3.5" fill="#EF4444" className="animate-ping" />
            <circle cx="50" cy="12" r="2.5" fill="#EF4444" />
          </g>
        </svg>
      </div>

      {/* ========================================================
          KEYFRAME CSS ANIMATIONS (THUNDER, LIGHTNING, RAIN, NATURE)
         ======================================================== */}
      <style>{`
        @keyframes skyLightningFlash {
          0%, 86%, 93%, 100% { opacity: 0; }
          87%, 89% { opacity: 0.38; }
          88% { opacity: 0.12; }
          90% { opacity: 0.48; }
          91%, 92% { opacity: 0.05; }
        }
        @keyframes skyLightningFlashSecondary {
          0%, 41%, 48%, 100% { opacity: 0; }
          42%, 44% { opacity: 0.28; }
          43% { opacity: 0.08; }
          45% { opacity: 0.38; }
          46%, 47% { opacity: 0.04; }
        }
        @keyframes lightningBoltStrike1 {
          0%, 86%, 93%, 100% { opacity: 0; }
          87% { opacity: 0.95; }
          88% { opacity: 0.15; }
          90% { opacity: 1; }
          91% { opacity: 0.3; }
          92% { opacity: 0.85; }
        }
        @keyframes lightningBoltStrike2 {
          0%, 41%, 48%, 100% { opacity: 0; }
          42% { opacity: 0.9; }
          43% { opacity: 0.15; }
          45% { opacity: 1; }
          46% { opacity: 0.25; }
          47% { opacity: 0.75; }
        }
        @keyframes riverLightningShimmer {
          0%, 86%, 93%, 100% { opacity: 0; }
          87%, 90% { opacity: 0.65; }
          88% { opacity: 0.2; }
          91%, 92% { opacity: 0.08; }
        }
        @keyframes rainFallLoop {
          0% { transform: translateY(-80px) translateX(25px); opacity: 0; }
          15% { opacity: 0.65; }
          85% { opacity: 0.65; }
          100% { transform: translateY(220px) translateX(-70px); opacity: 0; }
        }
        @keyframes rainFallLoopFast {
          0% { transform: translateY(-70px) translateX(20px); opacity: 0; }
          15% { opacity: 0.8; }
          85% { opacity: 0.8; }
          100% { transform: translateY(210px) translateX(-60px); opacity: 0; }
        }
        @keyframes rippleExpand {
          0% { transform: scale(0.3); opacity: 0.85; stroke-width: 1.5; }
          100% { transform: scale(2.4); opacity: 0; stroke-width: 0.2; }
        }
        @keyframes stormWindSway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          50% { transform: rotate(-1.5deg); }
          75% { transform: rotate(-6.5deg); }
        }
        @keyframes lanternFlicker {
          0%, 100% { opacity: 0.95; filter: drop-shadow(0 0 6px #F59E0B); }
          25% { opacity: 0.8; filter: drop-shadow(0 0 4px #D97706); }
          50% { opacity: 1; filter: drop-shadow(0 0 9px #FBBF24); }
          75% { opacity: 0.85; filter: drop-shadow(0 0 5px #F59E0B); }
        }
        @keyframes fireflyFloat {
          0%, 100% { opacity: 0.2; transform: translate(0px, 0px) scale(0.8); }
          50% { opacity: 1; transform: translate(8px, -6px) scale(1.3); }
        }
        @keyframes radarPulse {
          0% { opacity: 0.2; stroke-dashoffset: 0; }
          50% { opacity: 0.8; stroke-dashoffset: -15; }
          100% { opacity: 0.2; stroke-dashoffset: -30; }
        }
        @keyframes villageCloudsSlow {
          0% { transform: translateX(-220px); }
          50% { transform: translateX(180px); }
          100% { transform: translateX(-220px); }
        }
        @keyframes villageCloudsFast {
          0% { transform: translateX(-150px); }
          50% { transform: translateX(240px); }
          100% { transform: translateX(-150px); }
        }
        @keyframes birdsFly {
          0% { transform: translate(-300px, 30px); opacity: 0; }
          15% { opacity: 0.9; }
          85% { opacity: 0.9; }
          100% { transform: translate(1100px, -45px); opacity: 0; }
        }
        @keyframes sunPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes swayTrees {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2.5deg); }
        }
        @keyframes swayGrass {
          0%, 100% { transform: skewX(0deg); }
          50% { transform: skewX(4deg); }
        }
        @keyframes satelliteFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(4deg); }
        }
      `}</style>

      {/* Top Header Row with Farmer Profile and Action Bar */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
        {/* Left Side: Farmer Profile Info */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {/* Avatar with Live Indicator */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[2px] bg-white/95 shadow-md overflow-hidden flex items-center justify-center">
              <img
                src={defaultAvatar}
                alt={farmerName}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
                }}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {/* Live Online Ping Dot */}
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#E2136E] border-2 border-white flex items-center justify-center"
              title="সরাসরি সংযোগ সক্রিয়"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </div>
          </div>

          {/* User Name & Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="text-[10px] sm:text-[11px] text-pink-100/90 font-normal shrink-0">
                {getGreeting()}
              </span>
              <h2
                className="font-normal text-white text-sm sm:text-base tracking-tight leading-none truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[200px]"
                title={farmerName}
              >
                {farmerName}
              </h2>
            </div>

            {userEmail ? (
              <div
                className="text-[10px] sm:text-[11px] text-pink-100/80 truncate max-w-[130px] xs:max-w-[160px] sm:max-w-[220px] font-normal mt-0.5"
                title={userEmail}
              >
                {userEmail}
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-pink-100/85 mt-0.5 font-normal">
                <MapPin className="w-3 h-3 text-white/90 shrink-0" />
                <span
                  className="truncate max-w-[130px] xs:max-w-[160px] sm:max-w-[220px]"
                  title={coordinates.locationName}
                >
                  {coordinates.locationName}
                </span>
              </div>
            )}
            {/* bKash-style Balance / Field Status Capsule */}
            <div className="mt-1">
              <button
                onClick={() => {
                  setIsBalanceRevealed(true);
                  setTimeout(() => setIsBalanceRevealed(false), 4000);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white hover:bg-pink-50 active:scale-95 rounded-full shadow-xs text-xs transition-all cursor-pointer select-none"
                title="ট্যাপ করে ব্যালেন্স / অবস্থা দেখুন"
              >
                <span className="w-4 h-4 rounded-full bg-[#E2136E] text-white flex items-center justify-center text-[10px] font-bold">
                  ৳
                </span>
                <span className="text-[11px] font-semibold text-[#E2136E] font-sans">
                  {isBalanceRevealed
                    ? `আর্দ্রতা: ${Math.round(telemetry.smapSurfaceMoisture * 100)}% • নিরাপদ`
                    : 'ব্যালেন্স দেখুন'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Responsive Action Bar matching bKash UI */}
        <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
          {/* 1. Search Icon Button (White circle matching screenshot) */}
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white text-slate-700 hover:bg-slate-100 active:scale-95 shadow-sm flex items-center justify-center cursor-pointer transition-all"
              title="খুঁজুন (Search)"
            >
              <Search className="w-4 h-4 text-slate-600" />
            </button>
          )}

          {/* 2. bKash Bird Origami Icon Button (White circle with pink bird) */}
          <button
            onClick={handleRefreshClick}
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white text-[#E2136E] hover:bg-pink-50 active:scale-95 shadow-sm flex items-center justify-center cursor-pointer transition-all"
            title="তথ্য সিঙ্ক (Sync)"
          >
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none">
              <path d="M4 14L10 8L16 11L21 4L19 14L14 13L10 18L7 16L4 14Z" fill="#E2136E" />
              <path d="M10 8L14 13L10 18V8Z" fill="#C20F5D" />
            </svg>
          </button>

          {/* 3. Utility Capsule (Camera, Audio, Logout) */}
          <div className="bg-black/25 backdrop-blur-md border border-white/20 rounded-full p-1 flex items-center gap-1 shadow-sm">
            {onScanClick && (
              <button
                onClick={onScanClick}
                className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white/15 hover:bg-white/30 active:scale-95 text-white transition-all cursor-pointer flex items-center justify-center relative"
                title="ক্যামেরা স্ক্যান"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-white" />
              </button>
            )}

            <button
              onClick={onSonifyToggle}
              className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-white transition-all cursor-pointer flex items-center justify-center"
              title="বাংলা অডিও গাইড"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-white transition-all cursor-pointer flex items-center justify-center"
                title="লগআউট"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

