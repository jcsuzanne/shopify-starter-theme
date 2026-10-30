import { html } from './environment';

const SCROLL_LOCKED_CLASS = 'is-scroll-locked';

// Works with both Scroll (Lenis instance exposed on window) and ScrollLite (native scroll)
export function stopScroll() {
  window.scrollObjectInstance?.stop();
  html.classList.add(SCROLL_LOCKED_CLASS);
}

export function resumeScroll() {
  window.scrollObjectInstance?.start();
  html.classList.remove(SCROLL_LOCKED_CLASS);
}
