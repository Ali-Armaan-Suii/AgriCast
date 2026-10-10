/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  BestFarmingWindow,
  EarlyWarningItem,
  FieldPlot,
  FireHotspotAlert,
  GeoCoordinates,
  NasaPowerDayForecast,
  NasaTelemetry,
  PrescriptiveMitigation,
  TimelineDataPoint,
  WhatIfSimulation,
  WhyRootCauseItem,
} from './types';
import {
  DEFAULT_PLOTS,
  calculateBestFarmingWindow,
  computeWhatIf,
  fetchNasaPowerForecast,
  getEarlyWarnings,
  getFireAlert,
  getHistoricalTimeline,
  getPrescriptiveActions,
  getTelemetryForField,
  getWhyRootCause,
} from './services/nasaService';
import { sonificationEngine } from './services/sonificationService';
import { BANGLADESH_CROPS, CropVarietyInfo } from './data/bangladeshAgriData';
import { AgroHeroHeader } from './components/AgroHeroHeader';
import { AgroServicesGrid } from './components/AgroServicesGrid';
import { AgroBottomNav } from './components/AgroBottomNav';
import { TheSevenModules } from './components/TheSevenModules';
import { MyFieldMapPage } from './components/MyFieldMapPage';
import { CropCatalogPage } from './components/CropCatalogPage';
import { FarmingRoadmapPage } from './components/FarmingRoadmapPage';
import { InboxAlertsPage } from './components/InboxAlertsPage';
import { SoilScannerModal } from './components/SoilScannerModal';
import { AuthGateView } from './components/AuthGateView';
import { getFirebaseAuth } from './services/firebaseConfig';
import {
  Camera,
  CheckCircle,
  Crosshair,
  Droplets,
  Play,
  RotateCcw,
  Scan,
  Sparkles,
  Sprout,
  X,
} from 'lucide-react';

export type AppPage = 'home' | 'my_field' | 'crop_catalog' | 'farming_roadmap' | 'inbox';

