import { Piece } from 'piecesjs';
import { body, html } from '../utils/environment';
import { gsap } from 'gsap';
import Swup from 'swup';
import SwupParallelPlugin from '@swup/parallel-plugin';
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
        new SwupParallelPlugin(),
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
      gsap.delayedCall(0.3, () => {
        html.classList.remove('is-loading');
      });
    });

    this.swup.hooks.on('content:insert', (visit, { containers }) => {
      // console.log('------ content::insert');

      html.classList.add('has-transition');
      html.classList.remove('has-dom-ready');
      html.classList.remove('has-dom-ready-callback');
      html.classList.remove('has-dom-animated');

      for (const { next, remove } of containers) {
        this.newContainer = next;
        this.newContainer.classList.add('is-next-container');

        // Update components in the new samePage
        updateComponents(this.newContainer);
      }
    });

    this.swup.hooks.before('content:remove', (visit, { containers }) => {
      console.log('------ content::remove');

      html.classList.remove('is-loading');
      this.newContainer.classList.remove('is-next-container');

      gsap.delayedCall(window.readyDelay, () => {
        html.classList.add('has-dom-ready');

        body.setAttribute(
          'data-template',
          this.newContainer.getAttribute('data-template'),
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
      this.$('[data-swup-container]')[0].getAttribute('data-template'),
    );
  }
}

// Register the custom element
customElements.define('c-transitions', Transitions);
