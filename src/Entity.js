import AbstractModule from "./Abstract/AbstractModule";

import Signal from "./Command/Signal";
import Body from "./Command/Body";

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
            friction        : 0,
            accelX          : 0,
            accelY          : 0,
            limit           : { vx: 2000, vy: 2000 },
            bounce          : 0,
            angle           : 0,
            flip            : false
        });

        this.name       = "entity";
        this.type       = Entity.TYPE.SOLID;
        this.box        = Entity.BOX.RECTANGLE;
        this.scene      = null;

        this.standing   = false;
        this.moving     = false;
        this.falling    = false;

        this.signals.collision      = new Signal();

        this.signals.propChange.bind("angle", this.onAngleChange.bind(this));
        this.signals.propChange.bind("bounce", this.onBounceChange.bind(this));
        this.signals.propChange.bind(["vx", "vy"], this.onVelocityChange.bind(this));
        this.signals.propChange.bind("flip", this.onFlipChange.bind(this));
        this.signals.propChange.bind("bounce", this.onBounceChange.bind(this));
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        const settings = {
            mass: this.type,
            fixedRotation: this.type === Entity.TYPE.SOLID
        };

        switch (this.type) {
        case Entity.TYPE.CIRCLE: this.body = new Body.CircularBody(this.scene, this.props.x, this.props.y, this.props.width / 2, settings);
            break;

        default: this.body = new Body.RectangularBody(this.scene, this.props.x, this.props.y, this.props.width, this.props.height, settings);
            break;
        }

        this.onSizeChange();
    }

    /**
     * @kill
     * @lifecycle
     * @override
     */
    kill () {
        super.kill();

        if (this.body) {
            this.scene.world.removeBody(this.body.box);
        }
    }

    /**
     * @nextCycle
     * @lifecycle
     * @override
     */
    nextCycle () {
        super.nextCycle();

        this.setProps({
            x       : this.body.x,
            y       : this.body.y,
            angle   : this.body.angle
        });

        if (this.body) {
            this.moving     = this.body.data.velocity[0] || this.body.data.velocity[1];
            this.standing   = this.body.data.velocity[1];
            this.falling    = this.body.data.velocity[1] < 0;
        }

        this.container.position.set(this.props.x + this.container.pivot.x, this.props.y + this.container.pivot.y);
        this.container.rotation = this.body.data.angle;
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
     * set or remove the debug mode
     * @returns {void}
     */
    toggleDebug () {
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
    }

    /**
     * Set a new type for the current entity
     * @param {number} type: type corresponding of Entity.TYPE Object
     * @returns {void}
     */
    setType (type) {
        if (Object.keys(Entity.TYPE).find(key => Entity.TYPE[key] === type)) {
            this.type = type;

            if (this.body) {
                this.body.data.mass = this.props.mass;
                this.body.data.updateMassProperties();
            }
        }
    }


    /* EVENTS */

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

        if (this.body) {
            this.body.size(this.props.width, this.props.height);
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
            this.body.data.velocity[0] = this.props.vx;
        }

        if (this.props.vy !== this.last.vy && (this.props.vy || (!this.props.vy && !this.props.gravityFactor))) {
            this.body.data.velocity[1] = this.props.vy;
        }
    }

    /**
     * When bounce property change
     * @returns {void}
     */
    onBounceChange () {
        this.scene.setEntityBouncing(this, this.props.bounce, this.last.bounce);
    }

    /**
     * When angle attribute change
     * @returns {void}
     */
    onAngleChange () {
        this.updateContainerPosition();
        this.body.angle = this.props.angle;
    }

    /**
     * When mass attribute change
     * @returns {void}
     */
    onMassChange () {
        this.body.data.mass = this.props.mass;
        this.body.data.updateMassProperties();
    }
}

Entity.TYPE = {
    GHOST   : -1,
    STATIC  : 0,
    WEAK    : 1,
    SOLID   : 2
};

Entity.BOX = {
    RECTANGLE   : "rectangle",
    CIRCLE      : "circle"
};
