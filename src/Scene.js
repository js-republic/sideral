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
    }

    /* METHODS */


    /**
     * When tilemap change
     * @param {*} tilemap: next Tilemap to render
     * @param {function=} next: next callback
     * @returns {void|null} -
     */
    setTilemap (tilemap, next) {
        if (!tilemap) {
            return null;
        }

        const loader = new PIXI.loaders.Loader();

        this.removeTilemap();

        this.tilemap        = tilemap;
        this.tilemap.width  = 0;
        this.tilemap.height = 0;

        // Determine the size of the tilemap
        this.tilemap.grid.visual.forEach(layer => layer.forEach(line => {
            this.tilemap.width = line.length > this.tilemap.width ? line.length : this.tilemap.width;
        }));

        this.tilemap.width *= this.tilemap.tilewidth;
        this.tilemap.height = this.tilemap.grid.visual[0].length * this.tilemap.tileheight;

        // Load all assets
        loader.add("tilemap", this.tilemap.path);

        if (this.tilemap.backgrounds) {
            this.tilemap.backgrounds.forEach((background, index) => loader.add(`background${index}`, background.path));
        }

        if (this.tilemap.decorators) {
            Object.keys(this.tilemap.decorators.data).forEach(key => loader.add(key, this.tilemap.decorators.data[key]));
        }

        loader.load((currentLoader, resources) => {
            this._loadTilemapBackgrounds(resources);
            this._loadTilemapGrids();
            this._loadTilemapDecorators(resources);

            if (next) {
                next();
            }
        });
    }

    /**
     * Remove current tilemap
     * @returns {void|null} -
     */
    removeTilemap () {
        if (!this.tilemap) {
            return null;
        }

        if (this.tilemap.sprite) {
            this._container.removeChild(this.tilemap.sprite);
        }

        if (this.tilemap.backgroundSprites) {
            this.tilemap.backgroundSprites.forEach(backgroundSprite => this._container.removeChild(backgroundSprite));
        }

        if (this.tilemap.decoratorSprites) {
            this.tilemap.decoratorSprites.forEach(decoratorSprite => this._container.removeChild(decoratorSprite));
        }

        this.tilemap = null;
    }

    /**
     * Load the tilemap grids and logics
     * @returns {void}
     * @private
     */
    _loadTilemapGrids () {
        const canvas    = document.createElement("canvas"),
            ctx         = canvas.getContext("2d"),
            image       = new Image();

        canvas.width    = this.tilemap.width;
        canvas.height   = this.tilemap.height;

        // Render the tilemap into the canvas
        image.onload = () => {
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
            this._container.addChild(this.tilemap.sprite);
        };

        image.src = this.tilemap.path;
    }

    /**
     * Load all backgrounds provided by the tilemap
     * @param {*} resources: PIXI Loader resources
     * @returns {void|null} -
     * @private
     */
    _loadTilemapBackgrounds (resources) {
        if (!this.tilemap.backgrounds) {
            return null;
        }

        this.tilemap.backgroundSprites = this.tilemap.backgrounds.map((background, index) => {
            const backgroundSprite = new PIXI.Sprite(resources[`background${index}`].texture);

            this._container.addChildAt(backgroundSprite, 0);

            if (background.offset) {
                backgroundSprite.x = background.offset.x;
                backgroundSprite.y = background.offset.y;
            }

            if (typeof background.ratio !== "undefined" && background.ratio !== 1) {
                backgroundSprite.scale.x = background.ratio;
                backgroundSprite.scale.y = background.ratio;
            }

            return backgroundSprite;
        });
    }

    /**
     * Load all decorators provided by the tilemap
     * @param {*} resources: PIXI Textures resources
     * @returns {void|null} -
     * @private
     */
    _loadTilemapDecorators (resources) {
        if (!this.tilemap.decorators || (this.tilemap.decorators && !this.tilemap.decorators.items)) {
            return null;
        }

        this.tilemap.decoratorSprites = this.tilemap.decorators.items.
            map(item => {
                const sprite = new PIXI.Sprite(resources[item[0]].texture);

                sprite.x = item[1];
                sprite.y = item[2];

                return sprite;
            }).
            forEach(decoratorSprite => this._container.addChild(decoratorSprite));
    }
}
