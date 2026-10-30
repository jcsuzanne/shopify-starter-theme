import { html, body } from './environment';
import { getScrollBarWidth } from '../utils/device';

export function initSizes() {
  const scrollbarWidth = getScrollBarWidth();
  body.classList.toggle('has-scrollbar-y', scrollbarWidth > 0);
  html.style.setProperty('--scrollbar', `${scrollbarWidth}px`);

  let absRatio = 1;
  if (window.innerWidth < window.innerHeight) {
    absRatio = window.innerHeight / window.innerWidth;
  } else {
    absRatio = window.innerWidth / window.innerHeight;
  }

  html.style.setProperty('--absRatio', `${absRatio}`);
}
