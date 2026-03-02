import { Piece } from 'piecesjs';
import { AddToCart } from '../shopify/CartEvents';
export class GlobalAddToCart extends Piece {
  constructor() {
    super('GlobalAddToCart', {});
  }

  mount() {
    this.DOM = { view: this, ...this.captureTree() };
    this.DOM.form = this.DOM.view.querySelector('form[action$="/cart/add"]');
    this.DOM.error =
      this.DOM.view.parentElement?.parentElement?.querySelector(
        'product-error',
      ) || this.DOM.view.querySelector('product-error');
    this.on('click', this.domAttr('buttonAddToCart'), this.sendDatasToCard);
  }

  logData(data) {
    // Parse the FormData object
    const formDataEntries = {};

    // Iterate through all form data entries
    for (const [key, value] of data.entries()) {
      formDataEntries[key] = value;
      console.log(`Form data: ${key} = ${value}`);
    }

    // Log the complete parsed data object
    console.log('Complete form data:', formDataEntries);
  }

  sendDatasToCard() {
    const data = new FormData(this.DOM.form);
    // this.logData(data);

    // Continue with the form submission
    AddToCart(data, true, this.DOM.error);
  }

  unmount() {}
}

// Register the custom element
customElements.define('global-addtocart', GlobalAddToCart);
