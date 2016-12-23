import ComponentViewable from "./../ComponentViewable";
import Engine from "./../Engine";


export default class Entity extends ComponentViewable {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {*} props: properties
     */
    constructor (props) {
        super(props);

        /**
         * Mass of the entity (used for collision)
         * @type {string}
         */
        this.mass = this.mass || Entity.MASS.NONE;

        /**
         * Direction movement of the entity
         * @type {{x: number, y: number}}
         */
        this.direction = this.direction || {x: 0, y: 0};

        /**
         * Speed movement of the entity
         * @type {{x: number, y: number}}
         */
        this.speed = this.speed || {x: 100, y: 100};

        /**
         * Velocity of the entity
         * @type {{x: number, y: number}}
         * @readonly
         */
        this.velocity = this.velocity || {x: 0, y: 0};

        /**
         * Factor of scene gravity
         * @type {number}
         */
        this.gravityFactor = this.gravityFactor || 1;

        /**
         * If debug mode, it will show the box on canvas
         * @type {boolean}
         */
        this.debug = this.debug || false;

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
     * @override
     * @returns {void}
     */
    update () {
        super.update();

        if (this.direction.x) {
            this.velocity.x = this.speed.x * this.direction.x * Engine.tick;
            this.x += Math.round(this.velocity.x);
        }

        this.velocity.y = this.scene && this.scene.gravity && this.gravityFactor ? this.scene.gravity * this.gravityFactor * Engine.tick : 0;
        if (this.velocity.y || this.direction.y) {
            this.velocity.y += this.speed.y * this.direction.y * Engine.tick;
            this.y += Math.round(this.velocity.y);
        }
    }

    render (context) {
        const linewidth = context.lineWidth;

        context.clearRect((this.previousProps.x || this.x) - linewidth, (this.previousProps.y || this.y) - linewidth, (this.previousProps.width || this.width) + (linewidth * 2), (this.previousProps.height || this.height) + (linewidth * 2));

        super.render(context);

        if (this.debug) {
            const camera        = this.scene ? this.scene.camera : {x: 0, y: 0};

            context.strokeStyle = "red";
            context.strokeRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
        }
    }

    /* METHODS */

    /**
     * @override
     */
    getScene () {
        return this.scene;
    }

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

    get name () {
        return "entity";
    }
}

Entity.MASS = {
    SOLID: "solid",
    WEAK: "weak",
    NONE: "none"
};
