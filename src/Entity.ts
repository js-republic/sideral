import { Module } from "./Module";
import { Shape, Sprite } from "./Module/";
import { IEntityProps, IEntitySignals, IPauseState, IBodyContact, IPoint } from "./Interface";

import { Body, CircularBody, RectangularBody } from './Tool/Body';
import { SignalEvent } from "./Tool/SignalEvent";
import { Enum } from "./Tool/Enum";
import { SkillManager } from "./Tool/SkillManager";


/**
 * Module with physics
 */
export class Entity extends Module {

    /* ATTRIBUTES */

    /**
     * Properties of the entity
     */
    props: IEntityProps;

    /**
     * Signals of the entity
     */
    signals: IEntitySignals;

    /**
     * Manager of skills of the entity
     */
    skills: SkillManager;

    /**
     * The type of the entity (see Enum.TYPE)
     */
    type: number = Enum.TYPE.SOLID;

    /**
     * The kind of box of the entity (see Enum.BOX)
     */
    box: string = Enum.BOX.RECTANGLE;

    /**
     * The group of the entity (see Enum.GROUP)
     */
    group: number = Enum.GROUP.ALL;

    /**
     * If true, a friction will be added to its velocity when the entity will stop his movements
     */
    friction: boolean = false;

    /**
     * The last position of the Entity (in the last loop)
     * @readonly
     */
    lastPos: IPoint = {x: 0, y: 0};

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
     * The last bounce factor
     * @private
     */
    _bounce: number = 0;

    /**
     * Entities in collision with the current entity
     * @readonly
     */
    collides: Array<IBodyContact> = [];

    /**
     * The body of the entity
     * @readonly
     */
    body:Body;

