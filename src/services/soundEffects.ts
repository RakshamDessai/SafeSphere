// Synthesizes audio using Web Audio API and Speech Synthesis (no external assets needed)

class SoundEffectsService {
  private audioCtx: AudioContext | null = null;
  private sirenOscillator1: OscillatorNode | null = null;
  private sirenOscillator2: OscillatorNode | null = null;
  private sirenGainNode: GainNode | null = null;
  private sirenInterval: number | null = null;
  private isSirenPlaying = false;

  private ringtoneInterval: number | null = null;
  private isRinging = false;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play single pulse beep for SOS countdown
  playBeep(frequency = 880, duration = 0.15, type: OscillatorType = 'sine') {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Start High-Decibel Emergency Siren (Dual Tone Warble)
  startSiren() {
    if (this.isSirenPlaying) return;
    try {
      const ctx = this.getAudioContext();
      this.isSirenPlaying = true;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      gain.gain.setValueAtTime(0.35, ctx.currentTime);

      let toggle = false;
      osc1.frequency.setValueAtTime(750, ctx.currentTime);
      osc2.frequency.setValueAtTime(950, ctx.currentTime);

      this.sirenInterval = window.setInterval(() => {
        if (!this.isSirenPlaying) return;
        const now = ctx.currentTime;
        if (toggle) {
          osc1.frequency.setTargetAtTime(900, now, 0.05);
          osc2.frequency.setTargetAtTime(1200, now, 0.05);
        } else {
          osc1.frequency.setTargetAtTime(600, now, 0.05);
          osc2.frequency.setTargetAtTime(800, now, 0.05);
        }
        toggle = !toggle;
      }, 400);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      this.sirenOscillator1 = osc1;
      this.sirenOscillator2 = osc2;
      this.sirenGainNode = gain;
    } catch (e) {
      console.warn('Siren start error:', e);
    }
  }

  // Stop Emergency Siren
  stopSiren() {
    if (!this.isSirenPlaying) return;
    this.isSirenPlaying = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    try {
      this.sirenOscillator1?.stop();
      this.sirenOscillator2?.stop();
      this.sirenOscillator1?.disconnect();
      this.sirenOscillator2?.disconnect();
      this.sirenGainNode?.disconnect();
    } catch (e) {
      console.warn('Siren stop error:', e);
    }
  }

  // Incoming Phone Ringtone Simulation
  startRingtone() {
    if (this.isRinging) return;
    this.isRinging = true;

    const ringCycle = () => {
      if (!this.isRinging) return;
      this.playBeep(853, 0.4, 'triangle');
      setTimeout(() => {
        if (this.isRinging) this.playBeep(960, 0.4, 'triangle');
      }, 450);
      setTimeout(() => {
        if (this.isRinging) this.playBeep(853, 0.4, 'triangle');
      }, 900);
      setTimeout(() => {
        if (this.isRinging) this.playBeep(960, 0.4, 'triangle');
      }, 1350);
    };

    ringCycle();
    this.ringtoneInterval = window.setInterval(ringCycle, 3500);
  }

  stopRingtone() {
    this.isRinging = false;
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
  }

  // Text-To-Speech Voice Guidance or Fake Call Conversation
  speakText(text: string, voiceRate = 1.0, pitch = 1.0): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceRate;
      utterance.pitch = pitch;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundEffects = new SoundEffectsService();
