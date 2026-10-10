export interface CodeFile {
  name: string;
  path: string;
  category: 'architecture' | 'data_retrofit' | 'compose_ui' | 'firestore' | 'background_smtp';
  language: 'kotlin' | 'typescript' | 'markdown';
  description: string;
  code: string;
}

export const PROJECT_DIRECTORY_TREE = `
khetdrishti-android/
├── app/
│   ├── build.gradle.kts
│   └── src/main/
│       ├── AndroidManifest.xml
│       └── java/com/khetdrishti/app/
│           ├── di/
│           │   ├── AppModule.kt                   # Hilt dependency injection
│           │   ├── NetworkModule.kt               # Retrofit, OkHttp, NASA client providers
│           │   └── FirebaseModule.kt              # FirebaseAuth, FirebaseFirestore providers
│           ├── data/
│           │   ├── remote/
│           │   │   ├── api/
│           │   │   │   ├── NasaPowerApiService.kt    # Retrofit interface for NASA POWER
│           │   │   │   └── NasaFirmsApiService.kt    # Retrofit interface for MODIS/VIIRS FIRMS
│           │   │   ├── dto/
│           │   │   │   ├── NasaPowerResponseDto.kt   # JSON DTOs with Moshi/Gson annotations
│           │   │   │   └── NasaFirmsHotspotDto.kt    # CSV/JSON thermal anomaly DTOs
│           │   │   └── interceptor/
│           │   │       └── NasaAuthInterceptor.kt    # Token & rate-limit handling
│           │   ├── local/
│           │   │   ├── KhetDatabase.kt               # Room database for offline cache
│           │   │   └── dao/FieldDao.kt
│           │   └── repository/
│           │       ├── NasaRepositoryImpl.kt         # Merges POWER, SMAP & FIRMS data
│           │       └── FieldRepositoryImpl.kt        # Syncs Cloud Firestore & Room
│           ├── domain/
│           │   ├── model/
│           │   │   ├── Field.kt                      # Core domain plot entity
│           │   │   ├── NasaTelemetry.kt              # Domain SMAP, ECOSTRESS, GPM, NISAR
│           │   │   ├── WeatherForecast.kt            # 7-day weather domain model
│           │   │   ├── FireAlert.kt                  # VIIRS/MODIS thermal event
│           │   │   └── UserProfile.kt                # Farmer identity & subscription
│           │   ├── repository/
│           │   │   ├── NasaRepository.kt             # Domain interface
│           │   │   └── FieldRepository.kt            # Domain interface
│           │   └── usecase/
│           │       ├── GetBestFarmingWindowUseCase.kt# Agro-climatological window calculator
│           │       ├── CalculateCropRiskUseCase.kt   # What-If bio-physical simulation
│           │       └── SonifyTelemetryUseCase.kt     # Converts telemetry to audio frequencies
│           ├── ui/
│           │   ├── theme/
│           │   │   ├── Color.kt                      # Space-slate #0B132B, Emerald #10B981
│           │   │   ├── Theme.kt                      # Material 3 dark SaaS theme
│           │   │   └── Type.kt
│           │   ├── components/
│           │   │   ├── BentoCard.kt                  # Reusable Space-Slate Bento containers
│           │   │   ├── WeatherForecastHeader.kt      # NASA POWER 7-day carousel
│           │   │   ├── FireHotspotBanner.kt          # VIIRS 5km radial alert
│           │   │   ├── FieldHealthBentoGrid.kt       # SMAP, ECOSTRESS, GPM, NISAR cards
│           │   │   └── SonificationAudioBar.kt       # Rural accessibility audio player
│           │   ├── dashboard/
│           │   │   ├── DashboardScreen.kt            # Central responsive dashboard
│           │   │   └── DashboardState.kt
│           │   ├── modules/
│           │   │   ├── MyFieldScreen.kt              # Module 1: Plot management
│           │   │   ├── FieldHealthScreen.kt          # Module 2: Deep telemetry
│           │   │   ├── FieldTimelineScreen.kt        # Module 3: Historical & NISAR trends
│           │   │   ├── EarlyWarningScreen.kt         # Module 4: Alert cards
│           │   │   ├── WhyRootCauseScreen.kt         # Module 5: Causality tree
│           │   │   ├── WhatIfSimulatorScreen.kt      # Module 6: Real-time slider engine
│           │   │   └── WhatShouldIDoScreen.kt        # Module 7: Prescriptive actions
│           │   └── navigation/
│           │       └── KhetDrishtiNavHost.kt
│           ├── viewmodel/
│           │   ├── DashboardViewModel.kt             # Clean MVVM StateFlow coordinator
│           │   ├── WhatIfViewModel.kt
│           │   └── FieldViewModel.kt
│           ├── worker/
│           │   └── NasaSyncWorker.kt                 # WorkManager periodic sync & trigger
│           └── utils/
│               ├── LocationHelper.kt                 # FusedLocationProviderClient wrapper
│               ├── SonificationHelper.kt             # Android ToneGenerator / AudioTrack
│               └── Ext.kt
├── firebase-functions/
│   ├── package.json
│   └── src/
│       └── index.ts                                  # Cloud Function with Nodemailer SMTP
└── firestore.rules
`;

