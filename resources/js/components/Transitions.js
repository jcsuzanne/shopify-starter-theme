import { Piece } from 'piecesjs';
import { piecesManager } from 'piecesjs';
import { body, html } from '../utils/environment';
import { gsap } from 'gsap';
import Swup from 'swup';
import SwupProgressPlugin from '@swup/progress-plugin';
import SwupScrollPlugin from '@swup/scroll-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import { updateComponents } from '../components';
import { renderComponents } from './AfterMountRenderer';
import Channels from '../base/channels';

export class Transitions extends Piece {
  constructor() {
    super('Transitions');
  }

  mount(firstHit) {
    let linkSelector = 'a[href]';
    if (window.isMobile == false) {
      // linkSelector = '';

      this.swup = new Swup({
        containers: ['[data-swup-container]'],
        animateHistoryBrowsing: true,
        linkSelector: linkSelector,
        plugins: [
          new SwupProgressPlugin(),
          new SwupPreloadPlugin(),
          new SwupScrollPlugin({
            doScrollingRightAway: true,
            animateScroll: {
              betweenPages: true,
              samePageWithHash: false,
              samePage: true,
            },
            shouldResetScrollPosition: (link) => false,
          }),
        ],
      });

      window.swupInstance = this.swup;

      this.swup.hooks.on(
        'link:click',
        (e) => {
          html.classList.add('has-transition');
          html.classList.remove('has-dom-ready');
          html.classList.remove('has-dom-ready-callback');
          html.classList.remove('has-dom-animated');
          Channels.emit('closeCart');
          this.emit('link::clicked');
        },
        { priority: -100 },
      );

      this.swup.hooks.on('link:self', () => {
        gsap.delayedCall(0.3, () => {
          html.classList.remove('is-loading');
        });
      });

      this.swup.hooks.before('content:replace', (e) => {
        html.classList.add('is-loading');
        this.emit('transition::before');
        // this.call('resetUI', {}, 'App');

        if (html.classList.contains('has-nav-open')) {
          // this.call('toggleNav', {}, 'Navigation');
        }
      });

      this.swup.hooks.on('page:view', (param) => {
        window.hasTransitioned = true;
        window.readyAfterMount = 1;
        if (typeof param.fragmentVisit == 'undefined') {
          window.scrollTo(0, 0);
        }

        this.newContainer = document.querySelector(param.containers[0]);

        this.newContainer.classList.add('is-next-container');
        updateComponents(this.newContainer);

        html.classList.remove('is-loading');
        this.newContainer.classList.remove('is-next-container');

        gsap.delayedCall(window.readyDelay, () => {
          html.classList.add('has-dom-ready');
          html.classList.add('lenis');
          html.classList.add('lenis-smooth');

          body.setAttribute(
            'data-template',
            this.newContainer.getAttribute('data-template'),
          );
          body.setAttribute(
            'data-posttype',
            this.newContainer.getAttribute('data-posttype'),
          );

          gsap.delayedCall(window.readyCallbackDelay, () => {
            html.classList.add('has-dom-ready-callback');
            html.classList.add('has-dom-animated');
            html.classList.remove('has-transition');
          });
        });
      });

      // Manage errors
      this.swup.hooks.on('fetch:error', () => {
        console.log('--- fetch error ---');
      });

      this.swup.hooks.on('fetch:timeout', () => {
        console.log('--- fetch timeout ---');
      });

      this.swup.hooks.before('visit:end', (e) => {
        if (typeof e.fragmentVisit == 'undefined') {
          this.renderPieces(this.newContainer);
        }
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
    }
  }

  renderPieces(context) {
    renderComponents(context);
    this.emit('transition::end');
  }
}

// Register the custom element
customElements.define('c-transitions', Transitions);
