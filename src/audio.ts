/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class EtherealSynth {
  private ctx: AudioContext | null = null;
  private currentOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Ethereal single chime (bell vibe)
  playChime() {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (major triad chord)
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      
      // Delay note starters slightly for strumming harp effect
      const noteDelay = idx * 0.04;
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + noteDelay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + noteDelay + 1.8);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + noteDelay);
      osc.stop(now + noteDelay + 2.0);
    });
  }

  // Rising mystical pad (tension / energy gathering)
  startSwellingPad() {
    const ctx = this.initContext();
    if (!ctx) return () => {};

    const now = ctx.currentTime;
    const baseFreqs = [110, 220, 330, 440]; // A2, A3, E4, A4 (ambient 5ths/octaves)
    const oscillators: { osc: OscillatorNode; gain: GainNode }[] = [];

    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Use different wave types for lush blend
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      
      // Subtle pitch detuning for beautiful lush chorus effect
      osc.detune.setValueAtTime((idx - 1.5) * 8, now);
      
      gain.gain.setValueAtTime(0, now);
      // Gentle swell
      gain.gain.linearRampToValueAtTime(0.06, now + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      oscillators.push({ osc, gain });
    });

    // Return stopper function to clean up / fade out
    return () => {
      const stopNow = ctx.currentTime;
      oscillators.forEach(({ osc, gain }) => {
        gain.gain.cancelScheduledValues(stopNow);
        gain.gain.setValueAtTime(gain.gain.value, stopNow);
        gain.gain.exponentialRampToValueAtTime(0.0001, stopNow + 0.8);
        setTimeout(() => {
          try {
            osc.stop();
          } catch (e) {}
        }, 1000);
      });
    };
  }

  // Divine reveal chime
  playReveal() {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [329.63, 493.88, 659.25, 987.77, 1318.51]; // E4, B4, E5, B5, E6 (Golden Pentatonic)

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 1.5);

      const delay = idx * 0.08;

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 2.8);
    });
  }
}

export const synth = new EtherealSynth();
