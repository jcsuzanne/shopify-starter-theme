import { Piece } from 'piecesjs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { html } from '../utils/environment';

gsap.registerPlugin(ScrollTrigger);

// Shared logic of <c-scroll>, extended by:
// - ScrollLite.js : native scroll (default)
// - Scroll.js     : Lenis smooth scroll, parallax, horizontal mode, scroll-to links
// Pick one in components.js. Both register as the "Scroll" piece.

// <c-scroll> attributes
// data-scroll-vars - write --scrollValue and --scrollProgress on <html> while scrolling (opt-in: it restyles the whole page each frame)

// Item data-attributes
// data-scroll-item : element to detect (inside <c-scroll>)
// data-scroll="outsideItem" : element to detect, outside <c-scroll>
// data-scroll-id
// data-scroll-target - trigger when the target element is triggered (an id, or any CSS selector)
// data-scroll-start refered to `start` value of scrollTrigger
// data-scroll-start-mobile - `start` value on mobile
// data-scroll-end refered to `end` value of scrollTrigger
// data-scroll-marker
// data-scroll-repeat
// data-scroll-progress-context - value "desktop" or "mobile": progress call only runs in this context

// Call example : (data-scroll-call, data-scroll-progress-call)
// data-scroll-call="function,moduleName,{moduleId}" - call a function, in the modue "moduleName" with id the id "moduleId"
// OR
// data-scroll-id="myCustomId" data-scroll-call="function,moduleName"  will automatically call myModule with the id : "myCustomId"

// data-scroll-progress-call="function,moduleName,{moduleId}" - call a function on element in viewport updates, in the modue "moduleName" with id the id "moduleId"
// data-scroll-progress-reverse will call progress method from 1 to 0
// data-scroll-progress-css - will set a property --progress to get a css variable on your desired element

//! Exemple pour un module avec un progress géré dans le JS
//? DOM
// data-scroll-item
// data-module-tonModule="tonId"
// data-scroll-progress-call="onUpdate,TonModule,tonId"

//? JS
// Puis tu fais un module TonModule.js
// Tu crée la function onUpdate() dans ton module
// onUpdate({progress, isReversed}) {
//    console.log(progress, isReversed)
// }

const IN_VIEW_CLASS = 'is-inview';
const SCROLLED_CLASS = 'has-scrolled';
const SCROLLED_THRESHOLD = 60;
// Groups the height changes of a burst of lazy-loaded images into a single refresh
const HEIGHT_CHANGE_DELAY = 0.15;

const parseCall = (value, id) => {
  const [fn, module, moduleId] = value.split(',');
  return { function: fn, module, moduleId: moduleId ?? id };
};

export class ScrollBase extends Piece {
  constructor() {
    super('Scroll');
  }

