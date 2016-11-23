import Element from "./Element";
import Scene from "./Scene";


class Engine extends Element {

    /* LIFECYCLE */
    constructor () {
        super();

        /**
         * Global data to store
         * @type {{}}
         */
        this.storage = {};

        /**
         * List of scenes attached to engine
         * @type {Array}
         */
        this.scenes = [];

        /**
         * Time since last update
         * @type {number}
         */
        this.lastUpdate = 0;

        /**
         * Current FPS (Frames per second)
         * @type {number}
         */
        this.fps = 60;

        /**
         * Current latence between each frame (in ms)
         * @type {number}
         */
        this.latence = 0;

        /**
         * Current latence between each frame (in second)
         * @type {number}
         */
        this.tick = 0;

        /**
         * DOM of the engine
         * @type {null}
         */
        this.dom = null;

        /**
         * Stop the run
         * @type {boolean}
         */
        this.stopped = false;
    }

    /**
     * Run the engine
     * @param {number=} timeStart: time sended by requestAnimationFrame
     * @returns {void|null} null
     */
    run (timeStart) {
        if (this.stopped) {
            return null;
        }

        timeStart = timeStart || window.performance.now();
        requestAnimationFrame(this.run.bind(this));

        // 100ms latence max
        this.latence    = Math.min(timeStart - this.lastUpdate, 100);
        this.fps        = Math.floor(1000 / this.latence);
        this.tick       = 1000 / (this.fps * 1000);

        this.scenes.map(scene => scene.update());
        this.scenes.map(scene => scene.render());

        this.lastUpdate = window.performance.now();
    }

    /**
     * Stop the loop
     * @returns {void}
     */
    stop () {
        this.stopped    = true;
        this.tick       = 0;
    }

    /**
     * Restart the loop
     * @returns {void}
     */
    restart () {
        this.stopped    = false;
        this.run();
    }

    /**
     * Attach a scene to current engine
     * @param {*} scene: the scene to attach to the engine
     * @returns {Engine} the current engine
     */
    attachScene (scene) {
        if (!scene || (scene && !(scene instanceof Scene))) {
            throw new Error("Engine.attachScene : scene must be an instance of Scene.");
        }

        this.scenes.push(scene);
        scene.initialize();

        return this;
    }

    /**
     * Attach a dom to the parent dom passed by parameter
     * @param {*} parentDOM: the dom to attach the engine
     * @returns {Engine} : the current Engine
     */
    attachDOM (parentDOM) {
        if (!parentDOM) {
            throw new Error("Engine.initialize : dom must be passed to parameters and must be valid.");
        }

        if (!this.dom) {
            this.dom                = document.createElement("div");
            this.dom.id             = this.id;
            this.dom.className      = "sideral-engine";
            this.dom.style.position = "relative";
        }

        parentDOM.appendChild(this.dom);

        return this;
    }


    /* GETTERS & SETTERS */

    /**
     * The name of the engine
     * @returns {string} the name
     */
    get name () {
        return "engine";
    }

    /**
     * get only width from size
     * @returns {number} width of engine
     */
    get width () {
        return this.size.width;
    }

    /**
     * Get only height from size
     * @returns {number} height of engine
     */
    get height () {
        return this.size.height;
    }

    /**
     * set only width from size
     * @param {number} width: the new width of the engine
     */
    set width (width) {
        super.width     = width;

        if (this.dom) {
            this.dom.width  = width;
        }

        this.scenes.map((scene) => {
            scene.width = width;

            return null;
        });
    }

    /**
     * Set only height from size
     * @param {number} height: the new height of the engine
     */
    set height (height) {
        super.height     = height;

        if (this.dom) {
            this.dom.height = height;
        }

        this.scenes.map((scene) => {
            scene.height = height;

            return null;
        });
    }
}


export default new Engine();
