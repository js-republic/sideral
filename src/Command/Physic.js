import Game from "./../Game";


export default class Physic {

    /**
     * @constructor
     * @param {Entity} entity: entity owner
     */
    constructor (entity) {
        this.entity     = entity;
        this.type       = Physic.TYPE.NONE;
        this.collide    = {x: false, y: false};
    }

    resolveAll () {
        const entity    = this.entity,
            nextX       = entity.props.x + (this.entity.props.vx * Game.tick),
            nextY       = entity.props.y + (this.entity.props.vy * Game.tick),
            moveInX     = entity.props.x !== nextX,
            moveInY     = entity.props.gravityFactor ? entity.hasChanged("y") || (entity.props.y !== nextY) || !entity.collide.y : entity.props.y !== nextY;

        if (moveInX) {
            this.resolveX(entity.props.x, nextX);
        }

        if (entity.props.gravityFactor ? entity.hasChanged("x") || moveInX || moveInY : moveInY) {
            const gravity = entity.scene.props.gravity * entity.props.gravityFactor * Game.tick;

            entity.props.vy += gravity;
            this.resolveY(nextY + gravity);
        }
    }

    resolveX (lastX, nextX) {
        let entities = [this.entity];

        const logic = this.getLogicXAt(this.entity.scene, lastX, nextX, this.entity.props.y, this.entity.props.y + this.entity.props.height, this.entity.props.width),
            toLeft  = nextX < lastX,
            xmin    = toLeft ? logic.value : lastX,
            xmax    = (toLeft ? lastX : logic.value) + this.entity.props.width;

        entities = entities.concat(this.getEntitiesInRange(xmin, xmax, this.entity.props.y, this.entity.props.y + this.entity.props.height));

        if (!logic.collide && entities.length > 1) {
            entities.sort((a, b) => toLeft ? a.props.x - b.props.x : b.props.x - a.props.x);

            const fullWidth     = entities.reduce((acc, entity) => acc + entity.props.width, 0),
                ymin            = this.getLowestValue(entities, "y"),
                ymax            = this.getHighestValue(entities, "y"),
                lastWidth       = entities[toLeft ? entities.length - 1 : 0].props.width,
                fullLogic       = this.getLogicXAt(this.entity.scene, logic.value, toLeft ? logic.value + this.entity.props.width - fullWidth : logic.value + fullWidth - lastWidth, ymin, ymax, lastWidth);

            this.shiftEntitiesToX(entities, fullLogic.value, fullLogic.collide, toLeft);

        } else {
            this.shiftEntitiesToX(entities, logic.value, logic.collide, toLeft);

        }
    }

    // 1st - check if there is a wall between last and next x value
    // 1st - get all entities in the range between last and logic x value
    // 2nd - if there is more than 1 entity and no logic collide, report to the first algorithm with a new range (next x + width of all entities)

    resolveY (nextY) {
        let entities = [this.entity];

        const logic = this.getLogicYAt(this.entity.scene, this.entity.props.y, nextY, this.entity.props.x, this.entity.props.x + this.entity.props.width, this.entity.props.height),
            toTop   = nextY < this.entity.props.y,
            ymin    = toTop ? logic.value : this.entity.props.y,
            ymax    = (toTop ? this.entity.props.y : logic.value) + this.entity.props.height;

        entities = entities.concat(this.getEntitiesInRange(this.entity.props.x, this.entity.props.x + this.entity.props.width, ymin, ymax));

        if (!logic.collide && entities.length > 1) {
            entities.sort((a, b) => toTop ? a.props.y - b.props.y : b.props.y - a.props.y);

            const fullHeight    = entities.reduce((acc, entity) => acc + entity.props.height, 0),
                xmin            = this.getLowestValue(entities, "x"),
                xmax            = this.getHighestValue(entities, "x"),
                lastHeight      = entities[toTop ? entities.length - 1 : 0].props.height,
                fullLogic       = this.getLogicYAt(this.entity.scene, logic.value, toTop ? logic.value + this.entity.props.height - fullHeight : logic.value + fullHeight - lastHeight, xmin, xmax, lastHeight);

            this.shiftEntitiesToY(entities, fullLogic.value, fullLogic.collide, toTop);

        } else {
            this.shiftEntitiesToY(entities, logic.value, logic.collide, toTop);

        }
    }

    shiftEntitiesToX (entities, value, collide, toLeft) {
        entities.forEach((entity, index, array) => {
            const lastEntity = array[index - 1];

            if (!lastEntity) {
                entity.props.x      = value;
                entity.collide.x    = collide;

            } else if (entity.physic) {
                entity.props.x = toLeft ? lastEntity.props.x + lastEntity.props.width : lastEntity.props.x - entity.props.width;
            }

        });
    }

    shiftEntitiesToY (entities, value, collide, toTop) {
        entities.forEach((entity, index, array) => {
            const lastEntity = array[index - 1];

            if (!lastEntity) {
                entity.props.y = value;

            } else {
                entity.props.y = toTop ? lastEntity.props.y + lastEntity.props.height : lastEntity.props.y - entity.props.height;
            }

            entity.collide.y    = collide;
            entity.standing     = collide;

            if (collide) {
                entity.props.vy = 0;
            }
        });
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

    /**
     * Get entities from the scene in range
     * @param {number} xmin: position x min
     * @param {number} xmax: position x max
     * @param {number} ymin: position y min
     * @param {number} ymax: position y max
     * @param {Array<string>=} ids: array of IDs to filter
     * @returns {Array<Entity>} list of all entities in range
     */
    getEntitiesInRange (xmin, xmax, ymin, ymax, ids) {
        ids = [].concat(ids || [], this.entity.id);

        return this.entity.scene.getEntities().
            filter(entity => entity.props.x > (xmin - entity.props.width) && entity.props.x < xmax).
            filter(entity => entity.props.y > (ymin - entity.props.height) && entity.props.y < ymax).
            filter(entity => !ids.find(id => id === entity.id));
    }

    getHighestValue (entities, prop) {
        let value = Number.MIN_VALUE;

        entities.forEach(entity => value = Math.max(value, entity.props[prop]));

        return value;
    }

    getLowestValue (entities, prop) {
        let value = Number.MAX_VALUE;

        entities.forEach(entity => value = Math.min(value, entity.props[prop]));

        return value;
    }
}

/**
 * Type of physic
 * @type {{NONE: number, WEAK: number, SOLID: number}}
 */
Physic.TYPE = {
    NONE    : -1,
    WEAK    : 0,
    SOLID   : 1
};
