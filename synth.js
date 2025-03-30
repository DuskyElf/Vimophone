/** @typedef {typeof NOTE_NAMES[number]} NoteName */
const /** @type {["a", "b", "c", "d", "e", "f", "g"]} */
  NOTE_NAMES = ["a", "b", "c", "d", "e", "f", "g"];

export const A4 = 440;
export const NOTE_RATIO = Math.pow(2, 1 / 12);
export const ATTACK_TIME = 0.1;
export const DECAY_TIME = 0.5;
export const SUSTAIN_FACTOR = 0.1;
export const RELEASE_TIME = 0.1;

/**@returns {x is NoteName}*/
export const isNote = (/**@type any*/x) => NOTE_NAMES.includes(x);

function getFreq(/**@type NoteName*/noteName) {
  switch (noteName) {
    case "a":
      return A4 * Math.pow(NOTE_RATIO, 0);
    case "b":
      return A4 * Math.pow(NOTE_RATIO, 2);
    case "c":
      return A4 * Math.pow(NOTE_RATIO, -9);
    case "d":
      return A4 * Math.pow(NOTE_RATIO, -7);
    case "e":
      return A4 * Math.pow(NOTE_RATIO, -5);
    case "f":
      return A4 * Math.pow(NOTE_RATIO, -4);
    case "g":
      return A4 * Math.pow(NOTE_RATIO, -2);
  }
}

export class Note {
  constructor(/**@type AudioContext*/audioCtx, /**@type NoteName*/noteName, /**@type number*/timeStamp) {
    /**@private*/this._audioCtx = audioCtx;
    /**@private*/this._freq = getFreq(noteName);

    /**@private*/this._oscillator = audioCtx.createOscillator();

    const wave = audioCtx.createPeriodicWave([1, 0.9, 0.5, 0.5, 0.5, 0.5], [1, 1, 1, 1, 1, 1]);
    this._oscillator.setPeriodicWave(wave);

    this._oscillator.start(timeStamp);
    this._oscillator.frequency.setValueAtTime(this._freq, timeStamp);

    /**@private*/this._gainNode = audioCtx.createGain();
    this._gainNode.gain.setValueAtTime(0, timeStamp);
    this._oscillator.connect(this._gainNode);
    this._gainNode.connect(this._audioCtx.destination);
  }

  /** @typedef {{ octave: number, transpose: number }} Modifiers */
  /** Hitthe Note so that it makes some sound */
  hit(/**@type Modifiers*/modifiers) {
    const factor = 1
      * Math.pow(2, modifiers.octave)
      * Math.pow(NOTE_RATIO, modifiers.transpose);

    this._oscillator.frequency.setValueAtTime(
      this._freq * factor, this._audioCtx.currentTime);

    this._gainNode.gain.setTargetAtTime(0.8, this._audioCtx.currentTime, ATTACK_TIME);
    this._gainNode.gain.setTargetAtTime(0.8 * SUSTAIN_FACTOR, this._audioCtx.currentTime + ATTACK_TIME, DECAY_TIME);
  }

  /** The hitting action is completed, stop playing the sound */
  unhit() {
    this._gainNode.gain.cancelScheduledValues(this._audioCtx.currentTime);
    this._gainNode.gain.setTargetAtTime(0, this._audioCtx.currentTime, RELEASE_TIME)
  }
}