export default function tmpl(/**@type HTMLElement*/wc, /**@type String*/template) {
  const templateElem = document.createElement("template");
  templateElem.innerHTML = template;

  wc.querySelectorAll("[slot]")
    .forEach(seeker => {
      const slotName = seeker.getAttribute("slot");
      templateElem.content.querySelectorAll(`slot[name="${slotName}"]`)
        .forEach(slot => {
          slot.replaceWith(seeker);
        })
    });

  return templateElem.content;
}
