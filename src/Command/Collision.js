import Game from "./../Game";
import Entity from "./../Entity";


export default class Collision {

    /**
     * @constructor
     * @param {*} parent: parent (instance of Sideral Entity class)
     */
    constructor (parent) {
        this.parent = parent;
    }

    /**
     * @nextCycle
     * @override
     */
    nextCycle () {
        super.nextCycle();

        this._entities  = null;
        this._scene     = null;
        this._resolved  = false;
    }

    /**
     * Resolve all collision (wall and between entities) when entity is moving
     * @returns {void}
     */
    resolveAll () {
        const entity    = this.parent,
            scene       = entity.scene,
            nextX       = entity.props.x + (entity.props.vx * Game.tick),
            nextY       = entity.props.y + (entity.props.vy * Game.tick);

        if (!entity.moving) {
            this.getEntitiesInCollision(entity.props.x, entity.props.x + entity.props.width, entity.props.y, entity.props.y + entity.props.height, { scene: scene, id: entity.id }).forEach(ent => entity.onCollisionWith(ent));

        } else {
            if (entity.x !== nextX) {
                this.resolveChain("x", this.shiftInX(entity, nextX));
            }

            if (entity.y !== nextY) {
                this.resolveChain("y", this.shiftInY(entity, nextY));
            }
        }

        this._resolved = true;
    }

    /**
     * Get all entities in contact
     * @param {number} xmin: position x min
     * @param {number} xmax: position x max
     * @param {number} ymin: position y min
     * @param {number} ymax: position y max
     * @param {Scene=} scene: scene to get all entities
     * @param {string=} id: id to filter
     * @param {Entity=} entities: entities to check
     * @returns {Array.<Entity>} array of entities in collision
     */
    getEntitiesInCollision (xmin, xmax, ymin, ymax, { scene, id, entities }) {
        entities = (entities || scene.children).
            filter(ent => this.filterEntityByPositionY(ent, ymin - 1, ymax + 1)).
            filter(ent => this.filterEntityByPositionX(ent, xmin - 1, xmax + 1));

        return id ? entities.filter(ent => ent.id !== id) : entities;
    }

    /**
     * Shift an entity on x axis
     * @param {Entity} entity: current entity
     * @param {number} nextX: next position
     * @param {Array<{entity: Entity, movable: boolean, nextPos: number, collide: boolean, onLeft: boolean}>} chains: current chains of collisions
     * @returns {Array<{entity: Entity, movable: boolean, nextPos: number, collide: boolean, onLeft: boolean}>} chains of collisions
     */
    shiftInX (entity, nextX, chains = []) {
        if (chains.find(chain => chain.entity.id === entity.id)) {
            return chains;
        }

        if (this.isGhost(entity)) {
            chains.push({ entity: entity, movable: true, nextPos: entity.props.x, collide: entity.collide, onLeft: true, ghost: true });

            return chains;
        }

        const scene     = entity.scene,
            onLeft      = nextX < entity.x,
            logic       = this.getLogicXAt(scene, entity.props.x, nextX, entity.props.y, entity.props.y + entity.props.height, entity.props.width),
            lastChain   = chains[chains.length - 1],
            movable     = lastChain ? this.isMovable(entity, chains) && !logic.collide : !logic.collide;

        chains.push({ entity: entity, movable: movable, nextPos: logic.value, collide: logic.collide, onLeft: onLeft });

        scene.children.
            filter(ent => this.filterEntityByPositionY(ent, entity.props.y, entity.props.y + entity.props.height)).
            filter(ent => this.filterEntityByPositionX(ent, logic.value, logic.value + entity.props.width)).
            filter(ent => !chains.find(chain => chain.entity.id === ent.id)).
            forEach(ent => this.shiftInX(ent, onLeft ? logic.value - ent.width : logic.value + entity.props.width, chains));

        return chains;
    }

