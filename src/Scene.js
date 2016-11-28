import Element from "./Element";
import Entity from "./Entity";
import Canvas from "./components/Canvas";


export default class Scene extends Element {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        /**
         * List of entities
         * @type {Array<Entity>}
         */
        this.entities = [];

        /**
         * Gravity of the scene
         * @type {number}
         */
        this.gravity = 0;

        /**
         * Position of the camera
         * @type {{x: number, y: number}}
         */
        this.camera = {x: 0, y: 0};
    }

    /**
     * Initialization
     * @returns {void}
     */
    initialize () {
        super.initialize();

        this.compose(new Canvas(this.width(), this.height()));
    }

    /**
     * Update
     * @returns {void}
     */
    update () {
        super.update();

        this.entities.map(entity => entity.update());
    }

    /**
     * Render
     * @param {*} context: context of the canvas (created inside this function)
     * @returns {void}
     */
    render (context) {
        context = this.canvas.context;
        super.render(context);

        this.entities.map(entity => entity.render(context));
    }

    /* METHODS */

    /**
     * Attach an entity to the scene
     * @param {Entity} entity: entity to attach
     * @param {number} x: position x of entity
     * @param {number} y: position y of entity
     * @returns {Scene} current instance
     */
    attachEntity (entity, x = 0, y = 0) {
        if (!entity || (entity && !(entity instanceof Entity))) {
            throw new Error("Scene.attachEntity : entity must be an instance of Entity");
        }

        this.entities.push(entity);
        entity.x(x);
        entity.y(y);
        entity.scene = this;

        entity.initialize();

        return this;
    }

    /* GETTERS & SETTERS */

    /**
     * The name of the scene
     * @returns {string} the name
     */
    get name () {
        return "scene";
    }

    /**
     * Get or set the width
     * @param {number=} width: if exist, width will be setted
     * @returns {number} the current width
     */
    width (width) {
        if (typeof width !== "undefined") {
            if (this.isComposedOf("canvas")) {
                this.canvas.width(width);
            }
        }

        return super.width(width);
    }

    /**
     * Get or set the height
     * @param {number} height: if exist, height will be setted
     * @returns {number} the current height
     */
    height (height) {
        if (typeof height !== "undefined") {
            if (this.isComposedOf("canvas")) {
                this.canvas.height(height);
            }
        }

        return super.height(height);
    }
}
