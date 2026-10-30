import { html } from './environment';

export function initDevice() {
  const ua = navigator.userAgent;
  // iPadOS reports itself as MacIntel: touch points tell it apart from a Mac
  const isIpadOS =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

  window.isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
    isIpadOS;
  window.isTablet = window.isMobile && window.innerWidth > 1000;
  window.isAndroid = /android/i.test(ua);
  window.isWindows = navigator.platform.includes('Win');
  window.isIos = /iPad|iPhone|iPod/.test(navigator.platform) || isIpadOS;
  // Every iOS browser runs WebKit; on desktop exclude Chromium/Firefox/Edge UAs that also contain "Safari"
  window.isSafari =
    window.isIos ||
    (/Safari/i.test(ua) &&
      !/Chrome|Chromium|CriOS|FxiOS|Edg|Android/i.test(ua));

  html.classList.add(window.isMobile ? 'is-mobile' : 'is-desktop');
  html.classList.toggle('is-android', window.isAndroid);
  html.classList.toggle('is-windows', window.isWindows);
  html.classList.toggle('is-ios', window.isIos);
  html.classList.toggle('is-safari', window.isSafari);
}

export function getScrollBarWidth() {
  let el = document.createElement('div');
  el.style.cssText = 'overflow:scroll; visibility:hidden; position:absolute;';
  document.body.appendChild(el);
  let width = el.offsetWidth - el.clientWidth;
  el.remove();
  return width;
}
