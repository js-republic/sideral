import Engine from "../Engine";
import Component from "./index";


export default class Timer extends Component {

    /* LIFECYCLE */
    /**
     * Timer constructor
     * @param {*} options: options to be binded to timer
     */
    constructor (options = {}) {

        /**
         * Duration of the timer
         * @type {number}
         */
        options.duration = options.duration || 0;

        /**
         * Number of time the timer must reset after complete
         * @type {number}
         */
        options.recurrence = options.recurrence || 0;

        /**
         * If reversible, the timer will go t o it's initial value after complete
         * @type {boolean}
         */
        options.reversible = Boolean(options.reversible);

        /**
         * Event fired when initialize
         * @type {function}
         */
        options.eventInit  = options.eventInit || null;

        /**
         * Event fired when completed
         * @type {function}
         */
        options.eventComplete = options.eventComplete || null;

        super(options);

        /**
         * Name of the component
         * @type {string}
         */
        this.name = "timer";

        /**
         * Tendance value (used with reversible)
         * @type {number}
         */
        this.tendance = this.duration < 0 ? 1 : -1;

        /**
         * Current value of the timer
         * @type {number}
         */
        this.value = this.duration;

        /**
         * If true, the timer will pause
         * @type {boolean}
         */
        this.pause = false;

        /**
         * Setted to true if the timer is complete
         * @type {boolean}
         */
        this.finished = false;
    }

    /**
     * Initialization
     * @returns {void}
     */
    initialize () {
        super.initialize();

        if (this.eventInit) {
            this.eventInit();
        }
    }

    /**
     * Update
     * @returns {void|null} null
     */
    update () {
        if (this.pause || this.finished) {
            return null;
        }

        this.value      = this.value + this.tendance;
        const finished  = !this.value || (Math.abs(this.value) === Math.abs(this.duration));

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
     * @param {boolean=} reversed: reverse the ration (from 0 to 1 or from 1 to 0)
     * @returns {number} the value rationed
     */
    getValueRationed (reversed) {
        return reversed ? (this.duration - this.value) / this.duration : this.value / this.duration;
    }

    /**
     * Stop the timer
     * @param {boolean} avoidCompleteEvent: if true, the event complete won't be fired
     * @returns {void}
     */
    stop (avoidCompleteEvent = false) {
        if (this.eventComplete && !avoidCompleteEvent) {
            this.eventComplete();
        }

        this.finished = true;
    }

    /**
     * Restart the timer with its default values
     * @returns {void}
     */
    restart () {
        this.value      = this.duration;
        this.tendance   = this.duration < 0 ? 1 : -1;
        this.pause      = false;
        this.finished   = false;
    }

    /* STATIC */

    /**
     * convert a number of frame into ms (with latency)
     * @param {number} frame: number of frame to convert to ms
     * @returns {number} frame converted to ms
     */
    static toMs (frame) {
        return frame / Engine.fps;
    }
}
