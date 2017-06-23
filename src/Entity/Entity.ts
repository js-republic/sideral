import { Body } from "p2";

import { SkillManager, Physic } from "./index";
import { Module, Sprite, Shape } from "./../Module";
import { IEntityProps, IPauseState, IPoint, IEntitySignal, IBodyContact } from "./../Interface/";
import { Enum, SignalEvent } from "./../Tool/";


/**
 * Module with physics
 */
export class Entity extends Module {

    /* ATTRIBUTES */

    /**
     * Signals of an Entity
     */
    signals: IEntitySignal;

    /**
     * Properties of the entity
     */
    props: IEntityProps;

    /**
     * Manager of skills of the entity
     */
    skills: SkillManager;

    /**
     * Know if the entity is currently standing or not
     * @readonly
     */
    standing: boolean = false;

    /**
     * Know if the entity is currently moving or not
     * @readonly
     */
    moving: boolean = false;

    /**
     * The Physic engine
     * @readonly
     */
    physic: Physic;

    /**
     * The sprite of the entity
     * @readonly
     */
    sprite: Sprite;

    /**
     * All contact colliding
     * @readonly
     */
    collides: Array<IBodyContact> = [];

    /**
     * If debug mode is activated
     * @private
     * @readonly
     */
    _debug: Shape;

    /**
     * The pause state if the entity is paused
     * @private
     * @readonly
     */
    _beforePauseState: IPauseState;


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            vx              : 0,
            vy              : 0,
            accelX          : 0,
            accelY          : 0,
            angle           : 0,
            gravityFactor   : 1,
            bounce          : 0,
            box             : Enum.BOX.RECTANGLE,
            type            : Enum.TYPE.SOLID,
            group           : Enum.GROUP.ALL,
            friction        : false
        });

        this.signals.beginCollision = new SignalEvent();
        this.signals.collision      = new SignalEvent();
        this.signals.endCollision   = new SignalEvent();
        this.signals.wallCollision  = new SignalEvent();

        this.skills = <SkillManager> this.add(new SkillManager());

        this.signals.propChange.bind(["width", "height"], this.onSizeChange.bind(this));
        this.signals.propChange.bind(["x", "y"], this.onPositionChange.bind(this));
        this.signals.propChange.bind("debug", this.onDebugChange.bind(this));
        this.signals.propChange.bind("bounce", () => this.physic && this.physic.setBounciness(this.props.bounce));
        this.signals.propChange.bind("angle", () => this.physic && this.physic.setAngle(this.props.angle));
    }

    /**
     * @override
     */
    initialize (props) {
        super.initialize(props);

        if (this.props.type !== Enum.TYPE.NONE) {
            this.physic = new Physic(this, this.props.x, this.props.y, this.props.width, this.props.height, this.props.type, this.props.box, {
                group           : this.props.group,
                gravityFactor   : this.props.gravityFactor
            });

            this.physic.enable();
        }

        this.onDebugChange();
    }

    /**
     * @override
     */
    kill (): void {
        super.kill();

        if (this.physic) {
            this.physic.disable();
        }
    }

    /**
     * @override
     */
    nextCycle (): void {
        super.nextCycle();

        if (this._beforePauseState) {
            return null;
        }

        if (this.physic) {
            const vel   = this.physic.getVelocity(),
                pos     = this.physic.getPosition(),
                angle   = this.physic.getAngle();

            // this.physic.setAcceleration(this.props.accelX, this.props.accelY);
            this.physic.setVelocity((this.props.vx || (!this.props.vx && !this.props.friction)) && this.props.vx, this.props.vy || null);

            this.moving = Boolean(vel.x) || !this.standing;
            this.setProps({
                x       : pos.x,
                y       : pos.y,
                angle   : angle
            });
            this.updateContainerPosition();
        }

        this.standing = Boolean(this.collides.find(collide => collide.isAbove));
    }


    /* METHODS */

    /**
     * Will pause the entity (will not be affected about gravity; collisions and velocity)
     * @access public
     * @param hide - If true, the entity will be invisible
     */
    pause (hide?: boolean): void {
        this._beforePauseState = {
            x   : this.props.x,
            y   : this.props.y,
            vx  : this.props.vx,
            vy  : this.props.vy,
            gf  : this.props.gravityFactor
        };

        if (this.physic) {
            const vel = this.physic.getVelocity();

            this._beforePauseState.bodyVx   = vel.x;
            this._beforePauseState.bodyVy   = vel.y;

            this.physic.idle(true);
            this.physic.disable();
        }

        this.setProps({
            vx  : 0,
            vy  : 0
        });

        if (hide) {
            this.props.visible = false;
        }
    }

    /**
     * Will resume the entity (to be affected about gravity, collisions and velocity)
     * @access public
     * @param visible - If true, the entity will now be visible
     */
    resume (visible?: boolean): void {
        if (!this._beforePauseState) {
            return null;
        }

        this.setProps({
            vx: this._beforePauseState.vx,
            vy: this._beforePauseState.vy,
            gravityFactor: this._beforePauseState.gf
        });

        if (this.physic) {
            this.physic.setPosition(this.props.x, this.props.y);
            this.physic.setVelocity(this._beforePauseState.bodyVx, this._beforePauseState.bodyVy);
            this.physic.setGravityFactor(this._beforePauseState.gf);
            this.physic.enable();
        }

        this._beforePauseState = null;

        if (visible) {
            this.props.visible = true;
        }
    }

    /**
     * Add a new spritesheet to the current entity
     * @param imageId - id of the image
     * @param tilewidth - width of a tile
     * @param tileheight - height of a tile
     * @param props - props to pass to the spritesheet module
     * @param index - z index position of the entity
     * @returns The current spritesheet
     */
    addSprite (imageId: string, tilewidth: number, tileheight: number, props: any = {}, index?: number): Sprite {
        props.imageId   = imageId;
        props.width      = tilewidth;
        props.height     = tileheight;

        const sprite: Sprite = this.add(new Sprite(), props, index) as Sprite;

        if (!this.sprite) {
            this.sprite = sprite;
        }

        return sprite;
    }

    /**
     * Remove all velocity from the entity
     * @param removePhysicGravity - If true and if this Entity has a Physic, it will be no longer affected by gravity
     */
    idle (removePhysicGravity: boolean = false): void {
        this.props.vx = this.props.vy = this.props.accelX = this.props.accelY = 0;

        if (this.physic) {
            this.physic.idle(removePhysicGravity);
        }
    }


    /* EVENTS */

    /**
     * When "debug" property has changed
     */
    onDebugChange (): void {
        if (this._debug) {
            this._debug.kill();
            this._debug = null;
        }

        if (this.props.debug) {
            this._debug = <Shape> this.add(new Shape(), {
                box     : this.props.box,
                width   : this.props.width,
                height  : this.props.height,
                stroke  : "#FF0000",
                fill    : "transparent"
            });
        }
    }

    /**
     * onPositionChange
     * @override
     */
    onPositionChange (): void {
        if (this.physic) {
            this.physic.setPosition(this.props.x, this.props.y);
        }
    }

    /**
     * When "width" or "height" attributes change
     */
    onSizeChange (): void {
        if (this._debug) {
            this._debug.size(this.props.width, this.props.height);
        }
    }
}
