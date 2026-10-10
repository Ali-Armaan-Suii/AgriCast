import React from 'react';

interface AgroBottomNavProps {
  activeTab: 'home' | 'fields' | 'scan' | 'inbox';
  onSelectTab: (tab: 'home' | 'fields' | 'scan' | 'inbox') => void;
  unreadCount?: number;
  language: 'bn' | 'en';
}

export const AgroBottomNav: React.FC<AgroBottomNavProps> = ({
  activeTab,
  onSelectTab,
  unreadCount = 2,
  language,
}) => {
  const isBn = language === 'bn';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="relative bg-white border-t border-slate-100 px-3 py-2 flex items-center justify-between shadow-[0_-6px_25px_rgba(0,0,0,0.08)] rounded-t-[22px]">
          {/* 1. হোম (Home - bKash style pink squircle) */}
          <button
            onClick={() => onSelectTab('home')}
            className="flex flex-col items-center flex-1 py-1 transition-all cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center mb-0.5">
              {activeTab === 'home' ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="6" fill="#E2136E" />
                  <path d="M12 6L6 11V18H10V14H14V18H18V11L12 6Z" fill="white" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-500 group-hover:text-slate-800" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 10.5L12 3L21 10.5V19C21 19.5 20.5 20 20 20H15V14H9V20H4C3.5 20 3 19.5 3 19V10.5Z" />
                </svg>
              )}
            </div>
            <span
              className={`text-[10px] font-sans ${
                activeTab === 'home' ? 'text-[#E2136E] font-semibold' : 'text-slate-600 font-normal'
              }`}
            >
              {isBn ? 'হোম' : 'Home'}
            </span>
          </button>

          {/* 2. আমার জমি (My Fields / Wallet book) */}
          <button
            onClick={() => onSelectTab('fields')}
            className="flex flex-col items-center flex-1 py-1 transition-all cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center mb-0.5">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="14"
                  rx="3"
                  stroke={activeTab === 'fields' ? '#E2136E' : '#64748B'}
                  strokeWidth="1.8"
                  fill={activeTab === 'fields' ? '#FDE8F1' : 'none'}
                />
                <circle cx="12" cy="12" r="2.5" fill={activeTab === 'fields' ? '#E2136E' : '#64748B'} />
                <path d="M8 5V3M16 5V3" stroke={activeTab === 'fields' ? '#E2136E' : '#64748B'} strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span
              className={`text-[10px] font-sans ${
                activeTab === 'fields' ? 'text-[#E2136E] font-semibold' : 'text-slate-600 font-normal'
              }`}
            >
              {isBn ? 'আমার জমি' : 'My Fields'}
            </span>
          </button>

          {/* 3. QR / মাটি স্ক্যান (Center Scanner matching bKash Bangla QR) */}
          <div className="flex-1 flex justify-center -mt-6">
            <button
              onClick={() => onSelectTab('scan')}
              className="group relative flex flex-col items-center focus:outline-none cursor-pointer"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#C20F5D] to-[#E2136E] p-[3px] shadow-[0_8px_18px_rgba(226,19,110,0.35)] group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full rounded-[13px] bg-white flex flex-col items-center justify-center p-1">
                  <span className="text-[7px] font-bold text-[#E2136E] tracking-tight uppercase leading-none mb-0.5">
                    BANGLA
                  </span>
                  {/* Miniature multi-color QR scanner matrix */}
                  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
                    <rect x="1" y="1" width="6" height="6" rx="1" fill="#00843D" />
                    <rect x="3" y="3" width="2" height="2" fill="white" />
                    <rect x="13" y="1" width="6" height="6" rx="1" fill="#E2136E" />
                    <rect x="15" y="3" width="2" height="2" fill="white" />
                    <rect x="1" y="13" width="6" height="6" rx="1" fill="#E2136E" />
                    <rect x="3" y="15" width="2" height="2" fill="white" />
                    <circle cx="10" cy="10" r="1.5" fill="#F42A41" />
                    <rect x="13" y="13" width="3" height="3" fill="#00843D" />
                    <rect x="17" y="17" width="2" height="2" fill="#E2136E" />
                  </svg>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-[#E2136E] mt-1 font-sans">
                {isBn ? 'QR স্ক্যান' : 'QR Scan'}
              </span>
            </button>
          </div>

          {/* 4. ইনবক্স (Inbox / Alerts) */}
          <button
            onClick={() => onSelectTab('inbox')}
            className="flex flex-col items-center flex-1 py-1 transition-all cursor-pointer group"
          >
            <div className="relative w-6 h-6 flex items-center justify-center mb-0.5">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="3"
                  stroke={activeTab === 'inbox' ? '#E2136E' : '#64748B'}
                  strokeWidth="1.8"
                  fill={activeTab === 'inbox' ? '#FDE8F1' : 'none'}
                />
                <path
                  d="M3 8L12 13L21 8"
                  stroke={activeTab === 'inbox' ? '#E2136E' : '#64748B'}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#E2136E] text-white text-[8px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-sans ${
                activeTab === 'inbox' ? 'text-[#E2136E] font-semibold' : 'text-slate-600 font-normal'
              }`}
            >
              {isBn ? 'ইনবক্স' : 'Inbox'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
