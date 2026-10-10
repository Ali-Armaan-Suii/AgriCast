import React, { useEffect, useRef, useState } from 'react';
import { KhetDrishtiStatusPill } from './KhetDrishtiStatusPill';
import {
  ArrowLeft,
  CheckCircle2,
  Crosshair,
  Droplets,
  Expand,
  Globe2,
  Info,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  Plus,
  Minus,
  RotateCcw,
  Search,
  Sparkles,
  Sprout,
  X,
} from 'lucide-react';
import L from 'leaflet';
import { BANGLADESH_DISTRICTS, BangladeshDistrict } from '../data/bangladeshAgriData';
import { FieldPlot, GeoCoordinates } from '../types';

interface MyFieldMapPageProps {
  activePlot: FieldPlot;
  onBack: () => void;
  onSavePlot: (updatedPlot: FieldPlot) => void;
  onOpenCropCatalog: () => void;
}

type MapMode = 'nasa_satellite' | 'nasa_smap' | 'normal';

export const MyFieldMapPage: React.FC<MyFieldMapPageProps> = ({
  activePlot,
  onBack,
  onSavePlot,
  onOpenCropCatalog,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<BangladeshDistrict>(() => {
    const found = BANGLADESH_DISTRICTS.find(
      (d) =>
        Math.abs(d.lat - activePlot.coordinates.latitude) < 0.2 &&
        Math.abs(d.lng - activePlot.coordinates.longitude) < 0.2
    );
    return found || BANGLADESH_DISTRICTS[0];
  });

  const [currentCoords, setCurrentCoords] = useState<GeoCoordinates>(activePlot.coordinates);
  const [plotName, setPlotName] = useState(activePlot.nameBn || activePlot.name);
  const [plotSize, setPlotSize] = useState('২.৫ বিঘা (৮২.৫ শতাংশ)');
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [mapMode, setMapMode] = useState<MapMode>('nasa_satellite');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [showFieldPerimeter, setShowFieldPerimeter] = useState(true);

  // Dynamic NASA GIBS Reference Date (YYYY-MM-DD)
  const [gibsDate, setGibsDate] = useState<string>(() => {
    const now = new Date();
    // Use 2 days prior to ensure global cloud-composite imagery is fully mosaicked in GIBS
    now.setDate(now.getDate() - 2);
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);
  const gpsMarkerRef = useRef<L.CircleMarker | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Filtered districts for search
  const filteredDistricts = BANGLADESH_DISTRICTS.filter((d) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      d.nameBn.includes(q) ||
      d.nameEn.toLowerCase().includes(q) ||
      d.divisionBn.includes(q) ||
      d.division.toLowerCase().includes(q)
    );
  });

  // Custom bKash Pink Pin Icon
  const createPinkPinIcon = () => {
    const svgIcon = `
      <div style="position: relative; width: 40px; height: 52px; display: flex; align-items: center; justify-content: center;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="36" height="48" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35)); transition: transform 0.2s;">
          <path d="M18 0 C8.06 0 0 8.06 0 18 C0 30 18 48 18 48 C18 48 36 30 36 18 C36 8.06 27.94 0 18 0 Z" fill="#E2136E"/>
          <circle cx="18" cy="18" r="9" fill="#FFFFFF"/>
          <circle cx="18" cy="18" r="5" fill="#C20F5D"/>
        </svg>
        <div style="position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); width: 8px; height: 3px; background: rgba(0,0,0,0.3); border-radius: 50%; filter: blur(1px);"></div>
      </div>
    `;
    return L.divIcon({
      className: 'custom-pink-marker',
      html: svgIcon,
      iconSize: [40, 52],
      iconAnchor: [20, 50],
      popupAnchor: [0, -48],
    });
  };

  // Helper to generate simulated field boundary polygon around lat/lng
  const calculatePlotPolygon = (lat: number, lng: number): [number, number][] => {
    // Approx 2.5 Bigha boundary (~33,000 sq ft = ~0.00075 lat/lng delta)
    const deltaLat = 0.00085;
    const deltaLng = 0.00095;
    return [
      [lat + deltaLat, lng - deltaLng],
      [lat + deltaLat * 0.9, lng + deltaLng * 1.1],
      [lat - deltaLat * 0.95, lng + deltaLng * 0.85],
      [lat - deltaLat * 1.05, lng - deltaLng * 0.9],
    ];
  };

  // Layer update helper
  const updateMapLayers = (map: L.Map, mode: MapMode, date: string) => {
    if (tileLayerGroupRef.current) {
      tileLayerGroupRef.current.clearLayers();
    } else {
      tileLayerGroupRef.current = L.layerGroup().addTo(map);
    }

    const group = tileLayerGroupRef.current;

    if (mode === 'nasa_satellite') {
      // 1. High-Resolution Underlying Satellite Imagery (Esri World Imagery)
      const baseImagery = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Esri World Imagery',
        }
      );
      group.addLayer(baseImagery);

      // 2. Direct NASA GIBS VIIRS True-Color Tile Layer (Overlaid with smooth opacity)
      const nasaGibsViirs = L.tileLayer(
        `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
        {
          maxNativeZoom: 9,
          maxZoom: 19,
          opacity: 0.92,
          attribution: 'NASA GIBS (VIIRS SNPP)',
        }
      );
      group.addLayer(nasaGibsViirs);

      // 3. Google Maps-Style Hybrid Overlay: Transparent Road Networks, Districts, and Boundaries
      const hybridLabels = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
          pane: 'overlayPane',
          attribution: 'CartoDB / OpenStreetMap Labels',
        }
      );
      group.addLayer(hybridLabels);
    } else if (mode === 'nasa_smap') {
      // 1. Base Satellite Imagery
      const baseImagery = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Esri World Imagery',
        }
      );
      group.addLayer(baseImagery);

      // 2. Direct NASA GIBS SMAP L4 Soil Moisture Layer (7-day composite)
      const nasaGibsSmap = L.tileLayer(
        `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/SMAP_L4_Analyzed_Surface_Soil_Moisture_7-day_Composite/default/${date}/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png`,
        {
          maxNativeZoom: 6,
          maxZoom: 19,
          opacity: 0.72,
          attribution: 'NASA GIBS (SMAP L4 Moisture)',
        }
      );
      group.addLayer(nasaGibsSmap);

      // 3. Hybrid Labels & Roads
      const hybridLabels = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
          pane: 'overlayPane',
          attribution: 'CartoDB Labels',
        }
      );
      group.addLayer(hybridLabels);
    } else {
      // Normal Vector Map: Clean OpenStreetMap / Voyager
      const normalVectorMap = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution: 'OpenStreetMap',
        }
      );
      group.addLayer(normalVectorMap);
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = currentCoords.latitude;
    const initialLng = currentCoords.longitude;

    // Create Leaflet instance with Google Maps-like smooth touch & gesture navigation
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      minZoom: 5,
      maxZoom: 19,
      zoomControl: false, // We render custom Google-style floating zoom buttons
      attributionControl: false,
      bounceAtZoomLimits: true,
      wheelPxPerZoomLevel: 100,
    });

    // Populate active tile layers
    updateMapLayers(map, mapMode, gibsDate);

    // Create draggable custom pink pin
    const pinkIcon = createPinkPinIcon();
    const marker = L.marker([initialLat, initialLng], {
      icon: pinkIcon,
      draggable: true,
      autoPan: true,
    }).addTo(map);

    marker.bindPopup(
      `<div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px 2px;">
        <div style="color: #E2136E; font-size: 13px; font-weight: 400; margin-bottom: 2px;">${plotName}</div>
        <div style="color: #212121; font-size: 11px; font-weight: 400;">${selectedDistrict.nameBn} (${selectedDistrict.divisionBn})</div>
        <div style="color: #64748B; font-size: 10px; font-weight: 400; margin-top: 2px;">মাটি: ${selectedDistrict.soilTypeBn}</div>
      </div>`,
      { closeButton: false }
    ).openPopup();

    // Create plot perimeter polygon
    const polygonCoords = calculatePlotPolygon(initialLat, initialLng);
    const polygon = L.polygon(polygonCoords, {
      color: '#E2136E',
      weight: 2,
      dashArray: '5, 5',
      fillColor: '#E2136E',
      fillOpacity: 0.18,
    }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      updateCoordinates(pos.lat, pos.lng);
      if (polygonRef.current) {
        polygonRef.current.setLatLngs(calculatePlotPolygon(pos.lat, pos.lng));
      }
    });

    marker.on('drag', () => {
      const pos = marker.getLatLng();
      if (polygonRef.current) {
        polygonRef.current.setLatLngs(calculatePlotPolygon(pos.lat, pos.lng));
      }
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      if (polygonRef.current) {
        polygonRef.current.setLatLngs(calculatePlotPolygon(e.latlng.lat, e.latlng.lng));
      }
      updateCoordinates(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;
    polygonRef.current = polygon;

    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      polygonRef.current = null;
      gpsMarkerRef.current = null;
    };
  }, []);

  // Sync layer changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMapLayers(mapInstanceRef.current, mapMode, gibsDate);
    }
  }, [mapMode, gibsDate]);

  // Sync perimeter visibility
  useEffect(() => {
    if (polygonRef.current && mapInstanceRef.current) {
      if (showFieldPerimeter) {
        if (!mapInstanceRef.current.hasLayer(polygonRef.current)) {
          polygonRef.current.addTo(mapInstanceRef.current);
        }
      } else {
        if (mapInstanceRef.current.hasLayer(polygonRef.current)) {
          mapInstanceRef.current.removeLayer(polygonRef.current);
        }
      }
    }
  }, [showFieldPerimeter]);

  // Handle map resize when expanding
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 200);
    }
  }, [isMapExpanded]);

  const updateCoordinates = (lat: number, lng: number) => {
    let closest = BANGLADESH_DISTRICTS[0];
    let minDistance = 9999;
    BANGLADESH_DISTRICTS.forEach((d) => {
      const dist = Math.sqrt((d.lat - lat) ** 2 + (d.lng - lng) ** 2);
      if (dist < minDistance) {
        minDistance = dist;
        closest = d;
      }
    });

    setSelectedDistrict(closest);
    const newCoords: GeoCoordinates = {
      latitude: Number(lat.toFixed(4)),
      longitude: Number(lng.toFixed(4)),
      locationName: closest.nameBn,
      region: closest.divisionBn,
      country: 'বাংলাদেশ',
    };
    setCurrentCoords(newCoords);

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.setPopupContent(
        `<div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px 2px;">
          <div style="color: #E2136E; font-size: 13px; font-weight: 400; margin-bottom: 2px;">${plotName}</div>
          <div style="color: #212121; font-size: 11px; font-weight: 400;">${closest.nameBn} (${closest.divisionBn})</div>
          <div style="color: #64748B; font-size: 10px; font-weight: 400; margin-top: 2px;">মাটি: ${closest.soilTypeBn}</div>
        </div>`
      );
    }
  };

  const handleSelectDistrict = (district: BangladeshDistrict) => {
    setSelectedDistrict(district);
    setSearchQuery('');
    updateCoordinates(district.lat, district.lng);

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([district.lat, district.lng], 13, {
        duration: 1.2,
      });
      markerRef.current.setLatLng([district.lat, district.lng]);
      if (polygonRef.current) {
        polygonRef.current.setLatLngs(calculatePlotPolygon(district.lat, district.lng));
      }
    }
  };

  // Google Maps-like GPS Auto-Detect with pulsing user location radar
  const handleDetectGps = () => {
    if (!('geolocation' in navigator)) {
      alert('আপনার ডিভাইসে জিপিএস সমর্থন করছে না। মানচিত্রের উপর ট্যাপ করে অবস্থান চিহ্নিত করুন।');
      return;
    }

    setIsLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocatingGps(false);
        const { latitude, longitude } = position.coords;
        updateCoordinates(latitude, longitude);

        if (mapInstanceRef.current && markerRef.current) {
          // Smooth Google-like fly animation
          mapInstanceRef.current.flyTo([latitude, longitude], 14, {
            duration: 1.5,
          });
          markerRef.current.setLatLng([latitude, longitude]);

          if (polygonRef.current) {
            polygonRef.current.setLatLngs(calculatePlotPolygon(latitude, longitude));
          }

          // Render or update pulsing GPS blue ring
          if (gpsMarkerRef.current) {
            gpsMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            const gpsDot = L.circleMarker([latitude, longitude], {
              radius: 9,
              color: '#FFFFFF',
              weight: 2.5,
              fillColor: '#2563EB',
              fillOpacity: 1,
            }).addTo(mapInstanceRef.current);
            gpsMarkerRef.current = gpsDot;
          }
        }
      },
      () => {
        setIsLocatingGps(false);
        // Fallback Saidpur / Dinajpur agro block
        handleSelectDistrict(BANGLADESH_DISTRICTS[1]);
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRecenterPlot = () => {
    if (mapInstanceRef.current && markerRef.current) {
      const pos = markerRef.current.getLatLng();
      mapInstanceRef.current.flyTo(pos, 13, { duration: 1 });
      markerRef.current.openPopup();
    }
  };

  const handleSaveAndAnalyze = () => {
    const updatedPlot: FieldPlot = {
      ...activePlot,
      id: `plot-${Date.now()}`,
      name: plotName,
      nameBn: plotName,
      coordinates: currentCoords,
      soilClassification: selectedDistrict.soilTypeEn,
      soilClassificationBn: selectedDistrict.soilTypeBn,
      areaDisplayBn: plotSize,
    };

    onSavePlot(updatedPlot);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onBack();
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F6F8] text-[#212121] flex flex-col font-sans pb-12">
      {/* 1. Header with bKash Pink Accent & Back Button */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#FDE8F1] shadow-xs px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-[#FDE8F1] text-[#E2136E] flex items-center justify-center hover:bg-[#FCE4EC] transition-colors cursor-pointer"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5 text-[#E2136E]" />
          </button>
          <div>
            <h1 className="text-base font-normal text-[#212121] flex items-center gap-1.5">
              আমার জমি নির্ধারণ করুন
            </h1>
            <p className="text-[11px] text-slate-500 font-normal">
              নাসা GIBS উপগ্রহ হাইব্রিড মানচিত্র ও মাটির প্রোফাইল
            </p>
          </div>
        </div>

        {/* GPS Quick Action */}
        <button
          onClick={handleDetectGps}
          disabled={isLocatingGps}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDE8F1] hover:bg-[#FCE4EC] text-[#E2136E] text-xs font-normal transition-all cursor-pointer border border-[#FAD2E1] shadow-xs"
        >
          <Crosshair className={`w-3.5 h-3.5 ${isLocatingGps ? 'animate-spin' : ''}`} />
          <span>{isLocatingGps ? 'শনাক্ত হচ্ছে...' : 'আমার অবস্থান'}</span>
        </button>
      </div>

      <div className="max-w-md sm:max-w-lg mx-auto w-full px-3 sm:px-4 py-4 space-y-4">
        {/* 2. Interactive Google-Style Location Search Bar */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white rounded-2xl px-3.5 py-2.5 border border-[#FDE8F1] shadow-xs focus-within:border-[#E2136E] transition-all">
            <Search className="w-4 h-4 text-[#E2136E] shrink-0" />
            <input
              type="text"
              placeholder="উপজেলা বা জেলা খুঁজুন (সৈয়দপুর, দিনাজপুর, বগুড়া, রংপুর)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-[#212121] font-normal placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-1 font-normal cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {filteredDistricts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#FDE8F1] rounded-2xl shadow-xl z-50 max-h-56 overflow-y-auto divide-y divide-slate-100">
              {filteredDistricts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDistrict(d)}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#FDE8F1] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-normal text-[#212121]">{d.nameBn} ({d.nameEn})</div>
                    <div className="text-[10px] text-slate-500 font-normal">বিভাগ: {d.divisionBn} • {d.soilTypeBn}</div>
                  </div>
                  <MapPin className="w-4 h-4 text-[#E2136E]" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick District Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[11px] font-normal text-slate-500 whitespace-nowrap mr-1">জনপ্রিয় কৃষি এলাকা:</span>
          {BANGLADESH_DISTRICTS.slice(0, 6).map((d) => (
            <button
              key={d.id}
              onClick={() => handleSelectDistrict(d)}
              className={`px-2.5 py-1 rounded-full text-xs font-normal whitespace-nowrap transition-all cursor-pointer ${
                selectedDistrict.id === d.id
                  ? 'bg-[#E2136E] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-[#FDE8F1] hover:bg-[#FDE8F1] hover:text-[#E2136E]'
              }`}
            >
              {d.nameBn}
            </button>
          ))}
        </div>

        {/* স্থানান্তরকৃত বাটনদ্বয়: ১. জমির অবস্থা দেখুন & ২. মাটির আর্দ্রতা ও স্যাটেলাইট স্কোর */}
        <div className="bg-gradient-to-br from-[#FFF5F8] via-white to-[#FDE8F1]/40 border border-[#FAD2E1] rounded-2xl p-3.5 shadow-2xs">
          <KhetDrishtiStatusPill
            moisturePercent={22}
            isSafe={true}
            language="bn"
            variant="light"
          />
        </div>

        {/* 3. NASA SATELLITE TILES & GOOGLE HYBRID MAP CARD */}
        <div className="bg-white rounded-3xl p-3 border border-[#FDE8F1] shadow-xs space-y-2 relative overflow-hidden">
          {/* Top Bar above Map */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FDE8F1] text-[#E2136E] flex items-center justify-center">
                <Globe2 className="w-4 h-4 text-[#E2136E]" />
              </div>
              <div>
                <span className="text-xs font-normal text-[#212121] block">
                  নাসা GIBS উপগ্রহ হাইব্রিড ভিউ
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  VIIRS SNPP TrueColor + গুগল-স্টাইল লেবেল
                </span>
              </div>
            </div>

            {/* Layer Mode Indicator Pill */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-normal border border-emerald-200">
                {mapMode === 'nasa_satellite'
                  ? '🛰️ স্যাটেলাইট লাইভ'
                  : mapMode === 'nasa_smap'
                  ? '💧 SMAP আর্দ্রতা'
                  : '🗺️ রোড ম্যাপ'}
              </span>
            </div>
          </div>

          {/* Interactive Map Frame with Overlaid Google Controls */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            {/* The Leaflet Container */}
            <div
              ref={mapContainerRef}
              className={`w-full transition-all duration-300 relative z-10 ${
                isMapExpanded ? 'h-[460px]' : 'h-72 sm:h-80'
              }`}
            />

            {/* Top-Right Floating Map Layer Switcher */}
            <div className="absolute top-2.5 right-2.5 z-20 flex flex-col items-end gap-1.5">
              <button
                onClick={() => setShowLayerMenu((prev) => !prev)}
                className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-xs text-[#212121] text-[11px] font-normal shadow-md border border-[#FDE8F1] hover:border-[#E2136E] flex items-center gap-1.5 transition-all cursor-pointer"
                title="ম্যাপের ধরন পরিবর্তন করুন"
              >
                <Layers className="w-3.5 h-3.5 text-[#E2136E]" />
                <span>ম্যাপ লেয়ার</span>
              </button>

              {/* Layer Selection Dropdown */}
              {showLayerMenu && (
                <div className="bg-white rounded-2xl p-2 shadow-xl border border-[#FDE8F1] text-xs space-y-1 w-48 animate-fade-in">
                  <div className="text-[10px] text-slate-400 px-2 py-0.5 uppercase tracking-wider font-normal">
                    স্যাটেলাইট ফিল্টার
                  </div>
                  <button
                    onClick={() => {
                      setMapMode('nasa_satellite');
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-normal flex items-center justify-between transition-colors cursor-pointer ${
                      mapMode === 'nasa_satellite'
                        ? 'bg-[#FDE8F1] text-[#E2136E]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>🛰️ নাসা স্যাটেলাইট হাইব্রিড</span>
                    {mapMode === 'nasa_satellite' && <span className="text-[#E2136E] text-[10px]">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      setMapMode('nasa_smap');
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-normal flex items-center justify-between transition-colors cursor-pointer ${
                      mapMode === 'nasa_smap'
                        ? 'bg-[#FDE8F1] text-[#E2136E]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>💧 নাসা আর্দ্রতা (SMAP)</span>
                    {mapMode === 'nasa_smap' && <span className="text-[#E2136E] text-[10px]">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      setMapMode('normal');
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-normal flex items-center justify-between transition-colors cursor-pointer ${
                      mapMode === 'normal'
                        ? 'bg-[#FDE8F1] text-[#E2136E]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>🗺️ সাধারণ রোড ম্যাপ</span>
                    {mapMode === 'normal' && <span className="text-[#E2136E] text-[10px]">✓</span>}
                  </button>

                  <div className="pt-1 mt-1 border-t border-slate-100 flex items-center justify-between px-2">
                    <span className="text-[10px] text-slate-500 font-normal">প্লট সীমানা দেখান</span>
                    <input
                      type="checkbox"
                      checked={showFieldPerimeter}
                      onChange={(e) => setShowFieldPerimeter(e.target.checked)}
                      className="accent-[#E2136E] cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom-Right Floating Controls (Google Maps-Style) */}
            <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5">
              {/* Recenter Pin */}
              <button
                onClick={handleRecenterPlot}
                className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-xs text-[#212121] shadow-md border border-[#FDE8F1] hover:text-[#E2136E] flex items-center justify-center transition-all cursor-pointer"
                title="প্লটের অবস্থানে ফিরে যান"
              >
                <Navigation className="w-4 h-4" />
              </button>

              {/* GPS Pulse Button */}
              <button
                onClick={handleDetectGps}
                disabled={isLocatingGps}
                className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-xs text-[#E2136E] shadow-md border border-[#FDE8F1] hover:bg-[#FDE8F1] flex items-center justify-center transition-all cursor-pointer"
                title="বর্তমান অবস্থান শনাক্ত করুন"
              >
                <Crosshair className={`w-4 h-4 ${isLocatingGps ? 'animate-spin' : ''}`} />
              </button>

              {/* Expand / Minimize Map Height */}
              <button
                onClick={() => setIsMapExpanded((prev) => !prev)}
                className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-xs text-[#212121] shadow-md border border-[#FDE8F1] hover:text-[#E2136E] flex items-center justify-center transition-all cursor-pointer"
                title={isMapExpanded ? 'ম্যাপ ছোট করুন' : 'ম্যাপ বড় করুন'}
              >
                {isMapExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Zoom In & Out */}
              <div className="bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-[#FDE8F1] flex flex-col divide-y divide-slate-100 overflow-hidden">
                <button
                  onClick={handleZoomIn}
                  className="w-8 h-8 text-[#212121] hover:text-[#E2136E] flex items-center justify-center transition-colors cursor-pointer"
                  title="জুম ইন"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-8 h-8 text-[#212121] hover:text-[#E2136E] flex items-center justify-center transition-colors cursor-pointer"
                  title="জুম আউট"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom-Left NASA GIBS Satellite Badge */}
            <div className="absolute bottom-2.5 left-2.5 z-20 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[10px] font-normal font-mono flex items-center gap-1.5 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>NASA GIBS · {gibsDate}</span>
            </div>
          </div>

          {/* Under-Map Info Bar */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-normal px-1 pt-1 gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#E2136E]" />
              পিন টেনে বা ম্যাপে ক্লিক করে জমির দাগ বা সীমানা নির্দিষ্ট করুন
            </span>
            <span className="font-mono text-[#E2136E] font-normal">
              {currentCoords.latitude}° N, {currentCoords.longitude}° E
            </span>
          </div>

          {/* NASA SMAP Legend when in SMAP Mode */}
          {mapMode === 'nasa_smap' && (
            <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs space-y-1.5 animate-fade-in">
              <div className="flex items-center justify-between text-[11px] text-blue-900 font-normal">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-600" />
                  NASA SMAP L4 মাটির আর্দ্রতা স্কেল (ভলিউমেট্রিক m³/m³)
                </span>
                <span className="text-[10px] text-blue-700">৭-দিনের উপগ্রহ কম্পোজিট</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-blue-600 shadow-inner" />
              <div className="flex justify-between text-[10px] text-blue-800 font-normal">
                <span>শুষ্ক (&lt;১৫%)</span>
                <span>অনুকূল আর্দ্রতা (২৫%-৩৫%)</span>
                <span>স্যাচুরেটেড (&gt;৪০%)</span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Auto-Populated Land Telemetry Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#FDE8F1] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#FDE8F1] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FDE8F1] text-[#E2136E] flex items-center justify-center">
                <Layers className="w-4 h-4 text-[#E2136E]" />
              </div>
              <div>
                <h3 className="text-xs font-normal text-[#212121]">মাটি ও ভৌগোলিক তথ্য (NASA / SRDI)</h3>
                <p className="text-[10px] text-slate-500 font-normal">শনাক্তকৃত স্থানাঙ্কের ভিত্তিতে স্বয়ংক্রিয় বিশ্লেষণ</p>
              </div>
            </div>
            <span className="text-xs font-normal text-[#E2136E] bg-[#FDE8F1] px-2.5 py-1 rounded-full">
              {selectedDistrict.nameBn}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="bg-[#F5F6F8] rounded-xl p-2.5">
              <span className="text-[10px] text-slate-500 block font-normal">মাটির শ্রেণি (Soil Classification)</span>
              <span className="text-xs font-normal text-[#212121] leading-tight block mt-0.5">
                {selectedDistrict.soilTypeBn}
              </span>
            </div>

            <div className="bg-[#F5F6F8] rounded-xl p-2.5">
              <span className="text-[10px] text-slate-500 block font-normal">কৃষি পরিবেশ অঞ্চল (AEZ)</span>
              <span className="text-xs font-normal text-[#212121] leading-tight block mt-0.5">
                {selectedDistrict.agroZone}
              </span>
            </div>

            <div className="bg-[#F5F6F8] rounded-xl p-2.5">
              <span className="text-[10px] text-slate-500 block font-normal">মাটির পিএইচ (pH মান)</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-normal text-[#212121]">{selectedDistrict.soilPh}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-normal">
                  আদর্শ
                </span>
              </div>
            </div>

            <div className="bg-[#F5F6F8] rounded-xl p-2.5">
              <span className="text-[10px] text-slate-500 block font-normal">জৈব পদার্থের মাত্রা</span>
              <span className="text-xs font-normal text-[#212121] leading-tight block mt-0.5">
                {selectedDistrict.soilOrganicMatter} (অনুকূল)
              </span>
            </div>
          </div>
        </div>

        {/* 5. Plot Details & Crop Assignment */}
        <div className="bg-white rounded-3xl p-4 border border-[#FDE8F1] shadow-xs space-y-3">
          <h3 className="text-xs font-normal text-[#212121] flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-[#E2136E]" />
            প্লটের নাম ও ফসলের বিবরণ
          </h3>

          <div className="space-y-2.5">
            <div>
              <label className="text-[11px] font-normal text-slate-600 block mb-1">
                প্লটের নাম (Plot Name)
              </label>
              <input
                type="text"
                value={plotName}
                onChange={(e) => setPlotName(e.target.value)}
                placeholder="যেমন: উত্তর মাঠ - প্লট ১"
                className="w-full bg-[#F5F6F8] border border-[#FDE8F1] rounded-xl px-3 py-2 text-xs font-normal text-[#212121] focus:outline-none focus:border-[#E2136E]"
              />
            </div>

            <div>
              <label className="text-[11px] font-normal text-slate-600 block mb-1">
                জমির পরিমাপ (বিঘা / একর / শতক)
              </label>
              <input
                type="text"
                value={plotSize}
                onChange={(e) => setPlotSize(e.target.value)}
                placeholder="যেমন: ২.৫ বিঘা বা ৮২ শতক"
                className="w-full bg-[#F5F6F8] border border-[#FDE8F1] rounded-xl px-3 py-2 text-xs font-normal text-[#212121] focus:outline-none focus:border-[#E2136E]"
              />
            </div>

            {/* Crop Selector Card */}
            <div className="pt-1">
              <label className="text-[11px] font-normal text-slate-600 block mb-1">
                নির্ধারিত ফসল (Assigned Crop)
              </label>
              <div className="flex items-center justify-between bg-[#FDE8F1] border border-[#FAD2E1] rounded-2xl p-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#E2136E] flex items-center justify-center font-normal text-xs shadow-xs">
                    🌾
                  </div>
                  <div>
                    <h4 className="text-xs font-normal text-[#212121]">
                      {activePlot.cropVarietyBn || activePlot.cropVariety || 'বোরো ধান (ব্রি ধান-২৮)'}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-normal">
                      পর্যায়: {activePlot.growthStageBn || activePlot.growthStage}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onOpenCropCatalog}
                  className="px-3 py-1.5 rounded-xl bg-[#E2136E] hover:bg-[#C20F5D] text-white text-[11px] font-normal transition-all cursor-pointer shadow-xs"
                >
                  ফসল পরিবর্তন
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Save Plot Button */}
        <div className="pt-2">
          <button
            onClick={handleSaveAndAnalyze}
            className="w-full py-3.5 rounded-2xl bg-[#E2136E] hover:bg-[#C20F5D] text-white font-normal text-sm shadow-md shadow-[#E2136E]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>প্লট সংরক্ষণ ও স্যাটেলাইট বিশ্লেষণ শুরু করুন</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {showSavedToast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-[#212121] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-normal border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>প্লট সফলভাবে সংরক্ষিত ও আপডেট করা হয়েছে!</span>
        </div>
      )}
    </div>
  );
};