export default function App() {
  // Firebase Authentication State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  const [plots, setPlots] = useState<FieldPlot[]>(DEFAULT_PLOTS);
  const [activePlot, setActivePlot] = useState<FieldPlot>(DEFAULT_PLOTS[0]);
  const [coordinates, setCoordinates] = useState<GeoCoordinates>(DEFAULT_PLOTS[0].coordinates);

  const [forecast, setForecast] = useState<NasaPowerDayForecast[]>([]);
  const [telemetry, setTelemetry] = useState<NasaTelemetry>(getTelemetryForField(DEFAULT_PLOTS[0]));
  const [bestTime, setBestTime] = useState<BestFarmingWindow>({
    status: 'OPTIMAL',
    recommendedAction: 'মাটির আর্দ্রতা অনুযায়ী আজ সূর্যাস্তের পর সেচ দিন',
    windowDays: 'আগামী ২৪ থেকে ৪৮ ঘণ্টা',
    rationale: 'শিকড় অঞ্চলে পানির স্বাভাবিক ভারসাম্য বজায় রাখতে ড্রিপ সেচ দিন।',
    moistureVsRainBalance: 'আগামী ৪৮ ঘণ্টায় বৃষ্টিপাতের সম্ভাবনা নেই।',
    riskFactor: 'LOW',
  });

  const [fireAlert, setFireAlert] = useState<FireHotspotAlert>(getFireAlert(DEFAULT_PLOTS[0]));
  const [timeline, setTimeline] = useState<TimelineDataPoint[]>(getHistoricalTimeline());
  const [earlyWarnings, setEarlyWarnings] = useState<EarlyWarningItem[]>([]);
  const [whyRootCause, setWhyRootCause] = useState<WhyRootCauseItem>(getWhyRootCause(telemetry));
  const [whatIfSim, setWhatIfSim] = useState<WhatIfSimulation>(computeWhatIf(telemetry, 2.0, -30, 3));
  const [prescriptions, setPrescriptions] = useState<PrescriptiveMitigation[]>(getPrescriptiveActions());

  // Multi-page Navigation State
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedCrop, setSelectedCrop] = useState<CropVarietyInfo>(BANGLADESH_CROPS[0]);

  // Interactive app state
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [bottomNavTab, setBottomNavTab] = useState<'home' | 'fields' | 'scan' | 'inbox'>('home');
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // 1. Production Firebase Auth Observer
  useEffect(() => {
    let unsubscribe: any = null;
    let timer: any = null;

    const initAuth = () => {
      const auth = getFirebaseAuth();
      if (auth) {
        unsubscribe = auth.onAuthStateChanged((user: any) => {
          setCurrentUser(user);
          setAuthInitialized(true);
        });
      } else {
        // Retry shortly if compat scripts are still parsing
        timer = setTimeout(initAuth, 150);
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getFirebaseAuth();
      if (auth) {
        await auth.signOut();
      }
      setCurrentUser(null);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Sync data whenever activePlot changes
  useEffect(() => {
    setCoordinates(activePlot.coordinates);
    const newTelemetry = getTelemetryForField(activePlot);
    setTelemetry(newTelemetry);
    const newFire = getFireAlert(activePlot);
    setFireAlert(newFire);
    setEarlyWarnings(getEarlyWarnings(newTelemetry, newFire));
    setWhyRootCause(getWhyRootCause(newTelemetry));
    setWhatIfSim(computeWhatIf(newTelemetry, 1.5, -20, 2));

    loadWeatherForecast(activePlot.coordinates.latitude, activePlot.coordinates.longitude, newTelemetry);
  }, [activePlot]);

  const loadWeatherForecast = async (lat: number, lon: number, telem: NasaTelemetry) => {
    try {
      const data = await fetchNasaPowerForecast(lat, lon);
      setForecast(data);
      const computedWindow = calculateBestFarmingWindow(data, telem);
      setBestTime(computedWindow);
    } catch {
      // Fallback
    }
  };

  const handleUpdateWhatIf = (tempOffset: number, rainMultiplier: number, delayDays: number) => {
    const updated = computeWhatIf(telemetry, tempOffset, rainMultiplier, delayDays);
    setWhatIfSim(updated);
  };

  const handleSpeakBengali = (customText?: string) => {
    if (isPlayingVoice) {
      window.speechSynthesis?.cancel();
      setIsPlayingVoice(false);
      return;
    }
    if ('speechSynthesis' in window) {
      setIsPlayingVoice(true);
      const text =
        customText ||
        `${coordinates.locationName || 'তিস্তা অববাহিকা কৃষি ব্লকে'} রাতে বজ্রসহ মৃদু বৃষ্টিপাত হচ্ছে। মাটির আর্দ্রতা ${Math.round(
          telemetry.smapSurfaceMoisture * 100
        )} শতাংশ। ফসলের শিকড় অঞ্চলে পানির স্বাভাবিক ভারসাম্য বজায় রয়েছে।`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.onend = () => setIsPlayingVoice(false);
      utterance.onerror = () => setIsPlayingVoice(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Bottom navigation tab click
  const handleBottomNavSelect = (tab: 'home' | 'fields' | 'scan' | 'inbox') => {
    setBottomNavTab(tab);
    if (tab === 'home') {
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'fields') {
      setCurrentPage('my_field');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'scan') {
      setIsScanModalOpen(true);
    } else if (tab === 'inbox') {
      setCurrentPage('inbox');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Save updated plot from MyFieldMapPage
  const handleSavePlotFromMap = (updatedPlot: FieldPlot) => {
    setPlots((prev) => {
      const exists = prev.some((p) => p.id === updatedPlot.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedPlot.id ? updatedPlot : p));
      }
      return [updatedPlot, ...prev];
    });
    setActivePlot(updatedPlot);
  };

  // Select crop from Catalog and navigate to Roadmap
  const handleSelectCropFromCatalog = (crop: CropVarietyInfo) => {
    setSelectedCrop(crop);
    // Update active plot crop metadata
    const updated: FieldPlot = {
      ...activePlot,
      cropType: crop.nameBn,
      cropVariety: crop.nameEn,
      cropVarietyBn: crop.varieties[0] || crop.nameBn,
      growthStageBn: crop.stages[0]?.titleBn || 'প্রাথমিক বৃদ্ধি পর্যায়',
    };
    setActivePlot(updated);
    setCurrentPage('farming_roadmap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle selecting service from the floating AgroServicesGrid
  const handleSelectService = (serviceKey: string, moduleIndex: number) => {
    if (serviceKey === 'soil_scanner') {
      setIsScanModalOpen(true);
      return;
    }
    if (serviceKey === 'farming_roadmap') {
      setCurrentPage('crop_catalog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (serviceKey === 'fire_alert') {
      setCurrentPage('inbox');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (moduleIndex >= 0) {
      setActiveModuleIndex(moduleIndex);
      const el = document.getElementById('agri-modules-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Auth Gate: If user is logged out and auth is checked, show full-screen AuthGateView
  if (authInitialized && !currentUser) {
    return <AuthGateView onSuccess={() => {}} />;
  }

  // Derived user display attributes from Firebase User
  const userDisplayName =
    currentUser?.displayName ||
    (currentUser?.email ? currentUser.email.split('@')[0] : null) ||
    currentUser?.phoneNumber ||
    'আলী আরমান';

  const userPhotoURL = currentUser?.photoURL || null;
  const userEmailOrPhone = currentUser?.email || currentUser?.phoneNumber || null;

  return (
    <div className="w-full min-h-screen bg-[#F5F6F8] text-[#212121] flex flex-col font-sans pb-24 selection:bg-[#E2136E]/20 selection:text-[#E2136E]">
      {/* DIRECT MOBILE APP CONTAINER (Edge-to-Edge on phone, centered max-w-lg on wide displays) */}
      <div className="w-full max-w-md sm:max-w-lg mx-auto flex flex-col flex-1">
        {/* ========================================================
            ROUTING VIEW 1: PAGE 1 - MY FIELD MAP & GPS SETUP
           ======================================================== */}
        {currentPage === 'my_field' && (
          <MyFieldMapPage
            activePlot={activePlot}
            onBack={() => {
              setCurrentPage('home');
              setBottomNavTab('home');
            }}
            onSavePlot={handleSavePlotFromMap}
            onOpenCropCatalog={() => setCurrentPage('crop_catalog')}
          />
        )}

        {/* ========================================================
            ROUTING VIEW 2: PAGE 2 - BANGLADESH CROP CATALOG
           ======================================================== */}
        {currentPage === 'crop_catalog' && (
          <CropCatalogPage
            activePlot={activePlot}
            onBack={() => setCurrentPage('home')}
            onSelectCrop={handleSelectCropFromCatalog}
          />
        )}

        {/* ========================================================
            ROUTING VIEW 3: PAGE 3 - FARMING ROADMAP & STEP-BY-STEP ENGINE
           ======================================================== */}
        {currentPage === 'farming_roadmap' && (
          <FarmingRoadmapPage
            crop={selectedCrop}
            activePlot={activePlot}
            telemetry={telemetry}
            onBack={() => setCurrentPage('crop_catalog')}
            onGoHome={() => {
              setCurrentPage('home');
              setBottomNavTab('home');
            }}
            onSpeak={handleSpeakBengali}
          />
        )}

        {/* ========================================================
            ROUTING VIEW 4: PAGE 4 - INBOX & DISASTER WARNINGS
           ======================================================== */}
        {currentPage === 'inbox' && (
          <InboxAlertsPage
            onBack={() => {
              setCurrentPage('home');
              setBottomNavTab('home');
            }}
            earlyWarnings={earlyWarnings}
            telemetry={telemetry}
            fireAlert={fireAlert}
            onSpeak={handleSpeakBengali}
          />
        )}

        {/* ========================================================
            ROUTING VIEW 0: HOME - bKASH CLONE DASHBOARD & MODULES
           ======================================================== */}
        {currentPage === 'home' && (
          <>
            {/* 1. ANIMATED HERO BANNER & STATUS BUTTON (Top Header) */}
            <AgroHeroHeader
              farmerName={userDisplayName}
              userEmail={userEmailOrPhone}
              userPhoto={userPhotoURL}
              coordinates={coordinates}
              telemetry={telemetry}
              language="bn"
              onLanguageToggle={() => {}}
              onRefresh={() => loadWeatherForecast(coordinates.latitude, coordinates.longitude, telemetry)}
              onSonifyToggle={() => handleSpeakBengali()}
              onScanClick={() => setIsScanModalOpen(true)}
              onSearchClick={() => {
                setCurrentPage('my_field');
                setBottomNavTab('fields');
              }}
              onLogout={handleLogout}
            />

            {/* 2. MAIN AGRICULTURAL SERVICES (4x2 Circular Grid) */}
            <AgroServicesGrid
              onSelectService={handleSelectService}
              activeModuleIndex={activeModuleIndex}
              fireHotspotCount={fireAlert.detected ? 1 : 0}
              earlyWarningCount={earlyWarnings.length}
              language="bn"
            />

            {/* 3. ACTIVE FIELD & AGRONOMIC SECTION (The 7 Core Modules) */}
            <div id="agri-modules-section" className="mt-4 px-3 sm:px-4">
              <TheSevenModules
                plots={plots}
                activePlot={activePlot}
                onSelectPlot={(p) => setActivePlot(p)}
                telemetry={telemetry}
                timeline={timeline}
                earlyWarnings={earlyWarnings}
                whyRootCause={whyRootCause}
                whatIfSim={whatIfSim}
                onUpdateWhatIf={handleUpdateWhatIf}
                prescriptions={prescriptions}
                activeModuleIndex={activeModuleIndex}
                onSelectModuleIndex={(idx) => setActiveModuleIndex(idx)}
                language="bn"
                onOpenMapLocation={() => {
                  setCurrentPage('my_field');
                  setBottomNavTab('fields');
                }}
                onOpenCropCatalog={() => setCurrentPage('crop_catalog')}
                onOpenFarmingRoadmap={() => setCurrentPage('farming_roadmap')}
              />
            </div>

            {/* Bottom spacer for fixed nav */}
            <div className="h-6" />
          </>
        )}
      </div>

      {/* ========================================================
          7. STICKY BOTTOM NAVIGATION BAR (Fixed at screen bottom)
         ======================================================== */}
      <AgroBottomNav
        activeTab={bottomNavTab}
        onSelectTab={handleBottomNavSelect}
        unreadCount={earlyWarnings.length}
        language="bn"
      />

      {/* ========================================================
          8. SMART SOIL SCANNER & NASA SPECTRAL ANALYZER MODAL
         ======================================================== */}
      <SoilScannerModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        activePlot={activePlot}
        telemetry={telemetry}
        onSpeak={handleSpeakBengali}
      />
    </div>
  );
}
