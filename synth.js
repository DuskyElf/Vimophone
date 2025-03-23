customElements.define("synth-init", class extends HTMLElement {
  constructor() {
    super();

    this.innerHTML += /*html*/`
      <div overlay>
        Click here to Start
      </div>
      <style>
        synth-init {
          display: contents;
        }

        synth-init>[overlay] {
          color: #181818;
          font-size: 3rem;
          text-align: center;
          align-content: center;
          text-shadow:
            0px 0px 10px white,
            0px 0.5ch 10px white,
            0px -0.5ch 10px white;

          text-decoration: underline;
          text-decoration-thickness: 0.3rem;

          top: 50%;
          width: 100%;
          position: fixed;
          padding: 7rem;
          transform: translateY(-50%);
          box-shadow: 0 0 50px 10px #f0f0f0;

          z-index: 1000;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.0);

          transition: 0.5s padding;
          animation: blink 2s linear infinite;
        }

        synth-init>[overlay]:hover {
          animation: 0;
          padding-top: 50%;
          padding-bottom: 50%;
        }

        @keyframes blink {
          0% { color: #181818; }
          50% { color: transparent; }
          100% { color: #181818; }
        }
      </style>
    `;

    this.overlay = /**@type {HTMLDivElement}*/(this.querySelector("[overlay]"));
    this.overlay.addEventListener("click", this);
  }

  /**
  * @param {KeyboardEvent} ev
  */
  handleEvent(ev) {
    switch (ev.type) {
      case "click":
        this.overlay.style.display = "none";
    }
  }
})

customElements.define("synth-key", class extends HTMLElement {
  constructor() {
    super();
  }
})
