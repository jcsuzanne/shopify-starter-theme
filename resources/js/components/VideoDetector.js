import { Piece } from 'piecesjs';

const DESKTOP_QUERY = '(min-width: 1024px)';
const ROOT_MARGIN = '200px 0px';
const GESTURES = ['touchstart', 'click'];

export class VideoDetector extends Piece {
  constructor() {
    super('VideoDetector', {});
  }

  mount() {
    this.DOM = { view: this, ...this.captureTree() };
    this.$video = this.DOM.video?.[0];
    if (!this.$video) return;

    this.$video.muted = true;
    this.mode = this.dataset.mode ?? 'video-all';
    this.isInView = false;
    this.isLoaded = false;
    this.isReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    this.isWaitingGesture = false;
    this.update = this.update.bind(this);
    this.onGesture = this.onGesture.bind(this);
    this.desktopQuery = window.matchMedia(DESKTOP_QUERY);
    this.desktopQuery.addEventListener('change', this.update);

    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.isInView = entry.isIntersecting;
        this.update();
      },
      { rootMargin: ROOT_MARGIN },
    );
    this.observer.observe(this);
  }

  isActive() {
    if (this.mode == 'video-mobile') return !this.desktopQuery.matches;
    if (this.mode == 'video-desktop') return this.desktopQuery.matches;
    return true;
  }

  update() {
    if (this.isReduced || !this.isInView || !this.isActive()) {
      this.$video.pause();
      return;
    }

    this.load();
    this.$video.play().catch((error) => {
      if (error.name == 'NotAllowedError') this.waitForGesture();
    });
  }

  waitForGesture() {
    if (this.isWaitingGesture) return;
    this.isWaitingGesture = true;

    GESTURES.forEach((type) =>
      document.addEventListener(type, this.onGesture, { passive: true }),
    );
  }

  onGesture() {
    this.stopWaitingGesture();
    this.update();
  }

  stopWaitingGesture() {
    if (!this.isWaitingGesture) return;
    this.isWaitingGesture = false;

    GESTURES.forEach((type) =>
      document.removeEventListener(type, this.onGesture),
    );
  }

  load() {
    if (this.isLoaded) return;
    this.isLoaded = true;

    this.$video.querySelectorAll('source[data-src]').forEach(($source) => {
      $source.src = $source.dataset.src;
      $source.removeAttribute('data-src');
    });
    this.$video.load();
  }

  unmount() {
    this.desktopQuery?.removeEventListener('change', this.update);
    this.observer?.disconnect();
    this.stopWaitingGesture();
    this.$video?.pause();
  }
}

customElements.define('video-detector', VideoDetector);
