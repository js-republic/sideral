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
        this.tick = 1;

        /**
         * DOM of the engine
         * @type {null}
         */
        this.dom = null;

        /**
         * Stop the run
         * @type {boolean}
         * @readonly
         */
        this.stopped = false;
    }

    /**
     * Update
     * @returns {void}
     */
    update () {
        super.update();

        this.scenes.map(scene => scene.update());
    }

    /**
     * Render
     * @param {*=} context: canvas render (Engine has no context, it's only for overriding)
     * @returns {void}
     */
    render (context) {
        super.render(context);

        this.scenes.map(scene => scene.render(context));
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

        this.update();
        this.render(null);

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

        scene.width(this.width());
        scene.height(this.height());

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
     * Get or set the width
     * @param {number=} width: if exist, width will be setted
     * @returns {number} the current width
     */
    width (width) {
        if (typeof width !== "undefined") {
            if (this.dom) {
                this.dom.width = width;
            }

            this.scenes.forEach((scene) => {
                scene.width(width);
            });
        }

        return super.width(width);
    }

    /**
     * Get or set the height
     * @param {number=} height: if exist, height will be setted
     * @returns {number} the current height
     */
    height (height) {
        if (typeof height !== "undefined") {
            if (this.dom) {
                this.dom.height = height;
            }

            this.scenes.forEach((scene) => {
                scene.height(height);
            });
        }

        return super.height(height);
    }
}


export default new Engine();
