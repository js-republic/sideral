import { SideralObject } from "./../SideralObject";

import { ISkillSignals } from "./../Interface";

import { Enum } from "./Enum";
import { Timer } from "./Timer";
import { TimerManager } from "./TimerManager";
import { SignalEvent } from "./SignalEvent";
import { Entity } from '../Entity';
import { Hitbox } from '../Entity/Hitbox';


/**
 * The skill algorithm
 */
export class Skill extends SideralObject {

    /* ATTRIBUTES */

    /**
     * Owner of the skill
     */
    owner: Entity;

    /**
     * Signals emitted by the Skill
     */
    signals: ISkillSignals;

    /**
     * Name of the animation of the owner
     */
    animation: string;

    /**
     * The class of the hitbox to run when the skill is started (optional)
     */
    hitboxClass: typeof Hitbox;

    /**
     * Props of the Hitbox Class
     */
    hitboxProps: any = {};

    /**
     * The hitbox instanciated (if hitboxClass is provided)
     */
    hitbox: Hitbox;

    /**
     * Duration of the skill
     */
    duration: number = 0;

    /**
     * Type of duration
     */
    durationType: string = Enum.DURATION_TYPE.FRAME;

    /**
     * Duration of the preparation
     */
    preparation: number = 0;

    /**
     * Type of duration for the preparation
     */
    preparationType: string = Enum.DURATION_TYPE.FRAME;

    /**
     * Duration of the reload
     */
    reload: number = 0;

    /**
     * Type of duration for the reload
     * @type {string}
     */
    reloadType: string = Enum.DURATION_TYPE.FRAME;

    /**
     * If true, the skill cannot be stopable
     */
    unstoppable: boolean = true;

    /**
     * If true, the owner willnot move during the skill
     */
    movable: boolean = true;

    /**
     * Timer manager
     */
    timers: TimerManager;

    /**
     * Know if the skill is currently active or not
     * @readonly
     */
    active: boolean = false;

    /**
     * Know if the skill is ready to launch
     * @readonly
     */
    ready: boolean = true;


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.signals.preparationStart    = new SignalEvent();
        this.signals.preparationUpdate   = new SignalEvent();
        this.signals.preparationComplete = new SignalEvent();
        this.signals.skillStart          = new SignalEvent();
        this.signals.skillUpdate         = new SignalEvent();
        this.signals.skillComplete       = new SignalEvent();
        this.signals.reloadStart         = new SignalEvent();
        this.signals.reloadUpdate        = new SignalEvent();
        this.signals.reloadComplete      = new SignalEvent();
    }


    /* METHODS */

    /**
     * Instanciate a hitbox item during the time of the skill
     * @param hitbox - The hitbox to add
     * @param hitboxProps - The props to transmit to the hitbox instance
     * @returns The hitbox instance
     */
    addHitbox (hitbox: Hitbox, hitboxProps: any = {}): Hitbox {
        let x  = typeof hitboxProps.x === "undefined" ? this.owner.props.x : hitboxProps.x,
            y  = typeof hitboxProps.y === "undefined" ? this.owner.props.y : hitboxProps.y;

        delete hitboxProps.x;
        delete hitboxProps.y;

        return <Hitbox> this.owner.context.scene.spawn(hitbox, x, y, Object.assign({}, hitboxProps));
    }

    /**
     * Run the skill
     * @param params - Change attributes for the run
     */
    run (params = {}): void {
        const startSkill = () => {
            Object.assign(this, params);
            this.signals.preparationComplete.dispatch(this.name);

            this.timers.addTimer("skill", this.getTimerDuration(this.duration, this.durationType), this.onSkillComplete.bind(this), {
                init: (value, ratio, duration) => this.signals.skillStart.dispatch(this.name, value, ratio, duration),
                update: this.updateSkill.bind(this)
            });

            if (this.animation) {
                try {
                    this.owner.sprite.setAnimation(this.animation, true);

                } catch (e) {
                    throw Error(e);

                }
            }

            if (this.hitboxClass) {
                this.hitbox = this.addHitbox(new this.hitboxClass(), this.hitboxProps);
            }
        };

        this.active = true;
        this.ready  = !this.unstoppable;

        if (this.preparation) {
            this.timers.addTimer("preparation", this.getTimerDuration(this.preparation, this.preparationType), startSkill.bind(this), {
                init: (value, ratio, duration) => this.signals.preparationStart.dispatch(this.name, value, ratio, duration),
                update: (value, ratio, duration) => this.signals.preparationUpdate.dispatch(this.name, value, ratio, duration)
            });

       } else {
            startSkill();
       }
    }

    /**
     * Stop the skill
     */
    stop (): void {
        this.active = false;
        this.timers.removeAll();
    }

    /**
     * Get correct timer in ms
     * @param duration: initial duration of the timer
     * @param durationType: the type of duration
     * @returns The duration in ms
     */
    getTimerDuration (duration, durationType): number {
        let ms = duration;

        switch (durationType) {
            case Enum.DURATION_TYPE.ANIMATION_LOOP:
                const animation = this.owner.sprite.getAnimation(this.animation);

                ms = animation.duration * duration * animation.frames.length;
                break;

            case Enum.DURATION_TYPE.FRAME: ms = Timer.frameToMs(duration, this.owner.context.game.fps);
                break;
        }

        return ms;
    }


    /* EVENTS */

    /**
     * Skill update
     * @param value - The current value of the timer
     * @param ratio - The ratio of the Timer (from 0 to 1)
     * @param duration - The total duration of the timer
     */
    updateSkill (value: number, ratio: number, duration: number): void {
        if (!this.movable) {
            this.owner.props.vy = this.owner.props.accelY = 0;
            this.owner.props.vx = this.owner.props.accelX = 0;
        }

        this.signals.skillUpdate.dispatch(this.name, value, ratio, duration);
    }

    /**
     * When the skill is complete
     */
    onSkillComplete (): void {
        this.signals.skillComplete.dispatch(this);

        if (this.reload) {
            this.timers.addTimer("reload", this.getTimerDuration(this.reload, this.reloadType), () => {
                this.ready = true;
                this.signals.reloadComplete.dispatch(this.name);
            }, {
                update: (value, ratio, duration) => this.signals.reloadUpdate.dispatch(this.name, value, ratio, duration)
            });
        }

        this.ready = !this.reload;

        if (this.hitbox) {
            this.hitbox.kill();
            this.hitbox = null;
        }
    }
}
