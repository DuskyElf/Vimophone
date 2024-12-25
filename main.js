/**
* @typedef {typeof NOTE_NAMES[number]} NoteName
* @type {["a", "b", "c", "d", "e", "f", "g"]} 
*/const NOTE_NAMES = ["a", "b", "c", "d", "e", "f", "g"];

const A4 = 440;
const NOTE_RATIO = Math.pow(2, 1/12);
const ATTACK_TIME = 0.1;
const RELEASE_TIME = 0.1;

/**
* @param {any} x
* @returns {x is NoteName}
*/const isNote = (x) => NOTE_NAMES.includes(x);

/**
* @param {NoteName} noteName 
* @returns {number}
*/
function getFreq(noteName) {
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

class Note {
  /**
  * @param {AudioContext} audioCtx
  * @param {NoteName} noteName
  * @param {number} timeStamp
  */
  constructor(audioCtx, noteName, timeStamp) {
    /**@private @type {AudioContext} */
    this._audioCtx = audioCtx;
    /**@private @type {number} */
    this._freq = getFreq(noteName);

    /**@private @type {OscillatorNode} */
    this._oscillator = audioCtx.createOscillator();
    this._oscillator.type = "sine";
    this._oscillator.start(timeStamp);
    this._oscillator.frequency.setValueAtTime(this._freq, timeStamp);

    /**@private @type {GainNode} */
    this._gainNode = audioCtx.createGain();
    this._gainNode.gain.setValueAtTime(0, timeStamp);
    this._oscillator.connect(this._gainNode);
    this._gainNode.connect(this._audioCtx.destination);
  }

  /** Hit the Note so that it makes some sound
  * @typedef {{ octave: number, transpose: number }} Modifiers
  * @param {Modifiers} modifiers 
  */
  hit(modifiers) {
    const factor = 1
      * Math.pow(2, modifiers.octave)
      * Math.pow(NOTE_RATIO, modifiers.transpose);

    this._oscillator.frequency.setValueAtTime(
      this._freq * factor, this._audioCtx.currentTime);

    this._gainNode.gain.setTargetAtTime(0.8, this._audioCtx.currentTime, ATTACK_TIME)
  }

  /** The hitting action is completed, stop playing the sound */
  unhit() {
    this._gainNode.gain.setTargetAtTime(0, this._audioCtx.currentTime, RELEASE_TIME)
  }
}

function main() {
  const audioCtx = new AudioContext();
  const timeStamp = audioCtx.currentTime + 0.01;
  const notes = NOTE_NAMES
    .map(noteName => new Note(audioCtx, noteName, timeStamp))

  /** @param {NoteName} noteName */
  const noteFromName = noteName => notes[NOTE_NAMES.indexOf(noteName)];

  const /**@type {Modifiers}*/ modifiers = {
    octave: 0,
    transpose: 0,
  };

  document.addEventListener("keydown", (ev) => {
    if (ev.repeat) return;

    if (ev.key === "k") {
      modifiers.octave = -1;
    } else if (ev.key === "i") {
      modifiers.octave = 1;
    } else if (ev.key === ",") {
      modifiers.octave = 2;
    } else if (ev.key === "j") {
      modifiers.transpose = -1;
    } else if (ev.key === "u") {
      modifiers.transpose = 1;
    } else if (isNote(ev.key)) {
      noteFromName(ev.key).hit(modifiers);
    }
  });

  document.addEventListener("keyup", (ev) => {
    if ("ki,".includes(ev.key)) {
      modifiers.octave = 0;
    } else if ("ju".includes(ev.key)) {
      modifiers.transpose = 0;
    } else if (isNote(ev.key)) {
      noteFromName(ev.key).unhit();
    }
  });
}

let started = false;
document.addEventListener("click", () => {
  if (started) return;
  main();
  started = true;
});
