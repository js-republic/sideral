import Component from "./Component";
import Util from "./Util";


class Engine extends Component {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name = "engine";

        /**
         * PIXI Container
         * @type {PIXI}
         * @private
         */
        this._container = PIXI.autoDetectRenderer(this.width, this.height, { autoResize: true });

        /**
         * Global data to store
         * @type {{}}
         */
        this.storage    = {};

        // read-only

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
         * Background of the engine
         * @type {string}
         */
        this.background = "#DDDDDD";

        // Auto-binding
        this._whenSizeHasChanged = this._whenSizeHasChanged.bind(this);

        // Auto-initialization
        this.initialize();
    }

    /**
     * @override
     */
    setReactivity () {
        this.reactivity.
            unbindHasChanged("x", "y").
            when("dom").change(this._onDOMChange.bind(this)).
            when("background").change(this._onBackgroundChange.bind(this));
    }

    /**
     * With Engine, there is no need to add the addChild PIXI Method
     * @override
     */
    willReceiveChild (child) { }

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
        this.tick       = this.tick < 0 ? 0 : this.tick;

        super.update();
        super.afterUpdate();
        super.render();
        super.nextCycle();

        // Render all Child
        this.children.forEach(child => this._container.render(child._container));

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

        this._resize();
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
     * @override
     */
    _whenSizeHasChanged () {
        if (!this._container) {
            return null;
        }

        this._container.resize(this.width, this.height);
    }

    /**
     * When "dom" property has changed
     * @private
     * @param {*} dom: previous value of "dom" property
     * @returns {void}
     */
    _onDOMChange ({ dom }) {
        if (dom) {
            dom.removeChild(this._container.view);
        }

        if (this.dom) {
            this.dom.appendChild(this._container.view);
        }
    }

    /**
     * When "background" property has changed
     * @private
     * @returns {void}
     */
    _onBackgroundChange () {
        const color = Util.colorToDecimal(this.background);

        if (!isNaN(color)) {
            this._container.backgroundColor = color;
        }
    }
}


PIXI.utils.skipHello();

export default new Engine();
