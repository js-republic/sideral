import Engine from "./Engine";
import Component from "./Component";


export default class Scene extends Component {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name = "scene";

        /**
         * Stage of PIXI
         * @type {*}
         */
        this._container  = new PIXI.Container();

        /**
         * Gravity of the scene
         * @type {number}
         */
        this.gravity    = 0;

        /**
         * Scale of the scene
         * @type {number}
         */
        this.scale      = 1;

        /**
         * Width of the scene
         * @type {number}
         */
        this.width      = Engine.width;

        /**
         * Height of the scene
         * @type {number}
         */
        this.height     = Engine.height;

        /**
         * set a tilemap to the current Scene
         * @type {*}
         */
        this.tilemap    = null;

        // Private

        /**
         * Canvas to store the current tilemap texture
         * @private
         * @type {*}
         */
        this._canvas    = null;

        // Auto-binding

        this._onTilemapChange = this._onTilemapChange.bind(this);
    }

    /**
     * @override
     */
    setReactivity () {
        super.setReactivity();

        this.reactivity.
            when("tilemap").change(this._onTilemapChange);
    }

    /**
     * @update
     * @override
     */
    update () {
        super.update();

        this.updateCollisionBetweenEntities();
    }

    /* METHODS */

    /**
     * Determine if there is a collision on X axis
     * @param {number} posX: position X
     * @param {number} nextX: position X needed
     * @param {number} ymin: position Y Min
     * @param {number} ymax: position Y Max
     * @param {number} width: width of the object
     * @returns {number} get the position x
     */
    getLogicXAt (posX, nextX, ymin, ymax, width) {
        if (!this.tilemap || (this.tilemap && !this.tilemap.sprite)) {
            return nextX;
        }

        const orientation   = nextX > posX ? 1 : -1,
            cellXMin        = orientation > 0 ? Math.floor((posX + width) / this.tilemap.tilewidth) : Math.floor(posX / this.tilemap.tilewidth) - 1,
            cellXMax        = orientation > 0 ? Math.floor((nextX + width) / this.tilemap.tilewidth) : Math.floor(nextX / this.tilemap.tileheight),
            cellYMin        = Math.floor(Math.abs(ymin) / this.tilemap.tileheight),
            cellYMax        = Math.floor(Math.abs(ymax - 1) / this.tilemap.tileheight),
            grid            = this.tilemap.grid.logic;

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
                    return orientation > 0 ? (x * this.tilemap.tilewidth) - width : (x + 1) * this.tilemap.tilewidth;
                }
            }
        }

        return nextX;
    }

    /**
     * Determine if there is a collision on y axis
     * @param {number} posY : Y axis
     * @param {number} nextY : Y axis position needed
     * @param {number} xmin : X Min
     * @param {number} xmax : X Max
     * @param {number} height : height of the object
     * @returns {number} get the position y
     */
    getLogicYAt (posY, nextY, xmin, xmax, height) {
        if (!this.tilemap || (this.tilemap && !this.tilemap.sprite)) {
            return nextY;
        }

        const orientation   = nextY > posY ? 1 : -1,
            cellYMin        = orientation > 0 ? Math.floor((posY + height) / this.tilemap.tileheight) : Math.floor(nextY / this.tilemap.tileheight),
            cellYMax        = orientation > 0 ? Math.floor((nextY + height) / this.tilemap.tileheight) : Math.floor(posY / this.tilemap.tileheight),
            cellXMin        = Math.floor(Math.abs(xmin) / this.tilemap.tilewidth),
            cellXMax        = Math.floor(Math.abs(xmax - 1) / this.tilemap.tilewidth);

        let grid            = null;

        const loopParameter = {
            start: orientation > 0 ? cellYMin : cellYMax,
            end: orientation > 0 ? cellYMax : cellYMin
        };

        for (let y = loopParameter.start; y !== (loopParameter.end + orientation); y += orientation) {
            grid = this.tilemap.grid.logic[y];

            if (!grid) {
                continue;
            }

            for (let x = cellXMin; x <= cellXMax; x++) {
                if (grid[x]) {
                    return orientation > 0
                        ? (y * this.tilemap.tileheight) - height
                        : (y + 1) * this.tilemap.tileheight;
                }
            }
        }

        return nextY;
    }

    /**
     * Resolve all collision between entities children
     * @returns {void}
     */
    updateCollisionBetweenEntities () {
        const entities      = this.children.filter(x => x.mass !== x.MASS.NONE),
            intersections   = [];

        // 1st step - get all intersections
        entities.forEach((entity, index) => {
            for (let i = index + 1; i < entities.length; i++) {
                const other         = entities[i],
                    intersection    = entity.intersect(other);

                if (intersection) {
                    intersections.push([entity, other, intersection]);
                }
            }
        });

        // 2nd step - repositioning of entity by its collision
        intersections.forEach(intersection => this._replaceEntityByIntersection(...intersection));

        // 3rd step - call event onCollisionWith
        intersections.forEach(intersection => {
            intersection[0].onCollisionWith(intersection[1]);
            intersection[1].onCollisionWith(intersection[0]);
        });
    }

    /* PRIVATE */

    /**
     * Know all if entities in collision are weaker than other and must be moved
     * @private
     * @param {Entity} entity: entity
     * @param {Array<[Entity, Entity, {x: number, y: number}]>} intersections: the current intersections object
     * @param {{vector: {x: number, y: number}, moveable: boolean, entities: Array<Entity>}=} recursive: recursive object
     * @returns {{vector: {x: number, y: number}, moveable: boolean, entities: Array<Entity>}} recursive object
     */
    _getEntitiesImpactedByStrongerEntities (entity, intersections, recursive) {
        if (!recursive) {
            recursive = { vector: entity.getVectorVelocity(), moveable: true, entities: [] };
        }

        if (recursive.entities.length && (entity.mass === entity.MASS.SOLID || (recursive.vector.x && entity.collide.y) || (recursive.vector.y && entity.collide.y))) {
            recursive.moveable = false;

            return recursive;
        }

        intersections.filter(intersection => intersection[0].id === entity.id || intersection[1].id === entity.id).forEach(intersection => {
            const other = intersection[0].id === entity.id ? intersection[1] : intersection[0],
                vector  = intersection[2];

            if ((recursive.vector.x && recursive.vector.y) || (((vector.x === recursive.vector.x && vector.x === 0) || (vector.x !== recursive.vector.x && vector.x !== 0)) &&
                ((vector.y === recursive.vector.y && vector.y === 0) || (vector.y !== recursive.vector.y && vector.y !== 0)))) {

                recursive.entities.push(other);

                if ((recursive.vector.x && recursive.vector.y) || (!recursive.vector.x && !recursive.vector.y)) {
                    recursive.vector = {x: vector.x ? -vector.x : 0, y: vector.y ? -vector.y : 0};
                }

                return this._getEntitiesImpactedByStrongerEntities(other, intersections, recursive);
            }
        });
    }

    /**
     * Repositioning of entity by its vector collision
     * @private
     * @param {Entity} entity: the first entity
     * @param {Entity} other: the second entity
     * @param {{x: number, y: number}} vector: the vector collision related to the first entity
     * @returns {void}
     */
    _replaceEntityByIntersection (entity, other, vector) {
        if (vector.x) {
            if (other.vx && entity.vx && ((entity.vx < 0 && other.vx > 0) || (entity.vx > 0 && other.vx < 0))) {
                if (Math.abs(entity.vx) < Math.abs(other.vx)) {
                    entity.x -= entity.vx * Engine.tick;

                } else {
                    other.x -= other.vx * Engine.tick;

                }

                entity.vx   = 0;
                other.vx    = 0;

            } else {
                entity.x = vector.x > 0 ? other.x - entity.width : other.x + other.width;

            }
        }

        if (vector.y) {
            entity.y = vector.y > 0 ? other.y + other.height : other.y - entity.height;

            // Resolve Y with gravity
            entity.standing = vector.y < 0;
            entity.falling  = vector.y > 0;

            if (entity.standing) {
                entity.vy = 0;
            }

            if (vector.y < 0 && other.vx) {
                entity.x += other.vx * Engine.tick;
            }
        }
    }

    /**
     * When tilemap change
     * @private
     * @param {*} previousValue: previous value
     * @returns {void}
     */
    _onTilemapChange (previousValue) {
        const canvas    = document.createElement("canvas"),
            ctx         = canvas.getContext("2d"),
            image       = new Image();

        if (previousValue && previousValue.sprite) {
            this._container.removeChild(previousValue.sprite);
        }

        this.tilemap.width  = 0;
        this.tilemap.height = 0;

        // Determine the size of the tilemap
        this.tilemap.grid.visual.forEach(layer => layer.forEach(line => {
            this.tilemap.width = line.length > this.tilemap.width ? line.length : this.tilemap.width;
        }));

        this.tilemap.width *= this.tilemap.tilewidth;
        this.tilemap.height = this.tilemap.grid.visual[0].length * this.tilemap.tileheight;
        canvas.width        = this.tilemap.width;
        canvas.height       = this.tilemap.height;

        // Load the tileset
        image.onload = () => {

            // Render the tilemap into the canvas
            this.tilemap.grid.visual.forEach(layer => layer.forEach((line, y) => line.forEach((tile, x) => {
                ctx.drawImage(image,
                    Math.floor(tile * this.tilemap.tilewidth) % image.width,
                    Math.floor(tile * this.tilemap.tilewidth / image.width) * this.tilemap.tileheight,
                    this.tilemap.tilewidth, this.tilemap.tileheight,
                    x * this.tilemap.tilewidth, y * this.tilemap.tileheight,
                    this.tilemap.tilewidth, this.tilemap.tileheight
                );
            })));

            this.tilemap.sprite = PIXI.Sprite.from(canvas);

            this._container.addChildAt(this.tilemap.sprite, 0);
        };

        image.src = this.tilemap.path;
    }
}
