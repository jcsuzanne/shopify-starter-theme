import { Piece } from 'piecesjs';
import { gsap } from 'gsap';

/**
 * Example Usage:
 *
 * <c-timeline
 *   cid="fade{{ section.id }}"                                    // Unique identifier for the timeline
 *   data-scroll-item                                             // Makes element scrollable
 *   data-scroll-target="{{ section.id }}"                        // Target element for scroll trigger
 *   data-timeline-from='{"opacity":"0"}'                         // Starting animation state
 *   data-timeline-to='{"opacity":"1"}'                          // Ending animation state
 *   data-scroll-start="top 0"                                    // Scroll trigger start position
 *   data-scroll-end="bottom center"                             // Scroll trigger end position
 *   data-scroll-progress-call="progress,Timeline,fade{{ section.id }}"  // Progress callback
 *   class="">
 * </c-timeline>
 */

export class Timeline extends Piece {
  constructor() {
    super('Timeline');
  }

  mount() {
    this.condition = window.innerWidth < window.innerHeight;

    this.hasEase = typeof this.getAttribute('data-timeline-ease') == 'string';
    this.hasDuration =
      typeof this.getAttribute('data-timeline-duration') == 'string';
    this.hasCondition =
      typeof this.getAttribute('data-timeline-condition') == 'string';
    this.disabledIfCondition =
      typeof this.getAttribute('data-timeline-condition-disabled') == 'string';

    if (this.hasCondition) {
      this.on('resize', window, this.resize);
    }

    this.createTimeline();
  }

  unmount() {
    if (this.hasCondition) {
      this.off('resize', window, this.resize);
    }
  }

  createTimeline() {
    this.from = JSON.parse(this.getAttribute('data-timeline-from'));
    this.to = JSON.parse(this.getAttribute('data-timeline-to'));

    if (this.hasCondition && this.condition) {
      this.from = JSON.parse(this.getAttribute('data-timeline-from-condition'));
      this.to = JSON.parse(this.getAttribute('data-timeline-to-condition'));
    }

    this.ease = 'none';
    if (this.hasEase) {
      this.ease = this.getAttribute('data-timeline-ease');
    }

    this.duration = 1;
    if (this.hasDuration) {
      this.duration = this.getAttribute('data-timeline-duration') * 1;
    }

    this.tl = new gsap.timeline();
    this.tl.pause();
    this.tl.fromTo(
      this,
      {
        ...this.from,
      },
      {
        ...this.to,
        ease: this.ease,
        duration: this.duration,
      },
    );
  }

  progress({ progress, isReversed }) {
    console.log('progress', progress);
    let relativeProgress = progress;
    if (isReversed) relativeProgress = 1 - progress;

    if (this.tl != undefined) {
      this.tl.progress(relativeProgress);
    }
  }

  start() {
    this.tl.play();
  }

  resize() {
    let oldCondition = this.condition;

    this.condition = window.innerWidth < window.innerHeight;

    if (oldCondition != this.condition) {
      if (this.disabledIfCondition && this.condition) {
        this.tl = undefined;
      }
      if (!this.condition || (!this.disabledIfCondition && this.condition)) {
        this.tl = undefined;
        this.createTimeline();
      }
    }
  }
}

customElements.define('c-timeline', Timeline);
