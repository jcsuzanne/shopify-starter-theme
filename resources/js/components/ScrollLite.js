import { Piece } from 'piecesjs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { html } from '../utils/environment';

gsap.registerPlugin(ScrollTrigger);

const IN_VIEW_CLASS = 'is-inview';

export class Scroll extends Piece {
  constructor() {
    super('Scroll');
  }

  mount() {
    this.$scrollItems = [];
    this.windowWidth = window.innerWidth;

    // Collect all scroll items
    if (this.querySelectorAll('[data-scroll-item]').length > 0) {
      this.$scrollItems = Array.from(
        this.querySelectorAll('[data-scroll-item]'),
      );
    }

    // Native scroll setup
    this.lastScrollY = 0;
    this.ticking = false;

    document.documentElement.style.setProperty('--scrollValue', `0px`);

    // Setup scroll listener
    this.on('scroll', window, this.onScroll);

    ScrollTrigger.config({ ignoreMobileResize: true });

    // Init scroll detection after a short delay
    gsap.delayedCall(0.5, () => {
      this.initElements();
    });

    // Initial scroll update
    this.updateScrollValues();

    this.on('resize', window, this.resize);

    // Detect scroll height change
    this.scrollHeightObserver = new MutationObserver(() => {
      this.detectScrollHeightChange();
    });
    this.scrollHeightObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    // console.log('ScrollLite mount');
  }

  detectScrollHeightChange() {
    // Stocker la hauteur initiale
    if (!this.lastScrollHeight) {
      this.lastScrollHeight = document.documentElement.scrollHeight;
    }

    const currentScrollHeight = document.documentElement.scrollHeight;

    if (currentScrollHeight !== this.lastScrollHeight) {
      // console.log('Scroll height changed:', {
      //   previous: this.lastScrollHeight,
      //   current: currentScrollHeight,
      //   difference: currentScrollHeight - this.lastScrollHeight,
      // });

      this.lastScrollHeight = currentScrollHeight;

      // Optionnel : rafraîchir les ScrollTriggers après un changement de hauteur
      this.refresh();
    }
  }

