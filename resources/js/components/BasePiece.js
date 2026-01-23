import { Piece } from 'piecesjs';

export class BasePiece extends Piece {
  constructor() {
    super('BasePiece', {
      // stylesheets: [() => import('/assets/css/components/view.css')],
    });
  }

  mount() {
    this.DOM = { view: this, ...this.captureTree() };

    // afterMount is now automatically called with /utils/afterMountHelper.js
  }

  afterMount() {}

  unmount() {
  }
}

// Register the custom element
customElements.define('c-base-piece', BasePiece);
