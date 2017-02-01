/**
 * Created by christophebrochard on 25/10/2016.
 */


import Mixin from './../Mixin';
import State from './../State';


export default class Timer extends Component {
  /* LIFECYCLE */
  constructor (duration, options = {})
  {
    super();

    /**
     * Name of the component
     * @type {string}
     */
    this.name = 'timer';

    /**
     * Duration of the timer
     */
    this.duration = duration;

    /**
     * Number of time the timer must reset after complete
     */
    this.recurrence = options.recurrence;

    /**
     * If reversible, the timer will go to it's initial value after complete
     */
    this.reversible = options.reversible;

    /**
     * Event fired when initialized
     */
    this.eventInit = options.initialize;

    /**
     * Event fired when completed
     */
    this.eventComplete = options.complete;

    /**
     * Tendance value (used with reversible)
     */
    this.tendance = this.duration < 0 ? 1 : -1;

    /**
     * Current value of the timer
     */
    this.value = this.duration;

    /**
     * If true, the timer will pause
     */
    this.pause = false;

    /**
     * Setted to true if the timer is complete
     */
    this.finished = false;

    if (this.eventInit) {
      this.eventInit();
    }
  }

  /**
   * Lifecycle update : Timer mustnot have component children
   */
  update ()
  {
    if (this.pause || this.finished) {
      return null;
    }

    this.value    = this.value + this.tendance;
    let finished  = !this.value || (Math.abs(this.value) == Math.abs(this.duration));

    if (finished && this.recurrence) {
      this.recurrence--;

      if (this.reversible) {
        this.tendance = -this.tendance;

      } else {
        this.value = this.duration;

      }

    } else if (finished && !this.recurrence) {
      this.stop();

    }
  }


  /* METHODS */
  /**
   * Get value with ration (0 to 1)
   * @returns {number}
   */
  getValueRationed (reversed)
  {
    return reversed ? (this.duration - this.value) / this.duration : this.value / this.duration;
  }

  /**
   * Stop the timer, if bypassComplete is true, the event complete won't be fired
   * @param bypassComplete
   */
  stop (bypassComplete)
  {
    if (this.eventComplete && !bypassComplete) {
        this.eventComplete();
    }

    this.finished = true;
  }

  /**
   * Restart the timer with it default value
   */
  restart ()
  {
    this.value    = this.duration;
    this.tendance = this.duration < 0 ? 1 : -1;
    this.pause    = false;
    this.finished = false;
  }
}

Timer.toMs = (frame) => {
  "use strict";

  return frame / State.game.currentFps;
};