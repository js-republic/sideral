import AbstractModule from "./../Abstract/AbstractModule";


export default class Tilemap extends AbstractModule {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            tilewidth   : 0,
            tileheight  : 0
        });

        this.grid                   = {};
        this.gridContainer          = null;
        this.backgroundContainers   = [];
        this.decoratorContainers    = [];
    }


    /* METHODS */

    /**
     * Set a data to construct the tilemap
     * @param {*} data: data generaly provided by a json file
     * @returns {void}
     */
    setData (data) {
        const loader    = new PIXI.loaders.Loader();

        this.removeData();

        this.props.width        = 0;
        this.props.height       = 0;
        this.props.tilewidth    = data.tilewidth;
        this.props.tileheight   = data.tileheight;
        this.grid               = data.grid;

        // Determine the size of the tilemap
        data.grid.visual.forEach(layer => layer.forEach(line => {
            this.props.width = line.length > this.props.width ? line.length : this.props.width;
        }));

        this.props.width *= this.props.tilewidth;
        this.props.height = data.grid.visual[0].length * this.props.tileheight;

        // Load all assets
        if (data.backgrounds) {
            data.backgrounds.forEach((background, index) => loader.add(`background${index}`, background.path));
        }

        if (data.decorators) {
            Object.keys(data.decorators.data).forEach(key => loader.add(key, data.decorators.data[key]));
        }

        loader.load((currentLoader, resources) => {
            this._loadBackgrounds(data.backgrounds, resources);
            this._loadGrids(data.grid, data.path);
            this._loadDecorators(data.decorators, resources);
        });
    }

    /**
     * Remove all data from the tilemap
     * @returns {void}
     */
    removeData () {
        [].concat(this.gridContainer || [], this.backgroundContainers, this.decoratorContainers).forEach(container => {
            this.container.removeChild(container);
            container.destroy(true);
        });

        this.gridContainer          = null;
        this.backgroundContainers   = [];
        this.decoratorContainers    = [];
    }

    /**
     * Determine if there is a collision on X axis
     * @param {number} posX: position X
     * @param {number} nextX: position X needed
     * @param {number} ymin: position Y Min
     * @param {number} ymax: position Y Max
     * @param {number} width: width of the object
     * @returns {{collide: boolean, value: number}} get the position x
     */
    getLogicXAt (posX, nextX, ymin, ymax, width) {
        const orientation   = nextX > posX ? 1 : -1,
            cellXMin        = orientation > 0 ? Math.floor((posX + width) / this.props.tilewidth) : Math.floor(posX / this.props.tilewidth) - 1,
            cellXMax        = orientation > 0 ? Math.floor((nextX + width) / this.props.tilewidth) : Math.floor(nextX / this.props.tileheight),
            cellYMin        = Math.floor(Math.abs(ymin) / this.props.tileheight),
            cellYMax        = Math.floor(Math.abs(ymax - 1) / this.props.tileheight),
            grid            = this.grid.logic,
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
                    result.value    = orientation > 0 ? (x * this.props.tilewidth) - width : (x + 1) * this.props.tilewidth;

                    return result;
                }
            }
        }

        return result;
    }

    /**
     * Determine if there is a collision on y axis
     * @param {number} posY : position in y axis
     * @param {number} nextY : position needed in y axis
     * @param {number} xmin : position min in x axis
     * @param {number} xmax : position max in x axis
     * @param {number} height : height of the object
     * @returns {{collide: boolean, value: number}} get the position y
     */
    getLogicYAt (posY, nextY, xmin, xmax, height) {
        const orientation   = nextY > posY ? 1 : -1,
            cellYMin        = orientation > 0 ? Math.floor((posY + height) / this.props.tileheight) : Math.floor(nextY / this.props.tileheight),
            cellYMax        = orientation > 0 ? Math.floor((nextY + height) / this.props.tileheight) : Math.floor(posY / this.props.tileheight),
            cellXMin        = Math.floor(Math.abs(xmin) / this.props.tilewidth),
            cellXMax        = Math.floor(Math.abs(xmax - 1) / this.props.tilewidth),
            result          = { collide: false, value: nextY };

        let grid            = null;

        const loopParameter = {
            start: orientation > 0 ? cellYMin : cellYMax,
            end: orientation > 0 ? cellYMax : cellYMin
        };

        for (let y = loopParameter.start; y !== (loopParameter.end + orientation); y += orientation) {
            grid = this.grid.logic[y];

            if (!grid) {
                continue;
            }

            for (let x = cellXMin; x <= cellXMax; x++) {
                if (grid[x]) {
                    result.collide  = true;
                    result.value    = orientation > 0 ? (y * this.props.tileheight) - height : (y + 1) * this.props.tileheight;

                    return result;
                }
            }
        }

        return result;
    }


    /* PRIVATE */

    /**
     * Load all grids provided by the data
     * @private
     * @param {*} grid: grid provided by the data
     * @param {string} path: path to the image
     * @returns {void}
     */
    _loadGrids (grid, path) {
        const canvas    = document.createElement("canvas"),
            ctx         = canvas.getContext("2d"),
            image       = new Image();

        const { width, height, tilewidth, tileheight } = this.props;

        canvas.width    = width;
        canvas.height   = height;

        // Render the tilemap into the canvas
        image.onload = () => {
            grid.visual.forEach(layer => layer.forEach((line, y) => line.forEach((tile, x) => {
                ctx.drawImage(image,
                    Math.floor(tile * tilewidth) % image.width,
                    Math.floor(tile * tilewidth / image.width) * tileheight,
                    tilewidth, tileheight,
                    x * tilewidth, y * tileheight,
                    tilewidth, tileheight
                );
            })));

            this.gridContainer = PIXI.Sprite.from(canvas);
            this.container.addChild(this.gridContainer);
        };

        image.src = path;
    }

    /**
     * Load all backgrounds provided by the tilemap
     * @param {Array<*>} backgrounds: array of backgrounds data
     * @param {*} resources: PIXI Loader resources
     * @returns {void|null} -
     * @private
     */
    _loadBackgrounds (backgrounds, resources) {
        if (!backgrounds) {
            return null;
        }

        this.backgroundContainers = backgrounds.reverse().map((background, index) => {
            const backgroundContainer = new PIXI.Sprite(resources[`background${index}`].texture);

            this.container.addChildAt(backgroundContainer, 0);

            if (background.offset) {
                backgroundContainer.x = background.offset.x;
                backgroundContainer.y = background.offset.y;
            }

            if (typeof background.ratio !== "undefined" && background.ratio !== 1) {
                backgroundContainer.scale.x = background.ratio;
                backgroundContainer.scale.y = background.ratio;
            }

            return backgroundContainer;
        });
    }

    /**
     * Load all decorators provided by the tilemap
     * @param {*} decorators: array of decorators data
     * @param {*} resources: PIXI Textures resources
     * @returns {void|null} -
     * @private
     */
    _loadDecorators (decorators, resources) {
        if (!decorators || (decorators && !decorators.items)) {
            return null;
        }

        this.decoratorContainers = decorators.items.map(item => {
            const decoratorContainer = new PIXI.Sprite(resources[item[0]].texture);

            decoratorContainer.x = item[1];
            decoratorContainer.y = item[2];

            return decoratorContainer;

        }).forEach(decoratorContainer => this.container.addChild(decoratorContainer));
    }
}
