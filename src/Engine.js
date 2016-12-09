import Component from "./Component";
import Scene from "./Scene";


class Engine extends Component {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {*} props: properties
     */
    constructor (props) {
        super(props);

        /**
         * Width of the Engine
         * @type {number}
         */
        this.width = this.width || 50;

        /**
         * Height of the Engine
         * @type {number}
         */
        this.height = this.height || 50;

        /**
         * Global data to store
         * @type {{}}
         */
        this.storage = {};

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

        // Auto initialization
        this.initialize(null);
    }

    /**
     * @override
     */
    initialize (parent) {
        super.initialize(parent);

        // Observe width
        this.observeProp("width", (previousValue, nextValue) => {
            if (this.dom) {
                this.dom.width = nextValue;
            }

            this.scenes.forEach(scene => scene.width = nextValue);
        });

        // Observe height
        this.observeProp("height", (previousValue, nextValue) => {
            if (this.dom) {
                this.dom.height = nextValue;
            }

            this.scenes.forEach(scene => scene.height = nextValue);
        });
    }

    /**
     * Render scenes
     * @returns {void}
     */
    render () {
        this.scenes.forEach(scene => scene.render());
    }

    /* METHODS */

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
        this.render();
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
     * @override
     * @param {Component} component: component
     * @param {function=} next: function callback
     * @returns {Component} current instance
     */
    compose (component, next) {
        super.compose(component, next);

        if (component instanceof Scene) {
            component.width  = this.width;
            component.height = this.height;

            if (this.dom && component.has("canvas")) {
                component.canvas.setParentDOM(this.dom);
            }
        }

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

        this.scenes.forEach((scene) => {
            if (scene.has("canvas")) {
                scene.canvas.setParentDOM(this.dom);
            }
        });

        return this;
    }

    /* GETTERS & SETTERS */

    get name () {
        return "engine";
    }

    get scenes () {
        return this.components.filter(x => x instanceof Scene);
    }
}


export default new Engine();
