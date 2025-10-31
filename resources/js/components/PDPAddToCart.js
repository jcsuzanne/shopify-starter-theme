import { Piece } from 'piecesjs';
import { AddToCart } from '../shopify/CartEvents';
import Channels from '../base/channels';
import gsap from 'gsap';
export class PDPAddToCart extends Piece {
  constructor() {
    super('PDPAddToCart', {});
  }

  mount() {
    this.DOM = { view: this, ...this.captureTree() };
    this.DOM.form = this.DOM.view.querySelector('form[action$="/cart/add"]');
    this.DOM.error = this.DOM.view.querySelector('pdp-error');
    this.fnAddToCart = this.sendDatasToCard.bind(this);
    this.on('launcher::exit', document, this.afterMount);
  }

  afterMount() {
    Channels.addListener('product::addtocart', this.fnAddToCart);
  }

  sendDatasToCard() {
    const data = new FormData(this.DOM.form);
    AddToCart(data, true, this.DOM.error);
  }

  unmount() {
    this.off('launcher::exit', document, this.afterMount);
    Channels.removeListener('product::addtocart', this.fnAddToCart);
  }
}

// Register the custom element
customElements.define('pdp-addtocart', PDPAddToCart);
