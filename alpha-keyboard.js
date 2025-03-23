import tmpl from "./tmpl.js";

customElements.define("alpha-keyboard", class AlphaKeyboard extends HTMLElement {
  constructor() {
    super();

    this.appendChild(tmpl(this, AlphaKeyboard.template));
    document.addEventListener("keydown", this);
    document.addEventListener("keyup", this);
  }

  /**
  * @param {KeyboardEvent} ev
  */
  handleEvent(ev) {
    if (ev.type == "keydown" || ev.type == "keyup")
      this[`for${ev.type}`](ev);
  }

  /**
  * @param {KeyboardEvent} ev
  */
  forkeydown(ev) {
    if (ev.repeat) return;

    this.querySelector(`[key="${ev.key}"]`)?.setAttribute("pressed", "");

  }

  /**
  * @param {KeyboardEvent} ev
  */
  forkeyup(ev) {
    if (ev.repeat) return;

    this.querySelector(`[key="${ev.key}"]`)?.removeAttribute("pressed");
  }

  static template = /*html*/`
    <style>
      alpha-keyboard {
        gap: 2px;
        width: 85%;
        max-width: 600px;
        display: flex;
        flex-direction: column;
      }

      alpha-keyboard>[row] {
        gap: 2px;
        width: 100%;
        display: flex;
        flex-direction: row;
      }

      alpha-keyboard [key] {
        flex-grow: 1;
        max-width: 9%;
        border-radius: 5px;
        border: 2px solid black;
        aspect-ratio: 1 / 1;
      }

      alpha-keyboard>[row]:nth-of-type(2) {
        position: relative;
        left: 2.5%;
      }

      alpha-keyboard>[row]:nth-of-type(3) {
        position: relative;
        left: 7.5%;
      }

      alpha-keyboard>[row]:nth-of-type(4) {
        position: relative;
        left: 15%;
      }

      alpha-keyboard [key=" "] {
        max-width: 60%;
        aspect-ratio: 6 / 1;
      }

      alpha-keyboard [key][pressed] {
        background-color: #f0f0f0;
      }

      alpha-keyboard [key][disable] {
        opacity: 0.2;
      }
    </style>

    <div row>
      <slot name="q"><div disable key="q"></div></slot>
      <slot name="w"><div disable key="w"></div></slot>
      <slot name="e"><div disable key="e"></div></slot>
      <slot name="r"><div disable key="r"></div></slot>
      <slot name="t"><div disable key="t"></div></slot>
      <slot name="y"><div disable key="y"></div></slot>
      <slot name="u"><div disable key="u"></div></slot>
      <slot name="i"><div disable key="i"></div></slot>
      <slot name="o"><div disable key="o"></div></slot>
      <slot name="p"><div disable key="p"></div></slot>
      <slot name="["><div disable key="["></div></slot>
    </div>
    <div row>
      <slot name="a"><div disable key="a"></div></slot>
      <slot name="s"><div disable key="s"></div></slot>
      <slot name="d"><div disable key="d"></div></slot>
      <slot name="f"><div disable key="f"></div></slot>
      <slot name="g"><div disable key="g"></div></slot>
      <slot name="h"><div disable key="h"></div></slot>
      <slot name="j"><div disable key="j"></div></slot>
      <slot name="k"><div disable key="k"></div></slot>
      <slot name="l"><div disable key="l"></div></slot>
      <slot name=";"><div disable key=";"></div></slot>
    </div>
    <div row>
      <slot name="z"><div disable key="z"></div></slot>
      <slot name="x"><div disable key="x"></div></slot>
      <slot name="c"><div disable key="c"></div></slot>
      <slot name="v"><div disable key="v"></div></slot>
      <slot name="b"><div disable key="b"></div></slot>
      <slot name="n"><div disable key="n"></div></slot>
      <slot name="m"><div disable key="m"></div></slot>
      <slot name=","><div disable key=","></div></slot>
    </div>
    <div row>
      <slot name=" "><div key=" "></div></slot>
    </div>
  `
})
