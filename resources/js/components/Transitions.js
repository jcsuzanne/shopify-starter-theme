import { Piece } from 'piecesjs';
import { piecesManager } from 'piecesjs';
import { body, html } from '../utils/environment';
import { gsap } from 'gsap';
import Swup from 'swup';
import SwupProgressPlugin from '@swup/progress-plugin';
import SwupScrollPlugin from '@swup/scroll-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import { updateComponents } from '../components';
import { triggerAfterMount } from '../utils/afterMountHelper';
import Channels from '../base/channels';

const HTML_CLASSES = {
  transition: 'has-transition',
  loading: 'is-loading',
  domReady: 'has-dom-ready',
  domReadyCallback: 'has-dom-ready-callback',
  domAnimated: 'has-dom-animated',
  domFinalized: 'has-dom-finalized',
};

const NEXT_CONTAINER_CLASS = 'is-next-container';

const ANCHOR_HOLD_DURATION = 2.5;
const ANCHOR_RELEASE_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];

const FETCH_HOOK_ERROR_MESSAGES = {
  'fetch:error': '--- fetch error ---',
  'fetch:timeout': '--- fetch timeout ---',
};

function toggleHtmlClasses(add = [], remove = []) {
  html.classList.add(...add);
  html.classList.remove(...remove);
}

export class Transitions extends Piece {
  constructor() {
    super('Transitions');
  }

  mount(firstHit) {
    this.releaseHashAnchor = this.releaseHashAnchor.bind(this);
    let linkSelector = 'a[href]';
    this.swup = new Swup({
      containers: ['[data-swup-container]'],
      animateHistoryBrowsing: true,
      linkSelector: linkSelector,
      plugins: [
        new SwupProgressPlugin(),
        new SwupPreloadPlugin(),
        new SwupScrollPlugin({
          animateScroll: false,
          shouldResetScrollPosition: () => false,
        }),
      ],
    });

    window.swupInstance = this.swup;

    this.swup.hooks.on(
      'link:click',
      (e) => {
        toggleHtmlClasses([HTML_CLASSES.transition]);
        Channels.emit('cart::close');
        this.emit('link::clicked');
      },
      { priority: -100 },
    );

    this.swup.hooks.on('link:self', () => {
      gsap.delayedCall(0.1, () => {
        toggleHtmlClasses([], [HTML_CLASSES.loading, HTML_CLASSES.transition]);
      });
    });

    this.swup.hooks.on('visit:start', () => this.releaseHashAnchor());

    this.swup.hooks.before('content:replace', (e) => {
      toggleHtmlClasses([HTML_CLASSES.loading]);
      this.emit('transition::before');
      // this.call('resetUI', {}, 'App');

      if (html.classList.contains('has-nav-open')) {
        // this.call('toggleNav', {}, 'Navigation');
      }
    });

    this.swup.hooks.on('page:view', (param) => {
      window.hasTransitioned = true;
      window.readyAfterMount = 1;

      this.newContainer = document.querySelector(param.containers[0]);

      this.newContainer.classList.add(NEXT_CONTAINER_CLASS);
      updateComponents(this.newContainer);

      toggleHtmlClasses([], [HTML_CLASSES.loading]);
      this.newContainer.classList.remove(NEXT_CONTAINER_CLASS);

      gsap.delayedCall(window.readyDelay, () => this.scheduleDomReady());
    });

    Object.entries(FETCH_HOOK_ERROR_MESSAGES).forEach(([hookName, message]) => {
      this.swup.hooks.on(hookName, () => console.error(message));
    });

    this.swup.hooks.before('visit:end', (e) => {
      if (typeof e.fragmentVisit == 'undefined') {
        this.renderPieces(this.newContainer);
        this.holdHashAnchor();
      }
    });
  }

  getHashAnchor() {
    const id = decodeURIComponent(window.location.hash.replace('#', ''));
    return id ? document.getElementById(id) : null;
  }

  holdHashAnchor() {
    this.releaseHashAnchor();
    if (!this.getHashAnchor()) return;
    this.anchorObserver = new ResizeObserver(() => {
      this.getHashAnchor()?.scrollIntoView({
        behavior: 'instant',
        block: 'start',
      });
    });
    this.anchorObserver.observe(this.newContainer);
    this.anchorRelease = gsap.delayedCall(
      ANCHOR_HOLD_DURATION,
      this.releaseHashAnchor,
    );
    ANCHOR_RELEASE_EVENTS.forEach((type) =>
      window.addEventListener(type, this.releaseHashAnchor, { passive: true }),
    );
  }

  releaseHashAnchor() {
    this.anchorObserver?.disconnect();
    this.anchorObserver = null;
    this.anchorRelease?.kill();
    ANCHOR_RELEASE_EVENTS.forEach((type) =>
      window.removeEventListener(type, this.releaseHashAnchor),
    );
  }

  scheduleDomReady() {
    toggleHtmlClasses([HTML_CLASSES.domReady, 'lenis', 'lenis-smooth']);

    body.setAttribute(
      'data-template',
      this.newContainer.getAttribute('data-template'),
    );
    body.setAttribute(
      'data-posttype',
      this.newContainer.getAttribute('data-posttype'),
    );

    gsap.delayedCall(window.readyCallbackDelay, () =>
      this.scheduleDomReadyCallback(),
    );
  }

  scheduleDomReadyCallback() {
    toggleHtmlClasses(
      [HTML_CLASSES.domReadyCallback, HTML_CLASSES.domAnimated],
      [HTML_CLASSES.transition],
    );
  }

  renderPieces(context) {
    triggerAfterMount(context);
    this.emit('transition::end');
  }
}

// Register the custom element
customElements.define('c-transitions', Transitions);
