/** Stillscape — original, real-time synthesized ambient sound. No audio assets. */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const finite = (value, fallback) => Number.isFinite(value) ? value : fallback;
const TAU = Math.PI * 2;

// Each scene has a different balance, spectral colour, tuning and event density.
const PROFILES = {
  oil:        { wind: .65, water: .50, rain: .02, tone: .22, cutoff: 870, waterHz: 940, root: 146.83, drops: .12, colour: 'drop' },
  ink:        { wind: .32, water: .70, rain: .05, tone: .11, cutoff: 520, waterHz: 720, root: 130.81, drops: .34, colour: 'drop' },
  pixel:      { wind: .24, water: .28, rain: .02, tone: .32, cutoff: 620, waterHz: 1200, root: 164.81, drops: .13, colour: 'bell' },
  lowpoly:    { wind: .72, water: .25, rain: .00, tone: .19, cutoff: 780, waterHz: 960, root: 110, drops: .04, colour: 'drop' },
  cyberpunk:  { wind: .25, water: .17, rain: .68, tone: .35, cutoff: 410, waterHz: 1450, root: 82.41, drops: .58, colour: 'rain' },
  minimal:   { wind: .19, water: .00, rain: .00, tone: .22, cutoff: 450, waterHz: 500, root: 130.81, drops: .00, colour: 'bell' },
  surreal:   { wind: .31, water: .33, rain: .02, tone: .42, cutoff: 680, waterHz: 760, root: 138.59, drops: .10, colour: 'bell' },
  film:      { wind: .52, water: .25, rain: .12, tone: .12, cutoff: 590, waterHz: 820, root: 123.47, drops: .12, colour: 'rain' },
  space:     { wind: .10, water: .00, rain: .00, tone: .66, cutoff: 190, waterHz: 450, root: 65.41, drops: .00, colour: 'bell' },
  underwater:{ wind: .13, water: .85, rain: .00, tone: .32, cutoff: 240, waterHz: 430, root: 98, drops: .42, colour: 'bubble' },
  aurora:    { wind: .51, water: .06, rain: .00, tone: .48, cutoff: 660, waterHz: 700, root: 146.83, drops: .07, colour: 'bell' },
  desert:    { wind: .92, water: .00, rain: .04, tone: .16, cutoff: 1100, waterHz: 600, root: 110, drops: .00, colour: 'rain' },
  papercut:  { wind: .40, water: .13, rain: .04, tone: .20, cutoff: 1200, waterHz: 850, root: 174.61, drops: .06, colour: 'bell' },
  garden:    { wind: .40, water: .55, rain: .05, tone: .16, cutoff: 1250, waterHz: 1250, root: 196, drops: .29, colour: 'drop' },
  ukiyoe:    { wind: .56, water: .78, rain: .06, tone: .13, cutoff: 760, waterHz: 1100, root: 146.83, drops: .20, colour: 'drop' },
};
const ALIASES = { '油画': 'oil', oilpainting: 'oil', 'low-poly': 'lowpoly', 'paper-cut': 'papercut', 'oil-painting': 'oil', painting: 'oil', '水墨': 'ink', '像素': 'pixel', '低多边形': 'lowpoly', '赛博朋克': 'cyberpunk', '极简': 'minimal', '超现实': 'surreal', '胶片': 'film', '太空': 'space', '水下': 'underwater', '极光': 'aurora', '沙漠': 'desert', '剪纸': 'papercut', '花园': 'garden', '浮世绘': 'ukiyoe' };

const NOISE_WORKLET = `
class StillscapeNoise extends AudioWorkletProcessor {
  constructor() {
    super();
    this.seed = [Math.random() * 2147483646 + 1, Math.random() * 2147483646 + 1].map(Math.floor);
    this.memory = [[0,0,0], [0,0,0]];
  }
  process(inputs, outputs) {
    const channels = outputs[0];
    for (let c = 0; c < channels.length; c++) {
      const data = channels[c], b = this.memory[c];
      let seed = this.seed[c];
      for (let i = 0; i < data.length; i++) {
        seed = (seed * 16807) % 2147483647;
        const white = seed / 1073741823.5 - 1;
        b[0] = .99765 * b[0] + white * .099046;
        b[1] = .963 * b[1] + white * .2965164;
        b[2] = .57 * b[2] + white * 1.0526913;
        data[i] = (b[0] + b[1] + b[2] + white * .1848) * .10;
      }
      this.seed[c] = seed;
    }
    return true;
  }
}
registerProcessor('stillscape-noise', StillscapeNoise);
`;

