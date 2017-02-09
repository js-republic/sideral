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
         * @readonly
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
    }

    /* METHODS */


    /**
     * When tilemap change
     * @private
     * @param {*} tilemap: next Tilemap to render
     * @returns {void|null} -
     */
    setTilemap (tilemap) {
        if (!tilemap) {
            return null;
        }

        const canvas    = document.createElement("canvas"),
            ctx         = canvas.getContext("2d"),
            image       = new Image();

        if (this.tilemap && this.tilemap.sprite) {
            this._container.removeChild(this.tilemap.sprite);
        }

        this.tilemap        = tilemap;
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

        /*
        intersections.forEach(intersection => {
            const entity    = intersection[0],
                other       = intersection[1],
                vector      = intersection[2];

            if (entity.moving || other.moving) {
                const impact = this._getEntitiesImpactedByStrongerEntities(entity, intersections);

                console.log(impact);
                this._replaceEntityByIntersection(...intersection);
            }
        });
        */

        entities.filter(entity => entity.moving).forEach(entity => {
            const impact    = this._getEntitiesImpactedByStrongerEntities(entity, intersections);

            let lastEntity  = entity;

            if (impact.moveable) {
                impact.entities.forEach(other => {});
            }
        });

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
            const vectorVelocity = entity.getVectorVelocity();

            recursive = { vector: {x: vectorVelocity.x, y: vectorVelocity.y || (!entity.collide.y && this.gravity ? 1 : 0)}, moveable: true, entities: [] };
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

        recursive.moveable = recursive.entities.length ? recursive.moveable : true;

        return recursive;
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
                entity.x = vector.x > 0 ? other.x + other.width : other.x - entity.width;

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
}
