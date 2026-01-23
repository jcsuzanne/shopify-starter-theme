import { Piece } from 'piecesjs';

export class LanguageSwitcher extends Piece {
  constructor() {
    super('LanguageSwitcher', {
      // stylesheets: [() => import('/assets/css/components/file.css')],
    });
  }

  mount() {
    this.DOM = { view: this, ...this.captureTree() };
    this.DOM.form = this.DOM.view.querySelector('form');
    this.events();
  }

  events() {
    for (let trigger of this.DOM.trigger) {
      trigger.addEventListener('click', () => {
        this.DOM.input[0].value = trigger.dataset.value;
        this.DOM.form.submit();
      });
    }
  }

  unmount() {
  }
}

// Register the custom element
customElements.define('language-switcher', LanguageSwitcher);
