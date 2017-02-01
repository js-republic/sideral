import Engine from "./Engine";
import Component from "./Component";


export default class Scene extends Component {

    /* LIFECYCLE */

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
    getLogicYAtOLD (posY, nextY, xmin, xmax, height) {
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

    getLogicYAt (posY, nextY, xmin, xmax, height) {
        if (!this.tilemap || (this.tilemap && !this.tilemap.sprite)) {
            return nextY;
        }

        const orientation   = nextY > posY ? 1 : -1,
            cellYMin        = orientation > 0 ? Math.floor(posY / this.tilemap.tileheight) : Math.floor(nextY / this.tilemap.tileheight),
            cellYMax        = orientation > 0 ? Math.floor((nextY + height) / this.tilemap.tileheight) : Math.floor((posY + height) / this.tilemap.tileheight),
            cellXMin        = Math.floor(Math.abs(xmin) / this.tilemap.tilewidth),
            cellXMax        = Math.floor(Math.abs(xmax - 1) / this.tilemap.tilewidth);

        let grid            = null;

        const loopParameter = {
            start           : orientation > 0 ? cellYMin : cellYMax,
            end             : orientation > 0 ? cellYMax : cellYMin,
            lastCollide     : null
        };

        for (let y = loopParameter.start; y !== (loopParameter.end + orientation); y += orientation) {
            grid = this.tilemap.grid.logic[y];

            if (!grid) {
                continue;
            }

            for (let x = cellXMin; x <= cellXMax; x++) {
                if (grid[x]) {

                    /*
                    return orientation > 0
                        ? (y * this.tilemap.tileheight) - height
                        : (y + 1) * this.tilemap.tileheight;
                    */

                    loopParameter.lastCollide = {x: x, y: y};
                }
            }
        }

        return nextY;
    }

    /* PRIVATE */

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
