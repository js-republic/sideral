import { SideralObject } from "./../SideralObject";
import { Entity, Hitbox } from "./index";

import { ISkillSignals } from "./../Interface/";
import { Timer, TimerManager } from "./../SideralObject";
import { Enum, SignalEvent } from "./../Tool";


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
    durationType: string = Enum.DURATION_TYPE.MS;

    /**
     * Duration of the preparation
     */
    preparation: number = 0;

    /**
     * Type of duration for the preparation
     */
    preparationType: string = Enum.DURATION_TYPE.MS;

    /**
     * Duration of the reload
     */
    reload: number = 0;

    /**
     * Type of duration for the reload
     */
    reloadType: string = Enum.DURATION_TYPE.MS;

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

        this.timers = <TimerManager> this.add(new TimerManager());

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

        hitboxProps.owner   = this.owner;

        return <Hitbox> this.owner.context.scene.spawn(hitbox, x, y, Object.assign({}, hitboxProps));
    }

    /**
     * Run the skill
     * @param params - Change attributes for the run
     */
    run (params = {}): void {
        const startSkill = () => {
            Object.assign(this, params);
            this.signals.preparationComplete.dispatch();

            this.timers.addTimer("skill", this.timers.getDuration(this.duration, this.durationType, this.animation && this.owner.sprite.getAnimation(this.animation)), this._onSkillComplete.bind(this), {
                init: this.signals.skillStart.dispatch.bind(this),
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
                this.hitbox = this.addHitbox(new (this.hitboxClass)(), this.hitboxProps);
            }
        };

        this.active = true;
        this.ready  = !this.unstoppable;

        if (this.preparation) {
            this.timers.addTimer("preparation", this.timers.getDuration(this.preparation, this.preparationType), startSkill.bind(this), {
                init: this.signals.preparationStart.dispatch.bind(this),
                update: this.signals.preparationUpdate.dispatch.bind(this)
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


    /* EVENTS */

    /**
     * Skill update
     * @param tick - The current tick of the timer
     * @param value - The current value of the timer
     * @param ratio - The ratio of the Timer (from 0 to 1)
     * @param duration - The total duration of the timer
     */
    updateSkill (tick: number, value: number, ratio: number, duration: number): void {
        if (!this.movable) {
            this.owner.props.vy = this.owner.props.accelY = 0;
            this.owner.props.vx = this.owner.props.accelX = 0;
        }

        this.signals.skillUpdate.dispatch(tick, value, ratio, duration);
    }

    /**
     * When the skill is complete
     * @private
     */
    _onSkillComplete (): void {
        this.signals.skillComplete.dispatch(this);

        if (this.reload) {
            this.timers.addTimer("reload", this.timers.getDuration(this.reload, this.reloadType), () => {
                this.ready = true;
                this.signals.reloadComplete.dispatch;
            }, {
                update: this.signals.reloadUpdate.dispatch.bind(this)
            });
        }

        this.ready = !this.reload;

        if (this.hitbox) {
            this.hitbox.kill();
            this.hitbox = null;
        }
    }
}
