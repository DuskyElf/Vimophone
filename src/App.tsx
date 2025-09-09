import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  on,
  type Component,
} from "solid-js";
import { createStore } from "solid-js/store";
import Keyboard, { Key, KeyStates } from "./components/Keyboard";
import { notes, playNote, ReleaseHandle } from "./synth";

let audioContext: AudioContext;
const App: Component = () => {
  const activeKeys: Key[] = [
    "C",
    "D",
    "E",
    "F",
    "G",
    "A",
    "B",
    "U",
    "J",
    "I",
    "K",
    ",",
    " ",
  ];
  const isActiveKey = (key: string): key is Key => {
    return activeKeys.includes(key as Key);
  };

  const [keyStates, setKeyStates] = createStore<KeyStates>(
    Object.fromEntries(activeKeys.map((k) => [k, "released"])),
  );

  const initAudioContext = (e: Event) => {
    if (!audioContext) {
      audioContext = new AudioContext();
      window.removeEventListener("mousedown", initAudioContext);
      window.removeEventListener("keydown", initAudioContext);
    }
  };
  window.addEventListener("mousedown", initAudioContext);
  window.addEventListener("keydown", initAudioContext);

  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const key = e.key.toUpperCase();
      if (isActiveKey(key)) setKeyStates(key, "pressed");
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const key = e.key.toUpperCase();
      if (isActiveKey(key)) setKeyStates(key, "released");
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    });
  });

  let handle: Partial<Record<Key, ReleaseHandle>> = {};

  const [modifiers, setModifiers] = createStore({ octave: 4, transpose: 0 });
  createEffect(() => {
    let transpose = 0;
    if (keyStates["J"] === "pressed") transpose -= 1;
    if (keyStates["U"] === "pressed") transpose += 1;
    setModifiers("transpose", transpose);
  });

  createEffect(() => {
    let octave = 4;
    if (keyStates["K"] === "pressed") octave -= 1;
    if (keyStates["I"] === "pressed") octave += 1;
    if (keyStates[","] === "pressed") octave -= 2;
    setModifiers("octave", octave);
  });

  notes.forEach((key) => {
    createEffect(
      on(
        () => keyStates[key],
        () => {
          if (keyStates[key] === "pressed") {
            handle[key] = playNote(audioContext, key, modifiers);
          } else {
            handle[key]?.release();
          }
        },
      ),
    );
  });

  return (
    <div class="flex h-screen items-center justify-center">
      <Keyboard keyStates={keyStates} setKeyStates={setKeyStates}></Keyboard>
    </div>
  );
};

export default App;
