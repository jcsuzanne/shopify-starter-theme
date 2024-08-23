import { html } from './environment';

export function initDevice() {

  window.isMobile = (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  window.isAndroid = /(android)/i.test(navigator.userAgent);
  
  if (window.isMobile) {
      html.classList.add('is-mobile');
  } else {
      html.classList.add('is-desktop');
  }
  if(window.isMobile) {
      if(window.innerWidth > 1000) {
          window.isTablet = true;
      }
  }
  
  if(window.isAndroid) {
    html.classList.add('is-android');
  }
  
  window.isWindows = navigator.platform.indexOf('Win') > -1;
  
  if(window.isWindows) {
      html.classList.add('is-windows');
  }
  
  window.isIos = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if(window.isIos) {
      html.classList.add('is-ios');
  }
  
}

export function getScrollBarWidth() {
	let el = document.createElement("div");
	el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
	document.body.appendChild(el);
	let width = el.offsetWidth - el.clientWidth;
	el.remove();
	return width;
}