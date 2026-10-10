import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  Clock,
  CloudRain,
  Droplets,
  Flame,
  Info,
  ShieldAlert,
  Sun,
  Volume2,
  Wind,
} from 'lucide-react';
import { EarlyWarningItem, FireHotspotAlert, NasaTelemetry } from '../types';

interface InboxAlertsPageProps {
  onBack: () => void;
  earlyWarnings: EarlyWarningItem[];
  telemetry: NasaTelemetry;
  fireAlert: FireHotspotAlert;
  onSpeak: (text: string) => void;
}

interface NotificationItem {
  id: string;
  category: 'disaster' | 'irrigation_fertilizer' | 'general';
  titleBn: string;
  descriptionBn: string;
  source: string;
  timeAgoBn: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  isRead: boolean;
  actionBn?: string;
}

export const InboxAlertsPage: React.FC<InboxAlertsPageProps> = ({
  onBack,
  earlyWarnings,
  telemetry,
  fireAlert,
  onSpeak,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'disaster' | 'reminders'>('all');

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      category: 'disaster',
      titleBn: 'আকস্মিক বন্যা ও ভারী বর্ষণ সতর্কতা (NASA GPM)',
      descriptionBn: 'আগামী ৪৮-৭২ ঘণ্টায় উজানের অববাহিকা ও উত্তরাঞ্চলে ভারী বর্ষণের সম্ভাবনা রয়েছে। ফসলের ড্রেনেজ নালা পরিষ্কার রাখুন।',
      source: 'NASA GPM Satellite IMERG v07',
      timeAgoBn: '১০ মিনিট আগে',
      severity: 'CRITICAL',
      isRead: false,
      actionBn: 'ড্রেনেজ ব্যবস্থা চেক করুন',
    },
    {
      id: 'notif-2',
      category: 'disaster',
      titleBn: 'মাটির আর্দ্রতা ঘাটতি ও হিট স্ট্রেস এলার্ট',
      descriptionBn: 'মাটির শীর্ষ স্তরে আর্দ্রতা ১৮%-এ নেমে এসেছে। বাতাসের তাপমাত্রা ৩৩° সে. ছাড়িয়ে যাওয়ায় দ্রুত সেচ দেওয়া জরুরি।',
      source: 'NASA SMAP L4_SM_gph (9km)',
      timeAgoBn: '১ ঘণ্টা আগে',
      severity: 'WARNING',
      isRead: false,
      actionBn: 'সেচ সূচি দেখুন',
    },
    {
      id: 'notif-3',
      category: 'irrigation_fertilizer',
      titleBn: 'ইউরিয়া সারের ২য় কিস্তি প্রয়োগের সময়োপযোগী নোটিশ',
      descriptionBn: 'আপনার বোরো ধান প্লটে কুশি আসার পর্যায় শুরু হয়েছে। বিকেলবেলা মাটিতে পর্যাপ্ত রস থাকা অবস্থায় উপরিপ্রয়োগ সম্পন্ন করুন।',
      source: 'কৃষি সম্প্রসারণ অধিদপ্তর (DAE) নির্দেশিকা',
      timeAgoBn: '৩ ঘণ্টা আগে',
      severity: 'INFO',
      isRead: false,
      actionBn: 'সারের মাত্রা হিসাব করুন',
    },
    {
      id: 'notif-4',
      category: 'disaster',
      titleBn: 'MODIS/VIIRS খড় পোড়ানো ও থার্মাল হটস্পট পর্যবেক্ষণ',
      descriptionBn: 'আপনার প্লটের ৩ কিমি ব্যাসার্ধের মধ্যে বায়ুমণ্ডলীয় অ্যারোসল কণা বৃদ্ধি পেয়েছে। ফসল পুড়িয়ে ফেলার ধোঁয়া থেকে চারা রক্ষা করুন।',
      source: 'NASA FIRMS VIIRS NRT (375m)',
      timeAgoBn: '৫ ঘণ্টা আগে',
      severity: fireAlert.detected ? 'CRITICAL' : 'INFO',
      isRead: true,
    },
    {
      id: 'notif-5',
      category: 'irrigation_fertilizer',
      titleBn: 'সুষম সেচ সতর্কতা: আগামী কাল বৃষ্টির সম্ভাবনা নেই',
      descriptionBn: 'নাসার ৭ দিনের পূর্বাভাস অনুযায়ী আগামী কাল আকাশ পরিষ্কার থাকবে। সন্ধ্যার আগে হালকা স্প্রিঙ্কলার বা প্লাবন সেচ নিশ্চিত করুন।',
      source: 'NASA POWER Climatology API',
      timeAgoBn: 'গতকাল',
      severity: 'INFO',
      isRead: true,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markItemAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const filteredNotifs = notifications.filter((item) => {
    if (activeTab === 'disaster') return item.category === 'disaster';
    if (activeTab === 'reminders') return item.category === 'irrigation_fertilizer';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
              ইনবক্স ও সতর্কতা
              {unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#E2136E] text-white text-[10px] font-normal flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-[11px] text-slate-500 font-normal">
              নাসার রিয়েল-টাইম আর্লি ওয়ার্নিং ও কৃষি নোটিফিকেশন
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-[11px] font-normal text-[#E2136E] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>পড়া হয়েছে</span>
          </button>
        )}
      </div>

      <div className="max-w-md sm:max-w-lg mx-auto w-full px-3 sm:px-4 py-4 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#FDE8F1] shadow-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 rounded-xl text-xs font-normal transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#E2136E] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#E2136E]'
            }`}
          >
            সব নোটিফিকেশন ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('disaster')}
            className={`flex-1 py-2 rounded-xl text-xs font-normal transition-all cursor-pointer ${
              activeTab === 'disaster'
                ? 'bg-[#E2136E] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#E2136E]'
            }`}
          >
            ঝুঁকি সতর্কতা
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`flex-1 py-2 rounded-xl text-xs font-normal transition-all cursor-pointer ${
              activeTab === 'reminders'
                ? 'bg-[#E2136E] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#E2136E]'
            }`}
          >
            সার ও সেচ
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifs.map((item) => {
            const isCritical = item.severity === 'CRITICAL';
            const isWarning = item.severity === 'WARNING';

            return (
              <div
                key={item.id}
                onClick={() => markItemAsRead(item.id)}
                className={`bg-white rounded-3xl p-4 border transition-all shadow-xs relative overflow-hidden cursor-pointer ${
                  !item.isRead ? 'border-[#E2136E]/40 shadow-sm' : 'border-[#FDE8F1]'
                }`}
              >
                {/* Left Colored Accent Bar for Unread */}
                {!item.isRead && (
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#E2136E]" />
                )}

                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center ${
                      isCritical
                        ? 'bg-rose-100 text-rose-600'
                        : isWarning
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-[#FDE8F1] text-[#E2136E]'
                    }`}
                  >
                    {isCritical ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Bell className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-normal px-2 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isWarning
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isCritical ? 'জরুরি দুর্যোগ সতর্কতা' : isWarning ? 'সতর্কতা' : 'তথ্য ও রিমাইন্ডার'}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-normal">
                        <Clock className="w-3 h-3" />
                        {item.timeAgoBn}
                      </span>
                    </div>

                    <h3 className="text-xs font-normal text-[#212121] leading-snug">
                      {item.titleBn}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.descriptionBn}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-mono font-normal">
                        {item.source}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSpeak(`${item.titleBn}। ${item.descriptionBn}`);
                        }}
                        className="flex items-center gap-1 text-[11px] font-normal text-[#E2136E] hover:underline"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>ভয়েস শুনুন</span>
                      </button>
                    </div>
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
