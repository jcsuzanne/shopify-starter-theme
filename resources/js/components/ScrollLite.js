import { Piece } from 'piecesjs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { html } from '../utils/environment';

gsap.registerPlugin(ScrollTrigger);

const IN_VIEW_CLASS = 'is-inview';
const SCROLLED_CLASS = 'has-scrolled';
const SCROLLED_THRESHOLD = 60;

const parseCall = (value, id) => {
  const [fn, module, moduleId] = value.split(',');
  return { function: fn, module, moduleId: moduleId ?? id };
};

export class Scroll extends Piece {
  constructor() {
    super('Scroll');
  }

  mount() {
    this.$scrollItems = this.$All('[data-scroll-item]');
    this.scrollElements = [];
    this.windowWidth = window.innerWidth;

    // Native scroll setup
    this.lastScrollY = 0;
    this.lastDirection = null;
    this.lastScrollValue = null;
    this.lastScrollProgress = null;
    this.lastScrollHeight = null;
    this.frame = null;

    this.onFrame = this.onFrame.bind(this);
    this.on('scroll', window, this.onScroll);

    ScrollTrigger.config({ ignoreMobileResize: true });

    this.initCall = gsap.delayedCall(0.5, this.initElements.bind(this));

    this.updateMaxScroll();
    this.updateScrollValues();

    this.on('resize', window, this.resize);

    // ResizeObserver only fires on real size changes and gives the size without forcing a layout.
    // Observe #master, not body: body is height: 100% (layout.css) so it never grows with the content
    this.scrollHeightObserver = new ResizeObserver(
      this.detectScrollHeightChange.bind(this),
    );
    this.scrollHeightObserver.observe(
      document.getElementById('master') ?? document.body,
    );
  }

  detectScrollHeightChange([entry]) {
    const height = entry.contentRect.height;

    if (this.lastScrollHeight === null) {
      this.lastScrollHeight = height;
      return;
    }

    if (height !== this.lastScrollHeight) {
      this.lastScrollHeight = height;
      this.refresh();
      this.updateMaxScroll();
      this.updateScrollValues();
    }
  }

