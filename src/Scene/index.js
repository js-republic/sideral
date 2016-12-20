import ComponentViewable from "./../ComponentViewable";
import Entity from "./../Entity";
import Canvas from "./../Component/Canvas";


export default class Scene extends ComponentViewable {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {*} props: properties
     */
    constructor (props) {
        super(props);

        /**
         * Gravity of the scene
         * @type {number}
         */
        this.gravity = this.gravity || 0;

        /**
         * Scale of all entities behind this scene
         * @type {number}
         */
        this.scale = this.scale || 1;

        /**
         * Position of the camera
         * @type {{x: number, y: number, follow: Entity|null}}
         */
        this.camera = {x: 0, y: 0, follow: null};

        /**
         * List of componentViewable needing to be render
         * @type {{}}
         */
        this.renderRequested = {};
    }

    /**
     * @override
     */
    initialize (parent) {
        super.initialize(parent);

        this.compose(new Canvas({ width: this.width, height: this.height }));

        // Observe prop width
        this.observeProp("width", (previousValue, nextValue) => {
            this.canvas.width = nextValue;
        });

        // Observe prop height
        this.observeProp("height", (previousValue, nextValue) => {
            this.canvas.height = nextValue;
        });

        // Observe prop for scale and update it at next cycle
        this.observeProp("scale");
    }

    /**
     * @override
     */
    update () {
        super.update();

        if (this.camera.follow) {
            this.camera.x = this.camera.follow.x + (this.camera.follow.width * this.scale / 2) - (this.width / 2 / this.scale);
            this.camera.y = this.camera.follow.y + (this.camera.follow.height * this.scale / 2) - (this.height / 2 / this.scale);
        }
    }

    /**
     * @override
     */
    render (context) {
        context = this.canvas.context;

        this.components.forEach((component) => {
            if (this.renderRequested[component.id] && component.render) {
                component.render(context);
                delete this.renderRequested[component.id];
            }
        });

        return context;
    }

    /**
     * @override
     */
    nextCycle () {
        this.hasChanged("scale", (previousValue, nextValue) => {
            if (this.has("canvas")) {
                this.canvas.context.scale(nextValue / previousValue, nextValue / previousValue);
            }
        });

        super.nextCycle();
    }

    /* METHODS */

    /**
     * @override
     */
    compose (component, next) {
        if (component && component instanceof Entity) {
            component.scene                     = this;
            this.renderRequested[component.id]  = true;
        }

        return super.compose(component, next);
    }

    /* GETTERS & SETTERS */

    get name () {
        return "scene";
    }

    get entities () {
        return this.components.filter(x => x instanceof Entity);
    }
}
