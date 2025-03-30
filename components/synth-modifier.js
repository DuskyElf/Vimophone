import { SynthInit } from "./synth-init.js";

export class SynthModifier extends HTMLElement {
  constructor() {
    super();

    this.modifier = this.getAttribute("mod");
  }

  onSynthInit(/**@type SynthInit*/synthInit) {
    this.synthInit = synthInit;
  }

  static observedAttributes = ["pressed"];

  updateModifiers(/**@type boolean*/isPressed) {
    if (!this.synthInit) return;
    if (!this.synthInit.modifiers) throw "unrechable";

    const mod = this.getAttribute("mod");
    let modifiers = this.synthInit.modifiers;

    if (isPressed)
      switch (mod) {
        case "oct-2":
          modifiers.octave = -2;
          break;
        case "oct-1":
          modifiers.octave = -1;
          break;
        case "oct+1":
          modifiers.octave = 1;
          break;
        case "flat":
          modifiers.transpose = -1;
          break;
        case "sharp":
          modifiers.transpose = 1;
          break;
        default:
          console.error(`Unknown mod attribute: ${mod}`);
      }
    else
      switch (mod) {
        case "oct-2":
          modifiers.octave = 0;
          break;
        case "oct-1":
          modifiers.octave = 0;
          break;
        case "oct+1":
          modifiers.octave = 0;
          break;
        case "flat":
          modifiers.transpose = 0;
          break;
        case "sharp":
          modifiers.transpose = 0;
          break;
        default:
          console.error(`Unknown mod attribute: ${mod}`);
      }

  }

  attributeChangedCallback(/**@type string*/name, /**@type string*/setFrom, /**@type string*/setTo) {
    if (!this.synthInit) return;

    if (name == "pressed") {
      if (setTo)
        this.updateModifiers(true);
      else
        this.updateModifiers(false);
    }
  }
}

customElements.define("synth-modifier", SynthModifier);
