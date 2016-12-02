import Element from "./../Element";
import Engine from "./../Engine";


export default class Entity extends Element {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        /**
         * Show more information about entity on screen
         * @type {boolean}
         */
        this.debug = false;

        /**
         * Reference to the current scene
         * @type {*}
         */
        this.scene = null;

        /**
         * Position of entity
         * @type {{x: number, y: number}}
         * @readonly
         */
        this.position = {x: 0, y: 0};

        /**
         * Last position of entity
         * @type {{x: number, y: number}}
         * @readonly
         */
        this.lastPosition = {x: 0, y: 0};

        /**
         * If true, the position of this entity will be compared to the camera position
         * @type {boolean}
         */
        this.relativePosition = false;

        /**
         * Mass of the entity (used for collision)
         * @type {string}
         */
        this.mass = Entity.MASS.NONE;

        /**
         * Direction movement of the entity
         * @type {{x: number, y: number}}
         */
        this.direction = {x: 0, y: 0};

        /**
         * Speed movement of the entity
         * @type {{x: number, y: number}}
         */
        this.speed = {x: 100, y: 100};

        /**
         * Velocity of the entity
         * @type {{x: number, y: number}}
         * @readonly
         */
        this.velocity = {x: 0, y: 0};

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

        /**
         * Factor of scene gravity
         * @type {number}
         */
        this.gravityFactor = 1;

        /**
         * If true, this entity will pass into "pooling mode" (for memory sake)
         * @type {boolean}
         */
        this.pooling = false;

        this.width(10);
        this.height(10);
    }

    /**
     * Destroy the element
     * @returns {void}
     */
    destroy () {
        if (!this.pooling) {
            super.destroy();
        }

        this.destroyed = true;
    }

    /**
     * Update
     * @returns {void}
     */
    update () {
        super.update();

        if (this.direction.x) {
            this.velocity.x = this.speed.x * this.direction.x * Engine.tick;
            this.x(this.x() + this.velocity.x);
        }

        this.velocity.y += (this.direction.y ? this.speed.y * this.direction.y * Engine.tick : 0) + (this.scene ? this.scene.gravity * this.gravityFactor * Engine.tick : 0);
        if (this.velocity.y) {
            this.y(this.y() + this.velocity.y);
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
            context.strokeRect(this.x() - this.scene.camera.x, this.y() - this.scene.camera.y, this.width(), this.height());
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

        const x = (this.x() + (this.width() / 2)) - (entity.x() + (entity.width() / 2)),
            y   = (this.y() + (this.height() / 2)) - (entity.y() + (entity.height() / 2));

        return Math.sqrt((x * x) + (y * y));
    }

    /**
     * Compare coordinate to another entity to provide a coordinate direction
     * @param {Entity} entity: entity to compare
     * @returns {{x: number, y: number}} coordinate direction
     */
    directionTo (entity) {
        const bottom    = this.y() + this.height(),
            right       = this.x() + this.width(),
            entBottom   = entity.y() + entity.height(),
            entRight    = entity.x() + entity.width(),
            colBottom   = entBottom - this.y(),
            colTop      = bottom - entity.y(),
            colLeft     = right - entity.x(),
            colRight    = entRight - this.x();

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
        return !(entity.x() > (this.x() + this.width()) ||
        (entity.x() + entity.width()) < this.x() ||
        entity.y() > (this.y() + this.height()) ||
        (entity.x() + entity.height()) < this.y());
    }

    /* GETTERS & SETTERS */

    /**
     * Name of the entity
     * @returns {string} name
     */
    get name () {
        return "entity";
    }

    /**
     * Get or set x position
     * @param {number=} x: if exist, x will be setted
     * @returns {number} the current position x
     */
    x (x) {
        if (typeof x !== "undefined") {
            this.lastPosition.x = this.position.x;
            this.position.x     = Math.round(x);
        }

        return this.relativePosition && this.scene ? this.position.x - this.scene.camera.x : this.position.x;
    }

    /**
     * Get or set y position
     * @param {number=} y: if exist, y will be setted
     * @returns {number} the current position y
     */
    y (y) {
        if (typeof y !== "undefined") {
            this.lastPosition.y = this.position.y;
            this.position.y     = Math.round(y);
        }

        return this.relativePosition && this.scene ? this.position.y - this.scene.camera.y : this.position.y;
    }
}

Entity.MASS = {
    SOLID: "solid",
    WEAK: "weak",
    NONE: "none"
};
