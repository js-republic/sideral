export class Timer {
    duration: number;
    recurrence: number;
    reversible: boolean;
    eventInit: () => void;
    eventComplete: () => void;
    eventUpdate: (timeLeft: number, ratio: number, duration: number) => any;
    tendance: number;
    value: number;
    pause: boolean;
    finished: boolean;

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {number} duration: duration of the timer
     * @param {function} onComplete: callback function when finished
     * @param {*=} options: options to implement to the timer
     */
    constructor (duration: number, onComplete, options: any = {}) {

        /**
         * Duration of the timer
         * @type {number}
         */
        this.duration = duration * 0.001;

        /**
         * Number of time the timer must reset after complete
         * @type {number}
         */
        this.recurrence = options.recurrence;

        /**
         * If reversible, the timer will go to it's initial value after complete
         * @type {boolean}
         */
        this.reversible = options.reversible;

        /**
         * Event fired when initialized
         * @type {function}
         */
        this.eventInit = options.init;

        /**
         * Event fired when completed
         * @type {function}
         */
        this.eventComplete = onComplete;

        /**
         * Event fired when updating
         * @type {function}
         */
        this.eventUpdate    = options.onUpdate;

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

        if (this.eventInit) {
            this.eventInit();
        }
    }

    /**
     * update timer
     * @returns {void|null} -
     */
    update (tick) {
        if (this.pause || this.finished) {
            return null;
        }

        this.value      = this.value + (tick * this.tendance);
        const finished  = !this.value || (Math.abs(this.value) >= Math.abs(this.duration));

        if (this.eventUpdate) {
            this.eventUpdate(this.duration - this.value, this.getValueRationed(true), this.duration);
        }

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
     * @param {boolean=} reversed: to 0 to 1 or to 1 to 0
     * @returns {number} the value rationed
     */
    getValueRationed (reversed: boolean): number {
        return reversed ? (this.duration - this.value) / this.duration : this.value / this.duration;
    }

    /**
     * Stop the timer, if bypassComplete is true, the event complete won't be fired
     * @param {boolean=} bypassComplete: bypass the complete event or not
     * @returns {void}
     */
    stop (bypassComplete: boolean = false) {
        this.finished = true;

        if (this.eventComplete && !bypassComplete) {
            this.eventComplete();
        }
    }

    /**
     * Restart the timer with it default value
     * @returns {void}
     */
    restart () {
        this.value    = this.duration;
        this.tendance = this.duration < 0 ? 1 : -1;
        this.pause    = false;
        this.finished = false;
    }

    /**
     * Convert frame to ms
     * @param {number} frame - Number of frame
     * @param {number} fps - Current fps (provided by the Game Object)
     * @returns {number} number of ms
     */
    static frameToMs (frame, fps) {
        return (frame / fps) * 1000;
    }

    /**
     * Convert ms to frame
     * @param {number} ms - Number of milliseconds
     * @param {number} fps - Current fps (provided by the Game object)
     * @returns {number} Number of frames
     */
    static msToFrame (ms, fps) {
        return (ms / 1000) * fps;
    }
}
