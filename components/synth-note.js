import * as synth from "../synth.js";
import { SynthInit } from "./synth-init.js";

export class SynthNote extends HTMLElement {
  constructor() {
    super();

    const noteName = this.getAttribute("note");
    if (!synth.isNote(noteName)) throw `Invalid note ${noteName}`;

    this.noteName = noteName;
  }

  onSynthInit(/**@type SynthInit*/synthInit) {
    if (!synthInit.audioCtx || !synthInit.startTime) throw "unrechable";

    this.synthInit = synthInit;
    this.note = new synth.Note(synthInit.audioCtx, this.noteName, synthInit.startTime);
  }

  static observedAttributes = ["pressed"];

  attributeChangedCallback(/**@type string*/name, /**@type string*/setFrom, /**@type string*/setTo) {
    if (!this.synthInit) return;
    if (!this.synthInit.modifiers) throw "unrechable";

    if (name == "pressed") {
      if (setTo)
        this.note?.hit(this.synthInit.modifiers);
      else if (setFrom)
        this.note?.unhit();
    }
  }
}

customElements.define("synth-note", SynthNote);
