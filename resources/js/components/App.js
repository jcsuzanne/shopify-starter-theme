import { Piece } from 'piecesjs'
import { html } from '../utils/environment';
import { initDevice } from '../utils/device';
import { initSizes } from '../utils/sizes';
import { gsap } from 'gsap';

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
      "\n%cMade with ❤️ by Index: https://index.studio — 💻 Dev by JCS https://www.jcsuzanne.com and Quentin Hocdé https://quentinhocde.com",
      "color:#fff;font-size:12px; padding:0.45rem 0.75rem; margin: 0.3rem auto 1.3rem auto; font-family: Metropolis, Helvetica, sans-serif; border: 2px solid #0dd8d8; border-radius: 4px;font-weight: 100;background-size: cover;background-repeat: no-repeat;border: double 1px transparent;background-image: linear-gradient(#000, #122), radial-gradient(circle at top left, #54E5E3, #ED1E63);background-origin: border-box;background-clip: padding-box, border-box;"
    );

    initDevice();
    initSizes();

    html.classList.add('is-loaded');
    html.classList.remove('is-loading');

    gsap.delayedCall(window.readyDelay, () => {
        html.classList.add("has-dom-ready");

        gsap.delayedCall(window.readyCallbackDelay, () => {
            html.classList.add("has-dom-ready-callback");
            html.classList.add("has-dom-animated");

            window.firstHit = false;
        });
    });

		this.bindResize = this.resize.bind(this);
		window.addEventListener('resize',this.bindResize);
    
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
    initSizes()
  }

  unmount() {
		window.removeEventListener('resize',this.bindResize);
  }
}

// Register the custom element
customElements.define('c-app', App);