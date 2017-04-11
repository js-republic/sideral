import Game from "./../Game";
import Entity from "./../Entity";


class Chain {

    /**
     * @constructor
     * @param {Entity} entity: owner of the chain
     * @param {number} nextPos: next position needed
     * @param {string} axis: x axis or y axis
     * @param {Entity=} initiator: entity that initiated the chain
     */
    constructor (entity, nextPos, axis, initiator) {
        this.entity     = entity;
        this.nextPos    = nextPos;
        this.axis       = axis;
        this.moveable   = initiator ? !(entity.props.mass === Entity.MASS.SOLID) : true;
        this.logic      = this.getLogic();
        this.impacts    = [];
        this.isGhost    = entity.props.mass === Entity.MASS.NONE;

        this.nextPos    = this.moveable ? this.logic.value : entity.props.x;
        this.moveable   = this.moveable ? !this.logic.collide : this.moveable;

        if (this.moveable) {
            this.updateImpacts(initiator);

            this.getLogicCollision();
        }
    }

    updateImpacts (initiator) {
        const entity    = this.entity,
            xmin        = this.axis === "x" ? Math.min(this.logic.value, entity.props.x) : entity.props.x,
            xmax        = this.axis === "x" ? Math.max(this.logic.value, entity.props.x) + entity.props.width : entity.props.x + entity.props.width,
            ymin        = this.axis === "y" ? Math.min(this.logic.value, entity.props.y) : entity.props.y,
            ymax        = this.axis === "y" ? Math.max(this.logic.value, entity.props.y) + entity.props.height : entity.props.y + entity.props.height,
            range       = this.getEntitiesInRange(xmin, xmax, ymin, ymax, initiator && initiator.id);

        this.impacts = range.map(target => {
            const impact = {
                entity: target,
                vector: entity.vectorPositionTo(target)
            };

            switch (true) {
            case this.axis === "x": impact.chain = new Chain(target, impact.vector.x === 1 ? xmax : xmin - target.props.width, this.axis, entity);
                break;
            case this.axis === "y": impact.chain = new Chain(target, impact.vector.y === 1 ? ymax : ymin - target.props.height, this.axis, entity);
                break;
            }

            return impact;
        });
    }

    /**
     * Get logic with tilemap in x or y axis
     * @returns {{collide: boolean, value: number}} logic object
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
            filter(entity => entity.props.x >= (xmin - entity.props.width) && entity.props.x <= xmax).
            filter(entity => entity.props.y >= (ymin - entity.props.height) && entity.props.y <= ymax).
            filter(entity => !ids.find(id => id === entity.id));
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
        let chain       = null;

        const entity    = this.parent,
            nextX       = entity.props.x + (this.parent.props.vx * Game.tick),
            nextY       = entity.props.y + (this.parent.props.vy * Game.tick),
            moveInX     = entity.hasChanged("x") || (entity.props.x !== nextX),
            moveInY     = entity.hasChanged("y") || (entity.props.y !== nextY) || !entity.collide.y;

        if (moveInX) {
            chain = new Chain(entity, nextX, "x");

            if (chain.impacts.length) {
                console.log(chain.entity.props.power, chain.impacts.map(impact => impact.chain.moveable));
            }

            this.resolveChainX(chain);
        }

        if (moveInX || moveInY) {
            const gravity = entity.scene.props.gravity * entity.props.gravityFactor * Game.tick;

            chain  = new Chain(entity, nextY + gravity, "y");

            if (chain.moveable && !chain.logic.collide) {
                entity.props.vy += gravity;
            }

            entity.props.y  = chain.nextPos;
            entity.standing = chain.logic.collide;
        }
    }

    resolveChainX (chain) {
        let indexBlocked    = -1;

        if (!chain.moveable) {
            chain.entity.props[chain.axis] = chain.nextPos;

        } else if ((indexBlocked = chain.impacts.findIndex(impact => !impact.chain.moveable)) > -1) {
            chain.impacts.splice(indexBlocked).reverse().forEach((impact, index, array) => {
                const nextImpact    = array[index + 1];

                if (nextImpact) {
                    // nextImpact.chain.entity.props[nextImpact.chain.axis] = nextImpact.vector.x === 1 ? impact.chain.nextPos - nextImpact.chain.entity.props.width : impact.chain.
                }
            });

        } else {
            chain.entity.props[chain.axis] = chain.nextPos;
            chain.impacts.forEach(impact => impact.chain.entity.props[impact.chain.axis] = impact.chain.nextPos);

        }
    }
}
