import p2 from "p2";

import AbstractModule from "./Abstract/AbstractModule";

import Util from "./Command/Util";

import Shape from "./Module/Shape";
import Sprite from "./Module/Sprite";


export default class Entity extends AbstractModule {

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
            fricX           : 0,
            fricY           : 0,
            accelX          : 0,
            accelY          : 0,
            limit           : { vx: 2000, vy: 2000 },
            bouncing        : 0,
            angle           : 0,
            mass            : Entity.MASS.WEAK,
            debug           : false,
            flip            : false
        });

        this.standing   = false;
        this.moving     = false;
        this.scene      = null;
        this.collide    = {x: false, y: false};
        this.bodyShape  = new p2.Box({ width: this.props.width, height: this.props.height });
        this.body       = new p2.Body({ mass: this.props.mass, position: [this.props.x + (this.props.width / 2), this.props.y + (this.props.height / 2)] });

        this.body.addShape(this.bodyShape);

        this._debug     = null;

        this.signals.propChange.bind("debug", this._onDebugChange.bind(this));
        this.signals.propChange.bind("angle", this.onAngleChange.bind(this));
        this.signals.propChange.bind("mass", this.onMassChange.bind(this));
        this.signals.propChange.bind(["vx", "vy"], this.onVelocityChange.bind(this));
        this.signals.propChange.bind("flip", this.onFlipChange.bind(this));
        this.signals.update.add(this.updateVelocity.bind(this));
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        if (this.body) {
            this.body.position = [this.props.x + (this.props.width / 2), this.props.y + (this.props.height / 2)];
            this.onSizeChange();
        }
    }

    /**
     * @kill
     * @lifecycle
     * @override
     */
    kill () {
        super.kill();

        if (this.body) {
            this.scene.world.removeBody(this.body);
        }
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


    /* UPDATES */

    /**
     * When vx or vy attributes change
     * @returns {void}
     */
    updateVelocity () {
        this.props.x        = this.body.position[0] - (this.props.width / 2);
        this.props.y        = this.body.position[1] - (this.props.height / 2);
        this.props.angle    = Util.toDegree(this.body.angle);
    }


    /* EVENTS */

    /**
     * When "width" or "height" attributes change
     * @override
     * @returns {void}
     */
    onSizeChange () {

        /*
        this.container.pivot.x = this.props.width / 2;
        this.container.pivot.y = this.props.height / 2;
        */

        if (this._debug) {
            this._debug.size(this.props.width, this.props.height);
        }

        if (this.bodyShape) {
            this.bodyShape.width    = this.props.width;
            this.bodyShape.height   = this.props.height;
        }
    }

    /**
     * When "flip" attribute change
     * @returns {void}
     */
    onFlipChange () {
        if (this.spritesheet) {
            this.spritesheet.props.flip = this.props.flip;
        }
    }

    /**
     * When "vx" or "vy" attributes change
     * @returns {void}
     */
    onVelocityChange () {
        if (this.props.vx !== this.last.vx) {
            // this.body.velocity[0] = this.props.vx;
        }

        if (this.props.vy !== this.last.vy) {
            // this.body.velocity[1] = this.props.vy;
        }
    }

    /**
     * Event triggered when the current entity enter in collision with another entity
     * @param {*} entity: target entity (instance of Sideral Entity class)
     * @returns {void}
     */
    onCollisionWith (entity) {

    }

    /**
     * When angle attribute change
     * @returns {void}
     */
    onAngleChange () {
        this.container.rotation = Util.toRadians(this.props.angle);
    }

    /**
     * When mass attribute change
     * @returns {void}
     */
    onMassChange () {
        this.body.mass = this.props.mass;
        this.body.updateMassProperties();
    }

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
            });
        }
    }
}

Entity.MASS = {
    NONE    : 0,
    SOLID   : 1,
    WEAK    : 2
};
