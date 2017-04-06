import AbstractModule from "./Abstract/AbstractModule";
import Shape from "./Module/Shape";
import Sprite from "./Module/Sprite";
import Game from "./Game";


export default class Entity extends AbstractModule {

    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            gravityFactor   : 1,
            vx              : 0,
            vy              : 0,
            debug           : false
        });

        this.falling    = false;
        this.standing   = false;
        this.moving     = false;
        this.scene      = null;

        this._debug     = null;

        this.bind(this.SIGNAL.VALUE_CHANGE("debug"), this._onDebugChange.bind(this)).
            bind(this.SIGNAL.UPDATE(), this.updateVelocity.bind(this));
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

        this.props.x += this.props.vx * Game.tick;
        this.props.y += this.props.vy * Game.tick;
    }


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
