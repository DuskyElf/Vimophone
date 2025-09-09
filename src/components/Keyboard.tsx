import { For, onMount, onCleanup } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

export type Key = (typeof layout)[number][number] | " ";
export type KeyStates = Partial<Record<Key, "pressed" | "released">>;

interface KeyboardProps {
  keyStates?: KeyStates;
  setKeyStates?: SetStoreFunction<KeyStates>;
}

const layout = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"],
  ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"],
] as const;

export default function Keyboard(props: KeyboardProps) {
  let container: HTMLDivElement | undefined;
  let keys: Set<HTMLButtonElement> = new Set();
  let spaceKey: HTMLButtonElement | undefined;

  let beingClicked: Set<HTMLButtonElement> = new Set();

  onMount(() => {
    const mouseDownHandler = (e: MouseEvent) => {
      // only respond to left mouse button
      if (e.button !== 0) return;

      const target = (e.target as HTMLElement).closest(
        "button",
      ) as HTMLButtonElement | null;
      if (!target) return;

      let key;
      if (target === spaceKey) key = " " as Key;
      else if (keys.has(target)) key = target.innerText.toUpperCase() as Key;
      else return;

      if (!props.keyStates?.[key]) return;

      e.preventDefault();
      beingClicked.add(target);
      props.setKeyStates?.(key, "pressed");
    };
    const mouseUpHandler = (e: MouseEvent) => {
      beingClicked.forEach((button) => {
        let key;
        if (button === spaceKey) key = " " as Key;
        else key = button.innerText.toUpperCase() as Key;

        props.setKeyStates?.(key, "released");
      });
      beingClicked.clear();
    };

    container?.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);

    onCleanup(() => {
      container?.removeEventListener("mousedown", mouseDownHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    });
  });

  return (
    <div ref={container} class="font-mono">
      <For each={layout}>
        {(row) => (
          <div class="mb-1 flex justify-center">
            <For each={row}>
              {(key) => (
                <button
                  ref={(el) => {
                    keys.add(el);
                  }}
                  class={
                    "m-0.5 cursor-pointer rounded-xl bg-neutral-800 px-3 py-2 text-center transition select-none active:bg-violet-100 active:text-neutral-800"
                  }
                  classList={{
                    "opacity-20": !props.keyStates?.[key.toUpperCase() as Key],
                    "bg-violet-100":
                      props.keyStates?.[key.toUpperCase() as Key] === "pressed",
                    "text-neutral-800":
                      props.keyStates?.[key.toUpperCase() as Key] === "pressed",
                    "hover:bg-neutral-700":
                      props.keyStates?.[key.toUpperCase() as Key] ===
                      "released",
                  }}
                >
                  {key}
                </button>
              )}
            </For>
          </div>
        )}
      </For>
      <div class="flex justify-center">
        <button
          ref={spaceKey}
          class={
            "m-0.5 cursor-pointer rounded-xl bg-neutral-800 px-25 py-2 text-center transition select-none active:bg-violet-100 active:text-neutral-800"
          }
          classList={{
            "opacity-20": !props.keyStates?.[" "],
            "bg-violet-100": props.keyStates?.[" "] === "pressed",
            "text-neutral-800": props.keyStates?.[" "] === "pressed",
            "hover:bg-neutral-700": props.keyStates?.[" "] === "released",
          }}
        >
          &nbsp;
        </button>
      </div>
    </div>
  );
}
