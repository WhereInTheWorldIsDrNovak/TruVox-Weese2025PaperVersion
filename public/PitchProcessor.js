// pitch-processor.js

// import fxauto from "../src/function/fxauto.js";
class fxauto {
  constructor(z, A, p, C, s) {
    this.srate = s;
    this.tmin = Math.round(this.srate / C);
    this.tmax = Math.round(this.srate / z);
    this.bias = new Float32Array(this.tmax + 1);
    this.ac = new Float32Array(this.tmax + 1);
    const m = Math.log(A);
    const B = m * m;
    const D = 1;
    const E = 0.95;
    const v = Math.log(p);
    const w = v * v;
    const o = 1;
    const x = 0.95;
    let G = (m + v) / 2;
    const F = G * G;
    const H = 1;
    const t = 1;
    const q =
      B * G * o + m * H * w + D * F * v - D * G * w - B * H * v - m * F * o;
    const y =
      E * G * o + m * H * x + D * t * v - D * G * x - E * H * v - m * t * o;
    const J =
      B * t * o + E * H * w + D * F * x - D * t * w - B * H * x - E * F * o;
    const I =
      B * G * x + m * t * w + E * F * v - E * G * w - B * t * v - m * F * x;
    for (let r = this.tmin - 1; r <= this.tmax; r++) {
      G = Math.log(this.srate / r);
      this.bias[r] = (G * G * y) / q + (G * J) / q + I / q;
    }
  }

  CalculateFx(a, O) {
    let Q = 0;
    for (var j = 0; j < O; j++) {
      Q += a[j] * a[j];
    }
    Q = Math.sqrt(Q / O);
    for (var f = this.tmin - 1; f <= this.tmax; f++) {
      let T = 0;
      let R = 0;
      let S = 0;
      for (var j = 0; j < O - f; j++) {
        S += a[j] * a[j + f];
        T += a[j] * a[j];
        R += a[j + f] * a[j + f];
      }
      this.ac[f] = (this.bias[f] * S) / Math.sqrt(T * R);
    }
    let N = this.tmin - 1;
    let d = this.ac[N];
    for (var f = this.tmin; f <= this.tmax; f++) {
      if (this.ac[f] > d) {
        d = this.ac[f];
        N = f;
      }
    }
    if (N <= this.tmin + 1 || N >= this.tmax - 1 || d < 0.5) {
      return {fx: 0, tx: N / this.srate, vs: d, en: Q};
    }
    const K = this.ac[N - 1];
    const P = this.ac[N];
    const l = this.ac[N + 1];
    const g = (0.5 * (l - K)) / (2 * P - K - l);
    let h = N + g;
    const b = 2;
    if (d > 0.9) {
      for (let L = b; L > 1; L--) {
        let e = true;
        for (let M = 1; M < L; M++) {
          const c = Math.round((M * h) / L);
          if (this.ac[c] < 0.9 * d) {
            e = false;
          }
        }
        if (e) {
          h = h / L;
          break;
        }
      }
    }
    return {tx: h / this.srate, fx: this.srate / h, vs: d, en: Q};
  }
}

class PitchProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.fxCalc = null;
    this.config = null;

    this.buffer = []; // Accumulated sample buffer
    this.bufferSize = 2048; // Target buffer size for pitch calculation

    this.port.onmessage = event => {
      if (event.data.config) {
        // Initialize fxCalc with configuration
        this.config = event.data.config;
        this.fxCalc = new fxauto(
          this.config.fxmin,
          this.config.fxlow,
          this.config.fxhigh,
          this.config.fxmax,
          this.config.SRATE
        );
      }
    };
  }

  process(inputs) {
    if (!this.fxCalc) return true;

    const input = inputs[0];
    if (input && input[0]) {
      const buf = input[0]; // Mono channel
      this.buffer.push(...buf); // Accumulate samples in the buffer

      // Check if buffer has reached the target size
      if (this.buffer.length >= this.bufferSize) {
        // Slice out exactly the target buffer size and remove from buffer
        const processBuffer = this.buffer.slice(0, this.bufferSize);
        this.buffer = this.buffer.slice(this.bufferSize);

        // Perform pitch calculation
        const fxest = this.fxCalc.CalculateFx(
          processBuffer,
          processBuffer.length
        );

        // Send pitch data to main thread if energy is high enough
        if (fxest.en > 0) {
          const pitch = fxest.fx < 1 ? Math.random() : fxest.fx;
          this.port.postMessage({pitch});
        }
      }
    }

    return true; // Keep the processor alive
  }
}

// Register the processor with a unique name
registerProcessor('pitch-processor', PitchProcessor);
