import Element from "./Element";
import Scene from "./Scene";


class Engine extends Element {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {*} options: options
     */
    constructor (options) {
        super(options);

        /**
         * Name of the element
         * @readonly
         * @type {string}
         */
        this.name = "engine";

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
     * @nextCycle
     * @returns {void}
     */
    nextCycle () {
        this.scenes.forEach(scene => scene.nextCycle());
    }

    /**
     * @onPropsChanged
     * @param {*} changedProps: changed properties
     * @returns {void}
     */
    onPropsChanged (changedProps) {
        super.onPropsChanged(changedProps);

        if (changedProps.width) {
            if (this.dom) {
                this.dom.width = changedProps.width;
            }

            this.scenes.forEach(scene => {
                scene.width = changedProps.width;
            });
        }

        if (changedProps.height) {
            if (this.dom) {
                this.dom.height = changedProps.height;
            }

            this.scenes.forEach(scene => {
                scene.height = changedProps.height;
            });
        }
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
        this.nextCycle();

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

        if (this.dom && scene.isComposedOf("canvas")) {
            scene.canvas.setParentDOM(this.dom);
        }

        return this;
    }

    reorganizeCanvas () {

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

        this.scenes.forEach((scene) => {
            if (scene.isComposedOf("canvas")) {
                scene.canvas.setParentDOM(this.dom);
            }
        });

        return this;
    }
}


export default new Engine({
    width : 50,
    height: 50
});
