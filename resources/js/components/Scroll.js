import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { html } from '../utils/environment';
import { ScrollBase } from './ScrollBase';

// <c-scroll> with Lenis smooth scroll. Shared attributes and logic: ScrollBase.js

// <c-scroll> attributes
// data-scroll-wrapper - selector of the scrolled content (default: <html>)
// data-scroll-direction - "vertical" (default) or "horizontal" (desktop only)
// data-scroll-infinite - infinite scroll

// Item data-attributes
// data-scroll-parallax-from / data-scroll-parallax-to - y values of the parallax (disabled on Safari and iOS)
// data-scroll-parallax-safari - enable the parallax on Safari and iOS for this element
// data-scroll-wip - scroll to this element on load (dev helper)

// ScrollTo links: data-scroll-to with `href` or `data-href`
// data-scroll-to-duration
// data-scroll-to-offset
// data-scroll-to-immediate

const scrollToEasing = (x) =>
  x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;

const getHashTarget = () => {
  const id = decodeURIComponent(window.location.hash.slice(1));
  return id ? document.getElementById(id) : null;
};

export class Scroll extends ScrollBase {
  initScroll() {
    const wrapper = this.getAttribute('data-scroll-wrapper');
    this.$wrapper =
      (wrapper && document.querySelector(wrapper)) ?? document.documentElement;
    this.direction = window.isMobile
      ? 'vertical'
      : (this.getAttribute('data-scroll-direction') ?? 'vertical');
    const isInfinite = this.hasAttribute('data-scroll-infinite');

    html.setAttribute('data-scroll-direction', this.direction);

    this.lenis = new Lenis({
      wrapper: window,
      content: this.$wrapper,
      orientation: this.direction,
      gestureOrientation: 'vertical',
      // Native wheel scroll on Safari
      smoothWheel: !window.isSafari,
      syncTouch: window.isMobile && isInfinite,
      lerp: 0.3,
      infinite: isInfinite,
    });

    window.scrollObjectInstance = this.lenis;
    window.scrollInstance = {
      scroll: 0,
      velocity: 0,
      direction: 'down',
      progress: 0,
    };

    this.lenis.on('scroll', this.onLenisScroll.bind(this));

    // Lenis runs on the GSAP ticker so ScrollTrigger and Lenis share the same frame
    this.onTick = (time) => this.lenis.raf(time * 1000);
    gsap.ticker.add(this.onTick);
    gsap.ticker.lagSmoothing(0);

    if (this.direction === 'horizontal') {
      // Children grow as their images load: keep the container width in sync
      this.containerObserver = new ResizeObserver(() =>
        this.initContainerSize(),
      );
      Array.from(this.children).forEach(($child) =>
        this.containerObserver.observe($child),
      );
    }

    this.on('click', this.$All('[data-scroll-to]'), this.scrollTo);
  }

  getScroll() {
    return this.lenis.scroll;
  }

  updateMaxScroll() {
    this.lenis.resize();
    this.maxScroll = this.lenis.limit;
  }

  onLenisScroll({ scroll, velocity, progress }) {
    window.scrollInstance = {
      scroll,
      velocity,
      direction: velocity >= 0 ? 'down' : 'up',
      progress,
    };

    ScrollTrigger.update();
    this.updateScrollValues(scroll);
  }

  afterMount() {
    super.afterMount();

    const $start = getHashTarget() ?? this.querySelector('[data-scroll-wip]');
    if ($start) this.lenis.scrollTo($start);
  }

  initContainerSize() {
    const width = Array.from(this.children).reduce(
      (total, $child) => total + $child.getBoundingClientRect().width,
      0,
    );
    this.style.setProperty('--scrollContainerWidth', `${width}px`);
  }

  createElement($element) {
    const scrollElement = super.createElement($element);
    const parallaxFrom = $element.getAttribute('data-scroll-parallax-from');
    const allowParallax =
      !window.isSafari || $element.hasAttribute('data-scroll-parallax-safari');

    if (this.isOutOfContext($element)) {
      gsap.killTweensOf($element);
      gsap.set($element, { clearProps: 'y,height' });
    } else if (parallaxFrom != null && allowParallax) {
      scrollElement.parallaxTl = gsap.fromTo(
        $element,
        { y: parallaxFrom },
        {
          y: $element.getAttribute('data-scroll-parallax-to'),
          duration: 1,
          ease: 'none',
          paused: true,
        },
      );
    }

    return scrollElement;
  }

  getTriggerOptions($element, $trigger, scrollElement) {
    return {
      ...super.getTriggerOptions($element, $trigger, scrollElement),
      scroller: this.$wrapper,
      horizontal: this.direction === 'horizontal',
    };
  }

  update() {
    this.lenis.resize();
    super.update();
  }

  scrollTo(e) {
    e.preventDefault();
    const $link = e.currentTarget;

    this.lenis.scrollTo(
      $link.getAttribute('href') ?? $link.getAttribute('data-href'),
      {
        offset: parseInt($link.getAttribute('data-scroll-to-offset') ?? 0),
        duration: parseFloat(
          $link.getAttribute('data-scroll-to-duration') ?? 2,
        ),
        immediate: $link.hasAttribute('data-scroll-to-immediate'),
        easing: scrollToEasing,
      },
    );
  }

  unmount() {
    super.unmount();
    this.off('click', this.$All('[data-scroll-to]'), this.scrollTo);

    gsap.ticker.remove(this.onTick);
    // GSAP default lag smoothing
    gsap.ticker.lagSmoothing(500, 33);
    this.containerObserver?.disconnect();
    this.lenis.destroy();
  }
}

// Register the custom element
customElements.define('c-scroll', Scroll);
