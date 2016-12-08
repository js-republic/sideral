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
        const props = options.props || {};

        /**
         * Width of the scene
         * @type {number}
         */
        props.width = props.width || 10;

        /**
         * Height of the scene
         * @type {number}
         */
        props.height = props.height || 10;

        /**
         * Position of the camera
         * @type {{x: number, y: number, follow: Entity|null}}
         */
        props.camera = {x: 0, y: 0, follow: null};

        /**
         * Gravity of the scene
         * @type {number}
         */
        props.gravity = props.gravity || 0;

        /**
         * Scale of all entities behind this scene
         * @type {number}
         */
        props.scale = props.scale || 1;

        options.props = props;
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
    }

    /**
     * Initialization
     * @returns {void}
     */
    initialize () {
        super.initialize();

        this.compose(new Canvas({ width: this.width, height: this.height }));
    }

    /**
     * Update
     * @returns {void}
     */
    update () {
        super.update();

        if (this.camera.follow) {
            this.camera.x = this.camera.follow.x + (this.camera.follow.width * this.scale / 2) - (this.width / 2 / this.scale);
            this.camera.y = this.camera.follow.y + (this.camera.follow.height * this.scale / 2) - (this.height / 2 / this.scale);
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
     * @param {function=} callback: callback with entity added in parameter
     * @returns {Element} current instance
     */
    attachEntity (entity, callback) {
        if (!entity || (entity && !(entity instanceof Entity))) {
            throw new Error("Scene.attachEntity : entity must be an instance of Entity");
        }

        entity.scene = this;

        return this.attach(entity, this.entities, callback);
    }
}
