import { Piece } from 'piecesjs';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { html } from '../utils/environment';

gsap.registerPlugin(ScrollTrigger);

// data-attributes
// data-scroll="item" : to add element as "detectable"
// data-scroll="to" with `href` or `data-href` to add a scrollTo link
// data-scroll-progress-context - value "desktop" or "mobile"

// ScrollTo options
//data-scroll-to-duration
//data-scroll-to-offset
//data-scroll-to-immediate

// data-scroll-id

// Call example : (data-scroll-call, data-scroll-progress-call)
// data-scroll-call="function,moduleName,{moduleId}" - call a function, in the modue "moduleName" with id the id "moduleId"
// OR
// data-scroll-id="myCustomId" data-scroll-call="function,moduleName"  will automatically call myModule with the id : "myCustomId"

// data-scroll-progress-call="function,moduleName,{moduleId}" - call a function on element in viewport updates, in the modue "moduleName" with id the id "moduleId"
// data-scroll-progress-reverse will call progress method from 1 to 0
// data-scroll-progress-css - will set a property --progress to get a css variable on your desired element

// data-scroll-start refered to `start` value of scrollTrigger
// data-scroll-end refered to `end` value of scrollTrigger
// data-scroll-marker
// data-scroll-repeat
// data-scroll-target - trigger when the target element is triggered

//! Exemple pour un module avec un progress géré dans le JS
//? DOM
// data-scroll="item"
// data-module-tonModule="tonId"
// data-scroll-progress-call="onUpdate,TonModule,tonId"

//? JS
// Puis tu fais un module TonModule.js
// Tu crée la function onUpdate() dans ton module
// onUpdate({progress, isReversed}) {
//    console.log(progress, isReversed)
// }

const IN_VIEW_CLASS = 'is-inview';
const IN_VIEW_CLASS_FIRST = 'is-inview-first';

export class Scroll extends Piece {
  constructor() {
    super('Scroll');

    this.$infinite =
      typeof this.getAttribute('data-scroll-infinite') == 'string'
        ? document.querySelector(this.getAttribute('data-scroll-infinite'))
        : false;
  }

