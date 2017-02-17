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
}
