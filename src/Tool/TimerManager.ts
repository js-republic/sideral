import { SideralObject } from "./../SideralObject";

import { Timer } from "./Timer";


/**
 * A manager for all timers
 */
export class TimerManager extends SideralObject {

    /* ATTRIBUTES */

    /**
     * List of all current timers
     */
    timers: {[timerName: string]: Timer} = {};


    /* METHODS */

    /**
     * Add a new timer
     * @param name: Name of the timer
     * @param duration: Duration of the timer in ms
     * @param onComplete: Callback function when finished
     * @param options: Options to implement to the timer
     * @returns Rhe timer created
     */
    addTimer (name: string, duration: number, onComplete?: Function, options: any = {}): Timer {
        const timer = <Timer> this.add(new Timer(), {
            duration: duration,
            complete: onComplete,
            ...options
        });

        timer.name = name;

        return this.timers[name] = timer;
    }

    /**
     * Get a timer by its name
     * @param {string} name: name of the timer
     * @returns {Timer} The timer
     */
    get (name: string): Timer {
        return this.timers[name];
    }

    /**
     * Remove a timer by its name
     * @param {string} name: name of the timer
     * @returns {void}
     */
    remove (name: string): void {
        const timer = this.timers[name];

        if (timer) {
            timer.kill();
        }

        delete this.timers[name];
    }

    /**
     * Remove all timers
     */
    removeAll (): void {
        Object.keys(this.timers).forEach(key => this.timers[key] && this.timers[key].kill());

        this.timers = {};
    }

    /**
     * Check if a timer is finished or not
     * @acess public
     * @param {string} name - The name of the timer
     * @returns {boolean} The timer is finished ?
     */
    isFinished (name: string): boolean {
        const timer = this.timers[name];

        return timer ? timer.finished : true;
    }
}
