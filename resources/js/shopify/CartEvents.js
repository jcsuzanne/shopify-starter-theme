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

export function AddToCart(data, triggerEvent = true, errorDOM = null) {
  axios
    .post(window.Shopify.routes.root + 'cart/add.js', data)
    .then((response) => {
      Channels.emit('cart::render', { status: 'added_to_cart' });
      HandleAddToCartSuccess(errorDOM);
      if (triggerEvent) {
        gsap.delayedCall(0.5, () => Channels.emit('cart::open'));
      }
    })
    .catch((error) => {
      const errorData = error.response.data;
      if (errorData.status) {
        HandleAddToCartError(errorData, errorDOM);
      }
    });
}

export function HandleAddToCartSuccess(errorDOM = null) {
  errorDOM.classList.add('tw-hidden');
  errorDOM.style.display = '';
}

export function HandleAddToCartError(errorData, errorDOM = null) {
  errorDOM.querySelector('[data-dom="message"]').textContent =
    errorData.message;
  errorDOM.classList.remove('tw-hidden');
  errorDOM.style.display = 'block';
}

export function UpdateCart(data) {
  axios.post(window.Shopify.routes.root + 'cart/change.js', data);
}
