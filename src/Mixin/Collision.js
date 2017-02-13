import Mixin from "./../Mixin";
import Entity from "./../Entity";
import Engine from "./../Engine";


export default class Collision extends Mixin {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name = "collision";

        /**
         * Mass of the entity (collision)
         * @type {number}
         */
        this.mass           = 2;

        /**
         * Know if the parent is in collision with wall within axis
         * @type {{x: boolean, y: boolean}}
         */
        this.collide = {x: false, y: false};

        /**
         * Mass enumeration
         * @readonly
         * @type {{NONE: string, WEAK: string, SOLID: string}}
         */
        this.MASS = {
            NONE    : 0,
            WEAK    : 1,
            SOLID   : 2
        };
    }

    initialize (props) {
        super.initialize(props);

        this.interceptFunction("updateVelocity", this.updateVelocity);
    }

    /* OVERRIDES */

    /**
     * @override
     */
    updateVelocity () {
        const parent    = this.parent;

        parent.moving   = parent.vx || parent.vy;

        if (parent.moving) {
            this.resolveAll();
        }
    }

    /* METHODS */

    /**
     * Resolve all collision (wall and between entities) when entity is moving
     * @returns {void}
     */
    resolveAll () {
        const entity    = this.parent;

        this.getEntities(entities => {
            // 1st step - resolve collisions with wall
            this.resolveWallCollision(entity);

            // 2nd step - get collisions with all entities moving (intersections of two lines)
            this.getEntitiesCollisions(entity, entities).forEach(collision => {
                const { vector, other } = collision;

                if (this.isWeakerThan(other)) {
                    if (vector.x) {
                        entity.x = vector.x > 0 ? other.x - entity.width : other.x + other.width;
                    } else if (vector.y) {
                        entity.y = vector.y > 0 ? other.y - entity.height : other.y + other.height;
                    }

                } else {
                    // 3rd step - get all chains of collisions to resolve shifting
                    const chain = this.getChainCollision(collision.vector.x ? "x" : "y", [entity, collision.other], entities);

                    // 4rd step - resolve shifting of impact by entities moving
                    console.log(chain);
                }
            });

        });
    }

    /**
     * Resolve wall for entity passed in parameters
     * @param {Entity} entity : current entity
     * @returns {void|null} -
     */
    resolveWallCollision (entity) {
        const movingX     = entity.vx !== entity.last.vx,
            movingY     = entity.vy !== entity.last.vy;

        if (!movingX && !movingY) {
            return null;
        }

        entity.getScene(scene => {
            if (movingX) {
                const nextX     = entity.x + (entity.vx * Engine.tick),
                    logicX      = this.getLogicXAt(scene, entity.x, nextX, entity.y, entity.y + entity.height, entity.width);

                this.collide.x  = nextX !== logicX;
                entity.x        = logicX;
            }

            if (movingY) {
                const nextY     = entity.y + (entity.vy * Engine.tick),
                    logicY      = this.getLogicYAt(scene, entity.y, nextY, entity.x, entity.x + entity.width, entity.height);

                this.collide.y  = nextY !== logicY;
                entity.y        = logicY;
            }
        });
    }

    /**
     * Resolve the chain of collisions
     * @param {string} axis: axis x or y
     * @param {Array<Entity>} chain: chain of entity impacted by movement
     * @returns {void}
     */
    resolveChainOfCollisions (axis, chain) {
        // TODO
    }

    /**
     * Determine if there is a collision on X axis
     * @param {Scene} scene : current scene
     * @param {number} posX: position X
     * @param {number} nextX: position X needed
     * @param {number} ymin: position Y Min
     * @param {number} ymax: position Y Max
     * @param {number} width: width of the object
     * @returns {number} get the position x
     */
    getLogicXAt (scene, posX, nextX, ymin, ymax, width) {
        if (!scene.tilemap || (scene.tilemap && !scene.tilemap.sprite)) {
            return nextX;
        }

        const orientation   = nextX > posX ? 1 : -1,
            cellXMin        = orientation > 0 ? Math.floor((posX + width) / scene.tilemap.tilewidth) : Math.floor(posX / scene.tilemap.tilewidth) - 1,
            cellXMax        = orientation > 0 ? Math.floor((nextX + width) / scene.tilemap.tilewidth) : Math.floor(nextX / scene.tilemap.tileheight),
            cellYMin        = Math.floor(Math.abs(ymin) / scene.tilemap.tileheight),
            cellYMax        = Math.floor(Math.abs(ymax - 1) / scene.tilemap.tileheight),
            grid            = scene.tilemap.grid.logic;

        let cellY           = null;

        for (let y = cellYMin; y <= cellYMax; y++) {
            cellY = grid[y];

            if (!cellY) {
                continue;
            }

            for (let x = cellXMin; x !== (cellXMax + orientation); x += orientation) {
                if (cellY[x]) {
                    return orientation > 0 ? (x * scene.tilemap.tilewidth) - width : (x + 1) * scene.tilemap.tilewidth;
                }
            }
        }

        return nextX;
    }

    /**
     * Determine if there is a collision on y axis
     * @param {Scene} scene : current scene
     * @param {number} posY : Y axis
     * @param {number} nextY : Y axis position needed
     * @param {number} xmin : X Min
     * @param {number} xmax : X Max
     * @param {number} height : height of the object
     * @returns {number} get the position y
     */
    getLogicYAt (scene, posY, nextY, xmin, xmax, height) {
        if (!scene.tilemap || (scene.tilemap && !scene.tilemap.sprite)) {
            return nextY;
        }

        const orientation   = nextY > posY ? 1 : -1,
            cellYMin        = orientation > 0 ? Math.floor((posY + height) / scene.tilemap.tileheight) : Math.floor(nextY / scene.tilemap.tileheight),
            cellYMax        = orientation > 0 ? Math.floor((nextY + height) / scene.tilemap.tileheight) : Math.floor(posY / scene.tilemap.tileheight),
            cellXMin        = Math.floor(Math.abs(xmin) / scene.tilemap.tilewidth),
            cellXMax        = Math.floor(Math.abs(xmax - 1) / scene.tilemap.tilewidth);

        let grid            = null;

        const loopParameter = {
            start: orientation > 0 ? cellYMin : cellYMax,
            end: orientation > 0 ? cellYMax : cellYMin
        };

        for (let y = loopParameter.start; y !== (loopParameter.end + orientation); y += orientation) {
            grid = scene.tilemap.grid.logic[y];

            if (!grid) {
                continue;
            }

            for (let x = cellXMin; x <= cellXMax; x++) {
                if (grid[x]) {
                    return orientation > 0
                        ? (y * scene.tilemap.tileheight) - height
                        : (y + 1) * scene.tilemap.tileheight;
                }
            }
        }

        return nextY;
    }

    /**
     * Check if the parent is weaker than other in mass
     * @param {Entity} other: other entity
     * @returns {boolean} is weaker than
     */
    isWeakerThan (other) {
        return other.has("collision") && this.mass <= other.collision.mass;
    }

    /**
     * Check if the parent is stronger than other in mass
     * @param {Entity} other: other entity
     * @returns {boolean} is stronger than
     */
    isStrongerThan (other) {
        return other.has("collision") && this.mass > other.collision.mass;
    }

    /**
     * Get all collision with other entities
     * @param {Entity} entity: entity to check
     * @param {Array<Entity>} entities: list of entities to check
     * @returns {Array<{ vector: {x: number, y: number}, other: Entity}>} list of collisions
     */
    getEntitiesCollisions (entity, entities) {
        const collisions = [];

        entities.filter(other => other.has("collision")).forEach(other => {
            const vector = entity.intersect(other);

            if (vector) {
                collisions.push({ vector: vector, other: other });
            }
        });

        return collisions;
    }

    /**
     * Provide an array with all entities which will be impacted by a movement (chain of collisions)
     * @param {string} axis: axis x or y
     * @param {Array<Entity>} chain: the start chain of entity impacted by a movement
     * @param {Array<Entity>} entities: list of all entities to check
     * @returns {Array<Entity>} the complete chain of entity which will be impacted by a movement on axis passed in parameter
     */
    getChainCollision (axis, chain, entities) {
        const entity    = chain[chain.length - 1],
            lastLength  = chain.length;

        entities.filter(a => !chain.find(b => b.id === a.id)).some(other => {
            const vector = entity.intersect(other, true);

            if (vector && vector[axis]) {
                chain.push(other);
            }

            return lastLength !== chain.length;
        });

        return lastLength === chain.length ? chain : this.getChainCollision(axis, chain, entities);
    }

    /**
     * Get all entities from the scene
     * @param {function} callback: callback when all entites has been finded
     * @returns {void}
     */
    getEntities (callback) {
        this.parent.getScene(scene => {
            callback(scene.children.filter(child => child instanceof Entity && child.id !== this.parent.id));
        });
    }
}
