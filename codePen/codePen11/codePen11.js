import { VFX } from "https://esm.sh/@vfx-js/core";
const btn = document.querySelector(".change");
let vfxType = "sinewave";
let vfxTypes = ["sinewave", "glitch", "rgbShift"];
let count = 0;

btn.addEventListener("click", function(){
    count++;
    vfxType = vfxTypes[count % vfxTypes.length];
})
class ButtonEffect {
  constructor(button) {
    this.vfx = new VFX();
    button.addEventListener("mouseenter", (e) => {
      this.vfx.add(button, { shader: vfxType, overflow: 100 });
    });

    button.addEventListener("mouseleave", (e) => {
      this.vfx.remove(button);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ButtonEffect(document.querySelector(".hover"));
});
