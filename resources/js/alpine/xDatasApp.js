import { html } from '../utils/environment';
import Channels from '../base/channels';
import { AddToCart } from '../shopify/CartEvents';

export default () => ({
  async init() {},
  addToCart() {
    Channels.emit('product::addtocart');
  },
  addFromCart(form) {
    const data = new FormData(form);
    AddToCart(data, false);
    // Channels.emit('cart::adding-from-cart', data);
  },
  hideStockAlert() {
    html.classList.remove('stock-alert-opened');
  },
  showStockAlert() {
    html.classList.add('stock-alert-opened');
  },
});
