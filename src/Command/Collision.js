import Game from "./../Game";
import Entity from "./../Entity";


class Chain {

    /**
     * @constructor
     * @param {Entity} entity: owner of the chain
     * @param {number} nextPos: next position needed
     * @param {string} axis: x axis or y axis
     */
    constructor (entity, nextPos, axis) {
        this.entity     = entity;
        this.nextPos    = nextPos;
        this.axis       = axis;
        this.moveable   = true;
        this.logic      = this.getLogic();
        this.isGhost    = entity.props.mass === Entity.MASS.NONE;

        this.nextPos    = this.logic.value;
    }

    /**
     * Get logic with tilemap in x or y axis
     * @returns {{collide: boolean, value: number}}
     */
    getLogic () {
        if (!this.entity.scene.tilemap) {
            return { collide: false, value: this.nextPos };
        }

        if (this.axis === "x") {
            return this.getLogicXAt(this.entity.scene, this.entity.props.x, this.nextPos, this.entity.props.y, this.entity.props.y + this.entity.props.height, this.entity.props.width);
        }

        return this.getLogicYAt(this.entity.scene, this.entity.props.y, this.nextPos, this.entity.props.x, this.entity.props.x + this.entity.props.width, this.entity.props.height);
    }

    /**
     * Determine if there is a collision on X axis
     * @param {Scene} scene : current scene
     * @param {number} posX: position X
     * @param {number} nextX: position X needed
     * @param {number} ymin: position Y Min
     * @param {number} ymax: position Y Max
     * @param {number} width: width of the object
     * @returns {{collide: boolean, value: number}} get the position x
     */
    getLogicXAt (scene, posX, nextX, ymin, ymax, width) {
        if (!scene.tilemap) {
            return nextX;
        }

        const orientation   = nextX > posX ? 1 : -1,
            cellXMin        = orientation > 0 ? Math.floor((posX + width) / scene.tilemap.props.tilewidth) : Math.floor(posX / scene.tilemap.props.tilewidth) - 1,
            cellXMax        = orientation > 0 ? Math.floor((nextX + width) / scene.tilemap.props.tilewidth) : Math.floor(nextX / scene.tilemap.props.tileheight),
            cellYMin        = Math.floor(Math.abs(ymin) / scene.tilemap.props.tileheight),
            cellYMax        = Math.floor(Math.abs(ymax - 1) / scene.tilemap.props.tileheight),
            grid            = scene.tilemap.grid.logic,
            result          = { collide: false, value: nextX };

        let cellY           = null;

        for (let y = cellYMin; y <= cellYMax; y++) {
            cellY = grid[y];

            if (!cellY) {
                continue;
            }

            for (let x = cellXMin; x !== (cellXMax + orientation); x += orientation) {
                if (cellY[x]) {
                    result.collide  = true;
                    result.value    = orientation > 0 ? (x * scene.tilemap.props.tilewidth) - width : (x + 1) * scene.tilemap.props.tilewidth;

                    return result;
                }
            }
        }

        return result;
    }

    /**
     * Determine if there is a collision on y axis
     * @param {Scene} scene : current scene
     * @param {number} posY : Y axis
     * @param {number} nextY : Y axis position needed
     * @param {number} xmin : X Min
     * @param {number} xmax : X Max
     * @param {number} height : height of the object
     * @returns {{collide: boolean, value: number}} get the position y
     */
    getLogicYAt (scene, posY, nextY, xmin, xmax, height) {
        if (!scene.tilemap) {
            return nextY;
        }

        const orientation   = nextY > posY ? 1 : -1,
            cellYMin        = orientation > 0 ? Math.floor((posY + height) / scene.tilemap.props.tileheight) : Math.floor(nextY / scene.tilemap.props.tileheight),
            cellYMax        = orientation > 0 ? Math.floor((nextY + height) / scene.tilemap.props.tileheight) : Math.floor(posY / scene.tilemap.props.tileheight),
            cellXMin        = Math.floor(Math.abs(xmin) / scene.tilemap.props.tilewidth),
            cellXMax        = Math.floor(Math.abs(xmax - 1) / scene.tilemap.props.tilewidth),
            result          = { collide: false, value: nextY };

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
                    result.collide  = true;
                    result.value    = orientation > 0 ? (y * scene.tilemap.props.tileheight) - height : (y + 1) * scene.tilemap.props.tileheight;

                    return result;
                }
            }
        }

        return result;
    }
}


export default class Collision {

    /**
     * @constructor
     * @param {Entity} parent: owner of the collision command
     */
    constructor (parent) {
        this.parent = parent;
    }

    /**
     * Resolve all movement and collision
     * @returns {void}
     */
    resolveAll () {
        let chain   = null;

        const entity= this.parent,
            nextX   = entity.props.x + (this.parent.props.vx * Game.tick),
            nextY   = entity.props.y + (this.parent.props.vy * Game.tick),
            moveInX = entity.hasChanged("x") || (entity.props.x !== nextX),
            moveInY = entity.hasChanged("y") || (entity.props.y !== nextY) || !entity.collide.y;

        if (moveInX) {
            chain = new Chain(entity, nextX, "x");

            if (chain.moveable && !chain.logic.collide) {
                entity.props.x = chain.nextPos;
            }
        }

        if (moveInX || moveInY) {
            const gravity = entity.scene.props.gravity * entity.props.gravityFactor * Game.tick;

            chain = new Chain(entity, nextY + gravity, "y");

            if (chain.moveable && !chain.logic.collide) {
                entity.props.y  = chain.nextPos;
                entity.props.vy += gravity;
            }

            entity.standing = chain.logic.collide;
        }
    }

    /**
     * Get entities from the scene in range
     * @param {Scene} scene: scene to check
     * @param {number} xmin: position x min
     * @param {number} xmax: position x max
     * @param {number} ymin: position y min
     * @param {number} ymax: position y max
     * @returns {Array<Entity>}
     */
    getEntitiesInRange (scene, xmin, xmax, ymin, ymax) {
        return scene.getEntities().
            filter(entity => entity.props.x >= (xmin - entity.props.width) && entity.props.x <= xmax).
            filter(entity => entity.props.y >= (ymin - entity.props.height) && entity.props.y <= ymax);
    }
}