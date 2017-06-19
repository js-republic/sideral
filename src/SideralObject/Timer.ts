import { SideralObject } from "./../SideralObject";
import { Util } from "./../Tool";
import { ITimerProps } from "./../Interface";


/**
 * The timer object (replace window.setTimeout and window.setInterval)
 */
export class Timer extends SideralObject {

    /* ATTRIBUTES */

    /**
     * Properties of the Timer
     */
    props: ITimerProps;

    /**
     * Tendance of the value (+1 or -1)
     */
    tendance: number;

    /**
     * Current value of the timer
     */
    value: number;

    /**
     * Know if the timer is paused
     */
    pause: boolean;

    /**
     * Know if the timer is finished
     */
    finished: boolean;


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            value: 0
        });

        this.signals.propChange.bind("duration", this.onDurationChange.bind(this));
        this.signals.update.add(this.updateTimers.bind(this));
    }


    /* METHODS */

    /**
     * Get value with ration (0 to 1)
     * @param reversed - To 0 to 1 or to 1 to 0
     * @returns The value rationed
     */
    getValueRationed (reversed: boolean): number {
        return Util.limit(reversed ? (this.props.duration - this.value) / this.props.duration : this.value / this.props.duration, 0, 1);
    }

    /**
     * Stop the timer
     * @param bypassComplete - if true, the event complete won't be fired
     */
    stop (bypassComplete: boolean = false): void {
        this.finished = true;

        if (this.props.complete && !bypassComplete) {
            this.props.complete();
        }
    }

    /**
     * Restart the timer with it default value
     */
    restart (): void {
        this.value    = this.props.duration;
        this.tendance = this.props.duration < 0 ? 1 : -1;
        this.pause    = false;
        this.finished = false;
    }


    /* EVENTS */

    /**
     * update all timers
     * @returns -
     */
    updateTimers (tick): void {
        if (this.pause || this.finished || isNaN(this.value)) {
            return null;
        }

        this.value      = this.value + (tick * this.tendance * 1000);
        const finished  = this.value <= 0 || (Math.abs(this.value) >= Math.abs(this.props.duration));

        if (this.props.update) {
            this.props.update(tick, this.props.duration - this.value, this.getValueRationed(true), this.props.duration);
        }

        if (finished && this.props.recurrence) {
            this.props.recurrence--;

            if (this.props.reversible) {
                this.tendance = -this.tendance;

            } else {
                this.value = this.props.duration;

            }

            if (this.props.complete) {
                this.props.complete();
            }

        } else if (finished && !this.props.recurrence) {
            this.stop();

        }
    }

    /**
     * When "duration" property has changed
     */
    onDurationChange (): void {
        this.restart();

        if (this.props.init) {
            this.props.init();
        }
    }


    /* STATICS */

    /**
     * Convert frame to ms
     * @param frame - Number of frame
     * @param fps - Current fps (provided by the Game Object)
     * @returns number of ms
     */
    static frameToMs (frame: number, fps: number): number {
        return (frame / fps) * 1000;
    }

    /**
     * Convert ms to frame
     * @param ms - Number of milliseconds
     * @param fps - Current fps (provided by the Game object)
     * @returns Number of frames
     */
    static msToFrame (ms: number, fps: number): number {
        return (ms / 1000) * fps;
    }
}
