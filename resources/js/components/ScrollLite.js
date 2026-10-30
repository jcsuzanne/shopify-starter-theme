import { ScrollBase } from './ScrollBase';

// <c-scroll> on native scroll. Shared attributes and logic: ScrollBase.js
export class Scroll extends ScrollBase {
  initScroll() {
    this.frame = null;
    this.onFrame = this.onFrame.bind(this);
    this.on('scroll', window, this.onScroll);
  }

  onScroll() {
    if (this.frame === null) {
      this.frame = requestAnimationFrame(this.onFrame);
    }
  }

  onFrame() {
    this.frame = null;
    this.updateScrollValues();
  }

  unmount() {
    super.unmount();
    this.off('scroll', window, this.onScroll);
    cancelAnimationFrame(this.frame);
  }
}

// Register the custom element
customElements.define('c-scroll', Scroll);
