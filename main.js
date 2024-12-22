/**
* @typedef {typeof NOTES[number]} Note
*/
const /**@type {["a", "b", "c", "d", "e", "f", "g"]}*/ NOTES = ["a", "b", "c", "d", "e", "f", "g"];

/**
* @param {any} x
* @returns {x is Note}
*/
const isNote = (x) => NOTES.includes(x);

/**
* @param {Note} note 
*/
function getNote(note) {
  const A4 = 440;
  const PART = Math.pow(2, 1/12);
  switch (note) {
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

let /**@type {AudioContext | undefined}*/ audioCtx;
let /**@type {Object.<Note, OscillatorNode>}*/ oscillators = {};
document.addEventListener("click", () => {
  if (audioCtx) return;

  audioCtx = new AudioContext();
  const timeStamp = audioCtx.currentTime + 0.01;
  for (const note of NOTES) {
    const oscillator = audioCtx.createOscillator();
    oscillator.type = "sine";
    oscillator.start(timeStamp);
    oscillator.frequency.setValueAtTime(getNote(note), timeStamp);
    oscillators[note] = oscillator;
  }
});

document.addEventListener("keydown", (ev) => {
  if (!audioCtx) return;

  if (isNote(ev.key)) {
    oscillators[ev.key].connect(audioCtx.destination);
  }
});

document.addEventListener("keyup", (ev) => {
  if (!audioCtx) return;

  if (isNote(ev.key)) {
    oscillators[ev.key].disconnect(audioCtx.destination);
  }
});
