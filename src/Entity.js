import AbstractModule from "./Abstract/AbstractModule";

import Shape from "./Module/Shape";
import Sprite from "./Module/Sprite";

import Collision from "./Command/Collision";

import Game from "./Game";


export default class Entity extends AbstractModule {

    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            gravityFactor   : 1,
            vx              : 0,
            vy              : 0,
            max             : { vx: 2000, vy: 2000 },
            bouncing        : 0,
            mass            : Entity.MASS.WEAK,
            debug           : false
        });

        this.standing   = false;
        this.moving     = false;
        this.scene      = null;
        this.collide    = {x: false, y: false};
        this.collision  = new Collision(this);

        this._debug     = null;

        this.bind(this.SIGNAL.VALUE_CHANGE("debug"), this.createAction(this._onDebugChange)).
            bind(this.SIGNAL.UPDATE(), this.createAction(this.updateVelocity));
    }


    /* METHODS */

    /**
     * Add a new spritesheet to the current entity
     * @param {string} imagePath: path to the media
     * @param {number} tilewidth: width of a tile
     * @param {number} tileheight: height of a tile
     * @param {Object=} settings: settings to pass to the spritesheet module
     * @param {number=} index: z index position of the entity
     * @returns {Object} the current spritesheet
     */
    addSprite (imagePath, tilewidth, tileheight, settings = {}, index) {
        settings.imagePath  = imagePath;
        settings.width      = tilewidth;
        settings.height     = tileheight;

        return this.add(new Sprite(), settings, index);
    }

    /**
     * Set a new velocity for the current entity
     * @param {number=} vx: velocity in x axis
     * @param {number=} vy: velocity in y axis
     * @returns {void}
     */
    velocity (vx, vy) {
        if (typeof vx !== "undefined") {
            this.props.vx = vx;
        }

        if (typeof vy !== "undefined") {
            this.props.vy = vy;
        }
    }


    /* EVENTS */

    /**
     * When "width" or "height" attributes change
     * @override
     * @returns {void}
     */
    onSizeChange () {
        if (this._debug) {
            this._debug.size(this.props.width, this.props.height);
        }
    }

    /**
     * When vx or vy attributes change
     * @returns {void}
     */
    updateVelocity () {
        const gravity = this.scene.props.gravity;

        if (gravity && !this.standing) {
            this.props.vy += gravity * this.props.gravityFactor * Game.tick;
        }

        this.props.vy   = Math.min(this.props.max.vy, Math.max(-this.props.max.vy, this.props.vy));
        this.props.vx   = Math.min(this.props.max.vx, Math.max(-this.props.max.vx, this.props.vx));
        this.moving     = this.props.vx || this.props.vy;

        if (this.collision) {
            this.collision.resolveAll();

        } else {
            this.props.x += this.props.vx * Game.tick;
            this.props.y += this.props.vy * Game.tick;

        }

        if (this.standing) {
            this.props.vy = 0;
        }
    }

    /**
     * Event triggered when the current entity enter in collision with another entity
     * @param {*} entity: target entity (instance of Sideral Entity class)
     * @returns {void}
     */
    onCollisionWith (entity) { }


    /* PRIVATE */

    /**
     * When "debug" attribute change
     * @private
     * @returns {void}
     */
    _onDebugChange () {
        if (this._debug) {
            this._debug.kill();
            this._debug = null;
        }

        if (this.props.debug) {
            this._debug = this.add(new Shape(), {
                type    : Shape.TYPE.RECTANGLE,
                width   : this.props.width,
                height  : this.props.height,
                stroke  : "#FF0000",
                fill    : "transparent"
            }, 0);
        }
    }
}

Entity.MASS = {
    NONE    : 0,
    WEAK    : 1,
    SOLID   : 2
};
