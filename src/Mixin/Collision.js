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

    /**
     * @initialize
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.interceptFunction("updateVelocity", this.updateVelocity);
    }

    /**
     * @nextCycle
     * @override
     */
    nextCycle () {
        super.nextCycle();

        this._entities  = null;
        this._scene     = null;
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
        const entity    = this.parent,
            nextX       = entity.x + (entity.vx * Engine.tick),
            nextY       = entity.y + (entity.vy * Engine.tick);

        if (entity.x !== nextX) {
            this.resolveChain("x", this.shiftInX(entity, nextX));
        }

        if (entity.y !== nextY) {
            this.resolveChain("y", this.shiftInY(entity, nextY));
        }
    }

    shiftInX (entity, nextX, chains = []) {
        const scene     = this.getScene(),
            onLeft      = nextX < entity.x,
            logic       = this.getLogicXAt(scene, entity.x, nextX, entity.y, entity.y + entity.height, entity.width),
            lastChain   = chains[chains.length - 1],
            moveable    = lastChain ? this.isWeakerThan(entity, lastChain.entity) && !logic.collide : !logic.collide;

        chains.push({ entity: entity, moveable: moveable, nextPos: logic.value, collide: logic.collide, onLeft: onLeft });

        this.getEntities(scene).
            filter(ent => this.filterEntityByPositionY(ent, entity.y, entity.y + entity.height)).
            filter(ent => this.filterEntityByPositionX(ent, logic.value, logic.value + entity.width)).
            filter(ent => !chains.find(chain => chain.entity.id === ent.id) && ent.id !== entity.id).
            forEach(ent => this.shiftInX(ent, onLeft ? logic.value - ent.width : logic.value + entity.width, chains));

        return chains;
    }

    shiftInY (entity, nextY, chains = []) {
        const scene     = this.getScene(),
            onTop       = nextY > entity.y,
            logic       = this.getLogicYAt(scene, entity.y, nextY, entity.x, entity.x + entity.width, entity.height),
            lastChain   = chains[chains.length - 1],
            moveable    = lastChain ? this.isWeakerThan(entity, lastChain.entity) && !logic.collide : !logic.collide;

        chains.push({ entity: entity, moveable: moveable, nextPos: logic.value, collide: logic.collide, onTop: onTop });

        this.getEntities(scene).
            filter(ent => this.filterEntityByPositionX(ent, entity.x, entity.x + entity.width)).
            filter(ent => this.filterEntityByPositionY(ent, logic.value, logic.value + entity.height)).
            filter(ent => !chains.find(chain => chain.entity.id === ent.id) && ent.id !== entity.id).
            forEach(ent => this.shiftInY(ent, onTop ? logic.value + entity.height : logic.value - ent.height, chains));

        return chains;
    }

    resolveChain (axis, chains = []) {
        const indexEntityBlocked = chains.findIndex(chain => !chain.moveable);

        if (indexEntityBlocked >= 0) {
            chains.splice(0, indexEntityBlocked).reverse().forEach((chain, index, array) => {
                const nextChain = array[index + 1];

                // TODO: finir
                if (nextChain) {
                    if (axis === "x") {
                        chain.entity.x  = nextChain.onLeft ? nextChain.entity.x + nextChain.entity.width : nextChain.entity.x - chain.entity.x;

                    } else {
                        chain.entity.y  = nextChain.onTop ? chain.entity.y - nextChain.entity.y : chain.entity.y - chain.entity.height;

                    }
                }

                chain.entity.collide    = true;
            });

        } else {
            chains.forEach(chain => {
                if (chain.moveable) {
                    chain.entity[axis]                      = chain.nextPos;
                    chain.entity.collision.collide[axis]    = chain.collide;
                }
            });
        }
    }

    resolveX (entity, nextX, scene) {

        /*
        const onRight   = nextX > entity.x,
            logic       = this.getLogicXAt(scene, entity.x, nextX, entity.y, entity.y + entity.height, entity.width),
            entities    = this.getEntities(scene).filter(other => this.filterEntityByPositionY(other, entity.y, entity.y + entity.height)),
            firstEntity = { entity: entity, moveable: true, value: nextX },
            collisions  = entities.filter(other => this.filterEntityByPositionX(other, entity.x, logic.value + entity.width)).
                map(other => {
                    return { entity: other, moveable: true, value: other.x, chain: [] };
                });

        // Chain of chain
        collisions.forEach(collision => {
            entities.forEach(other => {
                if (other.x > (collision.value - other.width) && other.x < (collision.value + collision.entity.width)) {
                    collision.chain.push({ entity: other, moveable: true, value: other.x });
                }
            });
        });

        // Theorical chain
        collisions.forEach(collision => collision.chain.sort((a, b) => onRight ? a.entity.x - b.entity.x : b.entity.x - a.entity.x).forEach((other, index, array) => {
            const lastOther = index ? array[index - 1] : firstEntity;

            lastOther.moveable  = onRight ? this.isWeakerThan(lastOther.entity, other.entity) : this.isWeakerThan(other.entity, lastOther.entity);
            other.value         = onRight ? lastOther.entity.x + lastOther.entity.width : lastOther.entity.x - other.entity.width;
        }));

        if (collisions.length) {
            collisions.forEach(collision => {
                const chain = [firstEntity].concat(collision.chain),
                    bloc    = chain.filter(other => other.entity.id !== entity.id).findIndex(other => !other.moveable);

                if (bloc >= 0) {
                    for (let i = bloc; i > 0; i--) {
                        const other     = chain[i],
                            lastOther   = chain[i - 1];

                        lastOther.entity.x = onRight ? other.entity.x - lastOther.entity.width : other.entity.x + other.entity.width;
                    }
                } else {
                    chain.forEach(other => other.entity.x = other.value);
                }
            });

        } else {
            entity.x = nextX;
        }
        */

        const onLeft    = nextX < entity.x,
            logic       = this.getLogicXAt(scene, entity.x, nextX, entity.y, entity.y + entity.height, entity.width),
            entities    = this.getEntities(scene).filter(other => this.filterEntityByPositionY(other, entity.y, entity.y + entity.height));

        // Create collisions array
        const collisions = entities.filter(other => this.filterEntityByPositionX(other, entity.x, logic.value + entity.width)).map(other => {
            const currentEntity = { entity: other, moveable: true, nextX: onLeft ? logic.value - other.width : logic.value + entity.width };
            let lastEntity      = currentEntity;

            return [currentEntity].concat(entities.
                filter(ent => this.filterEntityByPositionX(ent, nextX, nextX + other.width)).
                sort((a, b) => onLeft ? b.x - a.x : a.x - b.x).
                map(ent => {
                    const nextEntity    = { entity: ent, moveable: true, nextX: onLeft ? lastEntity.nextX - ent.x : lastEntity.x + ent.width };

                    lastEntity.moveable = !this.isStrongerThan(ent, lastEntity.entity);
                    lastEntity          = nextEntity;

                    return nextEntity;
            }));
        });

        if (collisions.length) {

            collisions.forEach(collision => {
                const strongerEntityIndex = collision.findIndex(col => !col.moveable);

                console.log(collision, strongerEntityIndex);

                if (strongerEntityIndex >= 0) {
                    collision.slice(strongerEntityIndex, 1).reverse().forEach((ent, index, array) => {
                        const nextEntity = index === (array.length - 1) ? entity : array[index - 1].entity;

                        nextEntity.x = onLeft ? ent.x - nextEntity.width : ent.x + ent.width;
                    });

                } else {
                    collision.concat([{ entity: entity, moveable: true, nextX: logic.value }]).forEach(col => col.entity.x = col.nextX);
                }
            });

        } else {
            entity.x        = logic.value;
            this.collide.x  = logic.collide;
        }
    }

    resolveY (entity, nextY, scene) {
        const onTop     = nextY < entity.y,
            logic       = this.getLogicYAt(scene, entity.y, nextY, entity.x, entity.x + entity.width, entity.height),
            entities    = this.getEntities(scene).filter(other => this.filterEntityByPositionX(other, entity.x, entity.x + entity.width)),
            firstEntity = { entity: entity, moveable: true, value: nextY },
            collisions  = entities.filter(other => this.filterEntityByPositionY(other, entity.y, logic.value + entity.height)).
            map(other => {
                return { entity: other, moveable: true, value: other.y, chain: [] };
            });

        // Chain of chain
        collisions.forEach(collision => {
            entities.forEach(other => {
                if (other.y > (collision.value - other.height) && other.y < (collision.value + collision.entity.height)) {
                    collision.chain.push({ entity: other, moveable: true, value: other.y });
                }
            });
        });

        // Theorical chain
        collisions.forEach(collision => collision.chain.sort((a, b) => onTop ? b.entity.y - a.entity.y : a.entity.y - b.entity.y).forEach((other, index, array) => {
            const lastOther = index ? array[index - 1] : firstEntity;

            lastOther.moveable  = onTop ? this.isWeakerThan(other.entity, lastOther.entity) : this.isWeakerThan(lastOther.entity, other.entity);
            other.value         = onTop ? lastOther.entity.y - other.entity.height : lastOther.entity.y + lastOther.entity.height ;
        }));

        if (collisions.length) {
            console.log(collisions);

            collisions.forEach(collision => {
                const chain = [firstEntity].concat(collision.chain),
                    bloc    = chain.filter(other => other.entity.id !== entity.id).findIndex(other => !other.moveable);

                if (bloc >= 0) {
                    for (let i = bloc; i > 0; i--) {
                        const other     = chain[i],
                            lastOther   = chain[i - 1];

                        lastOther.entity.y = onTop ? other.entity.y + other.entity.height : other.entity.y - lastOther.entity.height;
                    }
                } else {
                    chain.forEach(other => other.entity.y = other.value);
                }
            });

        } else {
            entity.y = nextY;
        }
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
     * @returns {{collide: boolean, value: number}} get the position x
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
                    result.value    = orientation > 0 ? (x * scene.tilemap.tilewidth) - width : (x + 1) * scene.tilemap.tilewidth;

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
        if (!scene.tilemap || (scene.tilemap && !scene.tilemap.sprite)) {
            return nextY;
        }

        const orientation   = nextY > posY ? 1 : -1,
            cellYMin        = orientation > 0 ? Math.floor((posY + height) / scene.tilemap.tileheight) : Math.floor(nextY / scene.tilemap.tileheight),
            cellYMax        = orientation > 0 ? Math.floor((nextY + height) / scene.tilemap.tileheight) : Math.floor(posY / scene.tilemap.tileheight),
            cellXMin        = Math.floor(Math.abs(xmin) / scene.tilemap.tilewidth),
            cellXMax        = Math.floor(Math.abs(xmax - 1) / scene.tilemap.tilewidth),
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
                    result.value    = orientation > 0 ? (y * scene.tilemap.tileheight) - height : (y + 1) * scene.tilemap.tileheight;

                    return result;
                }
            }
        }

        return result;
    }

    /**
     * Check if the parent is weaker than other in mass
     * @param {Entity} entity: entity to check
     * @param {Entity} other: other entity
     * @returns {boolean} is weaker than
     */
    isWeakerThan (entity, other) {
        return entity.has("collision") && other.has("collision") && entity.collision.mass < other.collision.mass;
    }

    /**
     * Check if the parent is stronger than other in mass
     * @param {Entity} entity: entity to check
     * @param {Entity} other: other entity
     * @returns {boolean} is stronger than
     */
    isStrongerThan (entity, other) {
        return entity.has("collision") && other.has("collision") && entity.collision.mass >= other.collision.mass;
    }

    /**
     * Get all entities in same axis with min and max value of this axis
     * @param {Array<Entity>} entities: entites to check
     * @param {string} axis: axis x or y
     * @param {number} min: min value of the axis
     * @param {number} max: max value of the axis
     * @returns {Array<Entity>} list of entities in the same axis
     */
    getEntitiesInAxis (entities, axis, min, max) {
        const size  = axis === "x" ? "width" : "height";

        return entities.filter(entity => {
            const posMin    = entity[axis],
                posMax      = posMin + entity[size];

            return posMin <= max || posMax >= min;
        });
    }

    filterEntityByPositionX (entity, xmin, xmax) {
        return entity.x > (xmin - entity.width) && entity.x < xmax;
    }

    filterEntityByPositionY (entity, ymin, ymax) {
        return entity.y > (ymin - entity.height) && entity.y < ymax;
    }

    /**
     * Get position of an entity by axis passed in parameter
     * @param {Entity} entity: entity to check
     * @param {string} axis: axis x or y
     * @returns {{axis: string, min: number, max: number}} get object of position by axis
     */
    getEntityPositionInAxis (entity, axis) {
        return {
            axis: axis,
            min : entity[axis],
            max : entity[axis] + entity[axis === "x" ? "width" : "height"]
        };
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
     * @param {Scene} scene: Get entities from the current scene
     * @returns {Array<Entity>} list of entities provided by the scene
     */
    getEntities (scene) {
        if (this._entities) {
            return this._entities;
        }

        this._entities = scene.children.filter(child => child instanceof Entity && child.id !== this.parent.id);

        return this._entities;
    }

    /**
     * Get current scene
     * @returns {Scene} current scene
     */
    getScene () {
        if (this._scene) {
            return this._scene;
        }

        this._scene = this.parent.getScene();

        return this._scene;
    }
}
