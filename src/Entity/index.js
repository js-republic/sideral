import Element from "./../Element";
import Engine from "./../Engine";


export default class Entity extends Element {

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
        this.name = "entity";

        /**
         * Show more information about entity on screen
         * @type {boolean}
         */
        this.debug = options.debug;

        /**
         * Position on x axis
         * @type {number}
         */
        this.x = options.x || 0;

        /**
         * Position on y axis
         * @type {number}
         */
        this.y = options.y || 0;

        /**
         * Width of entity
         * @type {number}
         */
        this.width = options.width || 10;

        /**
         * Height of entity
         * @type {number}
         */
        this.height = options.height || 10;

        /**
         * Mass of the entity (used for collision)
         * @type {string}
         */
        this.mass = options.mass || Entity.MASS.NONE;

        /**
         * Direction movement of the entity
         * @type {{x: number, y: number}}
         */
        this.direction = options.direction || {x: 0, y: 0};

        /**
         * Speed movement of the entity
         * @type {{x: number, y: number}}
         */
        this.speed = options.speed || {x: 100, y: 100};

        /**
         * Velocity of the entity
         * @type {{x: number, y: number}}
         * @readonly
         */
        this.velocity = options.velocity || {x: 0, y: 0};

        /**
         * Factor of scene gravity
         * @type {number}
         */
        this.gravityFactor = options.gravityFactor || 1;

        /**
         * Reference to the current scene
         * @readonly
         * @type {*}
         */
        this.scene = null;

        /**
         * Know if the entity is standing on a ground (or over an entity)
         * @type {boolean}
         * @readonly
         */
        this.standing = false;

        /**
         * Know if the entity is falling (used with gravity)
         * @type {boolean}
         * @readonly
         */
        this.falling = false;
    }

    /**
     * @beforeUpdate
     * @returns {void}
     */
    beforeUpdate () {
        super.beforeUpdate();

        if (this.direction.x) {
            this.velocity.x = this.speed.x * this.direction.x * Engine.tick;
            this.x += this.velocity.x;
        }

        this.velocity.y = this.scene && this.scene.gravity && this.gravityFactor ? this.scene.gravity * this.gravityFactor * Engine.tick : 0;
        if (this.velocity.y || this.direction.y) {
            this.velocity.y += this.speed.y * this.direction.y * Engine.tick;
            this.y += this.velocity.y;
        }
    }

    /**
     * Render
     * @param {*} context: canvas context
     * @returns {void}
     */
    render (context) {
        super.render(context);

        if (this.debug) {
            context.strokeStyle = "rgb(255, 0, 0)";
            context.strokeRect(this.x - this.scene.camera.x, this.y - this.scene.camera.y, this.width, this.height);
        }
    }

    /* METHODS */

    /**
     * Get distance between this entity and an other
     * @param {Entity} entity: entity target
     * @returns {number} distance from entity target
     */
    distanceTo (entity) {
        if (!entity) {
            return 0;
        }

        const x = (this.x + (this.width / 2)) - (entity.x + (entity.width / 2)),
            y   = (this.y + (this.height / 2)) - (entity.y + (entity.height / 2));

        return Math.sqrt((x * x) + (y * y));
    }

    /**
     * Compare coordinate to another entity to provide a coordinate direction
     * @param {Entity} entity: entity to compare
     * @returns {{x: number, y: number}} coordinate direction
     */
    directionTo (entity) {
        const bottom    = this.y + this.height,
            right       = this.x + this.width,
            entBottom   = entity.y + entity.height,
            entRight    = entity.x + entity.width,
            colBottom   = entBottom - this.y,
            colTop      = bottom - entity.y,
            colLeft     = right - entity.x,
            colRight    = entRight - this.x;

        if (colTop < colBottom && colTop < colLeft && colTop < colRight) {
            return {x: 0, y: 1};

        } else if (colBottom < colTop && colBottom < colLeft && colBottom < colRight) {
            return {x: 0, y: -1};

        } else if (colLeft < colRight && colLeft < colTop && colLeft < colBottom) {
            return {x: 1, y: 0};

        } else if (colRight < colLeft && colRight < colTop && colRight < colBottom) {
            return {x: -1, y: 0};

        }

        return {x: 0, y: 0};
    }

    /**
     * Know if the target entity and the current entity is intersecting
     * @param {Entity} entity: entity to compare
     * @returns {boolean} true if the entity intersect the entity target
     */
    intersect (entity) {
        return !(entity.x > (this.x + this.width) ||
        (entity.x + entity.width) < this.x ||
        entity.y > (this.y + this.height) ||
        (entity.x + entity.height) < this.y);
    }

    /**
     * Get position x relative
     * @returns {number} the current relative position x
     */
    relativeX () {
        return this.scene ? this.x - this.scene.camera.x : this.x;
    }

    /**
     * Get position y relative
     * @returns {number} the current relative position y
     */
    relativeY () {
        return this.scene ? this.y - this.scene.camera.y : this.y;
    }

    /* GETTERS & SETTERS */

    get moving () {
        return this.direction.x || this.direction.y;
    }
}

Entity.MASS = {
    SOLID: "solid",
    WEAK: "weak",
    NONE: "none"
};