  // Cached so the scroll loop never reads layout: only changes with content height or viewport size
  updateMaxScroll() {
    this.maxScroll = document.documentElement.scrollHeight - window.innerHeight;
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

  updateScrollValues() {
    const currentScroll = window.scrollY;
    const direction = currentScroll - this.lastScrollY >= 0 ? 'down' : 'up';

    html.classList.toggle(SCROLLED_CLASS, currentScroll > SCROLLED_THRESHOLD);

    // Avoid style/attribute writes on <html> when nothing changed: they invalidate the whole document style
    if (direction !== this.lastDirection) {
      this.lastDirection = direction;
      html.setAttribute('data-direction', direction);
    }

    const scrollValue = -Math.trunc(Math.max(currentScroll, 0));
    if (scrollValue !== this.lastScrollValue) {
      this.lastScrollValue = scrollValue;
      html.style.setProperty('--scrollValue', `${scrollValue}px`);
    }

    const scrollProgress = (
      this.maxScroll > 0
        ? Math.min(Math.max(currentScroll / this.maxScroll, 0), 1)
        : 0
    ).toFixed(4);
    if (scrollProgress !== this.lastScrollProgress) {
      this.lastScrollProgress = scrollProgress;
      html.style.setProperty('--scrollProgress', scrollProgress);
    }

    this.lastScrollY = currentScroll;
  }

  initElements() {
    this.$scrollItems.forEach(($element) => {
      const scrollElement = this.createElement($element);
      const hasProgressCss = $element.hasAttribute('data-scroll-progress-css');
      const startMobile = window.isMobile
        ? $element.getAttribute('data-scroll-start-mobile')
        : null;

      const options = {
        trigger: $element,
        start:
          startMobile ??
          $element.getAttribute('data-scroll-start') ??
          'top bottom',
        end: $element.getAttribute('data-scroll-end') ?? 'bottom top',
        markers: $element.hasAttribute('data-scroll-marker'),
        onEnter: () => this.onElementEnter(scrollElement, 'down'),
        onLeave: () => this.onElementLeave(scrollElement, 'down'),
        onEnterBack: () => this.onElementEnter(scrollElement, 'up'),
        onLeaveBack: () => this.onElementLeave(scrollElement, 'up'),
      };

      if (hasProgressCss) $element.style.setProperty('--progress', 0);

      if (hasProgressCss || scrollElement.progressCallParameters) {
        options.onUpdate = (self) => {
          const progress = Math.round(self.progress * 1000) / 1000;

          if (hasProgressCss) {
            $element.style.setProperty('--progress', progress);
          }
          if (scrollElement.progressCallParameters) {
            this.onElementProgress(progress, scrollElement);
          }
        };
      }

      scrollElement.sTrigger = ScrollTrigger.create(options);
      this.scrollElements.push(scrollElement);
    });
  }

  createElement($element) {
    const id = $element.getAttribute('data-scroll-id');
    const call = $element.getAttribute('data-scroll-call');
    const progressCall = $element.getAttribute('data-scroll-progress-call');

    const callParameters = call != null ? parseCall(call, id) : undefined;

    let progressCallParameters;
    if (progressCall != null) {
      progressCallParameters = {
        ...parseCall(progressCall, id),
        isReversed: $element.hasAttribute('data-scroll-progress-reverse'),
      };

      if (progressCallParameters.moduleId == null) {
        console.warn(
          `You didn't specify a data-scroll-id, or a moduleId in your data-scroll-progress-call`,
          $element,
        );
      }
    }

    return {
      $el: $element,
      id,
      isRepeatable: $element.hasAttribute('data-scroll-repeat'),
      callParameters,
      progressCallParameters,
    };
  }

  onElementProgress(progress, scrollElement) {
    const {
      function: fn,
      module,
      moduleId,
      isReversed,
    } = scrollElement.progressCallParameters;

    this.call(fn, { progress, isReversed }, module, moduleId);
  }

  onElementEnter(scrollElement, direction) {
    const { $el, isRepeatable } = scrollElement;
    if (!isRepeatable && $el.classList.contains(IN_VIEW_CLASS)) return;

    $el.classList.add(IN_VIEW_CLASS);
    this.callElement(scrollElement, 'enter', direction);
  }

  onElementLeave(scrollElement, direction) {
    if (!scrollElement.isRepeatable) return;

    scrollElement.$el.classList.remove(IN_VIEW_CLASS);
    this.callElement(scrollElement, 'leave', direction);
  }

  callElement(scrollElement, mode, direction) {
    if (!scrollElement.callParameters) return;

    const { function: fn, module, moduleId } = scrollElement.callParameters;
    this.call(
      fn,
      { mode, direction, $el: scrollElement.$el },
      module,
      moduleId,
    );
  }

  update() {
    this.refresh();
  }

  refresh() {
    this.scrollElements?.forEach((scrollElement) => {
      scrollElement.sTrigger.refresh();
    });
    this.emit('redraw::fx');
  }

  resize() {
    // innerHeight changes on every resize (incl. mobile URL bar), unlike the width-gated refresh below
    this.updateMaxScroll();
    this.updateScrollValues();

    this.resizeTimeout?.kill();
    this.resizeTimeout = gsap.delayedCall(
      window.isMobile ? 0.6 : 0.3,
      this.resizeDebounce.bind(this),
    );
  }

  resizeDebounce() {
    if (this.windowWidth !== window.innerWidth) {
      this.windowWidth = window.innerWidth;
      this.refresh();
    }
  }

  unmount() {
    this.off('scroll', window, this.onScroll);
    this.off('resize', window, this.resize);

    cancelAnimationFrame(this.frame);
    this.initCall.kill();
    this.resizeTimeout?.kill();
    this.scrollHeightObserver.disconnect();

    this.scrollElements.forEach((scrollElement) => {
      scrollElement.sTrigger.kill();
    });
    this.scrollElements = [];
    this.$scrollItems = [];
  }
}

// Register the custom element
customElements.define('c-scroll', Scroll);
