import { Piece } from 'piecesjs';
import Channels from '../base/channels';

export class CartOpenTrigger extends Piece {
  constructor() {
    super('CartOpenTrigger', {
      // stylesheets: [() => import('/assets/css/components/file.css')],
    });
  }

  mount() {
    this.DOM = { view: this, ...this.captureTree() };
    setTimeout(() => {
      Channels.emit('cart::open');
    }, 100);
    this.on('launcher::exit', document, this.afterMount);
  }

  afterMount() {}

  unmount() {
    this.off('launcher::exit', document, this.afterMount);
  }
}

// Register the custom element
customElements.define('cart-opentrigger', CartOpenTrigger);
