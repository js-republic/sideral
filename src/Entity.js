import Component from "./Component";
import Scene from "./Scene";
import Engine from "./Engine";


export default class Entity extends Component {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name = "entity";

        this._container = new PIXI.DisplayObject();

        /**
         * Factor of gravity provided by the scene
         * @type {number}
         */
        this.gravityFactor  = 0;

        /**
         * Velocity X
         * @type {number}
         */
        this.vx             = 0;

        /**
         * Velocity y
         * @type {number}
         */
        this.vy             = 0;

        // read-only

        /**
         * Know if the entity is currently falling
         * @readonly
         * @type {boolean}
         */
        this.falling        = false;

        /**
         * Know if the entity is standing on the ground (or over an other entity)
         * @readonly
         * @type {boolean}
         */
        this.standing       = false;

        /**
         * Know if the entity is moving or not
         * @readonly
         * @type {boolean}
         */
        this.moving         = false;
    }

    update () {
        super.update();
        this.updateVelocity();
    }

    /* METHODS */

    /**
     * Set a new velocity for the current entity
     * @param {number=} vx: velocity in x axis
     * @param {number=} vy: velocity in y axis
     * @returns {void}
     */
    velocity (vx, vy) {
        if (typeof vx !== "undefined") {
            this.vx = vx;
        }

        if (typeof vy !== "undefined") {
            this.vy = vy;
        }
    }

    /**
     * Update the position with velocity and check if there is not a collision wall
     * @returns {void}
     */
    updateVelocity () {
        this.moving     = this.vx || this.vy;

        this.x          += this.vx * Engine.tick;
        this.y          += this.vy * Engine.tick;
    }

    /**
     * Find the first Scene into parent hierarchy
     * @param {*=} recursive: recursive object to get scene
     * @returns {Scene|null} get the current scene
     */
    getScene (recursive) {
        recursive = recursive || this;

        if (recursive.parent) {
            return recursive.parent instanceof Scene ? recursive.parent : this.getScene(recursive);
        }

        return recursive;
    }

    /**
     * Check if it intersect with the entity passed in parameter
     * @param {Entity} entity: other entity to check collision
     * @param {boolean=} onlyStaticIntersection: check only with static intersection
     * @returns {null|{x: number, y: number}} return the vector if true, else retur null
     */
    intersect (entity, onlyStaticIntersection) {
        const staticIntersection = !(entity.x > (this.x + this.width) ||
            (entity.x + entity.width) < this.x ||
            entity.y > (this.y + this.height) ||
            (entity.y + entity.height) < this.y),
            vector = this.vectorTo(entity);

        if (staticIntersection || onlyStaticIntersection) {
            return vector;

        } else if (this.moving) {
            const lastVector    = this.lastVectorTo(entity),
                lastDistance    = this.lastDistanceTo(entity),
                distance        = this.distanceTo(entity),
                colleft         = lastDistance * lastVector.x > 0 && distance * vector.x < 0,
                colright        = lastDistance * lastVector.x < 0 && distance * vector.x > 0,
                coltop          = lastDistance * lastVector.y > 0 && distance * vector.y < 0,
                colbottom       = lastDistance * lastVector.y < 0 && distance * vector.y > 0;

            if (colleft || colright || coltop || colbottom) {
                return vector;
            }
        }

        return null;
    }

    /**
     * Get vector to entity to target
     * @param {Entity} entity: the target
     * @returns {{x: number, y: number}} the vector
     */
    vectorTo (entity) {
        return Entity.vectorBetween(this.x, this.y, this.width, this.height,
            entity.x, entity.y, entity.width, entity.height);
    }

    /**
     * Get the last vector to entity to target
     * @param {Entity} entity: the target
     * @returns {{x: number, y: number}} the last vector
     */
    lastVectorTo (entity) {
        return Entity.vectorBetween(this.last.x, this.last.y, this.last.width, this.last.height,
            entity.x, entity.y, entity.width, entity.height);
    }

    /**
     * Get distance between current entity and the target
     * @param {Entity} entity: the target
     * @returns {number} the distance
     */
    distanceTo (entity) {
        return Entity.distanceBetween(this.x, this.y, this.width, this.height,
            entity.x, entity.y, entity.width, entity.height);
    }

    /**
     * Get last distance between current entity and the target
     * @param {Entity} entity: the target
     * @returns {number} the last distance
     */
    lastDistanceTo (entity) {
        return Entity.distanceBetween(this.last.x, this.last.y, this.last.width, this.last.height,
            entity.x, entity.y, entity.width, entity.height);
    }

    /**
     * Get the vector of the velocity
     * @returns {{x: number, y: number}} the vector of current velocity
     */
    getVectorVelocity () {
        let x = 0,
            y = 0;

        if (this.vx > 0) {
            x = 1;
        } else if (this.vx < 0) {
            x = -1;
        }

        if (this.vy > 0) {
            y = 1;
        } else if (this.vy < 0) {
            y = -1;
        }

        return {x: x, y: y};
    }

    /* ABSTRACT */

    /**
     * Event fired when entity enter in collision with an other entity
     * @param {Entity} other: other entity
     * @returns {void}
     */
    onCollisionWith (other) {

    }

    /* STATIC */

    /**
     * Get the vector between two entity
     * @param {number} x : x position of the first entity
     * @param {number} y : y position of the first entity
     * @param {number} width : width of the first entity
     * @param {number} height : height of the first entity
     * @param {number} targetX : x position of the second entity
     * @param {number} targetY : y position of the second entity
     * @param {number} targetWidth : width of the second entity
     * @param {number} targetHeight : height of the second entity
     * @returns {{x: number, y: number}} the vector result
     */
    static vectorBetween (x, y, width, height, targetX, targetY, targetWidth, targetHeight) {
        const bottom    = y + height,
            right       = x + width,
            targbottom  = targetY + targetHeight,
            targright   = targetX + targetWidth,
            colbottom   = targbottom - y,
            coltop      = bottom - targetY,
            colleft     = right - targetX,
            colright    = targright - x;

        if (coltop < colbottom && coltop < colleft && coltop < colright) {
            return {x: 0, y: 1};

        } else if (colbottom < coltop && colbottom < colleft && colbottom < colright) {
            return {x: 0, y: -1};

        } else if (colleft < colright && colleft < coltop && colleft < colbottom) {
            return {x: 1, y: 0};

        } else if (colright < colleft && colright < coltop && colright < colbottom) {
            return {x: -1, y: 0};
        }

        return {x: 0, y: 0};
    }

    /**
     * Get the absolute distance between two entities
     * @param {number} x : x position of the first entity
     * @param {number} y : y position of the first entity
     * @param {number} width : width of the first entity
     * @param {number} height : height of the first entity
     * @param {number} targetX : x position of the second entity
     * @param {number} targetY : y position of the second entity
     * @param {number} targetWidth : width of the second entity
     * @param {number} targetHeight : height of the second entity
     * @returns {number} the distance
     */
    static distanceBetween (x, y, width, height, targetX, targetY, targetWidth, targetHeight) {
        x = (x + (width / 2)) - (targetX + (targetWidth / 2));
        y = (y + (height / 2)) - (targetY + (targetHeight / 2));

        return Math.sqrt((x * x) + (y * y));
    }
}
