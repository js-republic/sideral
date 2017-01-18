import Component from "./Component";


export default class Entity extends Component {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        /**
         * position X
         * @type {number}
         */
        this.x              = 0;

        /**
         * Position Y
         * @type {number}
         */
        this.y              = 0;

        /**
         * Width of the entity
         * @type {number}
         */
        this.width          = 0;

        /**
         * Height of the entity
         * @type {number}
         */
        this.height         = 0;

        /**
         * Mass of the entity (collision)
         * @type {number}
         */
        this.mass           = null;

        /**
         * Factor of gravity provided by the scene
         * @type {number}
         */
        this.gravityFactor  = 0;

        // read-only

        /**
         * Know if the entity is currently falling
         * @readonly
         * @type {boolean}
         */
        this.falling    = false;

        /**
         * Know if the entity is standing on the ground (or over an other entity)
         * @readonly
         * @type {boolean}
         */
        this.standing   = false;

        // private

        this._debug     = null;
    }

    /**
     * @override
     */
    setReactiveProps () {
        // debug mode
        this.reactiveProp("debug", () => {
            if (this.debug) {
                this._setDebugMode();

            } else if (this._debug) {
                this.parent.stage.removeChild(this._debug);
                this._debug = null;

            }
        });

        // position x
        this.reactiveProp("x", () => {
            if (this._debug) {
                this._debug.position.x = this.x;
            }
        });

        // position y
        this.reactiveProp("y", () => {
            if (this._debug) {
                this._debug.position.y = this.y;
            }
        });

        // width
        this.reactiveProp("width", () => {
            if (this._debug) {
                this._debug.width = this.width;
            }
        });

        // height
        this.reactiveProp("height", () => {
            if (this._debug) {
                this._debug.height = this.height;
            }
        });
    }

    /**
     * @render
     * @returns {void|null} -
     */
    render () {
        if (!this.parent) {
            return null;
        }

        super.render();
    }

    /* PRIVATE */

    /**
     * set the debug graphics
     * @private
     * @returns {void}
     */
    _setDebugMode () {
        this._debug = new PIXI.Graphics();

        this._debug.lineStyle(1, 0xFF3300, 1);
        this._debug.beginFill(0, 0);
        this._debug.drawRect(0, 0, this.width, this.height);
        this._debug.endFill();

        this.parent.stage.addChild(this._debug);
    }
}