  onScroll() {
    // console.log('onScroll');
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.updateScrollValues();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  updateScrollValues() {
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;
    const scrollDelta = currentScroll - this.lastScrollY;

    // Determine direction
    const direction = scrollDelta >= 0 ? 'down' : 'up';

    // Update has-scrolled class
    if (currentScroll > 60) {
      if (!html.classList.contains('has-scrolled')) {
        html.classList.add('has-scrolled');
      }
    } else {
      if (html.classList.contains('has-scrolled')) {
        html.classList.remove('has-scrolled');
      }
    }

    html.setAttribute('data-direction', direction);

    document.documentElement.style.setProperty(
      '--scrollValue',
      `${-parseInt(Math.max(currentScroll, 0))}px`,
    );

    this.lastScrollY = currentScroll;
  }

  initElements() {
    this.scrollElements = [];

    this.$scrollItems.forEach(($element) => {
      const scrollElement = this.createElement($element);
      const hasMarkers =
        typeof $element.getAttribute('data-scroll-marker') == 'string';

      const options = {
        trigger: $element,
        start:
          typeof $element.getAttribute('data-scroll-start') == 'string'
            ? $element.getAttribute('data-scroll-start')
            : 'top bottom',
        end:
          typeof $element.getAttribute('data-scroll-end') == 'string'
            ? $element.getAttribute('data-scroll-end')
            : 'bottom top',
        markers: hasMarkers,
        onEnter: () => {
          this.onElementEnter(scrollElement, 'down');
        },
        onLeave: () => {
          this.onElementLeave(scrollElement, 'down');
        },
        onEnterBack: () => {
          this.onElementEnter(scrollElement, 'up');
        },
        onLeaveBack: () => {
          this.onElementLeave(scrollElement, 'up');
        },
      };

      // Mobile specific start position
      if (
        typeof $element.getAttribute('data-scroll-start-mobile') == 'string' &&
        window.isMobile
      ) {
        options.start = $element.getAttribute('data-scroll-start-mobile');
      }

      // Add progress callback if needed
      if (scrollElement.progressCallParameters != undefined) {
        options.onUpdate = (self) => {
          this.onElementProgress(self, scrollElement);
        };
      }

      // Add CSS progress variable if needed
      if (
        typeof $element.getAttribute('data-scroll-progress-css') == 'string'
      ) {
        $element.style.setProperty('--progress', 0);

        const previousOnUpdate = options.onUpdate;
        options.onUpdate = (self) => {
          let progress = self.progress.toFixed(3);
          $element.style.setProperty('--progress', progress);

          if (previousOnUpdate) {
            previousOnUpdate(self);
          }
        };
      }

      const sTrigger = ScrollTrigger.create(options);

      this.scrollElements.push({
        ...scrollElement,
        sTrigger,
      });
    });
  }

  createElement($element) {
    const id = $element.getAttribute('data-scroll-id');
    const isRepeatable =
      typeof $element.getAttribute('data-scroll-repeat') == 'string';

    // Manage classic call
    let callParameters;
    if (typeof $element.getAttribute('data-scroll-call') === 'string') {
      const callParametersArray = $element
        .getAttribute('data-scroll-call')
        .split(',');
      callParameters = {
        function: callParametersArray[0],
        module: callParametersArray[1],
        moduleId: callParametersArray.length < 3 ? id : callParametersArray[2],
      };
    }

    // Manage progress call
    let progressCallParameters;
    if (
      typeof $element.getAttribute('data-scroll-progress-call') === 'string'
    ) {
      const progressCallParametersArray = $element
        .getAttribute('data-scroll-progress-call')
        .split(',');

      progressCallParameters = {
        function: progressCallParametersArray[0],
        module: progressCallParametersArray[1],
        moduleId:
          progressCallParametersArray.length < 3
            ? id
            : progressCallParametersArray[2],
        isReversed:
          typeof $element.getAttribute('data-scroll-progress-reverse') ==
          'string',
      };

      if (progressCallParameters.moduleId == undefined) {
        console.warn(
          `You didn't specify a data-scroll-id, or a moduleId in your data-scroll-progress-call`,
          $element,
        );
      }
    }

    return {
      $el: $element,
      id,
      isRepeatable,
      callParameters,
      progressCallParameters,
    };
  }

  onElementProgress(self, scrollElement) {
    const progress = self.progress.toFixed(3);

    this.call(
      scrollElement.progressCallParameters.function,
      {
        progress: parseFloat(progress),
        isReversed: scrollElement.progressCallParameters.isReversed,
      },
      scrollElement.progressCallParameters.module,
      scrollElement.progressCallParameters.moduleId,
    );
  }

  onElementEnter(scrollElement, direction) {
    if (
      !scrollElement.isRepeatable &&
      scrollElement.$el.classList.contains(IN_VIEW_CLASS)
    ) {
      return;
    }
    scrollElement.$el.classList.add(IN_VIEW_CLASS);

    // Call js functions in a specific module with data-attribute
    if (scrollElement.callParameters != undefined) {
      this.call(
        scrollElement.callParameters.function,
        { mode: 'enter', direction: direction, $el: scrollElement.$el },
        scrollElement.callParameters.module,
        scrollElement.callParameters.moduleId,
      );
    }
  }

  onElementLeave(scrollElement, direction) {
    if (!scrollElement.isRepeatable) {
      return;
    }
    scrollElement.$el.classList.remove(IN_VIEW_CLASS);

    // Call js functions in a specific module with data-attribute
    if (scrollElement.callParameters != undefined) {
      this.call(
        scrollElement.callParameters.function,
        { mode: 'leave', direction: direction, $el: scrollElement.$el },
        scrollElement.callParameters.module,
        scrollElement.callParameters.moduleId,
      );
    }
  }

  refresh() {
    if (this.scrollElements) {
      this.scrollElements.forEach((scrollElement) => {
        scrollElement.sTrigger.refresh();
      });
    }
    this.emit('redraw::fx');
  }

  resize() {
    if (this.resizeTimeout != undefined) {
      this.resizeTimeout.kill();
    }
    this.resizeTimeout = gsap.delayedCall(window.isMobile ? 0.6 : 0.3, () => {
      this.resizeDebounce();
    });
  }

  resizeDebounce() {
    if (
      this.windowWidth != window.innerWidth ||
      (this.direction == 'horizontal' && !window.isMobile)
    ) {
      console.log('resizeDebounce');
      this.windowWidth = window.innerWidth;
      this.refresh();
    }
  }

  unmount() {
    this.off('scroll', window, this.onScroll);

    if (this.scrollElements) {
      this.scrollElements.forEach((scrollElement) => {
        scrollElement.sTrigger.kill();
      });
      this.$scrollItems = [];
      this.scrollElements = [];
    }

    this.off('resize', window, this.resize);
  }
}

// Register the custom element
customElements.define('c-scroll', Scroll);
