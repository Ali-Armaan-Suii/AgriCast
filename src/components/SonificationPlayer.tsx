import React, { useState } from 'react';
import { FieldPlot, FireHotspotAlert, NasaTelemetry } from '../types';
import { sonificationEngine } from '../services/sonificationService';
import { Headphones, Loader2, Play, Square, Volume2, VolumeX } from 'lucide-react';

interface SonificationPlayerProps {
  activePlot?: FieldPlot;
  telemetry: NasaTelemetry;
  fireAlert: FireHotspotAlert;
}

export const SonificationPlayer: React.FC<SonificationPlayerProps> = ({
  activePlot,
  telemetry,
  fireAlert,
}) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const handlePlayAcousticTone = async () => {
    if (isPlayingSound) {
      sonificationEngine.stopAcoustic();
      setIsPlayingSound(false);
      return;
    }

    setIsPlayingSound(true);
    await sonificationEngine.playAcousticSignature(telemetry, fireAlert, 4500);
    setIsPlayingSound(false);
  };

  const handlePlayVoice = async () => {
    if (isPlayingVoice) {
      sonificationEngine.stopSpeaking();
      setIsPlayingVoice(false);
      return;
    }

    setIsPlayingVoice(true);
    const synth = window.speechSynthesis;
    if (synth) {
      const text = `মাটির আর্দ্রতা ১৮ শতাংশ। আগামী ৪৮ ঘণ্টায় বৃষ্টির কোনো সম্ভাবনা নেই। আজ সূর্যাস্তের পর সেচ দিন।`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.onend = () => setIsPlayingVoice(false);
      utterance.onerror = () => setIsPlayingVoice(false);
      synth.speak(utterance);
    } else {
      setIsPlayingVoice(false);
    }
  };

  return (
    <div className="p-5 bg-white border border-[#FDE8F1] rounded-2xl shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#FDE8F1] text-[#E2136E]">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[#212121] text-base">
              ডেটা সোনিফিকেশন ও ভয়েস পরামর্শ (Data Sonification)
            </h3>
            <p className="text-xs text-slate-500">
              নাসার জটিল গ্রাফ ও স্যাটেলাইট রিডিংকে অডিও টোন ও স্পষ্ট বাংলা কণ্ঠে রূপান্তর।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayAcousticTone}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              isPlayingSound
                ? 'bg-rose-600 text-white'
                : 'bg-[#E2136E] hover:bg-[#C20F5D] text-white shadow-xs'
            }`}
          >
            {isPlayingSound ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlayingSound ? 'টোন বন্ধ করুন' : 'অ্যাকোস্টিক টোন শুনুন'}
          </button>

          <button
            onClick={handlePlayVoice}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              isPlayingVoice
                ? 'bg-rose-600 text-white'
                : 'bg-[#FDE8F1] hover:bg-[#FCE4EC] text-[#E2136E] border border-[#FAD2E1]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            {isPlayingVoice ? 'ভয়েস বন্ধ' : 'বাংলা ভয়েস গাইড'}
          </button>
        </div>
      </div>
    </div>
  );
};
