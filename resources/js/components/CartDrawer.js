import Env from '../base/env';
import gsap from 'gsap';
import { renderAmount, formatDollarsToCents } from '../shopify/Helpers';
import Channels from '../base/channels';

export default () => ({
  items: [],
  itemsError: [],
  itemsCount: 0,
  RAF: false,
  total: 0,
  async init() {
    this.getCart();
    this.watch();
    Channels.addListener('cart::render', () => {
      this.getCart(false, () => {
        if (this.patternBuy == 'direct') {
          this.openCart();
        }
      });
    });
  },
  addOneItem(item) {
    const data = {
      id: item.key,
      quantity: item.quantity + 1,
    };
    this.updateItem(data, item);
    this.getCart(true);
  },
  deleteOneItem(item) {
    const data = {
      id: item.key,
      quantity: item.quantity - 1,
    };
    this.updateItem(data, item);
    this.getCart(true);
  },
  watch() {
    this.RAF = requestAnimationFrame(() => {
      this.listenStock();
      this.watch();
    });
  },
  closeCart() {
    Channels.emit('cart::close');
  },
  listenStock() {
    if (document.querySelector('.js-stock-check') != null) {
      const style = window.getComputedStyle(
        document.querySelector('.js-stock-check'),
        null,
      );
      let display = style.getPropertyValue('display');
      if (display == 'flex') {
        Env.$html.classList.add('product-unavailable');
      } else {
        Env.$html.classList.remove('product-unavailable');
      }
    }
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
          console.log(data);
          // Clear if sample on cart and total == 0

          this.itemsCount = data.item_count;
          this.samplesCount = 0;
          this.total = data.total_price;
          this.items = data.items;

          if (
            typeof fnComplete != 'undefined' &&
            typeof fnComplete == 'function'
          )
            fnComplete();

          if (data.item_count > 0 && data.total_price == 0) {
            this.resetCart();
          }
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
        text += '<strike>' + renderAmount(item.total_discount) + '</strike>';
      }
      return text;
    } else {
      let text = '';
      text = renderAmount(price);
      if (item.discounts.length && item.discounts[0].amount != 0) {
        text += '<strike>' + renderAmount(item.original_price) + '</strike>';
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
    this.getCart(true);
  },
  resetCart() {
    fetch(window.Shopify.routes.root + 'cart/clear.js', {
      method: 'post',
    })
      .then((response) => response.json())
      .then((data) => {
        this.itemsError = [];
        this.getCart();
      });
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
          this.resetItemError(item);
          this.items = data.items;
        }
      })
      .catch((error) => {
        console.error('Error upading item from cart:', error);
      });
  },
});