export const CODE_FILES: CodeFile[] = [
  {
    name: 'Directory Tree',
    path: 'PROJECT_STRUCTURE.md',
    category: 'architecture',
    language: 'markdown',
    description: 'Complete Android package and clean architecture layout',
    code: PROJECT_DIRECTORY_TREE,
  },
  {
    name: 'NasaPowerApiService.kt',
    path: 'data/remote/api/NasaPowerApiService.kt',
    category: 'data_retrofit',
    language: 'kotlin',
    description: 'Retrofit interface and data models for NASA POWER Daily Point API',
    code: `package com.khetdrishti.app.data.remote.api

import com.google.gson.annotations.SerializedName
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Query

/**
 * NASA POWER API (Prediction of Worldwide Energy Resources)
 * Agroclimatology (AG) Community Endpoint
 * Base URL: https://power.larc.nasa.gov/api/
 */
interface NasaPowerApiService {

    @GET("temporal/daily/point")
    suspend fun getDailyAgroclimatology(
        @Query("parameters") parameters: String = "T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,RH2M,ALLSKY_SFC_SW_DWN,WS10M",
        @Query("community") community: String = "AG",
        @Query("longitude") longitude: Double,
        @Query("latitude") latitude: Double,
        @Query("start") startDate: String, // Format: YYYYMMDD
        @Query("end") endDate: String,     // Format: YYYYMMDD
        @Query("format") format: String = "JSON"
    ): Response<NasaPowerResponseDto>
}

data class NasaPowerResponseDto(
    @SerializedName("type") val type: String?,
    @SerializedName("geometry") val geometry: GeometryDto?,
    @SerializedName("properties") val properties: PowerPropertiesDto?,
    @SerializedName("messages") val messages: List<String>?
)

data class GeometryDto(
    @SerializedName("type") val type: String?,
    @SerializedName("coordinates") val coordinates: List<Double>?
)

data class PowerPropertiesDto(
    @SerializedName("parameter") val parameter: ParameterMapDto?
)

data class ParameterMapDto(
    @SerializedName("T2M") val temperatureAvg: Map<String, Double>?,            // Air Temp at 2m (°C)
    @SerializedName("T2M_MAX") val temperatureMax: Map<String, Double>?,        // Max Daily Temp (°C)
    @SerializedName("T2M_MIN") val temperatureMin: Map<String, Double>?,        // Min Daily Temp (°C)
    @SerializedName("PRECTOTCORR") val precipitationMm: Map<String, Double>?,  // Corrected Total Precipitation (mm/day)
    @SerializedName("RH2M") val relativeHumidity: Map<String, Double>?,         // Relative Humidity at 2m (%)
    @SerializedName("ALLSKY_SFC_SW_DWN") val solarInsolation: Map<String, Double>?, // All Sky Surface Shortwave Downward Irradiance (MJ/m^2/day)
    @SerializedName("WS10M") val windSpeed10m: Map<String, Double>?            // Wind Speed at 10m (m/s)
)
`,
  },
  {
    name: 'NasaFirmsApiService.kt',
    path: 'data/remote/api/NasaFirmsApiService.kt',
    category: 'data_retrofit',
    language: 'kotlin',
    description: 'Retrofit interface for NASA FIRMS (VIIRS/MODIS) Active Thermal Hotspots',
    code: `package com.khetdrishti.app.data.remote.api

import com.google.gson.annotations.SerializedName
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

/**
 * NASA FIRMS API (Fire Information for Resource Management System)
 * Real-time VIIRS 375m & MODIS 1km active fire hotspots
 * Base URL: https://firms.modaps.eosdis.nasa.gov/api/
 */
interface NasaFirmsApiService {

    /**
     * Radial search for active fires within bounding box or radius (km)
     * Sources: VIIRS_SNPP_NRT, VIIRS_NOAA20_NRT, MODIS_NRT
     */
    @GET("area/csv/{map_key}/{source}/{area}/{day_range}")
    suspend fun getActiveFireHotspotsCsv(
        @Path("map_key") apiKey: String,
        @Path("source") source: String = "VIIRS_SNPP_NRT",
        @Path("area") boundingArea: String, // format: "minLon,minLat,maxLon,maxLat"
        @Path("day_range") dayRange: Int = 1
    ): Response<String>

    @GET("country/json/{map_key}/{source}/{country_code}/{day_range}")
    suspend fun getActiveFiresByCountryJson(
        @Path("map_key") apiKey: String,
        @Path("source") source: String = "VIIRS_SNPP_NRT",
        @Path("country_code") countryCode: String = "IND",
        @Path("day_range") dayRange: Int = 1
    ): Response<List<FirmsFireHotspotDto>>
}

data class FirmsFireHotspotDto(
    @SerializedName("latitude") val latitude: Double,
    @SerializedName("longitude") val longitude: Double,
    @SerializedName("bright_ti4") val brightnessTempI4: Double?,    // VIIRS 375m I4 Channel (Kelvin)
    @SerializedName("scan") val scanResolution: Double?,
    @SerializedName("track") val trackResolution: Double?,
    @SerializedName("acq_date") val acquisitionDate: String,        // YYYY-MM-DD
    @SerializedName("acq_time") val acquisitionTime: String,        // HHMM UTC
    @SerializedName("satellite") val satellite: String,             // N: Suomi NPP, 20: NOAA-20, T: Terra, A: Aqua
    @SerializedName("confidence") val confidence: String?,          // "l" (low), "n" (nominal), "h" (high)
    @SerializedName("version") val version: String?,
    @SerializedName("bright_ti5") val brightnessTempI5: Double?,    // Channel I5 (Kelvin)
    @SerializedName("frp") val fireRadiativePowerMw: Double?,       // Fire Radiative Power (MW)
    @SerializedName("daynight") val dayNightFlag: String?           // "D" or "N"
)
`,
  },
  {
    name: 'RetrofitClient.kt',
    path: 'di/NetworkModule.kt',
    category: 'data_retrofit',
    language: 'kotlin',
    description: 'Dagger-Hilt Network Module with OkHttp caching, rate-limiting, and dual Retrofit builders',
    code: `package com.khetdrishti.app.di

import com.khetdrishti.app.data.remote.api.NasaFirmsApiService
import com.khetdrishti.app.data.remote.api.NasaPowerApiService
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Named
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    private const val NASA_POWER_BASE_URL = "https://power.larc.nasa.gov/api/"
    private const val NASA_FIRMS_BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api/"

    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(20, TimeUnit.SECONDS)
            .writeTimeout(15, TimeUnit.SECONDS)
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .retryOnConnectionFailure(true)
            .build()
    }

    @Provides
    @Singleton
    @Named("NasaPowerRetrofit")
    fun provideNasaPowerRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl(NASA_POWER_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    @Provides
    @Singleton
    @Named("NasaFirmsRetrofit")
    fun provideNasaFirmsRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl(NASA_FIRMS_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    @Provides
    @Singleton
    fun provideNasaPowerApiService(@Named("NasaPowerRetrofit") retrofit: Retrofit): NasaPowerApiService {
        return retrofit.create(NasaPowerApiService::class.java)
    }

    @Provides
    @Singleton
    fun provideNasaFirmsApiService(@Named("NasaFirmsRetrofit") retrofit: Retrofit): NasaFirmsApiService {
        return retrofit.create(NasaFirmsApiService::class.java)
    }
}
`,
  },
  {
    name: 'DashboardScreen.kt',
    path: 'ui/dashboard/DashboardScreen.kt',
    category: 'compose_ui',
    language: 'kotlin',
    description: 'Jetpack Compose Material 3 Dashboard with Bento Grid, NASA Header, Fire Alert, and Sonification',
    code: `package com.khetdrishti.app.ui.dashboard

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.khetdrishti.app.ui.components.*
import com.khetdrishti.app.ui.theme.*

/**
 * Main KhetDrishti Responsive Dashboard
 * SaaS Aesthetic: Space-Slate Dark (#0B132B) + Crisp Agricultural Emerald (#10B981)
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    viewModel: DashboardViewModel = hiltViewModel(),
    onNavigateToModule: (moduleIndex: Int) -> Unit = {}
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        containerColor = SpaceSlateDark,
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .clip(RoundedCornerShape(50))
                                .background(AgroEmerald)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "KhetDrishti",
                            fontWeight = FontWeight.Bold,
                            fontSize = 20.sp,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "(A.S atif)",
                            fontSize = 12.sp,
                            color = AgroEmerald,
                            fontWeight = FontWeight.Medium
                        )
                    }
                },
                actions = {
                    // Audio Sonification Quick Toggle
                    IconButton(onClick = { viewModel.toggleSonification() }) {
                        Icon(
                            imageVector = if (uiState.isSonifying) Icons.Default.VolumeUp else Icons.Default.SpatialAudioOff,
                            contentDescription = "Sonify Field Data",
                            tint = if (uiState.isSonifying) AgroEmerald else SlateMuted
                        )
                    }
                    IconButton(onClick = { viewModel.refreshLocationAndNasaData() }) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Sync NASA Telemetry",
                            tint = Color.White
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = SpaceSlateDark
                )
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. GPS Auto-Location & Weather Engine Header
            item {
                WeatherHeaderCard(
                    locationName = uiState.currentLocationName,
                    coordinates = uiState.coordinates,
                    forecastList = uiState.sevenDayForecast,
                    bestTimeWindow = uiState.bestFarmingWindow,
                    isLoading = uiState.isWeatherLoading
                )
            }

            // 2. Active Fire Hotspots Banner (NASA VIIRS/MODIS)
            if (uiState.fireAlert.isDetected) {
                item {
                    FireHotspotAlertCard(
                        fireAlert = uiState.fireAlert,
                        onDismiss = { viewModel.dismissFireAlert() }
                    )
                }
            }

            // 3. Audio Sonification Accessibility Bar
            item {
                SonificationControlCard(
                    isSonifying = uiState.isSonifying,
                    selectedLanguage = uiState.sonificationLanguage,
                    onToggleSonify = { viewModel.toggleSonification() },
                    onLanguageSelect = { lang -> viewModel.setSonificationLanguage(lang) }
                )
            }

            // 4. Core Field Health Bento Grid (SMAP, ECOSTRESS, GPM, NISAR)
            item {
                Text(
                    text = "FIELD TELEMETRY · BENTO INTELLIGENCE",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.2.sp,
                    color = SlateMuted
                )
            }

            item {
                FieldHealthBentoGrid(
                    telemetry = uiState.telemetry,
                    onCardClick = { metricKey -> onNavigateToModule(1) }
                )
            }

            // 5. Seven Core Agri-Modules Quick Nav
            item {
                Text(
                    text = "THE 7 AGRI-MODULES",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.2.sp,
                    color = SlateMuted
                )
            }

            item {
                AgriModulesCarousel(
                    activePlot = uiState.activePlot,
                    earlyWarningCount = uiState.earlyWarnings.size,
                    onSelectModule = onNavigateToModule
                )
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
`,
  },
  {
    name: 'BentoGridComponents.kt',
    path: 'ui/components/BentoGridComponents.kt',
    category: 'compose_ui',
    language: 'kotlin',
    description: 'Jetpack Compose Bento Card layout and satellite telemetric gauge components',
    code: `package com.khetdrishti.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.khetdrishti.app.domain.model.NasaTelemetry
import com.khetdrishti.app.ui.theme.*

@Composable
fun FieldHealthBentoGrid(
    telemetry: NasaTelemetry,
    onCardClick: (String) -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        // Row 1: SMAP (60% width) + ECOSTRESS (40% width)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // SMAP Soil Moisture
            BentoContainer(
                modifier = Modifier
                    .weight(1.3f)
                    .clickable { onCardClick("SMAP") },
                accentColor = AgroEmerald
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "SOIL MOISTURE (SMAP L4)",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = SlateMuted
                        )
                        Icon(
                            imageVector = Icons.Default.WaterDrop,
                            contentDescription = null,
                            tint = AgroEmerald,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "\${(telemetry.smapSurfaceMoisture * 100).toInt()}%",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Root-zone: \${(telemetry.smapRootZoneMoisture * 100).toInt()}% VWC · 0-100cm",
                        fontSize = 12.sp,
                        color = if (telemetry.smapSurfaceMoisture < 0.18) AmberWarning else AgroEmerald
                    )
                }
            }

            // ECOSTRESS Canopy Temp
            BentoContainer(
                modifier = Modifier
                    .weight(1.0f)
                    .clickable { onCardClick("ECOSTRESS") },
                accentColor = if (telemetry.ecostressCanopyTempC > 32) CrimsonAlert else AgroEmerald
            ) {
                Column {
                    Text(
                        text = "CANOPY TEMP",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = SlateMuted
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "\${telemetry.ecostressCanopyTempC.toInt()}°C",
                        fontSize = 30.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "ECOSTRESS (ISS)",
                        fontSize = 11.sp,
                        color = SlateMuted
                    )
                }
            }
        }

        // Row 2: GPM IMERG Rainfall + NISAR Subsurface Radar Coherence
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // GPM IMERG
            BentoContainer(
                modifier = Modifier
                    .weight(1.0f)
                    .clickable { onCardClick("GPM") },
                accentColor = Color(0xFF38BDF8)
            ) {
                Column {
                    Text(
                        text = "PRECIPITATION (GPM)",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = SlateMuted
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "\${telemetry.gpmAccumulated24hMm} mm",
                        fontSize = 26.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Last rain: \${telemetry.gpmLastRainTimestamp}",
                        fontSize = 11.sp,
                        color = SlateMuted
                    )
                }
            }

            // NISAR Subsurface Deformation & L-Band SAR
            BentoContainer(
                modifier = Modifier
                    .weight(1.3f)
                    .clickable { onCardClick("NISAR") },
                accentColor = Color(0xFFA855F7)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "NISAR SAR COHERENCE",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = SlateMuted
                        )
                        Icon(
                            imageVector = Icons.Default.Radar,
                            contentDescription = null,
                            tint = Color(0xFFA855F7),
                            modifier = Modifier.size(16.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "\${(telemetry.nisarLbandCoherence * 100).toInt()}% Coherence",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Subsurface: \${telemetry.nisarSubsurfaceMoisturePct}% · Def: \${telemetry.nisarSurfaceDeformationMm}mm/yr",
                        fontSize = 11.sp,
                        color = SlateMuted
                    )
                }
            }
        }
    }
}

@Composable
fun BentoContainer(
    modifier: Modifier = Modifier,
    accentColor: Color = AgroEmerald,
    content: @Composable BoxScope.() -> Unit
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(SpaceSlateCard)
            .border(1.dp, SpaceSlateBorder, RoundedCornerShape(16.dp))
            .padding(16.dp),
        content = content
    )
}
`,
  },
  {
    name: 'FirestoreSchema.kt',
    path: 'data/model/FirestoreSchema.kt',
    category: 'firestore',
    language: 'kotlin',
    description: 'Kotlin data classes for Firebase Authentication & Cloud Firestore schemas',
    code: `package com.khetdrishti.app.data.model

import com.google.firebase.Timestamp
import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.GeoPoint
import com.google.firebase.firestore.PropertyName
import com.google.firebase.firestore.ServerTimestamp

/**
 * Cloud Firestore Collection: "users/{userId}"
 */
data class UserFirestoreModel(
    @DocumentId val uid: String = "",
    val email: String = "",
    val displayName: String = "",
    val phoneNumber: String? = null,
    val preferredLanguage: String = "hi", // "hi" (Hindi), "pa" (Punjabi), "en" (English)
    val fcmToken: String? = null,
    val smtpNotificationEmail: String? = null,
    val alertThresholds: AlertThresholdsModel = AlertThresholdsModel(),
    @ServerTimestamp val createdAt: Timestamp? = null,
    @ServerTimestamp val updatedAt: Timestamp? = null
)

data class AlertThresholdsModel(
    val smapMoistureDeficitLimit: Double = 0.18, // Alert if < 18% VWC
    val ecostressCanopyTempStressMaxC: Double = 33.0,
    val firmsFireHotspotRadiusKm: Double = 5.0,
    val enableSmtpDailyDigest: Boolean = true
)

/**
 * Cloud Firestore Collection: "users/{userId}/fields/{fieldId}"
 */
data class FieldFirestoreModel(
    @DocumentId val fieldId: String = "",
    val ownerUid: String = "",
    val fieldName: String = "",
    val cropName: String = "",
    val cropVariety: String = "",
    val sowingDate: String = "", // ISO-8601
    val harvestProjectedDate: String = "",
    val acreage: Double = 0.0,
    val soilType: String = "", // e.g. "Alluvial Silty Loam", "Vertisol"
    val centroid: GeoPoint = GeoPoint(0.0, 0.0),
    val boundaryPolygonGeoPoints: List<GeoPoint> = emptyList(),
    val latestNdvi: Double = 0.0,
    val latestSmapMoisture: Double = 0.0,
    val latestCanopyTempC: Double = 0.0,
    val activeFireAlertCount: Int = 0,
    @ServerTimestamp val lastSyncedAt: Timestamp? = null
)

/**
 * Subcollection: "users/{userId}/fields/{fieldId}/telemetry_logs/{logId}"
 */
data class TelemetryLogFirestoreModel(
    @DocumentId val logId: String = "",
    val recordedAt: Timestamp = Timestamp.now(),
    val smapSurfaceMoisture: Double = 0.0,
    val smapRootZoneMoisture: Double = 0.0,
    val ecostressCanopyTempC: Double = 0.0,
    val ecostressEsi: Double = 0.0,
    val gpmPrecipMm: Double = 0.0,
    val nisarSubsurfacePct: Double = 0.0,
    val nisarDeformationMm: Double = 0.0,
    val isWaterStressDetected: Boolean = false
)

/**
 * Subcollection: "users/{userId}/fields/{fieldId}/alert_events/{alertId}"
 */
data class AlertEventFirestoreModel(
    @DocumentId val alertId: String = "",
    val alertType: String = "", // "FIRE_HOTSPOT", "WATER_STRESS", "HEAT_ANOMALY"
    val severity: String = "",  // "CRITICAL", "WARNING", "ADVISORY"
    val sourceDataset: String = "", // "NASA_VIIRS", "NASA_SMAP", "NASA_ECOSTRESS"
    val description: String = "",
    val isResolved: Boolean = false,
    val smtpEmailSent: Boolean = false,
    val smtpEmailSentAt: Timestamp? = null,
    @ServerTimestamp val timestamp: Timestamp? = null
)
`,
  },
  {
    name: 'NasaSyncWorker.kt',
    path: 'worker/NasaSyncWorker.kt',
    category: 'background_smtp',
    language: 'kotlin',
    description: 'WorkManager background worker checking NASA thresholds and triggering SMTP alert',
    code: `package com.khetdrishti.app.worker

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.khetdrishti.app.domain.repository.FieldRepository
import com.khetdrishti.app.domain.repository.NasaRepository
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * WorkManager Background Sync Worker:
 * Runs periodically (every 6 hours) or on constrained network.
 * 1. Checks NASA POWER 7-day forecast & GPM rainfall
 * 2. Checks VIIRS/MODIS FIRMS for fire hotspots <= 5km
 * 3. Checks SMAP soil moisture thresholds
 * 4. Writes AlertEvent to Cloud Firestore, which triggers Cloud Functions SMTP pipeline
 */
@HiltWorker
class NasaSyncWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted workerParams: WorkerParameters,
    private val nasaRepository: NasaRepository,
    private val fieldRepository: FieldRepository
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        try {
            val userFields = fieldRepository.getAllActiveFields()

            for (field in userFields) {
                // 1. Check for Active Fires within 5km radius via NASA FIRMS
                val fireAlert = nasaRepository.checkFirmsFireHotspots(
                    lat = field.centroid.latitude,
                    lon = field.centroid.longitude,
                    radiusKm = 5.0
                )

                // 2. Fetch Latest Telemetry
                val telemetry = nasaRepository.getLatestNasaTelemetry(field.fieldId)

                // 3. Evaluate Thresholds & Trigger Cloud Event if Critical
                val isFireThreat = fireAlert != null && fireAlert.distanceKm <= 5.0
                val isWaterCritical = telemetry.smapSurfaceMoisture < 0.16

                if (isFireThreat || isWaterCritical) {
                    fieldRepository.recordAlertEvent(
                        fieldId = field.fieldId,
                        alertType = if (isFireThreat) "FIRE_HOTSPOT" else "WATER_STRESS",
                        severity = "CRITICAL",
                        source = if (isFireThreat) "NASA_VIIRS_FIRMS" else "NASA_SMAP_L4",
                        description = if (isFireThreat) {
                            "Fire hotspot detected \${fireAlert?.distanceKm}km away (FRP: \${fireAlert?.fireRadiativePowerMw} MW)"
                        } else {
                            "Volumetric soil moisture dropped to \${(telemetry.smapSurfaceMoisture * 100).toInt()}%"
                        }
                    )
                }
            }

            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) Result.retry() else Result.failure()
        }
    }
}
`,
  },
  {
    name: 'index.ts (Cloud Function SMTP)',
    path: 'firebase-functions/src/index.ts',
    category: 'background_smtp',
    language: 'typescript',
    description: 'Firebase Cloud Functions Firestore Trigger sending automated SMTP emails via Nodemailer',
    code: `import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();
const db = admin.firestore();

// Configure SMTP transport using environment variables or Secret Manager
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'apikey',
    pass: process.env.SMTP_PASSWORD || 'SG.your_sendgrid_key_here',
  },
});

/**
 * Cloud Function Trigger: onDocumentCreated in alert_events subcollection
 * Sends an immediate, high-priority email to farmer if severity is CRITICAL or WARNING.
 */
export const onNasaAlertCreated = functions.firestore
  .document('users/{userId}/fields/{fieldId}/alert_events/{alertId}')
  .onCreate(async (snap, context) => {
    const alertData = snap.data();
    const { userId, fieldId } = context.params;

    if (!alertData || alertData.severity !== 'CRITICAL') {
      return null;
    }

    try {
      // 1. Retrieve Farmer User Profile
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      const recipientEmail = userData?.smtpNotificationEmail || userData?.email;

      if (!recipientEmail) {
        console.warn(\`No recipient email registered for user \${userId}\`);
        return null;
      }

      // 2. Retrieve Field Details
      const fieldDoc = await db.collection('users').doc(userId).collection('fields').doc(fieldId).get();
      const fieldData = fieldDoc.data();
      const fieldName = fieldData?.fieldName || 'Plot A';

      // 3. Compose Space-Grade SaaS Alert Email
      const mailOptions = {
        from: '"KhetDrishti NASA Intelligence" <alerts@khetdrishti.nasa.agro>',
        to: recipientEmail,
        subject: \`⚠️ [CRITICAL ALERT] \${alertData.alertType} Detected near \${fieldName}\`,
        html: \`
          <div style="background-color: #0B132B; color: #F8FAFC; padding: 24px; font-family: sans-serif; border-radius: 8px;">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              <span style="display: inline-block; width: 12px; height: 12px; background-color: #10B981; border-radius: 50%; margin-right: 8px;"></span>
              <h2 style="margin: 0; color: #FFFFFF; font-size: 20px;">KhetDrishti (A.S atif)</h2>
            </div>
            <p style="color: #94A3B8; font-size: 14px;">NASA Earth Science Real-Time Telemetry Alert</p>
            <div style="background-color: #111D4A; border: 1px solid #1C2541; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="color: #EF4444; font-weight: bold; margin-top: 0;">CRITICAL STATUS: \${alertData.alertType}</p>
              <p style="color: #E2E8F0; margin: 8px 0;"><strong>Target Field:</strong> \${fieldName}</p>
              <p style="color: #E2E8F0; margin: 8px 0;"><strong>Source Satellite:</strong> \${alertData.sourceDataset}</p>
              <p style="color: #E2E8F0; margin: 8px 0;"><strong>Details:</strong> \${alertData.description}</p>
            </div>
            <p style="color: #10B981; font-weight: 600;">Recommended Next Step: Open the KhetDrishti Android App to review the 'What Should I Do?' mitigation plan.</p>
            <hr style="border: none; border-top: 1px solid #1C2541; margin: 20px 0;" />
            <small style="color: #64748B;">Automated message dispatched via KhetDrishti Cloud Firestore & WorkManager NASA Sync Pipeline.</small>
          </div>
        \`,
      };

      await transporter.sendMail(mailOptions);

      // 4. Update the Firestore Alert document with SMTP dispatched flag
      await snap.ref.update({
        smtpEmailSent: true,
        smtpEmailSentAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(\`Successfully dispatched SMTP alert to \${recipientEmail} for field \${fieldId}\`);
    } catch (error) {
      console.error('Failed to send SMTP email alert:', error);
    }

    return null;
  });
`,
  },
  {
    name: 'KhetDrishtiTheme.kt',
    path: 'ui/theme/KhetDrishtiTheme.kt',
    category: 'compose_ui',
    language: 'kotlin',
    description: 'Production theme with Primary Pink, Dark Gradient, Soft Tint, Surface White, and Canvas tokens',
    code: `package com.khetdrishti.app.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// 1. Signature Agro-Pink Palette
val KhetPinkPrimary = Color(0xFFE2136E)
val KhetPinkDark = Color(0xFFC20F5D)
val KhetPinkLight = Color(0xFFFDE8F1)
val KhetPinkTint = Color(0xFFFDE8F1)

// 2. Neutral Backgrounds & Canvas Surfaces
val SurfaceWhite = Color(0xFFFFFFFF)
val CanvasBackground = Color(0xFFF5F6F8)

// 3. Typography & Feedback Tokens
val TextPrimary = Color(0xFF212121)
val TextMuted = Color(0xFF6B7280)
val AlertRed = Color(0xFFD32F2F)

// 4. Recommendation Pastel Cards Palette
val PastelAmber = Color(0xFFFFF8E1)
val PastelAmberBorder = Color(0xFFFFE082)
val PastelAmberText = Color(0xFFF57F17)

val PastelGreen = Color(0xFFE8F5E9)
val PastelGreenBorder = Color(0xFFA5D6A7)
val PastelGreenText = Color(0xFF2E7D32)

val PastelBlue = Color(0xFFE3F2FD)
val PastelBlueBorder = Color(0xFF90CAF9)
val PastelBlueText = Color(0xFF1565C0)

private val LightColorScheme = lightColorScheme(
    primary = KhetPinkPrimary,
    onPrimary = SurfaceWhite,
    primaryContainer = KhetPinkTint,
    onPrimaryContainer = KhetPinkDark,
    secondary = KhetPinkDark,
    onSecondary = SurfaceWhite,
    background = CanvasBackground,
    surface = SurfaceWhite,
    onSurface = TextPrimary,
    surfaceVariant = CanvasBackground,
    onSurfaceVariant = TextMuted,
    error = AlertRed,
    onError = SurfaceWhite
)

private val DarkColorScheme = darkColorScheme(
    primary = KhetPinkPrimary,
    onPrimary = SurfaceWhite,
    primaryContainer = KhetPinkDark,
    onPrimaryContainer = KhetPinkTint,
    secondary = KhetPinkLight,
    background = Color(0xFF070D1F),
    surface = Color(0xFF0B132B),
    onSurface = SurfaceWhite,
    error = AlertRed
)

val KhetDrishtiShapes = Shapes(
    small = RoundedCornerShape(8.dp),
    medium = RoundedCornerShape(16.dp),
    large = RoundedCornerShape(24.dp)
)

val KhetDrishtiTypography = Typography(
    titleLarge = TextStyle(
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp,
        lineHeight = 26.sp,
        color = TextPrimary
    ),
    titleMedium = TextStyle(
        fontWeight = FontWeight.SemiBold,
        fontSize = 15.sp,
        lineHeight = 22.sp,
        color = TextPrimary
    ),
    bodyMedium = TextStyle(
        fontWeight = FontWeight.Normal,
        fontSize = 13.sp,
        lineHeight = 18.sp,
        color = TextPrimary
    ),
    labelSmall = TextStyle(
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 15.sp,
        color = TextMuted
    )
)

@Composable
fun KhetDrishtiTheme(
    darkTheme: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    MaterialTheme(
        colorScheme = colorScheme,
        shapes = KhetDrishtiShapes,
        typography = KhetDrishtiTypography,
        content = content
    )
}
`,
  },
  {
    name: 'KhetDrishtiStatusPill.kt',
    path: 'ui/components/KhetDrishtiStatusPill.kt',
    category: 'compose_ui',
    language: 'kotlin',
    description: 'Animated tap-to-reveal status pill component with 4-second auto-collapse logic',
    code: `package com.khetdrishti.app.ui.components

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.EnergySavingsLeaf
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.khetdrishti.app.ui.theme.*
import kotlinx.coroutines.delay

/**
 * KhetDrishtiStatusPill
 * Exact 1:1 replica of the balance check capsule button:
 * - White rounded pill container with circular primary-pink icon on the left
 * - Initial Label: "জমির অবস্থা দেখুন"
 * - Revealed Label: "মাটির আর্দ্রতা: ২৪% | ঝুঁকি নেই"
 * - Automatically collapses back after 4.0 seconds
 */
@Composable
fun KhetDrishtiStatusPill(
    moisturePercent: Int = 24,
    isSafe: Boolean = true,
    modifier: Modifier = Modifier
) {
    var isRevealed by remember { mutableStateOf(false) }

    // Auto-collapse after exactly 4 seconds
    LaunchedEffect(isRevealed) {
        if (isRevealed) {
            delay(4000)
            isRevealed = false
        }
    }

    Surface(
        onClick = { isRevealed = !isRevealed },
        shape = RoundedCornerShape(50),
        color = SurfaceWhite,
        shadowElevation = 8.dp,
        modifier = modifier.animateContentSize(
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioLowBouncy,
                stiffness = Spring.StiffnessMedium
            )
        )
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 9.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            // Circular Pink Badge Icon
            Box(
                modifier = Modifier
                    .size(24.dp)
                    .clip(CircleShape)
                    .background(if (isRevealed) KhetPinkPrimary else KhetPinkTint),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (isRevealed) Icons.Default.Check else Icons.Default.EnergySavingsLeaf,
                    contentDescription = null,
                    tint = if (isRevealed) SurfaceWhite else KhetPinkPrimary,
                    modifier = Modifier.size(14.dp)
                )
            }

            Spacer(modifier = Modifier.width(10.dp))

            // Animated content transition
            AnimatedContent(
                targetState = isRevealed,
                transitionSpec = {
                    (fadeIn() + expandHorizontally()) togetherWith (fadeOut() + shrinkHorizontally())
                },
                label = "status_pill_transition"
            ) { revealed ->
                if (revealed) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "মাটির আর্দ্রতা: $moisturePercent%",
                            color = KhetPinkPrimary,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                        Text(
                            text = " | ",
                            color = KhetPinkDark.copy(alpha = 0.5f),
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                        Text(
                            text = if (isSafe) "ঝুঁকি নেই" else "সতর্কতা",
                            color = if (isSafe) Color(0xFF2E7D32) else AlertRed,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                    }
                } else {
                    Text(
                        text = "জমির অবস্থা দেখুন",
                        color = KhetPinkPrimary,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            Icon(
                imageVector = if (isRevealed) Icons.Default.VisibilityOff else Icons.Default.ChevronRight,
                contentDescription = null,
                tint = KhetPinkPrimary,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}
`,
  },
  {
    name: 'KhetDrishtiHomeScreen.kt',
    path: 'ui/home/KhetDrishtiHomeScreen.kt',
    category: 'compose_ui',
    language: 'kotlin',
    description: 'Complete home dashboard with animated header, overlapping 8-item grid, promo banner, and recommendations',
    code: `package com.khetdrishti.app.ui.home

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.khetdrishti.app.ui.components.KhetDrishtiStatusPill
import com.khetdrishti.app.ui.theme.*

/**
 * KhetDrishtiHomeScreen (A.S atif)
 * 1. Top Animated Hero Section (Header) with landscape vector & status pill
 * 2. Overlapping Services Grid (Main 8 Features in 4 columns)
 * 3. Middle Interactive NASA Alert Coupon Banner
 * 4. Quick Features / Recommendation Pastel Cards (Horizontal LazyRow)
 * 5. Fixed Bottom Navigation Bar with Center Scanner FAB
 */
@Composable
fun KhetDrishtiHomeScreen(
    farmerName: String = "A.S Atif",
    onNavigateToModule: (String) -> Unit = {},
    onScanClick: () -> Unit = {},
    onSearchClick: () -> Unit = {}
) {
    var selectedBottomNav by remember { mutableStateOf(0) }

    Scaffold(
        bottomBar = {
            KhetDrishtiBottomNavigation(
                selectedItem = selectedBottomNav,
                onItemSelected = { selectedBottomNav = it },
                onScanClick = onScanClick
            )
        },
        containerColor = CanvasBackground
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = innerPadding.calculateBottomPadding()),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // 1. TOP ANIMATED HERO SECTION (Header)
            item {
                AgroAnimatedHeroHeader(
                    farmerName = farmerName,
                    onSearchClick = onSearchClick
                )
            }

            // 2. OVERLAPPING SERVICES GRID (8 Core Features)
            item {
                OverlappingAgroServicesGrid(
                    onModuleClick = onNavigateToModule
                )
            }

            // 3. MIDDLE INTERACTIVE CAROUSEL / ALERT BANNER
            item {
                AgroPromotionalAlertBanner(
                    onBannerClick = { onNavigateToModule("alert_rain") }
                )
            }

            // 4. QUICK FEATURES / SUGGESTION CARDS (Horizontal Scroll)
            item {
                AgroRecommendationCardsRow(
                    onCardClick = onNavigateToModule
                )
            }

            item {
                Spacer(modifier = Modifier.height(20.dp))
            }
        }
    }
}

/**
 * 1. Top Animated Hero Section (Header)
 * Deep pink background with animated landscape vectors, hills, sky, moving clouds & floating satellite
 */
@Composable
fun AgroAnimatedHeroHeader(
    farmerName: String,
    onSearchClick: () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "hero_anim")
    val cloudOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 600f,
        animationSpec = infiniteRepeatable(
            animation = tween(18000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "clouds"
    )
    val floatY by infiniteTransition.animateFloat(
        initialValue = -3f,
        targetValue = 3f,
        animationSpec = infiniteRepeatable(
            animation = tween(2200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "satellite_float"
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(bottomStart = 28.dp, bottomEnd = 28.dp))
            .background(
                Brush.verticalGradient(
                    colors = listOf(KhetPinkPrimary, KhetPinkDark)
                )
            )
            .padding(top = 18.dp, bottom = 42.dp, start = 16.dp, end = 16.dp)
    ) {
        // Continuous moving clouds & hill contours canvas
        Canvas(modifier = Modifier.matchParentSize()) {
            val canvasWidth = size.width
            val xPos = (cloudOffset % (canvasWidth + 200f)) - 100f

            // Orbit arc
            drawArc(
                brush = Brush.horizontalGradient(
                    listOf(Color.Transparent, SurfaceWhite.copy(alpha = 0.35f), Color.Transparent)
                ),
                startAngle = 180f,
                sweepAngle = 180f,
                useCenter = false,
                topLeft = Offset(-80f, 30f),
                size = androidx.compose.ui.geometry.Size(canvasWidth + 160f, 160f)
            )

            // Landscape Hill 1
            val hillPath1 = Path().apply {
                moveTo(0f, 290f)
                cubicTo(canvasWidth * 0.3f, 250f, canvasWidth * 0.7f, 310f, canvasWidth, 270f)
                lineTo(canvasWidth, 400f)
                lineTo(0f, 400f)
                close()
            }
            drawPath(path = hillPath1, color = Color(0x2E64052E))

            // Drifting Cloud Silhouette
            val cloudPath = Path().apply {
                moveTo(xPos, 65f)
                cubicTo(xPos + 30f, 40f, xPos + 70f, 50f, xPos + 90f, 65f)
                cubicTo(xPos + 120f, 55f, xPos + 150f, 75f, xPos + 140f, 95f)
                lineTo(xPos, 95f)
                close()
            }
            drawPath(path = cloudPath, color = SurfaceWhite.copy(alpha = 0.15f))
        }

        Column(modifier = Modifier.fillMaxWidth()) {
            // Header Top Row: Profile (Left) & Search + Origami Satellite (Right)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Farmer profile avatar with name
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(CircleShape)
                            .background(SurfaceWhite)
                            .padding(2.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .clip(CircleShape)
                                .background(KhetPinkDark),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Person,
                                contentDescription = null,
                                tint = SurfaceWhite,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = farmerName,
                                color = SurfaceWhite,
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(SurfaceWhite.copy(alpha = 0.2f))
                                    .padding(horizontal = 4.dp, vertical = 1.dp)
                            ) {
                                Text(
                                    text = "কৃষি বিজ্ঞানী",
                                    color = SurfaceWhite,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                        Text(
                            text = "লুধিয়ানা এগ্রো সেক্টর",
                            color = KhetPinkTint,
                            fontSize = 11.sp
                        )
                    }
                }

                // Top-Right: Search icon and floating origami satellite logo
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    IconButton(
                        onClick = onSearchClick,
                        modifier = Modifier
                            .size(36.dp)
                            .background(SurfaceWhite.copy(alpha = 0.15f), CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search",
                            tint = SurfaceWhite,
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    // Floating Origami Satellite
                    Box(
                        modifier = Modifier
                            .offset(y = floatY.dp)
                            .size(42.dp)
                            .clip(CircleShape)
                            .background(SurfaceWhite.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.SatelliteAlt,
                            contentDescription = "Origami Satellite",
                            tint = SurfaceWhite,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Center Pill Button: "জমির অবস্থা দেখুন"
            Box(
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                KhetDrishtiStatusPill(
                    moisturePercent = 24,
                    isSafe = true
                )
            }
        }
    }
}

/**
 * 2. Overlapping Services Grid (Main Features)
 * Pure white card elevated over the pink header with 8 circular items
 */
data class AgroGridService(
    val id: String,
    val title: String,
    val icon: ImageVector,
    val badge: String? = null
)

@Composable
fun OverlappingAgroServicesGrid(
    onModuleClick: (String) -> Unit
) {
    val services = remember {
        listOf(
            // Row 1
            AgroGridService("my_field", "আমার জমি", Icons.Default.Grass),
            AgroGridService("field_health", "জমির স্বাস্থ্য", Icons.Default.Analytics),
            AgroGridService("timeline", "টাইমলাইন", Icons.Default.Timeline),
            AgroGridService("early_warning", "সতর্কবার্তা", Icons.Default.WarningAmber, badge = "জরুরি"),
            // Row 2
            AgroGridService("what_if", "সিমুলেশন", Icons.Default.Tune),
            AgroGridService("nisar", "নিসার রাডার", Icons.Default.Radar),
            AgroGridService("fire", "আগুন সতর্কতা", Icons.Default.LocalFireDepartment, badge = "হটস্পট"),
            AgroGridService("audio_guide", "অডিও পরামর্শ", Icons.Default.Headphones)
        )
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .offset(y = (-24).dp)
            .padding(horizontal = 14.dp)
            .shadow(10.dp, RoundedCornerShape(24.dp))
            .clip(RoundedCornerShape(24.dp))
            .background(SurfaceWhite)
            .padding(vertical = 18.dp, horizontal = 12.dp)
    ) {
        LazyVerticalGrid(
            columns = GridCells.Fixed(4),
            modifier = Modifier.height(180.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            userScrollEnabled = false
        ) {
            items(services) { item ->
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null
                        ) { onModuleClick(item.id) }
                ) {
                    Box(contentAlignment = Alignment.TopEnd) {
                        // Circular Pink-tinted icon container (#FDE8F1 with #E2136E icon)
                        Box(
                            modifier = Modifier
                                .size(52.dp)
                                .clip(CircleShape)
                                .background(KhetPinkTint),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = item.icon,
                                contentDescription = item.title,
                                tint = KhetPinkPrimary,
                                modifier = Modifier.size(26.dp)
                            )
                        }

                        item.badge?.let { badgeText ->
                            Box(
                                modifier = Modifier
                                    .offset(x = 4.dp, y = (-4).dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(KhetPinkPrimary)
                                    .padding(horizontal = 4.dp, vertical = 1.dp)
                            ) {
                                Text(
                                    text = badgeText,
                                    color = SurfaceWhite,
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = item.title,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TextPrimary,
                        maxLines = 1
                    )
                }
            }
        }
    }
}

/**
 * 3. Middle Interactive Promotional NASA Alert Banner
 */
@Composable
fun AgroPromotionalAlertBanner(
    onBannerClick: () -> Unit
) {
    Card(
        onClick = onBannerClick,
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 14.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = KhetPinkTint),
        border = androidx.compose.foundation.BorderStroke(1.dp, KhetPinkPrimary.copy(alpha = 0.3f))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(KhetPinkPrimary),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.CloudSync,
                        contentDescription = null,
                        tint = SurfaceWhite,
                        modifier = Modifier.size(22.dp)
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(KhetPinkPrimary)
                                .padding(horizontal = 4.dp, vertical = 1.dp)
                        ) {
                            Text(
                                text = "সরাসরি সতর্কতা",
                                color = SurfaceWhite,
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "NASA GPM IMERG",
                            fontSize = 10.sp,
                            color = TextMuted
                        )
                    }

                    Spacer(modifier = Modifier.height(3.dp))

                    Text(
                        text = "⚠️ আগামী ৪৮ ঘণ্টায় ভারী বৃষ্টির সম্ভাবনা - নিষ্কাশন নালা পরিষ্কার রাখুন",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary,
                        lineHeight = 16.sp
                    )
                }
            }

            Icon(
                imageVector = Icons.Default.ArrowForward,
                contentDescription = null,
                tint = KhetPinkPrimary,
                modifier = Modifier.size(18.dp)
            )
        }
    }
}

/**
 * 4. Quick Features / Recommendation Cards (LazyRow Horizontal Scroll)
 */
data class AgroRecommendation(
    val id: String,
    val category: String,
    val title: String,
    val description: String,
    val icon: ImageVector,
    val bg: Color,
    val border: Color,
    val accent: Color
)

@Composable
fun AgroRecommendationCardsRow(
    onCardClick: (String) -> Unit
) {
    val items = remember {
        listOf(
            AgroRecommendation(
                id = "moisture_deficit",
                category = "আর্দ্রতা ঘাটতি",
                title = "মাটির আর্দ্রতা ঘাটতি",
                description = "মাটির উপরের স্তরে পানির পরিমাণ ১৮% এর নিচে নেমেছে। ড্রিপ সেচ বিবেচনা করুন।",
                icon = Icons.Default.WaterDrop,
                bg = PastelAmber,
                border = PastelAmberBorder,
                accent = PastelAmberText
            ),
            AgroRecommendation(
                id = "irrigation_time",
                category = "সেচ শিডিউল",
                title = "সেচ দেওয়ার মোক্ষম সময়",
                description = "আজ সূর্যাস্তের পর ১৮ মিমি ড্রিপ সেচ দিন যাতে বাষ্পীভবনে অপচয় না হয়।",
                icon = Icons.Default.Schedule,
                bg = PastelGreen,
                border = PastelGreenBorder,
                accent = PastelGreenText
            ),
            AgroRecommendation(
                id = "fertilizer_day",
                category = "পুষ্টি প্রয়োগ",
                title = "সার প্রয়োগের উপযুক্ত দিন",
                description = "আগামী ৩ দিন অনুকূল তাপমাত্রা ও কম বাতাস থাকবে। পটাশ স্প্রে করুন।",
                icon = Icons.Default.WbSunny,
                bg = PastelBlue,
                border = PastelBlueBorder,
                accent = PastelBlueText
            )
        )
    }

    Column(modifier = Modifier.padding(horizontal = 14.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "জরুরি পরামর্শসমূহ",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Text(
                text = "সব দেখুন →",
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = KhetPinkPrimary
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            items(items) { card ->
                Card(
                    modifier = Modifier
                        .width(260.dp)
                        .height(140.dp)
                        .clickable { onCardClick(card.id) },
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = card.bg),
                    border = androidx.compose.foundation.BorderStroke(1.dp, card.border),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(14.dp),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = card.category,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = card.accent
                            )
                            Icon(
                                imageVector = card.icon,
                                contentDescription = null,
                                tint = card.accent,
                                modifier = Modifier.size(18.dp)
                            )
                        }

                        Column {
                            Text(
                                text = card.title,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = card.description,
                                fontSize = 11.sp,
                                color = TextMuted,
                                maxLines = 2,
                                lineHeight = 15.sp
                            )
                        }

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "পরামর্শ দেখুন",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = card.accent
                            )
                            Icon(
                                imageVector = Icons.Default.ArrowForward,
                                contentDescription = null,
                                tint = card.accent,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * 5. Fixed Bottom Navigation Bar
 * 4 items: হোম, আমার জমি, কিউআর/স্ক্যান (center button), ইনবক্স
 */
@Composable
fun KhetDrishtiBottomNavigation(
    selectedItem: Int,
    onItemSelected: (Int) -> Unit,
    onScanClick: () -> Unit
) {
    Box(modifier = Modifier.fillMaxWidth().height(78.dp)) {
        NavigationBar(
            containerColor = SurfaceWhite,
            tonalElevation = 8.dp,
            modifier = Modifier.align(Alignment.BottomCenter).fillMaxWidth().height(64.dp)
        ) {
            NavigationBarItem(
                selected = selectedItem == 0,
                onClick = { onItemSelected(0) },
                icon = { Icon(Icons.Default.Home, contentDescription = "হোম") },
                label = { Text("হোম", fontSize = 10.sp) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = KhetPinkPrimary,
                    selectedTextColor = KhetPinkPrimary,
                    indicatorColor = KhetPinkTint
                )
            )

            NavigationBarItem(
                selected = selectedItem == 1,
                onClick = { onItemSelected(1) },
                icon = { Icon(Icons.Default.Park, contentDescription = "আমার জমি") },
                label = { Text("আমার জমি", fontSize = 10.sp) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = KhetPinkPrimary,
                    selectedTextColor = KhetPinkPrimary,
                    indicatorColor = KhetPinkTint
                )
            )

            Spacer(modifier = Modifier.weight(1f))

            NavigationBarItem(
                selected = selectedItem == 2,
                onClick = { onItemSelected(2) },
                icon = { Icon(Icons.Default.Explore, contentDescription = "রাডার") },
                label = { Text("রাডার", fontSize = 10.sp) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = KhetPinkPrimary,
                    selectedTextColor = KhetPinkPrimary,
                    indicatorColor = KhetPinkTint
                )
            )

            NavigationBarItem(
                selected = selectedItem == 3,
                onClick = { onItemSelected(3) },
                icon = {
                    BadgedBox(badge = { Badge(containerColor = AlertRed) { Text("২") } }) {
                        Icon(Icons.Default.Mail, contentDescription = "ইনবক্স")
                    }
                },
                label = { Text("ইনবক্স", fontSize = 10.sp) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = KhetPinkPrimary,
                    selectedTextColor = KhetPinkPrimary,
                    indicatorColor = KhetPinkTint
                )
            )
        }

        // Floating Center Scanner FAB (45-degree rotated rounded square)
        Box(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .size(56.dp)
                .rotate(45f)
                .clip(RoundedCornerShape(16.dp))
                .background(
                    Brush.linearGradient(listOf(KhetPinkDark, KhetPinkPrimary))
                )
                .border(2.dp, SurfaceWhite, RoundedCornerShape(16.dp))
                .clickable { onScanClick() },
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.QrCodeScanner,
                contentDescription = "কিউআর/স্ক্যান",
                tint = SurfaceWhite,
                modifier = Modifier
                    .size(28.dp)
                    .rotate(-45f)
            )
        }
    }
}
`,
  },
];