  mount() {
    this.$scrollItems = [];
    this.$scrollItems = Array.from(this.querySelectorAll('[data-scroll-item]'));
    console.log(this.querySelectorAll('[data-scroll-item]'));

    // check if items are outside the container
    this.$scrollOutsideItems = document.querySelectorAll(
      '[data-scroll-outside-item]',
    );
    this.$scrollOutsideItems.forEach((outsideItem) => {
      this.$scrollItems.push(outsideItem);
    });

    this.$scrollToWip = this.$('[data-scroll-wip]');
    this.scrollToItems = this.$('[data-scroll-to]');
    this.$wrapper =
      typeof this.getAttribute('data-scroll-wrapper') == 'string'
        ? document.querySelector(this.getAttribute('data-scroll-wrapper'))
        : this.parentNode;
    this.direction =
      typeof this.getAttribute('data-scroll-direction') == 'string'
        ? this.getAttribute('data-scroll-direction')
        : 'vertical';

    this.windowWidth = window.innerWidth;

    if (window.isMobile) {
      this.gestureDirection = 'vertical';
      this.direction = 'vertical';
    }

    window.scrollInstance = {
      velocity: 0,
      direction: 'down',
      progress: 0,
      scroll: 0,
    };

    html.setAttribute('data-scroll-direction', this.direction);
    this.initContainerSize();
    this.imagesLoading();

    let isSmoothOnMobile =
      typeof this.getAttribute('data-scroll-infinite') == 'string' &&
      window.isMobile
        ? true
        : false;

    this.lenis = new Lenis({
      wrapper: this.$wrapper,
      content: this,
      orientation: this.direction,
      gestureOrientation: this.gestureDirection,
      smoothWheel: true,
      smoothTouch: false,
      syncTouch: true,
      duration: window.isMobile ? 0.75 : 0.8,
      lerp: window.isMobile ? 0.6 : 0.3,
      easing: (t) => 1 - Math.pow(1 - t, 5), // Ease Out Quint
      // wheelMultiplier: 0.7,
      touchMultiplier: 1.4,
      touchInertiaMultiplier: 5,
      infinite: typeof this.getAttribute('data-scroll-infinite') == 'string',
    });
    window.scrollObjectInstance = this.lenis;
    window.scrollObjectInstance.container = this.$wrapper;

    document.documentElement.style.setProperty('--scrollValue', `0px`);

    //get scroll value
    this.lenis.on(
      'scroll',
      ({ scroll, velocity, progress }) => {
        let direction = velocity >= 0 ? 'down' : 'up';
        window.scrollInstance = {
          scroll,
          velocity,
          direction,
          progress,
        };

        if (scroll > 60) {
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
          `${-parseInt(Math.max(scroll, 0))}px`,
        );
      },
      { passive: true },
    );
    this.lenis.on('scroll', ScrollTrigger.update);

    ScrollTrigger.config({ ignoreMobileResize: true });

    gsap.ticker.add((time) => this.lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Init elements to detect
    gsap.delayedCall(1.2, () => {
      this.initElements();
    });

    gsap.delayedCall(1, () => {
      this.update();

      if (window.location.hash != '') {
        this.lenis.scrollTo(document.querySelector(window.location.hash));
      } else if (this.$scrollToWip != undefined) {
        this.lenis.scrollTo(this.$scrollToWip);
      }
    });

    this.on('click', this.$('[data-scroll-to]'), this.scrollTo);

    this.on('resize', window, this.resize);
  }

  update() {
    console.log('update lenis');
    this.lenis.resize();
    gsap.delayedCall(0.1, () => {
      this.refresh();
      this.emit('redraw::fx');
    });
  }

  initContainerSize() {
    if (this.direction === 'horizontal') {
      let elWidth = 0;

      for (
        let childIndex = 0;
        childIndex < this.el.children.length;
        childIndex++
      ) {
        const child = this.el.children[childIndex];
        elWidth += child.getBoundingClientRect().width;
      }
      this.el.style.setProperty('--scrollContainerWidth', elWidth + 'px');
    }
  }

  imagesLoading() {
    let $images = Array.from(document.getElementsByTagName('img'));
    let count = 0;

    $images.forEach(($image) => {
      $image.addEventListener('load', () => {
        count++;

        if (count == $images.length) {
          this.initContainerSize();
        }
      });
    });
  }

  initElements() {
    this.triggers = new Array(this.$scrollItems.length);
    this.scrollElements = new Array(this.$scrollItems.length);

    this.$scrollItems.forEach(($element, index) => {
      let scrollElement = this.createElement($element, index);
      let hasMarkers =
        typeof $element.getAttribute('data-scroll-marker') == 'string';
      let $target =
        typeof $element.getAttribute('data-scroll-target') == 'string'
          ? this.$($element.getAttribute('data-scroll-target'))
          : $element;

      if ($target == null) return;

      let options = {
        scroller: this.$wrapper,
        trigger: $target,
        start:
          typeof $element.getAttribute('data-scroll-start') == 'string'
            ? $element.getAttribute('data-scroll-start')
            : 'top bottom',
        end:
          typeof $element.getAttribute('data-scroll-end') == 'string'
            ? $element.getAttribute('data-scroll-end')
            : 'bottom top',
        markers: hasMarkers,
        horizontal: this.direction == 'horizontal',
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

      if (scrollElement.progressCallParameters != undefined) {
        options = {
          ...options,
          onUpdate: (self) => {
            this.onElementProgress(self, scrollElement);
          },
        };
      }

      if (
        typeof $element.getAttribute('data-scroll-progress-css') == 'string'
      ) {
        $element.style.setProperty('--progress', 0);

        options = {
          ...options,
          onUpdate: (self) => {
            let progress = self.progress.toFixed(3);
            $element.style.setProperty('--progress', progress);

            if (scrollElement.progressCallParameters != undefined) {
              this.onElementProgress(self, scrollElement);
            }
            if (scrollElement.parallaxTl != undefined) {
              scrollElement.parallaxTl.progress(self.progress);
            }
          },
        };
      } else if (scrollElement.parallaxTl != undefined) {
        options = {
          ...options,
          onUpdate: (self) => {
            scrollElement.parallaxTl.progress(self.progress);
          },
        };
      }

      let sTrigger = ScrollTrigger.create(options);

      this.scrollElements.push({
        ...scrollElement,
        sTrigger,
      });
    });
  }

  createElement($element, index) {
    let id = $element.getAttribute('data-scroll-id');
    let isRepeatable =
      typeof $element.getAttribute('data-scroll-repeat') == 'string';

    // Manage classic call
    let callParameters;
    if (typeof $element.getAttribute('data-scroll-call') === 'string') {
      let callParametersArray = $element
        .getAttribute('data-scroll-call')
        .split(',');
      callParameters = {
        function: callParametersArray[0],
        module: callParametersArray[1],
        moduleId: callParametersArray.length < 3 ? id : callParametersArray[2],
      };
      if (callParameters.moduleId == undefined) {
        // console.warn(`You didn't specified a data-scroll-id, or a moduleId in your data-scroll-call`,$element)
      }
    } else {
      callParameters = undefined;
    }

    // Manage progress call
    let progressCallParameters;
    if (
      typeof $element.getAttribute('data-scroll-progress-call') === 'string'
    ) {
      let progressCallParametersArray = $element
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
          `You didn't specified a data-scroll-id, or a moduleId in your data-scroll-progress-call`,
          this.el,
        );
      }
    } else {
      progressCallParameters = undefined;
    }

    let parallax =
      typeof $element.getAttribute('data-scroll-parallax-from') === 'string';

    let parallaxTl;

    if (parallax) {
      parallaxTl = gsap.fromTo(
        $element,
        {
          y: $element.getAttribute('data-scroll-parallax-from'),
        },
        {
          y: $element.getAttribute('data-scroll-parallax-to'),
          duration: 1,
          ease: 'none',
        },
      );
      parallaxTl.pause();
    }

    let progressContext = $element.getAttribute('data-scroll-progress-context');
    if (typeof progressContext == 'string') {
      if (
        (progressContext == 'mobile' && !window.isMobile) ||
        (progressContext == 'desktop' && window.isMobile)
      ) {
        gsap.killTweensOf($element);
        gsap.set($element, { clearProps: 'y,height' });
        progressCallParameters = undefined;
        parallaxTl = undefined;
      }
    }

    return {
      $el: $element,
      id,
      isRepeatable,
      callParameters,
      parallaxTl,
      progressCallParameters,
    };
  }