    /**
     * Shift an entity on y axis
     * @param {Entity} entity: current entity
     * @param {number} nextY: next position
     * @param {Array<{entity: Entity, movable: boolean, nextPos: number, collide: boolean, onTop: boolean}>} chains: current chains of collisions
     * @returns {Array<{entity: Entity, movable: boolean, nextPos: number, collide: boolean, onTop: boolean, ghost: boolean}>} chains of collisions
     */
    shiftInY (entity, nextY, chains = []) {
        if (this.isGhost(entity)) {
            chains.push({ entity: entity, movable: true, nextPos: entity.props.y, collide: entity.collide, onTop: true, ghost: true });

            return chains;
        }

        const scene     = this.getScene(),
            onTop       = nextY > entity.y,
            logic       = this.getLogicYAt(scene, entity.props.y, nextY, entity.props.x, entity.props.x + entity.props.width, entity.props.height),
            lastChain   = chains[chains.length - 1],
            movable    = lastChain ? this.isMovable(entity, chains) && !logic.collide : !logic.collide;

        chains.push({ entity: entity, movable: movable, nextPos: logic.value, collide: logic.collide, onTop: onTop });

        scene.children.
            filter(ent => this.filterEntityByPositionX(ent, entity.props.x, entity.props.x + entity.props.width)).
            filter(ent => this.filterEntityByPositionY(ent, logic.value, logic.value + entity.props.height)).
            filter(ent => !chains.find(chain => chain.entity.id === ent.id) && ent.id !== entity.id).
            forEach(ent => this.shiftInY(ent, onTop ? logic.value + entity.props.height : logic.value - ent.height, chains));

        return chains;
    }

    /**
     * Resolve all chains of collisions
     * @param {string} axis: axis x or y
     * @param {Array<{entity: Entity, movable: boolean, nextPos: number, collide: boolean, onLeft: boolean, onTop: boolean, ghost: boolean}>} chains: current chains of collisions
     * @returns {void}
     */
    resolveChain (axis, chains = []) {
        const indexEntityBlocked    = chains.findIndex(chain => !chain.movable);
        let lastChain               = null;

        if (indexEntityBlocked >= 0) {
            chains.slice(0, indexEntityBlocked + 1).reverse().forEach((chain, index, array) => {
                const nextChain     = array.slice(index + 1).find(x => !x.ghost);

                if (nextChain) {
                    if (axis === "x" && this.filterEntityByPositionY(nextChain.entity, chain.entity.props.y, chain.entity.props.y + chain.entity.props.height)) {
                        nextChain.entity.x  = chain.onLeft ? chain.entity.props.x + chain.entity.props.width : chain.entity.props.x - nextChain.entity.props.width;

                    } else if (axis === "y" && this.filterEntityByPositionX(nextChain.entity, chain.entity.props.x, chain.entity.props.x + chain.entity.props.width)) {
                        nextChain.entity.y  = chain.onTop ? chain.entity.props.y - nextChain.entity.props.height : chain.entity.props.y + chain.entity.props.height;

                    }
                }

                console.log(chain.entity, chain.entity.collide);
                chain.entity.collide[axis] = chain.collide;

                this.resolveBouncing(chain, lastChain && lastChain.entity);

                lastChain = chain;
            });

        } else {
            chains.filter(chain => !chain.ghost).forEach((chain, index, array) => {
                chain.entity.props[axis]    = chain.nextPos;
                chain.entity.collide[axis]  = chain.collide;

                if (axis === "y") {
                    chain.entity.standing   = chain.collide;
                }

                lastChain = index && array[index - 1];

                this.resolveBouncing(chain, lastChain && lastChain.entity);
            });
        }

        // Call event onCollisionWith
        chains.forEach((chain, index, array) => {
            if (chain.ghost) {
                this.getEntitiesInCollision(chain.entity.props.x, chain.entity.props.x + chain.entity.props.width, chain.entity.props.y, chain.entity.props.y + chain.entity.props.height, { id: chain.entity.id, entities: chains.map(x => x.entity) }).
                    forEach(other => {
                        chain.entity.onCollisionWith(other);
                        other.onCollisionWith(chain.entity)
                    });

            } else {
                const nextChain = array[index + 1];

                lastChain       = array[index - 1];

                if (lastChain && !lastChain.ghost) {
                    chain.entity.onCollisionWith(lastChain.entity);
                }

                if (nextChain && !nextChain.ghost) {
                    chain.entity.onCollisionWith(nextChain.entity);
                }
            }

            if (chain.entity.collision) {
                chain.entity.collision._resolved = true;
            }
        });
    }

