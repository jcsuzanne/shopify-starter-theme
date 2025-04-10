import { Piece } from 'piecesjs';
import { body, html } from '../utils/environment';
import { gsap } from 'gsap';
import Swup from 'swup';
// import SwupFragmentPlugin from '@swup/fragment-plugin';
import SwupScrollPlugin from '@swup/scroll-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import { updateComponents } from '../components';

export class Transitions extends Piece {
  constructor() {
    super('Transitions');
  }

  mount(firstHit) {
    this.swup = new Swup({
      containers: ['[data-swup-container]'],
      animateHistoryBrowsing: true,
      plugins: [
        // new SwupParallelPlugin(),
        new SwupPreloadPlugin(),
        new SwupScrollPlugin({
          doScrollingRightAway: true,
          animateScroll: {
            betweenPages: true,
            samePageWithHash: true,
            samePage: true,
          },
          shouldResetScrollPosition: (link) => false,
        }),
      ],
    });

    this.swup.hooks.on(
      'link:click',
      () => {
        html.classList.add('is-loading');
      },
      { priority: -100 },
    );

    this.swup.hooks.on('link:self', () => {
      gsap.delayedCall(0.01, () => {
        html.classList.remove('is-loading');
        html.classList.remove('has-nav-main-open');
        html.classList.remove('has-menu-mobile-open');
        html.classList.remove('has-nav-secondary-open');
      });
    });

    this.swup.hooks.on('visit:start', () => {
      // this.call('hideLogo', null, 'Footer');
      html.classList.add('is-loading');
      html.classList.add('has-transition');
      html.classList.add('is-leaving');
    });

    this.swup.hooks.on('content:replace', () => {
      this.newContainer = document.querySelector('[data-swup-container]');
      updateComponents(this.newContainer);
      return new Promise((res) => setTimeout(res, 600));
    });

    this.swup.hooks.on('animation:out:start', () => {
      gsap.delayedCall(0.3, () => {
        // this.call('closeNavs', {}, 'UI');
      });
    });

    this.swup.hooks.on('animation:out:end', () => {
      html.classList.remove('is-leaving');
      html.classList.add('is-switching');

      html.classList.remove('has-dom-ready');
      html.classList.remove('has-dom-ready-callback');
      html.classList.remove('has-dom-animated');
    });

    this.swup.hooks.on('animation:in:start', () => {
      console.log('animation:in:start');
      html.classList.remove('is-switching');

      html.classList.remove('is-loading');
      this.newContainer.classList.remove('is-next-container');

      body.setAttribute(
        'data-template',
        this.newContainer.getAttribute('data-template'),
      );

      gsap.delayedCall(0.3, () => {
        html.classList.add('has-dom-ready');

        gsap.delayedCall(window.readyCallbackDelay, () => {
          html.classList.add('has-dom-ready-callback');
          html.classList.add('has-dom-animated');
          html.classList.remove('has-transition');
        });
      });

      // });
    });

    // Manage errors
    this.swup.hooks.on('fetch:error', () => {
      console.log('--- fetch error ---');
    });

    this.swup.hooks.on('fetch:timeout', () => {
      console.log('--- fetch timeout ---');
    });

    /**
     * Overwrite swup's scrollTo function
     */
    this.swup.scrollTo = (offsetY, animate = true) => {
      if (!animate) {
        this.swup.hooks.callSync('scroll:start', undefined);
        window.scrollTo(0, offsetY);
        this.swup.hooks.callSync('scroll:end', undefined);
        return;
      }
    };

    // first hit data template
    body.setAttribute(
      'data-template',
      this.$('[data-swup-container]').getAttribute('data-template'),
    );
  }

  goto(href) {
    // console.log('goto', href);
    this.swup.navigate(href);
  }
}

// Register the custom element
customElements.define('c-transitions', Transitions);
