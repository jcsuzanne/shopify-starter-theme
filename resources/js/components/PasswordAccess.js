import { Piece } from 'piecesjs';

export class PasswordAccess extends Piece {
  constructor() {
    super('PasswordAccess', {
      // stylesheets: [() => import('/assets/css/components/file.css')],
    });
  }

  mount() {
    this.DOM = { view: this, ...this.captureTree() };

    console.log('PasswordAccess');
    if (window.location.search.includes('devmode')) {
      this.DOM.view.style.display = 'block';
    }
  }

  unmount() {
  }
}

// Register the custom element
customElements.define('password-access', PasswordAccess);
