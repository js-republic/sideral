export default class Game {

    /**
     * @constructor
     * @param {{}=} props: properties to the object
     */
    constructor (props) {

        /**
         * PIXI Container
         * @type {any}
         */
        this.container = PIXI.autoDetectRenderer(this.width, this.height, { autoResize: true });

        /**
         * List of all scenes
         * @readonly
         * @type {Scene}
         */
        this.children   = [];

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


        // private

        this._events = {};

        this.bind("width", this.resize);
    }

    /**
     * Start the game loop
     * @returns {void}
     */
    start () {
        if (!this.width || !this.height || !this.dom) {
            throw new Error("Engine.start: You must set 'width', 'height' and a 'dom' container");
        }

        this._update();
    }

    /**
     * Pause the current game loop
     * @returns {void}
     */
    pause () {
        this.stopped = true;
    }

    /**
     * Resume the current game loop
     * @returns {void}
     */
    resume () {
        this.stopped = false;
    }

    /**
     * resize the current canvas
     * @returns {void|null} -
     */
    resize () {
        if (!this.container) {
            return null;
        }

        this.container.resize(this.props.width, this.props.height);
    }

    /* PRIVATE */

    /**
     * Update loop
     * @param {number=} performance: performance returned by the navigator
     * @returns {void|null} -
     * @private
     */
    _update (performance) {
        if (this.stopped) {
            return null;
        }

        performance = performance || window.performance.now();
        requestAnimationFrame(this.update.bind(this));

        // 100ms latency max
        this.latency    = Math.min(performance - this.lastUpdate, 100);
        this.fps        = Math.floor(1000 / this.latency);
        this.tick       = 1000 / (this.fps * 1000);
        this.tick       = this.tick < 0 ? 0 : this.tick;

        this.children.forEach(scene => scene._update());
        this.children.forEach(scene => this.container.render(scene.container));

        this.lastUpdate = window.performance.now();
    }
}
