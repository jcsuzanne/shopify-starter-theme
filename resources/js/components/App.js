import { Piece } from 'piecesjs';
import { html } from '../utils/environment';
import { initDevice } from '../utils/device';
import { initSizes } from '../utils/sizes';
import { gsap } from 'gsap';
import { triggerAfterMount } from '../utils/afterMountHelper';

window.firstHit = true;
window.readyDelay = 0.3;
window.readyCallbackDelay = 1;

export class App extends Piece {
  constructor() {
    super('App');
  }

  mount() {
    // Credits
    console.log(
      '\n%cIndex Studio%c\n\nSite developed by Index Studio — https://index.studio\n👨‍💻 JCS — https://www.jcsuzanne.com\n👨‍💻 Quentin Hocdé — https://quentinhocde.com\n',
      'display:inline-block; padding:0.75rem 2.5rem; background:#000; color:#fff; font:700 14px/1 Helvetica, Arial, sans-serif; letter-spacing:0.2em; text-align:center; text-transform:uppercase;',
      'font:400 12px/1.6 Helvetica, Arial, sans-serif;',
    );

    initDevice();
    initSizes();
    this.detectEnvironment();

    html.classList.add('is-loaded');
    html.classList.remove('is-loading');

    this.on('pieces:ready', document, this.onPiecesReady);

    this.bindResize = this.resize.bind(this);
    window.addEventListener('resize', this.bindResize);
  }

  onPiecesReady() {
    this.off('pieces:ready', document, this.onPiecesReady);

    gsap.delayedCall(window.readyDelay, () => {
      html.classList.add('has-dom-ready');
      triggerAfterMount();

      gsap.delayedCall(window.readyCallbackDelay, () => {
        html.classList.add('has-dom-ready-callback');
        html.classList.add('has-dom-animated');

        window.firstHit = false;
      });
    });
  }

  detectEnvironment() {
    if (window.location.href.includes('http://127.0.0.1:9292')) {
      html.classList.add('local-env');
    }
  }

  update() {
    // initSizes();
  }

  resize() {
    if (this.resizeTimeout != undefined) {
      this.resizeTimeout.kill();
    }
    this.resizeTimeout = gsap.delayedCall(0.6, () => {
      this.resizeDebounce();
    });
  }

  resizeDebounce() {
    initSizes();
  }

  unmount() {
    this.off('pieces:ready', document, this.onPiecesReady);
    window.removeEventListener('resize', this.bindResize);
  }
}

// Register the custom element
customElements.define('c-app', App);
