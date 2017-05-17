import Timer from "./Timer";


export default class TimerManager {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        this.timers = {};
    }

    /**
     * @update
     * @returns {void}
     */
    update () {
        Object.keys(this.timers).forEach(key => this.timers[key].update());
    }


    /* METHODS */

    /**
     * Add a new timer
     * @param {string} name: name of the timer
     * @param {number} duration: duration of the timer
     * @param {function} onComplete: callback function when finished
     * @param {*=} options: options to implement to the timer
     * @returns {Timer} the timer created
     */
    add (name, duration, onComplete, options = {}) {
        const timer = new Timer(duration, onComplete, options);

        return this.timers[name] = timer;
    }

    /**
     * Get a timer by its name
     * @param {string} name: name of the timer
     * @returns {Timer} The timer
     */
    get (name) {
        return this.timers[name];
    }

    /**
     * Remove a timer by its name
     * @param {string} name: name of the timer
     * @returns {void}
     */
    remove (name) {
        delete this.timers[name];
    }

    /**
     * Check if a timer is finished or not
     * @acess public
     * @param {string} name - The name of the timer
     * @returns {boolean} The timer is finished ?
     */
    isFinished (name) {
        const timer = this.timers[name];

        return timer ? timer.finished : true;
    }
}
