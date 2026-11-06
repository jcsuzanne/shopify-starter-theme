import gsap from 'gsap';
import { piecesManager } from 'piecesjs';
import { html } from '../utils/environment';
import { stopScroll, resumeScroll } from '../utils/helpers';

export default () => ({
  variantId: null,
  variantQuantity: null,
  currentImageId: null,
  currentImage: null,
  price: null,
  priceToDisplay: null,
  comparedPriceToDisplay: null,
  variantTitle: null,
  variantDescription: null,
  inventoryPolicy: null,
  inventoryDisplay: null,
  inventoryManagement: null,
  available: false,
  recipientName: null,
  recipientEmail: null,
  recipientMessage: null,
  recipientControlFlag: false,
  keyVariant: null,
  variant: null,
  option1: null,
  option2: null,
  option3: null,
  option1ID: null,
  option2ID: null,
  option3ID: null,
  panelActive: null,
  engravingActive: null,
  engravingSentence: null,
  engravingVariantId: null,
  engravingPriceDisplay: null,
  optionColorName: null,
  productVariants: [],
  // Purchasable but out of stock: sold on backorder (inventory policy "continue").
  get isPreorder() {
    return (
      this.available &&
      this.inventoryPolicy === 'continue' &&
      this.inventoryManagement !== '' &&
      this.inventoryDisplay !== '' &&
      Number(this.inventoryDisplay) <= 0
    );
  },
  init() {
    const parse = JSON.parse(this.$el.dataset.model);
    Object.assign(this, parse);
    // Variants payload rendered by snippets/pdp-json.liquid. Read from the DOM, not from a global
    // set by an inline script: Swup does not run inline scripts of the new container.
    const variantsNode = this.$el.parentElement.querySelector(
      '[data-dom="product-variants"]',
    );
    this.productVariants = variantsNode
      ? JSON.parse(variantsNode.textContent)
      : [];
    // console.log(this.option1, this.option2, this.option3);
    // console.log(this.option1ID, this.option2ID, this.option3ID);
  },
  addEngraving(id, price) {
    this.engravingSentence = (this.engravingSentence ?? '').trim();
    if (this.engravingSentence.length > 0) {
      this.engravingActive = true;
      this.engravingVariantId = id;
      this.engravingPriceDisplay = price;
    } else {
      this.engravingActive = false;
    }
    // console.log(this.engravingPriceDisplay);
  },
  cancelEngraving() {
    this.engravingActive = false;
    this.engravingSentence = '';
    this.engravingVariantId = null;
    this.engravingPriceDisplay = null;
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
      this.resetScroll();
    }
  },
  matchVariant() {
    const variant = this.productVariants.find(
      (variant) => variant.key_variant === this.keyVariant,
    );
    if (variant) {
      this.variant = variant;
      this.variantId = variant.id;
      this.price = variant.price;
      this.priceToDisplay = variant.price;
      this.comparedPriceToDisplay = variant.compare_at_price;
      this.variantTitle = variant.title;
      this.variantDescription = variant.description;
      this.inventoryPolicy = variant.inventory_policy;
      this.inventoryDisplay = variant.inventory_quantity;
      this.inventoryManagement = variant.inventory_management;
      this.available = variant.available;
      this.currentImage = variant.image;
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
      this.updateUrl();
      // Update Gallery
      piecesManager.currentPieces.PdpGallery?.pdpGalleryMain?.piece.updateGallery(
        variant.gallery,
      );
    }
  },
  togglePanel(status, index = 0) {
    const panels = piecesManager.currentPieces.AccordionBlock?.panelsPDP?.piece;
    if (status == 'opened') {
      html.classList.add('pdp-panels-active');
      if (panels) {
        gsap.delayedCall(0.3, () => panels.openSlide(index));
      }
      stopScroll();
    } else {
      html.classList.remove('pdp-panels-active');
      resumeScroll();
      if (panels) {
        gsap.delayedCall(0.3, () => panels.closeAll());
      }
    }
  },
  toggleEngraving(status) {
    if (status == 'opened') {
      html.classList.add('panel-engraving-active');
      stopScroll();
    } else {
      html.classList.remove('panel-engraving-active');
      resumeScroll();
    }
  },
  toggleFAQ(status, event) {
    if (status == 'opened') {
      html.classList.add('panel-faq-active');
      stopScroll();
      piecesManager.currentPieces.AccordionBlock?.panelFaq?.piece.openSlide(
        event?.index,
      );
    } else {
      html.classList.remove('panel-faq-active');
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
  updateVolumeDisplay(volume) {
    this.volumeDisplay = volume;
  },
});
