import { html } from '../utils/environment';
import gsap from 'gsap';
import { renderAmount } from '../shopify/Helpers';
import Channels from '../base/channels';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default () => ({
  isOpen: false,
  lastFocused: null,
  items: [],
  itemsError: [],
  itemsCount: 0,
  total: 0,
  async init() {
    this.getCart();
    // Stock display only changes with the variant or the page, no need to poll every frame
    const checkStock = () => this.$nextTick(() => this.listenStock());
    checkStock();
    window.addEventListener('option-changed', checkStock);
    document.addEventListener('swup:page:view', checkStock);
    // AddToCart opens the drawer itself (cart::open): here only refresh the content
    Channels.addListener('cart::render', () => this.getCart());
    Channels.addListener('cart::open', () => this.onOpen());
    Channels.addListener('cart::close', () => this.onClose());
  },
  onOpen() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.lastFocused = document.activeElement;
    // Wait for x-effect to drop `inert` before moving the focus
    this.$nextTick(() => {
      const [first] = this.getFocusables();
      (first ?? this.$refs.drawer).focus({ preventScroll: true });
    });
  },
  onClose() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.lastFocused?.focus?.({ preventScroll: true });
    this.lastFocused = null;
  },
  getFocusables() {
    return Array.from(this.$refs.drawer.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.getClientRects().length > 0,
    );
  },
  trapFocus(e) {
    const focusables = this.getFocusables();
    if (!focusables.length) {
      e.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  },
  addOneItem(item) {
    const data = {
      id: item.key,
      quantity: item.quantity + 1,
    };
    this.updateItem(data, item);
  },
  deleteOneItem(item) {
    const data = {
      id: item.key,
      quantity: item.quantity - 1,
    };
    this.updateItem(data, item);
  },
  closeCart() {
    Channels.emit('cart::close');
  },
  listenStock() {
    const $stockCheck = document.querySelector('.js-stock-check');
    html.classList.toggle(
      'product-unavailable',
      $stockCheck != null &&
        window.getComputedStyle($stockCheck).display == 'flex',
    );
  },
  openCart() {
    Channels.emit('cart::open');
  },
  getCart(state, fnComplete = null) {
    const delay = state ? 0.5 : 0;
    gsap.delayedCall(delay, () => {
      // console.log("cart update");
      fetch(window.Shopify.routes.root + 'cart.js', {
        method: 'get',
      })
        .then((response) => response.json())
        .then((data) => {
          this.itemsCount = data.item_count;
          this.total = data.total_price;
          this.items = data.items;

          if (
            typeof fnComplete != 'undefined' &&
            typeof fnComplete == 'function'
          )
            fnComplete();
        })
        .catch((error) => {
          console.error('Error adding item to cart:', error);
        });
    });
  },
  getProductPrice(item) {
    return item.original_price;
  },
  getCount() {
    return this.itemsCount;
  },
  getTotal() {
    return renderAmount(this.total);
  },
  renderPrice(price, item) {
    if (price == 0) {
      let text = translations.free_product_price;
      if (
        typeof item != 'undefined' &&
        typeof item.total_discount != 'undefined' &&
        item.total_discount != 0
      ) {
        text += '<s>' + renderAmount(item.total_discount) + '</s>';
      }
      return text;
    } else {
      let text = '';
      text = renderAmount(price);
      if (item.discounts.length && item.discounts[0].amount != 0) {
        text += '<s>' + renderAmount(item.original_price) + '</s>';
      }

      return text;
    }
  },
  removeItem(item) {
    const data = {
      id: item.key,
      quantity: 0,
    };
    this.updateItem(data, item);
  },
  resetItemError(item) {
    if (this.itemsError.find((error) => error.id == item.key)) {
      this.itemsError = this.itemsError.filter((error) => error.id != item.key);
    }
  },
  showProperties(item) {
    const propertiesClean = item.properties;
    let showProps = [];
    for (let k in propertiesClean) {
      if (k != '_free_sample' && k != '_gift') {
        // Product — SKU
        const captureText = propertiesClean[k].split(' — ');
        showProps.push(captureText[0].trim());
      }
    }
    return showProps.join(', ');
  },
  updateItem(payload, item) {
    fetch(window.Shopify.routes.root + 'cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          this.itemsError.push({
            id: payload.id,
            message: data.message,
          });
        } else {
          // change.js returns the whole cart: no need to fetch cart.js again
          this.resetItemError(item);
          this.items = data.items;
          this.itemsCount = data.item_count;
          this.total = data.total_price;
        }
      })
      .catch((error) => {
        console.error('Error upading item from cart:', error);
      });
  },
});
