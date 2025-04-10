import { html } from '../utils/environment';
import Channels from '../base/channels';
import axios from 'axios';
import gsap from 'gsap';

export function EmitCartOpen() {
  Channels.addListener('cart::open', () => {
    html.classList.add('cart-opened');
  });
}

export function EmitCartClose() {
  Channels.addListener('cart::close', () => {
    html.classList.remove('cart-opened');
  });
}

export function AddToCart(data, triggerEvent = true) {
  axios
    .post(window.Shopify.routes.root + 'cart/add.js', data)
    .then((response) => {
      Channels.emit('cart::render', { status: 'added_to_cart' });
      if (triggerEvent) {
        gsap.delayedCall(0.5, () => Channels.emit('cart::open'));
      }
    });
}

export function UpdateCart(data) {
  axios.post(window.Shopify.routes.root + 'cart/change.js', data);
}
