export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  locationName: string;
  region: string;
  country: string;
}

export interface FieldPlot {
  id: string;
  name: string;
  cropType: string;
  cropVariety: string;
  sowingDate: string;
  harvestProjected: string;
  areaAcres: number;
  soilClassification: string;
  soilClassificationBn?: string;
  coordinates: GeoCoordinates;
  currentNdvi: number;
  growthStage: string;
  nameBn?: string;
  cropVarietyBn?: string;
  growthStageBn?: string;
  areaDisplayBn?: string;
}

export interface NasaPowerDayForecast {
  date: string;
  dayName: string;
  tempMaxC: number;
  tempMinC: number;
  tempAvgC: number;
  precipMm: number;
  humidityRh2m: number;
  solarInsolation: number; // MJ/m^2/day
  windSpeed10m: number; // m/s
  farmingSuitabilityScore: number; // 0 to 100
}

export interface BestFarmingWindow {
  status: 'OPTIMAL' | 'FAIR' | 'UNFAVORABLE' | 'RESTRICTED';
  recommendedAction: string;
  windowDays: string;
  rationale: string;
  moistureVsRainBalance: string;
  riskFactor: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface NasaTelemetry {
  // NASA SMAP (Soil Moisture Active Passive)
  smapSurfaceMoisture: number; // m^3/m^3 (0.05 to 0.45)
  smapRootZoneMoisture: number; // m^3/m^3 (0.10 to 0.50)
  smapMoistureStatus: 'OPTIMAL' | 'MODERATE' | 'DEFICIT' | 'SURPLUS';

  // NASA ECOSTRESS (ISS Thermal Infrared Sensor)
  ecostressCanopyTempC: number; // Celsius
  ecostressAirTempDiffC: number; // Canopy minus Air (thermal stress indicator)
  ecostressEsi: number; // Evaporative Stress Index (0.0 to 1.0)
  ecostressStatus: 'NORMAL' | 'ELEVATED' | 'CRITICAL_WATER_STRESS';

  // NASA GPM (Global Precipitation Measurement IMERG)
  gpmPrecipRateMmHr: number; // mm/hr
  gpmAccumulated24hMm: number; // mm
  gpmLastRainTimestamp: string;

  // NASA-ISRO NISAR (Dual-frequency L-Band & S-Band SAR)
  nisarLbandCoherence: number; // 0.0 to 1.0 (coherence index)
  nisarSubsurfaceMoisturePct: number; // % estimated up to 10cm depth
  nisarSurfaceDeformationMm: number; // mm/year displacement (subsidence/heave)
  nisarSoilRoughnessIndex: number;
}

export interface FireHotspotAlert {
  detected: boolean;
  satellite: 'VIIRS' | 'MODIS';
  distanceKm: number;
  brightnessTempKelvin: number;
  confidencePct: number;
  fireRadiativePowerMw: number;
  detectedAt: string;
  direction: string;
  isThreatToCrop: boolean;
  stubbleBurnRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
}

export interface EarlyWarningItem {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY' | 'INFO';
  title: string;
  sourceDataset: string;
  summary: string;
  detectedTime: string;
  mitigationSnippet: string;
}

export interface WhyRootCauseItem {
  id: string;
  phenomenon: string;
  primaryDrivers: {
    factor: string;
    satelliteSource: string;
    value: string;
    deviation: string;
    weightPct: number;
  }[];
  causalExplanation: string;
  confidence: number;
}

export interface WhatIfSimulation {
  tempOffsetCelsius: number; // e.g. -4 to +6
  precipMultiplierPct: number; // e.g. -80% to +100%
  irrigationDelayDays: number; // 0 to 14 days
  simulatedSmapMoisture: number;
  simulatedEcostressCanopyTemp: number;
  projectedYieldRiskPct: number;
  stressCategory: 'LOW' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
}

export interface PrescriptiveMitigation {
  priority: 'IMMEDIATE' | 'NEXT_24_HOURS' | 'WEEKLY_SCHEDULE';
  title: string;
  category: 'IRRIGATION' | 'PEST_DISEASE' | 'SOIL_PROTECTION' | 'HARVEST_TIMING';
  prescription: string;
  dosageOrRate: string;
  nasaSensorBacking: string;
  expectedRecoveryDays: number;
}

export interface TimelineDataPoint {
  date: string;
  smapMoisture: number;
  ecostressCanopyTemp: number;
  gpmRainfall: number;
  nisarSubsurfacePct: number;
}
