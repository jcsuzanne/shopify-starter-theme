import { Piece } from 'piecesjs';
import { EmitCartOpen, EmitCartClose } from '../shopify/CartEvents';
import Channels from '../base/channels';

export class UIview extends Piece {
  constructor() {
    super('UIview', {
      // stylesheets: [() => import('/assets/css/components/file.css')],
    });
  }

  mount() {
    this.DOM = { view: this, ...this.captureTree() };
    //? Cart events
    EmitCartClose();
    EmitCartOpen();
  }
}

// Register the custom element
customElements.define('ui-view', UIview);
