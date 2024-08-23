import { html, body } from './environment';
import { getScrollBarWidth } from "../utils/device";

export function initSizes() {

  if (getScrollBarWidth() > 0) {
    body.classList.add("has-scrollbar-y");
    document.documentElement.style.setProperty(
      "--scrollbar",
      `${getScrollBarWidth()}px`
    );
  } else {
    body.classList.remove("has-scrollbar-y");

    document.documentElement.style.setProperty(
      "--scrollbar",
      `0px`
    );
  }

  let absRatio = 1;
  if(window.innerWidth < window.innerHeight) {
    absRatio =  window.innerHeight / window.innerWidth;
  } else {
    absRatio =  window.innerWidth / window.innerHeight;
  }

  document.documentElement.style.setProperty(
    "--absRatio",
    `${absRatio}`
  );

  // screen height
  document.documentElement.style.setProperty(
    "--app-availheight",
    `${window.screen.availHeight}px`
  );
  document.documentElement.style.setProperty(
    "--app-height",
    `${window.innerHeight}px`
  );
  document.documentElement.style.setProperty(
    "--app-height-negative",
    `-${window.innerHeight}px`
  );
  
}