import Element from "../Element";
import Entity from "../Entity";
import Canvas from "../Component/Canvas";


export default class Scene extends Element {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {*} options: options
     */
    constructor (options = {}) {
        super(options);

        /**
         * Name of the element
         * @readonly
         * @type {string}
         */
        this.name = "scene";

        /**
         * List of entities
         * @type {Array<Entity>}
         */
        this.entities = [];

        /**
         * Gravity of the scene
         * @type {number}
         */
        this.gravity = options.gravity || 0;

        /**
         * Scale of all entities behind this scene
         * @type {number}
         */
        this.scale = options.scale || 1;

        /**
         * Position of the camera
         * @type {{x: number, y: number, follow: Entity|null}}
         */
        this.camera = {x: 0, y: 0, following: null};
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

        if (this.camera.follow) {
            this.camera.x = this.camera.follow.x() + (this.camera.follow.width() * this.scale / 2) - (this.width() / 2 / this.scale);
            this.camera.y = this.camera.follow.y() + (this.camera.follow.height() * this.scale / 2) - (this.height() / 2 / this.scale);
        }

        this.entities.map(entity => entity.update());
    }

    /**
     * @onPropsChanged
     * @param {*} changedProps: changed properties
     * @returns {void}
     */
    onPropsChanged (changedProps) {
        super.onPropsChanged(changedProps);

        if (this.isComposedOf("canvas")) {
            if (changedProps.width) {
                this.canvas.width = changedProps.width;
            }

            if (changedProps.height) {
                this.canvas.height = changedProps.height;
            }
        }
    }

    /**
     * Render
     * @param {*} context: context of the canvas (created inside this function)
     * @returns {void}
     */
    render (context) {
        context = this.canvas.context;
        super.render(context);

        this.entities.filter(x => x.requestRender).map(entity => entity.render(context));
    }

    /**
     * @nextCycle
     * @returns {void}
     */
    nextCycle () {
        super.nextCycle();

        this.entities.forEach(entity => entity.nextCycle());
    }

    /* METHODS */

    /**
     * Attach an entity to the scene
     * @param {Entity} entity: entity to attach
     * @returns {Scene} current instance
     */
    attachEntity (entity) {
        if (!entity || (entity && !(entity instanceof Entity))) {
            throw new Error("Scene.attachEntity : entity must be an instance of Entity");
        }

        this.entities.push(entity);
        entity.scene = this;
        entity.initialize();

        return this;
    }

    /* GETTERS & SETTERS */

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
     * @param {number=} height: if exist, height will be setted
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
