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
        this.mass           = "none";

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
            NONE    : "none",
            WEAK    : "weak",
            SOLID   : "solid"
        };
    }

    initialize (props) {
        super.initialize(props);

        this.interceptFunction("updateVelocity", this.updateVelocity);
    }

    /* OVERRIDES */

    updateVelocity () {
        const parent = this.parent;

        parent.moving = parent.vx || parent.vy;

        if (parent.moving) {
            this.resolveAll();
        }
    }

    /* METHODS */

    /**
     * Resolve all collision (wall and between entities)
     * @returns {void}
     */
    resolveAll () {
        const entity = this.parent;

        this.getEntities(entities => {
            // 1st step - resolve collisions with wall
            this.resolveWallCollision(entity);

            // 2nd step - get collisions with all entities moving (intersections of two lines)
            this.resolveEntitiesCollision(entity, entities);

            // 3rd step - get all chains of collisions to resolve shifting
            // 4rd step - resolve shifting of impact by entities moving
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
     * get all collision with entities in the scene
     * @param {Entity} entity: current entity
     * @param {Array<Entity>} entities: entities to check
     * @returns {void|null} -
     */
    resolveEntitiesCollision (entity, entities = []) {
        entities.forEach(other => {
            if (entity.intersect(other)) {
                console.log("intersection");
            }
        });
    }

    /**
     * Check if two lines are intersected
     * @param {{x: number, y: number}} line1Start - start coordinate of line 1
     * @param {{x: number, y: number}} line1End - end coordinate of line 1
     * @param {{x: number, y: number}} line2Start - start coordinate of line 2
     * @param {{x: number, y: number}} line2End - end coordinate of line 2
     * @returns {boolean} return true if the lines intersect each other
     */
    checkLineIntersection (line1Start, line1End, line2Start, line2End) {
        const denominator = ((line2End.y - line2Start.y) * (line1End.x - line1Start.x)) - ((line2End.x - line2Start.x) * (line1End.y - line1Start.y));

        if (denominator === 0) {
            return false;
        }

        let a           = line1Start.y - line2Start.y,
            b           = line1Start.x - line2Start.x;

        const numerator1    = ((line2End.x - line2Start.x) * a) - ((line2End.y - line2Start.y) * b),
            numerator2      = ((line1End.x - line1Start.x) * a) - ((line1End.y - line1Start.y) * b);

        a = numerator1 / denominator;
        b = numerator2 / denominator;

        return a > 0 && a < 1 && b > 0 && b < 1;
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

        const loopParameter = {
            start: orientation > 0 ? cellXMax : cellXMin,
            end: orientation > 0 ? cellXMin : cellXMax
        };

        for (let y = cellYMin; y <= cellYMax; y++) {
            cellY = grid[y];

            if (!cellY) {
                continue;
            }

            for (let x = loopParameter.start; x !== (loopParameter.end + orientation); x += orientation) {
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
