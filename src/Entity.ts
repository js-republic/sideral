import { Module } from "./Module";
import { Shape, Sprite } from "./Module/";
import { IEntityProps, IPauseState, IPoint } from "./Interface";

import { Physic } from "./Module/Physic";
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
     * The physic body of the entity
     * @readonly
     */
    physic: Physic;

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
            vx              : 0,
            vy              : 0,
            accelX          : 0,
            accelY          : 0,
            angle           : 0
        });

        this.skills = <SkillManager> this.add(new SkillManager());

        this.signals.propChange.bind(["width", "height"], this.onSizeChange.bind(this));
        this.signals.propChange.bind(["x", "y"], this.onPositionChange.bind(this));
        this.signals.propChange.bind("debug", this.onDebugChange.bind(this));
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        if (this.type !== Enum.TYPE.NONE) {
            this.physic = <Physic> this.spawn(new Physic(), this.props.x, this.props.y, {
                width   : this.props.width,
                height  : this.props.height,
                owner   : this
            });

            this.context.scene.addPhysic(this.physic);
        }
    }

    /**
     * @kill
     * @lifecycle
     * @override
     */
    kill (): void {
        super.kill();

        if (this.physic) {
            this.context.scene.removePhysic(this.physic);
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

        if (this.physic) {
            const { x, y, vx, vy, angle, accelX, accelY } = this.physic.props;


            if (this.last.x !== x) {
                this.lastPos.x = this.last.x;
            }

            if (this.last.y !== y) {
                this.lastPos.y = this.last.y;
            }

            this.setProps({
                x       : x,
                y       : y,
                angle   : angle
            });

            this.moving         = Boolean(vx) || !this.standing;
            this.standing       = Boolean(this.physic.collides.find(collide => collide.isAbove));
            this.physic.props.accelX = this.props.accelX;
            this.physic.props.accelY = this.props.accelY;

            if (this.props.vx || (!this.props.vx && !this.friction)) {
                this.physic.props.vx = this.props.vx;
            }

            if (this.props.vy || (!this.props.vy && (!this.physic.props.gravityFactor || !this.context.scene.props.gravity))) {
                this.physic.props.vy = this.props.vy;
            }

            this.container.rotation = this.physic.props.angle;
            this.container.position.set(this.props.x + this.container.pivot.x, this.props.y + this.container.pivot.y);
        }
    }


    /* METHODS */

    /**
     * @override
     */
    position (x: number, y: number): void {
        super.position(x, y);

/*
        if (this.physic) {
            this.physic.props.x = this.props.x;
            this.physic.props.y = this.props.y;
        }
        */
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
            vy  : this.props.vy
        };

        if (this.physic) {
            this._beforePauseState.bodyVx   = this.physic.props.vx;
            this._beforePauseState.bodyVy   = this.physic.props.vy;
            this._beforePauseState.gf       = this.physic.props.gravityFactor;

            this.physic.idle(true);
            this.context.scene.removePhysic(this.physic);
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
            vx : this._beforePauseState.vx,
            vy : this._beforePauseState.vy,
        });

        if (this.physic) {
            this.physic.props.x     = this.props.x;
            this.physic.props.y     = this.props.y;
            this.physic.props.vx    = this._beforePauseState.bodyVx;
            this.physic.props.vy    = this._beforePauseState.bodyVy;
            this.physic.props.gravityFactor = this._beforePauseState.gf;

            this.context.scene.addPhysic(this.physic);
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
        /*
        if (this.physic) {
            this.physic.props.x = this.props.x;
            this.physic.props.y = this.props.y;
        }
        */
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
