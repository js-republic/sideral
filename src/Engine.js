import Component from "./Component";
import PIXI from "pixi";


class Engine extends Component {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {{}=} props: properties
     */
    constructor (props) {
        super(props);

        /**
         * Pixi container
         * @type {*}
         */
        this.stage      = null;

        /**
         * Pixi renderer
         * @type {*}
         */
        this.renderer   = null;

        /**
         * Width of the engine
         * @type {number}
         */
        this.width      = 0;

        /**
         * Height of the engine
         * @type {number}
         */
        this.height     = 0;

        /**
         * Set the engine at full screen
         * @type {boolean}
         */
        this.fullScreen = false;

        /**
         * Global data to store
         * @type {{}}
         */
        this.storage    = {};

        /**
         * Dom element to render the engine
         * @readonly
         * @type {*}
         */
        this.dom        = null;

        /**
         * Time since last loop
         * @readonly
         * @type {number}
         */
        this.lastUpdate = 0;

        /**
         * Current FPS (Frames per second)
         * @readonly
         * @type {number}
         */
        this.fps        = 60;

        /**
         * Current latency between each frame (in ms)
         * @readonly
         * @type {number}
         */
        this.latency    = 0;

        /**
         * Tick of latency between each frame (in second)
         * @readonly
         * @type {number}
         */
        this.tick       = 1;

        /**
         * Check if the engine is currently looping
         * @readonly
         * @type {boolean}
         */
        this.stopped    = true;

        /**
         * Canvas as a layer
         * @readonly
         * @type {{}}
         */
        this.layers     = {};

        // Auto-initialization
        this.initialize(null);
    }

    initialize (parent) {
        super.initialize(parent);

        this.reactiveProp("fullScreen", (previousValue, nextValue) => {
            if (!previousValue && nextValue) {
                this.renderer.view.style.position   = "absolute";
                this.renderer.view.style.display    = "block";
                this.resize();

            } else if (previousValue && !nextValue) {
                this.renderer.view.style.position   = "";
                this.renderer.view.style.display    = "";
                this.resize();

            }
        });

        this.reactiveProp("width", () => this._resize());
    }

    /**
     * Update of the engine
     * @override
     * @param {number=} timeStart: time provided by the refresh frame
     * @returns {void|null} -
     */
    update (timeStart) {
        if (this.stopped) {
            return null;
        }

        timeStart = timeStart || window.performance.now();
        requestAnimationFrame(this.update.bind(this));

        // 100ms latency max
        this.latency    = Math.min(timeStart - this.lastUpdate, 100);
        this.fps        = Math.floor(1000 / this.latency);
        this.tick       = 1000 / (this.fps * 1000);

        super.update();
        this.render();

        this.lastUpdate = window.performance.now();
    }

    /* METHODS */

    /**
     * Start the engine
     * @returns {void}
     */
    start () {
        if (!this.width || !this.height || !this.dom) {
            throw new Error("Engine.start", "You must set 'width', 'height' and a 'dom' container");
        }

        this.renderer   = PIXI.autoDetectRenderer(this.width, this.height);
        this.dom.appendChild(this.renderer.view);

        this.restart();
    }

    /**
     * Stop the Engine
     * @returns {void}
     */
    stop () {
        this.stopped = true;
    }

    /**
     * Restart the Engine
     * @returns {void}
     */
    restart () {
        this.stopped = false;
        this.update();
    }

    /* PRIVATE */

    /**
     * Resize the pixi renderer
     * @private
     * @returns {void|null} -
     */
    _resize () {
        if (!this.renderer) {
            return null;
        }

        this.renderer.autoResize = true;
        this.renderer.resize(this.width, this.height);
    }

    /* GETTERS & SETTERS */

    get name () {
        return "engine";
    }
}


export default new Engine();
