export const notes = ["C", "D", "E", "F", "G", "A", "B"] as const;
type Note = (typeof notes)[number];

interface Modifiers {
  octave: number;
  transpose: number;
}

const A4 = 440;
const NOTE_RATIO = Math.pow(2, 1 / 12);

const ATTACK_TIME = 0.01;
const DECAY_TIME = 0.3;
const SUSTAIN_FACTOR = 0.05;
const RELEASE_TIME = 0.1;
const Img = [0, 1, 0.6, 0.4, 0.25, 0.15, 0.1, 0.06, 0.04];
const WAVE_FORM = [new Float32Array(Img.length).fill(0), new Float32Array(Img)];

export type ReleaseHandle = ReturnType<typeof playNote>;

export function playNote(
  audioCtx: AudioContext,
  baseNote: Note,
  modifiers: Partial<Modifiers>,
) {
  const octave = modifiers.octave ?? 4;
  const transpose = modifiers.transpose ?? 0;
  let frequency =
    getFreq(baseNote) * Math.pow(2, octave - 4) * Math.pow(2, transpose / 12);

  // The 12th root of 2 is used in equal temperament tuning to divide the octave
  // into 12 equal semitones, but this produces irrational frequency ratios.
  // Rounding the frequency to two decimal places helps reduce floating point artifacts
  // and brings the result closer to simple rational ratios, minimizing beating effects.
  frequency = Math.round(frequency * 100) / 100;

  const osc = audioCtx.createOscillator();
  const wave = audioCtx.createPeriodicWave(WAVE_FORM[0], WAVE_FORM[1]);
  osc.setPeriodicWave(wave);
  osc.frequency.value = frequency;
  osc.start();

  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0;
  gainNode.connect(audioCtx.destination);

  osc.connect(gainNode);
  const now = audioCtx.currentTime;
  gainNode.gain.setTargetAtTime(0.8, now, ATTACK_TIME);
  gainNode.gain.setTargetAtTime(
    0.8 * SUSTAIN_FACTOR,
    now + ATTACK_TIME,
    DECAY_TIME,
  );

  return {
    release: () => {
      const now = audioCtx.currentTime;
      gainNode.gain.cancelScheduledValues(0);
      gainNode.gain.setTargetAtTime(0, now, RELEASE_TIME);
      osc.stop(now + RELEASE_TIME * 5);
      osc.onended = () => {
        gainNode.disconnect();
      };
    },
  };
}

function getFreq(noteName: Note) {
  switch (noteName) {
    case "A":
      return A4 * Math.pow(NOTE_RATIO, 0);
    case "B":
      return A4 * Math.pow(NOTE_RATIO, 2);
    case "C":
      return A4 * Math.pow(NOTE_RATIO, -9);
    case "D":
      return A4 * Math.pow(NOTE_RATIO, -7);
    case "E":
      return A4 * Math.pow(NOTE_RATIO, -5);
    case "F":
      return A4 * Math.pow(NOTE_RATIO, -4);
    case "G":
      return A4 * Math.pow(NOTE_RATIO, -2);
  }
}