  mount() {
    this.$scrollItems = [
      ...this.$All('[data-scroll-item]'),
      ...document.querySelectorAll('[data-scroll="outsideItem"]'),
    ];
    this.scrollElements = [];
    this.elementsReady = false;
    this.hasScrollVars = this.hasAttribute('data-scroll-vars');
    this.windowWidth = window.innerWidth;

    this.lastScrollY = 0;
    this.lastDirection = null;
    this.lastScrollValue = null;
    this.lastScrollProgress = null;
    this.lastScrollHeight = null;

    ScrollTrigger.config({ ignoreMobileResize: true });

    // Every refresh (ours or ScrollTrigger's automatic one on resize) notifies the fx
    this.onRefresh = this.onRefresh.bind(this);
    ScrollTrigger.addEventListener('refresh', this.onRefresh);

    this.initScroll();
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

  // Scroll source setup, implemented by ScrollLite / Scroll
  initScroll() {}

  getScroll() {
    return window.scrollY;
  }

  // Called by triggerAfterMount() once the DOM is ready (first load and after each swup visit)
  afterMount() {
    if (this.elementsReady) return;
    this.elementsReady = true;
    this.initElements();
  }

  detectScrollHeightChange([entry]) {
    const height = entry.contentRect.height;
    if (height === this.lastScrollHeight) return;

    const isFirstMeasure = this.lastScrollHeight === null;
    this.lastScrollHeight = height;
    this.updateMaxScroll();
    if (isFirstMeasure) return;

    this.heightChangeCall?.kill();
    this.heightChangeCall = gsap.delayedCall(HEIGHT_CHANGE_DELAY, () => {
      // Width changed: the height follows the reflow and ScrollTrigger already refreshes on window resize
      if (window.innerWidth !== this.windowWidth) {
        this.windowWidth = window.innerWidth;
        return;
      }
      this.refresh();
      this.updateScrollValues();
    });
  }

  // Cached so the scroll loop never reads layout: only changes with content height or viewport size
  updateMaxScroll() {
    this.maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  }

  updateScrollValues(currentScroll = this.getScroll()) {
    const direction = currentScroll - this.lastScrollY >= 0 ? 'down' : 'up';
    this.lastScrollY = currentScroll;

    html.classList.toggle(SCROLLED_CLASS, currentScroll > SCROLLED_THRESHOLD);

    // Avoid style/attribute writes on <html> when nothing changed: they invalidate the whole document style
    if (direction !== this.lastDirection) {
      this.lastDirection = direction;
      html.setAttribute('data-direction', direction);
    }

    if (!this.hasScrollVars) return;

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
  }

  initElements() {
    this.$scrollItems.forEach(($element) => {
      const $trigger = this.getTarget($element);
      if ($trigger == null) return;

      const scrollElement = this.createElement($element);
      scrollElement.sTrigger = ScrollTrigger.create(
        this.getTriggerOptions($element, $trigger, scrollElement),
      );
      this.scrollElements.push(scrollElement);
    });
  }

  getTarget($element) {
    const target = $element.getAttribute('data-scroll-target');
    if (target == null) return $element;

    let $target = document.getElementById(target);
    if ($target == null) {
      try {
        $target = document.querySelector(target);
      } catch {
        // Not a valid selector either
      }
    }

    if ($target == null) {
      console.warn(`data-scroll-target "${target}" not found`, $element);
    }
    return $target;
  }

  getTriggerOptions($element, $trigger, scrollElement) {
    const hasProgressCss = $element.hasAttribute('data-scroll-progress-css');
    const startMobile = window.isMobile
      ? $element.getAttribute('data-scroll-start-mobile')
      : null;

    const options = {
      trigger: $trigger,
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

    // A single onUpdate for every progress feature, so none of them overrides another
    if (
      hasProgressCss ||
      scrollElement.progressCallParameters ||
      scrollElement.parallaxTl
    ) {
      options.onUpdate = (self) => {
        const progress = Math.round(self.progress * 1000) / 1000;

        if (hasProgressCss) {
          $element.style.setProperty('--progress', progress);
        }
        if (scrollElement.progressCallParameters) {
          this.onElementProgress(progress, scrollElement);
        }
        scrollElement.parallaxTl?.progress(self.progress);
      };
    }

    return options;
  }

  // data-scroll-progress-context="mobile|desktop": progress features only run in this context
  isOutOfContext($element) {
    const context = $element.getAttribute('data-scroll-progress-context');
    return (
      (context == 'mobile' && !window.isMobile) ||
      (context == 'desktop' && window.isMobile)
    );
  }

  createElement($element) {
    const id = $element.getAttribute('data-scroll-id');
    const call = $element.getAttribute('data-scroll-call');
    const progressCall = $element.getAttribute('data-scroll-progress-call');

    const callParameters = call != null ? parseCall(call, id) : undefined;

    let progressCallParameters;
    if (progressCall != null && !this.isOutOfContext($element)) {
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

  // Public API, used by scrollUpdate() in utils/utilities.js
  update() {
    this.refresh();
  }

  refresh() {
    ScrollTrigger.refresh();
  }

  onRefresh() {
    this.emit('redraw::fx');
  }

  resize() {
    // innerHeight changes on every resize (incl. mobile URL bar). ScrollTrigger refreshes itself on resize
    this.updateMaxScroll();
    this.updateScrollValues();
  }

  unmount() {
    this.off('resize', window, this.resize);
    ScrollTrigger.removeEventListener('refresh', this.onRefresh);

    this.heightChangeCall?.kill();
    this.scrollHeightObserver.disconnect();

    this.scrollElements.forEach(({ sTrigger, parallaxTl }) => {
      sTrigger.kill();
      parallaxTl?.kill();
    });
    this.scrollElements = [];
    this.$scrollItems = [];
  }
}