export class Soundscape {
  constructor({ volume = .22 } = {}) {
    this.volume = clamp(finite(volume, .22), 0, 1);
    this.enabled = false;
    this.destroyed = false;
    this.scene = { style: 'oil' };
    this.profile = { ...PROFILES.oil };
    this.motion = { time: 0, speed: 1, wind: 1, water: 1, cloud: 1, playing: true };
    this.nodes = [];
    this.sources = [];
    this.events = new Set();
    this._lastUpdate = -Infinity;
    this._lastEventTime = 0;
    this._onVisibility = () => {
      this._applyMaster();
      if (!document.hidden && this.enabled && this.context?.state === 'suspended') {
        this.context.resume().catch(() => {});
      }
    };
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', this._onVisibility);
  }

  /** Call directly from a user click/tap; rejects if audio is unavailable. */
  async enable() {
    if (this.destroyed) throw new Error('Soundscape has been destroyed.');
    this.enabled = true;
    try {
      if (!this.context) {
        const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!AudioContext) throw new Error('Web Audio is not supported in this browser.');
        this.context = new AudioContext({ latencyHint: 'playback' });
      }
      // Resume before the asynchronous worklet load to preserve user activation.
      await this.context.resume();
      if (!this._initPromise) this._initPromise = this._build();
      await this._initPromise;
      if (this.destroyed) return false;
      this._applyMotion(true);
      this._applyMaster();
      return this.enabled;
    } catch (error) {
      this.enabled = false;
      this._applyMaster();
      throw error;
    }
  }

  disable() {
    this.enabled = false;
    this._applyMaster();
  }

  setVolume(value) {
    this.volume = clamp(finite(value, this.volume), 0, 1);
    this._applyMaster();
  }

  setScene(scene = {}) {
    this.scene = typeof scene === 'string' ? { style: scene } : (scene || {});
    const raw = String(this.scene.style || this.scene.id || 'oil').toLowerCase();
    const style = ALIASES[raw] || raw;
    this.profile = { ...(PROFILES[style] || PROFILES.oil) };
    const effects = this.scene.effects;
    const hasEffect = name => Array.isArray(effects) ? effects.includes(name) : typeof effects === 'string' ? effects.split(/[ ,|]+/).includes(name) : !!effects?.[name];
    if (hasEffect('rain')) { this.profile.rain = Math.max(.42, this.profile.rain); this.profile.drops = Math.max(.38, this.profile.drops); }
    if (hasEffect('water') || hasEffect('river') || hasEffect('ocean')) this.profile.water = Math.max(.5, this.profile.water);
    if (hasEffect('snow')) this.profile.cutoff *= .72;
    // An explicit false disables a layer; omitted effects keep the style defaults.
    if (effects && !Array.isArray(effects) && typeof effects === 'object') {
      for (const key of ['wind', 'water', 'rain', 'tone']) if (effects[key] === false) this.profile[key] = 0;
      if ((effects.rain === false && this.profile.colour === 'rain') ||
          (effects.water === false && ['drop', 'bubble'].includes(this.profile.colour)) ||
          (effects.tone === false && this.profile.colour === 'bell')) this.profile.drops = 0;
    }
    this._applyMotion(true);
  }

  /** Clocks are already integrated by the renderer; never multiply them by speed again. */
  update({ time, windTime, waterTime, cloudTime, speed, wind, water, cloud, gust, playing } = {}) {
    const previousPlaying = this.motion.playing;
    this.motion.time = finite(time, this.motion.time);
    this.motion.speed = clamp(finite(speed, this.motion.speed), .25, 3);
    for (const [key, value] of Object.entries({ windTime, waterTime, cloudTime })) {
      if (Number.isFinite(value)) this.motion[key] = value;
      else if (Number.isFinite(time)) this.motion[key] = undefined;
    }
    for (const [key, value] of Object.entries({ wind, water, cloud })) {
      this.motion[key] = clamp(finite(value, this.motion[key]), 0, 3);
    }
    if (Number.isFinite(gust)) this.motion.gust = clamp(gust, 0, 2);
    else if (Number.isFinite(time)) this.motion.gust = undefined;
    if (typeof playing === 'boolean') this.motion.playing = playing;
    if (previousPlaying !== this.motion.playing) this._applyMaster();
    this._applyMotion();
  }

  _track(node) { this.nodes.push(node); return node; }
  _smooth(param, value, constant = .5) {
    if (!this.context || this.context.state === 'closed') return;
    const now = this.context.currentTime;
    // Holding the current automation value avoids clicks during rapid toggles.
    if (typeof param.cancelAndHoldAtTime === 'function') param.cancelAndHoldAtTime(now);
    else param.cancelScheduledValues(now);
    param.setTargetAtTime(value, now, constant);
  }

  async _build() {
    const ctx = this.context;
    this.master = this._track(ctx.createGain());
    this.master.gain.value = 0;
    this.bus = this._track(ctx.createGain());
    const dc = this._track(ctx.createBiquadFilter());
    dc.type = 'highpass'; dc.frequency.value = 28; dc.Q.value = .5;
    const compressor = this._track(ctx.createDynamicsCompressor());
    compressor.threshold.value = -16; compressor.knee.value = 18;
    compressor.ratio.value = 3; compressor.attack.value = .025; compressor.release.value = .4;
    this.bus.connect(dc).connect(compressor).connect(this.master).connect(ctx.destination);
    let hasWorklet = false;
    if (ctx.audioWorklet && typeof AudioWorkletNode !== 'undefined') {
      const url = URL.createObjectURL(new Blob([NOISE_WORKLET], { type: 'text/javascript' }));
      try { await ctx.audioWorklet.addModule(url); hasWorklet = true; }
      catch { /* CSP or older browser: use long, seamless independent noise beds. */ }
      finally { URL.revokeObjectURL(url); }
    }
    if (this.destroyed) return;
    this.noiseMode = hasWorklet ? 'continuous-worklet' : 'long-buffer-fallback';
    this.layers = {};
    for (const [index, key] of ['wind', 'water', 'rain'].entries()) {
      const source = hasWorklet ? this._track(new AudioWorkletNode(ctx, 'stillscape-noise', { numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [2] })) : this._fallbackNoise(37.13 + index * 12.71);
      const high = this._track(ctx.createBiquadFilter()); high.type = 'highpass'; high.Q.value = .55;
      high.frequency.value = { wind: 80, water: 280, rain: 1100 }[key];
      const low = this._track(ctx.createBiquadFilter()); low.type = 'lowpass'; low.Q.value = .5;
      low.frequency.value = { wind: 850, water: 1200, rain: 3400 }[key];
      const gain = this._track(ctx.createGain()); gain.gain.value = 0;
      source.connect(high).connect(low).connect(gain).connect(this.bus);
      this.layers[key] = { gain, low, high };
    }
    this.tones = [1, 1.5, 2.002, .5].map((ratio, index) => {
      const oscillator = this._track(ctx.createOscillator()); oscillator.type = 'sine';
      oscillator.frequency.value = this.profile.root * ratio;
      const gain = this._track(ctx.createGain()); gain.gain.value = 0;
      const pan = this._track(ctx.createStereoPanner()); pan.pan.value = [-.42, .38, .12, -.1][index];
      oscillator.connect(gain).connect(pan).connect(this.bus);
      oscillator.start(); this.sources.push(oscillator);
      return { oscillator, gain, ratio, index };
    });
    this._lastEventTime = ctx.currentTime;
    this._eventTimer = setInterval(() => this._tickEvents(), 140);
  }

  _fallbackNoise(seconds) {
    const ctx = this.context, length = Math.round(seconds * ctx.sampleRate);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    const overlap = Math.round(ctx.sampleRate * .14);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = .99765 * b0 + white * .099046;
        b1 = .963 * b1 + white * .2965164;
        b2 = .57 * b2 + white * 1.0526913;
        data[i] = (b0 + b1 + b2 + white * .1848) * .1;
      }
      // Equal-power boundary crossfade, then loop from the end of the overlap.
      for (let i = 0; i < overlap; i++) {
        const theta = (i / overlap) * Math.PI / 2;
        data[length - overlap + i] = data[length - overlap + i] * Math.cos(theta) + data[i] * Math.sin(theta);
      }
    }
    const source = this._track(ctx.createBufferSource());
    source.buffer = buffer; source.loop = true;
    source.loopStart = overlap / ctx.sampleRate; source.loopEnd = length / ctx.sampleRate;
    source.start(0, overlap / ctx.sampleRate); this.sources.push(source);
    return source;
  }

  _applyMaster() {
    if (!this.master || this.destroyed) return;
    const visible = typeof document === 'undefined' || !document.hidden;
    const audible = this.enabled && this.motion.playing && visible;
    // Quadratic-feeling slider, with a restrained maximum and quiet default.
    this._smooth(this.master.gain, audible ? this.volume * .85 : 0, audible ? .7 : .22);
  }

  _applyMotion(force = false) {
    if (!this.layers || this.destroyed) return;
    const ctx = this.context;
    if (!force && ctx.currentTime - this._lastUpdate < 1 / 24) return;
    this._lastUpdate = ctx.currentTime;
    const { time: t, wind, water, cloud } = this.motion, p = this.profile;
    const windClock = this.motion.windTime ?? t, waterClock = this.motion.waterTime ?? t;
    const gust = this.motion.gust ?? (.65 + .20 * Math.sin(windClock * .173 + .9) + .10 * Math.sin(windClock * .071 + 2.2) + .05 * Math.sin(windClock * .433 - .5));
    const breeze = Math.sqrt(wind) * gust;
    const flow = Math.sqrt(water) * (.82 + .12 * Math.sin(waterClock * .37) + .06 * Math.sin(waterClock * .137 + 1.4));
    const rain = Math.sqrt(cloud) * (.8 + .2 * Math.min(1.5, gust));
    const transition = force ? 1.3 : .16;
    this._smooth(this.layers.wind.gain.gain, p.wind * .65 * breeze, transition);
    this._smooth(this.layers.wind.low.frequency, p.cutoff * (.68 + .55 * Math.min(1.8, breeze)), force ? 1.2 : .22);
    this._smooth(this.layers.water.gain.gain, p.water * .55 * flow, transition);
    this._smooth(this.layers.water.low.frequency, p.waterHz * (.82 + .18 * Math.min(2, flow)), transition);
    this._smooth(this.layers.rain.gain.gain, p.rain * .38 * rain, transition);
    for (const tone of this.tones) {
      const breath = .82 + .12 * Math.sin(t * (.037 + tone.index * .013) + tone.index * 1.3);
      this._smooth(tone.gain.gain, p.tone * [ .019, .010, .006, .009 ][tone.index] * breath, force ? 1.8 : .45);
      this._smooth(tone.oscillator.frequency, p.root * tone.ratio, 1.8);
    }
  }

  _tickEvents() {
    if (!this.context || this.destroyed) return;
    const now = this.context.currentTime;
    const dt = clamp(now - this._lastEventTime, 0, .35); this._lastEventTime = now;
    if (!this.enabled || !this.motion.playing || this.context.state !== 'running' || (typeof document !== 'undefined' && document.hidden)) return;
    const p = this.profile;
    const amount = p.colour === 'rain' ? this.motion.cloud : p.colour === 'bell' ? .7 + this.motion.cloud * .15 : this.motion.water;
    if (Math.random() < 1 - Math.exp(-p.drops * amount * dt)) this._event(p.colour);
  }

  _event(colour) {
    const ctx = this.context, now = ctx.currentTime + .018;
    const oscillator = ctx.createOscillator(), gain = ctx.createGain(), pan = ctx.createStereoPanner();
    const bubble = colour === 'bubble', bell = colour === 'bell', rain = colour === 'rain';
    const duration = bell ? 2.6 : bubble ? .32 : rain ? .10 : .46;
    const root = this.profile.root;
    const pitch = bell ? root * [2, 3, 4, 4.5][Math.floor(Math.random() * 4)] : (bubble ? 170 : rain ? 650 : 420) + Math.random() * (rain ? 500 : 360);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(pitch, now);
    oscillator.frequency.exponentialRampToValueAtTime(pitch * (bubble ? 1.6 : bell ? 1 : .62), now + duration * .75);
    const peak = bell ? .008 : bubble ? .013 : rain ? .009 : .016;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + (bell ? .13 : .008));
    gain.gain.exponentialRampToValueAtTime(.00001, now + duration);
    pan.pan.value = (Math.random() * 2 - 1) * .65;
    oscillator.connect(gain).connect(pan).connect(this.bus);
    const event = { oscillator, gain, pan }; this.events.add(event);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); pan.disconnect(); this.events.delete(event); };
    oscillator.start(now); oscillator.stop(now + duration + .02);
  }

  async destroy() {
    if (this.destroyed) return;
    this.enabled = false;
    this._applyMaster();
    this.destroyed = true;
    clearInterval(this._eventTimer);
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', this._onVisibility);
    // Allow the short release to settle before tearing down active nodes.
    if (this.context?.state === 'running') await new Promise(resolve => setTimeout(resolve, 750));
    for (const source of [...this.sources, ...Array.from(this.events, event => event.oscillator)]) {
      try { source.stop(); } catch { /* Already stopped. */ }
    }
    for (const node of this.nodes) { try { node.disconnect(); } catch { /* Already disconnected. */ } }
    for (const event of this.events) { event.oscillator.disconnect(); event.gain.disconnect(); event.pan.disconnect(); }
    this.events.clear();
    if (this.context && this.context.state !== 'closed') await this.context.close();
  }
}
