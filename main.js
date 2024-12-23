/**
* @typedef {typeof NOTE_NAMES[number]} NoteName
* @type {["a", "b", "c", "d", "e", "f", "g"]} 
*/ const NOTE_NAMES = ["a", "b", "c", "d", "e", "f", "g"];

/**
* @param {any} x
* @returns {x is NoteName}
*/ const isNote = (x) => NOTE_NAMES.includes(x);

/**
* @param {NoteName} noteName 
* @returns {number}
*/
function getFreq(noteName) {
  const A4 = 440;
  const PART = Math.pow(2, 1/12);
  switch (noteName) {
    case "a":
      return A4 * Math.pow(PART, 0);
    case "b":
      return A4 * Math.pow(PART, 2);
    case "c":
      return A4 * Math.pow(PART, -9);
    case "d":
      return A4 * Math.pow(PART, -7);
    case "e":
      return A4 * Math.pow(PART, -5);
    case "f":
      return A4 * Math.pow(PART, -4);
    case "g":
      return A4 * Math.pow(PART, -2);
  }
}

class Note {
  /**
  * @param {AudioContext} audioCtx
  * @param {NoteName} noteName 
  * @param {number} timeStamp
  */
  constructor(audioCtx, noteName, timeStamp) {
    /**@type {AudioContext} */
    this.audioCtx = audioCtx;

    /**@type {OscillatorNode} */
    this.oscillator = audioCtx.createOscillator();
    this.oscillator.type = "sine";
    this.oscillator.start(timeStamp);
    this.oscillator.frequency.setValueAtTime(getFreq(noteName), timeStamp);

    /**@type {GainNode} */
    this.gainNode = audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(0, timeStamp);
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
  }

  /** Hit the Note so that it makes some sound */
  hit() {
    this.gainNode.gain.setTargetAtTime(0.8, this.audioCtx.currentTime, 0.1)
  }

  /** The hitting action is completed, stop playing the sound */
  unhit() {
    this.gainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.1)
  }
}

function main() {
  const audioCtx = new AudioContext();
  const timeStamp = audioCtx.currentTime + 0.01;
  const notes = NOTE_NAMES
    .map(noteName => new Note(audioCtx, noteName, timeStamp))

  /** @param {NoteName} noteName */
  const noteFromName = noteName => notes[NOTE_NAMES.indexOf(noteName)];

  document.addEventListener("keydown", (ev) => {
    if (isNote(ev.key)) {
      noteFromName(ev.key).hit();
    }
  });

  document.addEventListener("keyup", (ev) => {
    if (isNote(ev.key)) {
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
