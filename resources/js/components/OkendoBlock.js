import { Piece } from 'piecesjs';
import gsap from 'gsap';

export class OkendoBlock extends Piece {
  constructor() {
    super('OkendoBlock', {
      // stylesheets: [() => import('/assets/css/components/file.css')],
    });
  }

  mount() {
    this.DOM = { view: this, ...this.captureTree() };
    console.log('init okendo');
    this.setup();
  }

  setup() {
    if (window.hasTransitioned) {
      window.okeWidgetApi.initAllWidgets();
    }
    gsap.delayedCall(1, () => {
      if (this.DOM.view.querySelector('.oke-w-reviews-count') != null) {
        const counterEL = this.DOM.view.querySelector('.oke-w-reviews-count');
        this.DOM.headerTitle[0].innerHTML = counterEL.innerHTML;
        counterEL.innerHTML = '';
      }
    });
  }

  unmount() {
  }

}

// Register the custom element
customElements.define('okendo-block', OkendoBlock);
