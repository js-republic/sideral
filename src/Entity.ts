import { Module } from "./Module";
import { Shape, Sprite } from "./Module/";

import { Scene } from './Scene';
import { SideralObject } from './SideralObject';
import { Body, CircularBody, RectangularBody } from './Tool/Body';
import { Signal } from "./Tool/Signal";
import { Enum } from "./Tool/Enum";
import { SkillManager } from "./Tool/SkillManager";


/**
 * Module with physics and interaction
 * @class entity
 * @extends Module
 */
export class Entity extends Module {

    name: string            = "entity";
    type: number            = Enum.TYPE.SOLID;
    box: string             = Enum.BOX.RECTANGLE;
    group: number           = Enum.GROUP.ALL;
    friction: boolean       = false;
    lastPos                 = {x: 0, y: 0};
    skills: SkillManager    = new SkillManager(this);

    standing: boolean       = false;
    moving: boolean         = false;

    _bounce    = 0;
    collides   = [];
    body:Body;
    sprite: Sprite;
    _debug: any;
    _beforePauseState: {
        x?: number;
        y?: number;
        vx?: number;
        vy?: number;
        gf?: number;
        bodyVx?: number;
        bodyVy?: number;
    };


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
            flip            : false
        });

        this.signals.beginCollision = new Signal();
        this.signals.collision      = new Signal();
        this.signals.endCollision   = new Signal();

        this.signals.propChange.bind("angle", this.onAngleChange.bind(this));
        this.signals.propChange.bind("flip", this.onFlipChange.bind(this));
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
     * @update
     * @lifecycle
     * @override
     */
    update (tick) {
        super.update(tick);

        this.skills.update(tick);
    }

    /**
     * @kill
     * @lifecycle
     * @override
     */
    kill () {
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
    nextCycle () {
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
    position (x, y) {
        super.position(x, y);

        if (this.body) {
            this.body.x = this.props.x;
            this.body.y = this.props.y;
        }
    }

    /**
     * Will pause the entity (will not be affected about gravity; collisions and velocity)
     * @access public
     * @param {boolean=} hide - If true, the entity will be invisible
     * @returns {void}
     */
    pause (hide) {
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
     * @param {boolean=} visible - If true, the entit will now be visible
     * @returns {null} -
     */
    resume (visible) {
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
     * @param {string} imagePath: path to the media
     * @param {number} tilewidth: width of a tile
     * @param {number} tileheight: height of a tile
     * @param {Object=} settings: settings to pass to the spritesheet module
     * @param {number=} index: z index position of the entity
     * @returns {Object} the current spritesheet
     */
    addSprite (imagePath: string, tilewidth: number, tileheight: number, settings: any = {}, index?): Sprite {
        settings.imagePath  = imagePath;
        settings.width      = tilewidth;
        settings.height     = tileheight;

        const sprite: Sprite = this.add(new Sprite(), settings, index) as Sprite;

        if (!this.sprite) {
            this.sprite = sprite;
        }

        return sprite;
    }

    /**
     * Remove all velocity from the entity
     * @returns {void}
     */
    idle () {
        this.props.vx = this.props.vy = this.props.accelX = this.props.accelY = 0;

        if (this.body) {
            this.body.data.velocity[0] = 0;
            this.body.data.velocity[1] = 0;
            this.body.data.force[0] = 0;
            this.body.data.force[1] = 0;
        }
    }

    /**
     * set or remove the debug mode
     * @returns {void}
     */
    toggleDebug () {
        /*
        if (this._debug) {
            this._debug.kill();
            this._debug = null;

        } else {
            this._debug = this.add(new Shape(), {
                box     : this.box,
                width   : this.props.width,
                height  : this.props.height,
                stroke  : "#FF0000",
                fill    : "transparent"
            });
        }
        */
    }

    /**
     * Set a new type for the current entity
     * @param {number} type: type corresponding of Entity.TYPE Object
     * @returns {number} the type
     */
    setType (type: number): number {
        if (Object.keys(Enum.TYPE).find(key => Enum.TYPE[key] === type)) {
            this.type = type;

            if (this.body) {
                this.body.data.mass = this.props.mass;
                this.body.data.updateMassProperties();
            }
        }

        return this.type;
    }

    /**
     * Set a new bounce factor
     * @param {number} bounceFactor: next factor of bounce
     * @returns {number} the next bounceFactor
     */
    setBounce (bounceFactor: number): number {
        this._bounce = this.context.scene.setEntityBouncing(this, bounceFactor, this._bounce);

        return this._bounce;
    }


    /* EVENTS */

    /**
     * When "debug" property has change
     * @returns {void}
     */
    onDebugChange () {
        if (this._debug) {
            this._debug.kill();
            this._debug = null;
        }

        if (this.props.debug) {
            this._debug = this.add(new Shape(), {
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
    onPositionChange () {
        super.onPositionChange();

        if (this.body) {
            this.body.x = this.props.x;
            this.body.y = this.props.y;
        }
    }

    /**
     * When "width" or "height" attributes change
     * @override
     * @returns {void}
     */
    onSizeChange () {
        super.onSizeChange();

        if (this._debug) {
            this._debug.size(this.props.width, this.props.height);
        }
    }

    /**
     * When "flip" attribute change
     * @returns {void}
     */
    onFlipChange () {
        if (this.sprite) {
            this.sprite.props.flip = this.props.flip;
        }
    }

    /**
     * When gravityFactor property change
     * @returns {void}
     */
    onGravityFactorChange () {
        if (this.body) {
            this.body.data.gravityScale = this.props.gravityFactor;
        }
    }

    /**
     * When angle attribute change
     * @returns {void}
     */
    onAngleChange () {
        this.updateContainerPosition();
        this.body.angle = this.props.angle;
    }
}