  onElementProgress(self, scrollElement) {
    let progress = self.progress.toFixed(3);

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
    scrollElement.$el.classList.add(IN_VIEW_CLASS_FIRST);

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
    if (
      !scrollElement.isRepeatable &&
      scrollElement.$el.classList.contains(IN_VIEW_CLASS)
    ) {
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

  scrollTo(e) {
    if (typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    let target =
      typeof e.currentTarget.getAttribute('href') === 'string'
        ? e.currentTarget.getAttribute('href')
        : e.currentTarget.getAttribute('data-href');

    let duration =
      typeof e.currentTarget.getAttribute('data-scroll-to-duration') == 'string'
        ? parseFloat(e.currentTarget.getAttribute('data-scroll-to-duration'))
        : 1;
    let offset =
      typeof e.currentTarget.getAttribute('data-scroll-to-offset') == 'string'
        ? e.currentTarget.getAttribute('data-scroll-to-offset')
        : window.isMobile
          ? -80
          : -120;
    let immediate =
      typeof e.currentTarget.getAttribute('data-scroll-to-immediate') ==
      'string';
    let easing = (x) =>
      x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;

    if (e.himself) {
      target = e.currentTarget;
    }

    if (offset == 'middle') {
      offset = -window.innerHeight / 2.5;
    } else {
      offset = parseInt(offset);
    }

    this.lenis.scrollTo(target, {
      offset,
      duration,
      immediate,
      easing,
    });
  }

  refresh() {
    if (this.scrollElements != undefined) {
      this.scrollElements.forEach((scrollElement) => {
        scrollElement.sTrigger.refresh();
      });
    }
  }

  stop() {
    this.lenis.stop();
  }

  start() {
    this.lenis.start();
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
      this.initContainerSize();
      this.windowWidth = window.innerWidth;
      this.lenis.resize();
      this.refresh();
    }
  }

  unmount() {
    this.lenis.destroy();
    if (this.scrollElements != undefined) {
      this.scrollElements.forEach((scrollElement) => {
        scrollElement.sTrigger.kill();
      });
      this.$scrollItems = [];
    }
    gsap.ticker.remove((time) => this.raf(time));

    this.off('click', this.$('[data-scroll-to]'), this.scrollTo);
    this.off('resize', window, this.resize);
  }
}

// Register the custom element
customElements.define('c-scroll', Scroll);
