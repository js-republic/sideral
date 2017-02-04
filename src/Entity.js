import Component from "./Component";
import Scene from "./Scene";


export default class Entity extends Component {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name = "entity";

        this._container = new PIXI.DisplayObject();

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
        this.falling        = false;

        /**
         * Know if the entity is standing on the ground (or over an other entity)
         * @readonly
         * @type {boolean}
         */
        this.standing       = false;
    }

    /**
     * @override
     */
    setReactivity () {
        super.setReactivity();
    }

    /* METHODS */

    /**
     * Find the first Scene into parent hierarchy
     * @param {function=} callback: callback when the scene has been finded
     * @param {*=} recursive: recursive object to get scene
     * @returns {void}
     */
    getScene (callback, recursive) {
        recursive = recursive || this;

        if (recursive.parent) {

            if (recursive.parent instanceof Scene) {
                callback(recursive.parent);

            } else {
                this.getScene(callback, recursive);

            }
        }
    }

    /* PRIVATE */

    /**
     * @override
     * @private
     */
    _onPositionChange ({ x, y, ...options }) {
        super._onPositionChange({ x, y, ...options });

        const isX   = typeof x !== "undefined",
            isY     = typeof y !== "undefined";

        if (isX || isY) {

            this.getScene(scene => {
                const nextValue = isX
                    ? scene.getLogicXAt(x, this.x, this.y, this.y + this.height, this.width)
                    : scene.getLogicYAt(y, this.y, this.x, this.x + this.width, this.height);

                if (isY && this.y !== nextValue) {
                    this.y = nextValue;
                }

                if (isX && this.x !== nextValue) {
                    this.x = nextValue;
                }
/*
                if (this[name] !== nextValue) {
                    this[name] = nextValue;
                }*/
            });
        }
    }
}
