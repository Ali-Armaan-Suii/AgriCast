import os
import zipfile

def main():
    os.makedirs('public', exist_ok=True)
    
    with open('src/data/androidCodebase.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by '{' and extract path and code
    items = []
    # Find all path: '...'
    pos = 0
    while True:
        idx = content.find("path: '", pos)
        if idx == -1:
            idx = content.find('path: "', pos)
            if idx == -1:
                break
            quote = '"'
            start_p = idx + len('path: "')
        else:
            quote = "'"
            start_p = idx + len("path: '")
        
        end_p = content.find(quote, start_p)
        if end_p == -1:
            break
        rel_path = content[start_p:end_p]
        
        # Now find code: `
        code_marker = "code: `"
        code_start_idx = content.find(code_marker, end_p)
        if code_start_idx == -1:
            # Maybe code: PROJECT_DIRECTORY_TREE
            pos = end_p + 1
            continue
        
        code_content_start = code_start_idx + len(code_marker)
        # Find closing backtick that ends this code block
        code_content_end = content.find("`,\n", code_content_start)
        if code_content_end == -1:
            code_content_end = content.find("`\n", code_content_start)
        if code_content_end == -1:
            code_content_end = content.find("`", code_content_start)
            
        code_str = content[code_content_start:code_content_end]
        items.append((rel_path, code_str))
        pos = code_content_end + 1

    zip_path = 'public/khetdrishti-app.zip'

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for rel_path, code in items:
            clean_path = os.path.join('khetdrishti-android', rel_path.lstrip('/'))
            zf.writestr(clean_path, code.strip())

        # Root build.gradle.kts
        zf.writestr('khetdrishti-android/build.gradle.kts', """// Top-level build file
plugins {
    id("com.android.application") version "8.2.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false
    id("com.google.dagger.hilt.android") version "2.50" apply false
}
""")

        # settings.gradle.kts
        zf.writestr('khetdrishti-android/settings.gradle.kts', """pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "KhetDrishti"
include(":app")
""")

        # app/build.gradle.kts
        zf.writestr('khetdrishti-android/app/build.gradle.kts', """plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("kotlin-kapt")
    id("dagger.hilt.android.plugin")
}

android {
    namespace = "com.khetdrishti.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.khetdrishti.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
}
""")

        # AndroidManifest.xml
        zf.writestr('khetdrishti-android/app/src/main/AndroidManifest.xml', """<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="ক্ষেতদৃষ্টি"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.KhetDrishti">
        <activity
            android:name=".ui.MainActivity"
            android:exported="true"
            android:theme="@style/Theme.KhetDrishti">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
""")

        # README.md
        zf.writestr('khetdrishti-android/README.md', """# KhetDrishti (ক্ষেতদৃষ্টি) - Android App Codebase & APK Builder

এই প্যাকেজে সম্পূর্ণ KhetDrishti Android Jetpack Compose অ্যাপ সোর্স কোড অন্তর্ভুক্ত রয়েছে।

## APK বিল্ড ও ফোনে ইনস্টল করার সহজ নিয়ম:

### পদ্ধতি ১: Android Studio দিয়ে সরাসরি ইনস্টল
1. এই জিপ ফাইলটি এক্সট্র্যাক্ট (Unzip) করুন।
2. **Android Studio** ওপেন করে `Open Project` সিলেক্ট করুন এবং `khetdrishti-android` ফোল্ডারটি ওপেন করুন।
3. Gradle Sync সম্পন্ন হওয়ার পর আপনার অ্যান্ড্রয়েড ফোন USB ক্যাবল বা WiFi দিয়ে কানেক্ট করুন।
4. সরাসরি উপরে থাকা সবুজ **Run** বাটনে ক্লিক করলেই আপনার ফোনে অ্যাপ ইনস্টল হয়ে যাবে।

### পদ্ধতি ২: টার্মিনাল/কমান্ড লাইন দিয়ে Debug APK বিল্ড
```bash
cd khetdrishti-android
./gradlew assembleDebug
```
বিল্ড শেষ হলে আপনার ফোনে ইনস্টল করার রেডি APK পাওয়া যাবে এখানে:
`app/build/outputs/apk/debug/app-debug.apk`

---
### বৈশিষ্ট্যসমূহ:
- NASA POWER ও FIRMS রিয়েলটাইম স্যাটেলাইট এপিআই
- মাটির আর্দ্রতা (SMAP) ও ইকোস্ট্রেস মনিটরিং
- বাংলা অডিও গাইড ও কালবৈশাখী ঝড়-বৃষ্টি আবহাওয়া সতর্কতা
- বিকাশ-অনুপ্রাণিত উপাদান ও অফলাইন রুম ডাটাবেজ
""")

    print(f"Success: Created {zip_path} with {len(items)} source files. Size: {os.path.getsize(zip_path)} bytes.")

if __name__ == '__main__':
    main()