    /**
     * The sprite of the entity
     * @readonly
     */
    sprite: Sprite;

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
            gravityFactor   : 1,
            vx              : 0,
            vy              : 0,
            accelX          : 0,
            accelY          : 0,
            angle           : 0,
            bounce          : 0
        });

        this.skills = <SkillManager> this.add(new SkillManager());

        this.signals.beginCollision = new SignalEvent();
        this.signals.collision      = new SignalEvent();
        this.signals.endCollision   = new SignalEvent();

        this.signals.propChange.bind(["width", "height"], this.onSizeChange.bind(this));
        this.signals.propChange.bind(["x", "y"], this.onPositionChange.bind(this));
        this.signals.propChange.bind("bounce", this.onBounceChange.bind(this));
        this.signals.propChange.bind("debug", this.onDebugChange.bind(this));
        this.signals.propChange.bind("gravityFactor", this.onGravityFactorChange.bind(this));
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        if (this.type === Enum.TYPE.NONE) {
            return this.onSizeChange();
        }

        const settings = {
            mass            : this.type < 0 ? 0 : this.type,
            gravityScale    : this.props.gravityFactor,
            group           : this.group,
            fixedRotation   : this.type !== Enum.TYPE.WEAK,
            angularVelocity : this.type === Enum.TYPE.WEAK ? 1 : 0
        };

        switch (this.box) {
            case Enum.BOX.CIRCLE:
                this.body = new CircularBody(this, this.props.x, this.props.y, this.props.width / 2, settings);
                break;

            default: 
                this.body = new RectangularBody(this, this.props.x, this.props.y, this.props.width, this.props.height, settings);
                break;
        }

        this.onSizeChange();
    }

    /**
     * @kill
     * @lifecycle
     * @override
     */
    kill (): void {
        super.kill();

        if (this.body && this.context.scene.world) {
            this.context.scene.world.removeBody(this.body.data);
        }
    }

    /**
     * @nextCycle
     * @lifecycle
     * @override
     */
    nextCycle (): void {
        super.nextCycle();

        if (this._beforePauseState) {
            return null;
        }

        if (this.body) {
            if (this.last.x !== this.body.x) {
                this.lastPos.x = this.last.x;
            }

            if (this.last.y !== this.body.y) {
                this.lastPos.y = this.last.y;
            }

            this.setProps({
                x: this.body.x,
                y: this.body.y
            });

            this.moving         = Boolean(this.body.data.velocity[0]) || !this.standing;
            this.standing       = Boolean(this.collides.find(collide => collide.isAbove));
            this.props.x        = this.body.x;
            this.props.y        = this.body.y;
            this.props.angle    = this.body.angle;

            this.body.data.force[0]     = this.props.accelX;
            this.body.data.force[1]     = this.props.accelY;

            if (this.props.vx || (!this.props.vx && !this.friction)) {
                this.body.vx = this.props.vx;
            }

            if (this.props.vy || (!this.props.vy && (!this.props.gravityFactor || !this.context.scene.props.gravity))) {
                this.body.vy = this.props.vy;
            }

            this.container.rotation = this.body.data.angle;

            this.container.position.set(this.props.x + this.container.pivot.x, this.props.y + this.container.pivot.y);
        }

        this.collides.forEach(collide => collide.entity && !collide.entity._beforePauseState && this.signals.collision.dispatch(collide.entity.name, collide.entity));
    }


    /* METHODS */

    /**
     * @override
     */
    position (x: number, y: number): void {
        super.position(x, y);

        if (this.body) {
            this.body.x = this.props.x;
            this.body.y = this.props.y;
        }
    }

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

        if (this.body) {
            this._beforePauseState.bodyVx         = this.body.vx;
            this._beforePauseState.bodyVy         = this.body.vy;
            this.body.vx                = 0;
            this.body.vy                = 0;
            this.body.data.gravityScale = 0;
            this.body.disable();
        }

        this.setProps({
            vx              : 0,
            vy              : 0,
            gravityFactor   : 0
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
            vx              : this._beforePauseState.vx,
            vy              : this._beforePauseState.vy,
            gravityFactor   : this._beforePauseState.gf
        });

        if (this.body) {
            this.body.x             = this.props.x;
            this.body.y             = this.props.y;
            this.body.vx            = this._beforePauseState.bodyVx;
            this.body.vy            = this._beforePauseState.bodyVy;
            this.body.data.gravityScale = this._beforePauseState.gf;
            this.body.enable();
        }

        this._beforePauseState = null;

        if (visible) {
            this.props.visible = true;
        }
    }

    /**
     * Add a new spritesheet to the current entity
     * @param imagePath - path to the media
     * @param tilewidth - width of a tile
     * @param tileheight - height of a tile
     * @param props - props to pass to the spritesheet module
     * @param index - z index position of the entity
     * @returns The current spritesheet
     */
    addSprite (imagePath: string, tilewidth: number, tileheight: number, props: any = {}, index?: number): Sprite {
        props.imagePath  = imagePath;
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
     */
    idle (): void {
        this.props.vx = this.props.vy = this.props.accelX = this.props.accelY = 0;

        if (this.body) {
            this.body.data.velocity[0] = 0;
            this.body.data.velocity[1] = 0;
            this.body.data.force[0] = 0;
            this.body.data.force[1] = 0;
        }
    }


    /* EVENTS */

    /**
     * When "bounce" attribute change
     */
    onBounceChange (): void {
        this.context.scene.setEntityBouncing(this, this.props.bounce, this.last.bounce);
    }

    /**
     * When "debug" property has change
     */
    onDebugChange (): void {
        if (this._debug) {
            this._debug.kill();
            this._debug = null;
        }

        if (this.props.debug) {
            this._debug = <Shape> this.add(new Shape(), {
                box     : this.box,
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
        if (this.body) {
            this.body.x = this.props.x;
            this.body.y = this.props.y;
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

    /**
     * When gravityFactor property change
     */
    onGravityFactorChange (): void {
        if (this.body) {
            this.body.data.gravityScale = this.props.gravityFactor;
        }
    }
}
