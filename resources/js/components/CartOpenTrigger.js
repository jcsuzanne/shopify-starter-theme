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
  }
}

// Register the custom element
customElements.define('cart-opentrigger', CartOpenTrigger);
