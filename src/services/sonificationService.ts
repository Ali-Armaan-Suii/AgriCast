// Data Sonification Engine: Acoustic Sound Mapping & Voice Accessibility for Rural Farmers
import { FieldPlot, FireHotspotAlert, NasaTelemetry } from '../types';

class SonificationEngine {
  private audioCtx: AudioContext | null = null;
  private isTonePlaying = false;
  private oscillatorNode: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  private initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Generates acoustic frequency mapped to Soil Moisture & Canopy Stress
   * Healthy Soil Moisture (0.28+) -> Harmonic 440Hz - 528Hz (Warm soothing resonance)
   * Depleted Moisture (0.12 - 0.18) -> Low tension 190Hz - 280Hz
   * Critical Fire Alert -> 880Hz / 1200Hz pulsing urgent alarm
   */
  public playAcousticSignature(
    telemetry: NasaTelemetry,
    fireAlert: FireHotspotAlert,
    durationMs = 4500
  ): Promise<void> {
    return new Promise((resolve) => {
      try {
        this.initAudio();
        if (!this.audioCtx) {
          resolve();
          return;
        }

        this.stopAcoustic();

        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        // Base frequency mapped to SMAP moisture: 0.10 -> 220Hz (A3), 0.35 -> 587Hz (D5)
        const moistureRatio = Math.max(0, Math.min(1, (telemetry.smapSurfaceMoisture - 0.1) / 0.25));
        const baseFreq = 220 + moistureRatio * 330;

        // Create main oscillator
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // If fire is detected nearby, use pulsed triangle alarm
        if (fireAlert.detected && fireAlert.distanceKm <= 5) {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.setValueAtTime(660, now + 0.3);
          osc.frequency.setValueAtTime(880, now + 0.6);
          osc.frequency.setValueAtTime(660, now + 0.9);
          osc.frequency.setValueAtTime(880, now + 1.2);
          osc.frequency.setValueAtTime(660, now + 1.5);
          osc.frequency.setValueAtTime(880, now + 1.8);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.exponentialRampToValueAtTime(0.25, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + (durationMs / 1000));
        } else {
          // Warm multi-timbre tone indicating moisture level
          osc.type = telemetry.ecostressAirTempDiffC > 1.5 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(baseFreq, now);
          // Frequency gentle rise/sweep to indicate telemetry stability
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, now + 2.0);
          osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 4.0);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.exponentialRampToValueAtTime(0.18, now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, now + (durationMs / 1000));
        }

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + durationMs / 1000);

        this.oscillatorNode = osc;
        this.gainNode = gain;
        this.isTonePlaying = true;

        setTimeout(() => {
          this.isTonePlaying = false;
          resolve();
        }, durationMs);
      } catch (e) {
        console.error('Audio synthesis error:', e);
        resolve();
      }
    });
  }

  public stopAcoustic() {
    if (this.oscillatorNode) {
      try {
        this.oscillatorNode.stop();
        this.oscillatorNode.disconnect();
      } catch {}
      this.oscillatorNode = null;
    }
    this.isTonePlaying = false;
  }

  /**
   * Multi-lingual voice briefing for rural farmers (English, Hindi, Punjabi)
   */
  public speakFarmerBriefing(
    plot: FieldPlot,
    telemetry: NasaTelemetry,
    fireAlert: FireHotspotAlert,
    language: 'hi' | 'pa' | 'en' = 'en'
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      let text = '';
      const smapPct = (telemetry.smapSurfaceMoisture * 100).toFixed(0);
      const canopyTemp = telemetry.ecostressCanopyTempC.toFixed(0);

      if (language === 'hi') {
        text = `नमस्ते किसान भाई। खेतदृष्टि नासा उपग्रह रिपोर्ट: ${plot.name} में मृदा नमी ${smapPct} प्रतिशत है। फसल का तापमान ${canopyTemp} डिग्री सेल्सियस है। `;
        if (fireAlert.detected) {
          text += `सावधान! ${fireAlert.distanceKm} किलोमीटर दूरी पर नासा उपग्रह द्वारा आग का हॉटस्पॉट देखा गया है। `;
        }
        if (telemetry.smapSurfaceMoisture < 0.18) {
          text += `मृदा में पानी की कमी है, कृपया शाम को ड्रिप सिंचाई शुरू करें।`;
        } else {
          text += `फसल का स्वास्थ्य उत्तम है।`;
        }
      } else if (language === 'pa') {
        text = `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ। ਖੇਤ ਦ੍ਰਿਸ਼ਟੀ ਨਾਸਾ ਸੈਟੇਲਾਈਟ ਰਿਪੋਰਟ: ${plot.name} ਵਿੱਚ ਮਿੱਟੀ ਦੀ ਨਮੀ ${smapPct} ਫ਼ੀਸਦੀ ਹੈ। ਫਸਲ ਦਾ ਤਾਪਮਾਨ ${canopyTemp} ਡਿਗਰੀ ਹੈ। `;
        if (fireAlert.detected) {
          text += `ਧਿਆਨ ਦਿਓ! ${fireAlert.distanceKm} ਕਿਲੋਮੀਟਰ ਦੂਰੀ ਉੱਤੇ ਨਾਸਾ ਸੈਟੇਲਾਈਟ ਨੇ ਅੱਗ ਦੀ ਗਰਮੀ ਪਛਾਣੀ ਹੈ। `;
        }
        text += `ਖੇਤੀ ਕੰਮਾਂ ਲਈ ਮੌਸਮ ਅਨੁਕੂਲ ਹੈ।`;
      } else {
        text = `Greetings Farmer. AgriCast NASA Earth Intelligence report for ${plot.name}: SMAP soil moisture is at ${smapPct} percent. ECOSTRESS canopy temperature is ${canopyTemp} degrees Celsius. `;
        if (fireAlert.detected) {
          text += `Alert! NASA VIIRS detected an active thermal fire hotspot ${fireAlert.distanceKm} kilometers away. `;
        }
        text +=
          telemetry.smapSurfaceMoisture < 0.18
            ? `Moisture is below target threshold. Schedule night drip irrigation.`
            : `Crop vegetative vigor is currently healthy.`;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Select voice if available
      const voices = window.speechSynthesis.getVoices();
      if (language === 'hi') {
        const hiVoice = voices.find((v) => v.lang.startsWith('hi'));
        if (hiVoice) utterance.voice = hiVoice;
      } else if (language === 'pa') {
        const paVoice = voices.find((v) => v.lang.startsWith('pa') || v.lang.startsWith('hi'));
        if (paVoice) utterance.voice = paVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sonificationEngine = new SonificationEngine();
