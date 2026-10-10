import React, { useState } from 'react';
import { CODE_FILES, CodeFile } from '../data/androidCodebase';
import { Check, Copy, FileCode, FolderGit2, Layers, Server } from 'lucide-react';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(CODE_FILES[1]); // Default to NasaPowerApiService.kt
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'সকল ফাইল (All)' },
    { id: 'data_retrofit', label: 'Retrofit & Data' },
    { id: 'compose_ui', label: 'Compose UI' },
    { id: 'firestore', label: 'Firestore Schema' },
    { id: 'background_smtp', label: 'WorkManager & SMTP' },
    { id: 'architecture', label: 'Package Tree' },
  ];

  const filteredFiles =
    activeCategory === 'all'
      ? CODE_FILES
      : CODE_FILES.filter((f) => f.category === activeCategory);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-[#FDE8F1] rounded-2xl overflow-hidden shadow-xs">
      {/* Top Header */}
      <div className="p-4 sm:p-5 bg-white border-b border-[#FDE8F1] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#FDE8F1] text-[#E2136E]">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[#212121] text-base">
                Android Jetpack Compose & Clean MVVM Codebase
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FDE8F1] text-[#E2136E] border border-[#FAD2E1] font-mono">
                PRODUCTION KOTLIN
              </span>
            </div>
            <p className="text-xs text-slate-500">
              NASA Retrofit API, Jetpack Compose UI, Cloud Firestore এবং WorkManager SMTP কোডবেস।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-[#FDE8F1] hover:bg-[#FCE4EC] text-[#E2136E] border border-[#FAD2E1] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#E2136E]" />}
            {copied ? 'কপি হয়েছে!' : 'কোড কপি'}
          </button>
        </div>
      </div>

      {/* Category selector */}
      <div className="px-4 py-2 bg-[#F5F6F8] border-b border-[#FDE8F1] flex items-center gap-1.5 overflow-x-auto text-xs">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeCategory === c.id
                ? 'bg-[#E2136E] text-white shadow-2xs'
                : 'text-slate-700 hover:text-[#E2136E] hover:bg-[#FDE8F1]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Main split view: File list + Code viewer */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        {/* Left file navigator */}
        <div className="md:col-span-4 bg-[#F5F6F8] border-r border-[#FDE8F1] p-3 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider px-2 py-1 font-mono">
            সোর্স ফাইল তালিকা
          </div>
          {filteredFiles.map((file) => (
            <button
              key={file.path}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start gap-2 cursor-pointer ${
                selectedFile.path === file.path
                  ? 'bg-white text-[#E2136E] shadow-xs border border-[#FDE8F1]'
                  : 'text-slate-700 hover:bg-white hover:text-[#E2136E]'
              }`}
            >
              <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${selectedFile.path === file.path ? 'text-[#E2136E]' : 'text-slate-400'}`} />
              <div className="truncate">
                <div className="font-mono text-xs">{file.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{file.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Right Code viewer */}
        <div className="md:col-span-8 p-4 bg-white overflow-auto max-h-[600px]">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 text-xs">
            <span className="font-mono text-[#E2136E]">{selectedFile.path}</span>
            <span className="text-slate-400 font-mono text-[11px]">{selectedFile.language.toUpperCase()}</span>
          </div>
          <pre className="text-xs font-mono text-[#212121] leading-relaxed overflow-x-auto p-4 bg-[#F5F6F8] rounded-xl border border-slate-200">
            <code>{selectedFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
