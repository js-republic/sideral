import AbstractModule from "./Abstract/AbstractModule";

import Signal from "./Command/Signal";
import Body from "./Command/Body";
import Enum from "./Command/Enum"

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
            angle           : 0,
            flip            : false
        });

        this.name       = "entity";
        this.type       = Enum.TYPE.SOLID;
        this.box        = Enum.BOX.RECTANGLE;
        this.group      = Enum.GROUP.ALL;
        this.scene      = null;

        this.standing   = false;
        this.moving     = false;

        this._bounce    = 0;
        this._standing  = false;

        this.signals.collision      = new Signal();
        this.signals.endCollision   = new Signal();

        this.signals.propChange.bind("angle", this.onAngleChange.bind(this));
        this.signals.propChange.bind("flip", this.onFlipChange.bind(this));
        this.signals.propChange.bind("gravityFactor", this.onGravityFactorChange.bind(this));
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        const settings = {
            mass            : this.type,
            gravityScale    : this.props.gravityFactor,
            group           : this.group,
            fixedRotation   : this.type === Enum.TYPE.SOLID,
            angularVelocity : this.type === Enum.TYPE.WEAK ? 1 : 0
        };

        switch (this.box) {
        case Enum.BOX.CIRCLE: this.body = new Body.CircularBody(this.scene, this.props.x, this.props.y, this.props.width / 2, settings);
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
        const lastVx = this.last.vx;

        super.nextCycle();

        this.setProps({
            x       : this.body.x,
            y       : this.body.y,
            angle   : this.body.angle
        });

        if (this.props.playerLeft) {
            // console.log(this._standing, this.standing);
        }

        if (this.body) {
            // this.standing   = this._standing || !Math.ceil(this.body.data.velocity[1]);
            this.moving     = Boolean(this.body.data.velocity[0]) || !this.standing;
            // this.standing   = this._standing === null ? this.standing : this._standing;
            this._standing  = false;

            this.body.data.force[0]     = this.props.accelX;
            this.body.data.force[1]     = this.props.accelY;

            if (!(lastVx === this.props.vx && !this.props.vx)) {
                this.body.data.velocity[0] = this.props.vx;
            }

            if (this.props.vy || (!this.props.vy && (!this.props.gravityFactor || !this.scene.props.gravity))) {
                this.body.data.velocity[1] = this.props.vy;
            }
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

        const sprite = this.add(new Sprite(), settings, index);

        if (!this.sprite) {
            this.sprite = sprite;
        }

        return sprite;
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
     * @returns {number} the type
     */
    setType (type) {
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
    setBounce (bounceFactor) {
        this._bounce = this.scene.setEntityBouncing(this, bounceFactor, this._bounce);

        return this._bounce;
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