    /**
     * Resolve bouncing with chain
     * @param {{entity: Entity, movable: boolean, nextPos: number, collide: boolean, onLeft: boolean, onTop: boolean, ghost: boolean}} chain: current chains of collisions
     * @param {*} other: other if the bouncing is established with a collision with another entity
     * @returns {void}
     */
    resolveBouncing (chain, other) {
        if (typeof chain.onTop === "undefined") {
            this.resolveBouncingX(chain.entity, other, chain.collide, chain.onLeft);

        } else {
            this.resolveBouncingY(chain.entity, other, chain.collide, chain.onTop);

        }
    }

    /**
     * Resolve bouncing in x axis
     * @param {*} entity: entity targeted (instance of Sideral Entity class)
     * @param {*} other: other entity if the bouncing is established with a collision with it
     * @param {{x: boolean, y: boolean}} collide: collide object
     * @param {boolean} onLeft: side of collision
     * @returns {void|null} -
     */
    resolveBouncingX (entity, other, collide, onLeft) {
        if (!entity.props.bouncing || entity.props.mass === Entity.MASS.SOLID) {
            return null;
        }

        entity.props.vx = other
            ? Math.abs(other.props.vx || entity.props.vx) * (other.props.x < entity.props.x ? 1 : -1) * entity.props.bouncing
            : (collide ? Math.abs(entity.props.vx) * (onLeft ? 1 : -1) * entity.props.bouncing : entity.props.vx);

        if (other && !entity.props.vy && other.props.vy) {
            entity.props.vy = other.props.vy * entity.props.bouncing;
        }
    }


    /**
     * Resolve bouncing in y axis
     * @param {*} entity: entity targeted (instance of Sideral Entity class)
     * @param {*} other: other entity if the bouncing is established with a collision with it
     * @param {{x: boolean, y: boolean}} collide: collide object
     * @param {boolean} onTop: side of collision
     * @returns {void|null} -
     */
    resolveBouncingY (entity, other, collide, onTop) {
        if (!entity.props.bouncing || entity.props.mass === Entity.MASS.SOLID) {
            return null;
        }

        const bouncing      = entity.props.bouncing;

        entity.props.vy = other
            ? Math.abs(other.props.vy || entity.props.vy) * (other.props.y < entity.props.y ? 1 : -1) * bouncing
            : (collide ? Math.abs(entity.props.vy) * (onTop ? -bouncing : bouncing) : entity.props.vy);
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
     * Check if the entity is movable relative to other entity
     * @param {Entity} entity : the entity
     * @param {Array} chains : chains of collisions
     * @returns {boolean} is movable
     */
    isMovable (entity, chains = []) {
        if (!entity) {
            return false;
        }

        const mass = entity.props.mass;

        if (chains.length > 1) {
            return mass !== Entity.MASS.SOLID;
        }

        const lastChain     = chains[chains.length - 1],
            lastEntity      = chains[chains.length - 1].entity,
            lastEntityMass  = lastEntity.props.mass;

        if (lastEntityMass === Entity.MASS.WEAK && lastEntityMass === mass) {
            return !(lastEntity.props["v" + lastChain.axis] || entity.props["v" + lastChain.axis]);
        }

        return mass < lastEntityMass;
    }

    /**
     * Check if the entity passed in parameter is a ghost (mass === NONE)
     * @param {Entity} entity: entity to check
     * @returns {boolean} return true if the entity is a ghost
     */
    isGhost (entity) {
        if (!entity) {
            return true;
        }

        return entity.props.mass === Entity.MASS.NONE;
    }

    /**
     * Filter an entity by range of position in x axis
     * @param {Entity} entity: entity to check
     * @param {number} xmin: position x min
     * @param {number} xmax: position x max
     * @returns {boolean} if entity is in range of position in x axis
     */
    filterEntityByPositionX (entity, xmin, xmax) {
        return entity.props.x > (xmin - entity.props.width) && entity.props.x < xmax;
    }

    /**
     * Filter an entity by range of position in y axis
     * @param {Entity} entity: entity to check
     * @param {number} ymin: position y min
     * @param {number} ymax: position y max
     * @returns {boolean} if entity is in range of position in y axis
     */
    filterEntityByPositionY (entity, ymin, ymax) {
        return entity.props.y > (ymin - entity.props.height) && entity.props.y < ymax;
    }
}
