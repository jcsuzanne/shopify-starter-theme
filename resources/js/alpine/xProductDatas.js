import { html } from '../utils/environment';
import { stopScroll, resumeScroll } from '../utils/helpers';

export default () => ({
  variantId: null,
  sellingPlanId: null,
  price: null,
  priceToDisplay: null,
  comparedPriceToDisplay: null,
  variantTitle: null,
  variantDescription: null,
  inventoryPolicy: null,
  inventoryDisplay: null,
  inventoryManagement: null,
  keyVariant: null,
  variant: null,
  option1: null,
  option2: null,
  option3: null,
  option1ID: null,
  option2ID: null,
  option3ID: null,
  variants: [],
  panelActive: null,
  init() {
    const parse = JSON.parse(this.$el.dataset.model);
    Object.assign(this, parse);
    const variantsNode = document.querySelector(
      '[data-dom="product-variants"]',
    );
    // Fallback on the global set by snippets/pdp-json.liquid
    this.variants = variantsNode
      ? JSON.parse(variantsNode.textContent)
      : (window.productVariants ?? []);
  },
  generateKeyVariant(callback = false) {
    const keyVariant = [];
    if (this.option1ID) {
      keyVariant.push(this.option1ID);
    }
    if (this.option2ID) {
      keyVariant.push(this.option2ID);
    }
    if (this.option3ID) {
      keyVariant.push(this.option3ID);
    }
    this.keyVariant = keyVariant.join('_');
    if (callback == true) {
      this.matchVariant();
      if (window.innerWidth > 1024) {
        this.resetScroll();
      }
    }
  },
  matchVariant() {
    const variant = this.variants.find(
      (variant) => variant.key_variant === this.keyVariant,
    );
    if (variant) {
      this.variant = variant;
      this.variantId = variant.id;
      this.sellingPlanId = variant.selling_plan_id;
      this.price = variant.price;
      this.priceToDisplay = variant.price;
      this.comparedPriceToDisplay = variant.compare_at_price;
      this.variantTitle = variant.title;
      this.variantDescription = variant.description;
      this.inventoryPolicy = variant.inventory_policy;
      this.inventoryDisplay = variant.inventory_quantity;
      this.inventoryManagement = variant.inventory_management;
      if (variant.options[0]) {
        this.option1 = variant.options[0].name;
        this.option1ID = variant.options[0].id;
      }
      if (variant.options[1]) {
        this.option2 = variant.options[1].name;
        this.option2ID = variant.options[1].id;
      }
      if (variant.options[2]) {
        this.option3 = variant.options[2].name;
        this.option3ID = variant.options[2].id;
      }
      // Update URL
      // this.updateUrl();
    }
  },
  togglePanel(status) {
    if (status == 'opened') {
      html.classList.add('pdp-panels-active');
      stopScroll();
    } else {
      html.classList.remove('pdp-panels-active');
      resumeScroll();
    }
  },
  resetScroll() {
    window.scrollTo(0, 0);
  },
  updateColorChip(colorChip) {
    this.colorChip = colorChip;
  },
  updateUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set('variant', this.variantId);
    window.history.pushState({}, '', url);
  },
});
