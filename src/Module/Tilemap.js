import AbstractModule from "./../Abstract/AbstractModule";

import Shape from "./Shape";

import Body from "./../Command/Body";


export default class Tilemap extends AbstractModule {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            tilewidth   : 0,
            tileheight  : 0,
            debug       : false
        });

        this.bodies                 = [];
        this._debugs                = [];
        this.grid                   = {};
        this.gridContainer          = null;
        this.backgroundContainers   = [];
        this.decoratorContainers    = [];

        this.signals.propChange.bind("debug", this._onDebugChange.bind(this));
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
            this._loadLogic(data.grid.logic);
            this._loadDecorators(data.decorators, resources);
            this._onDebugChange();
        });
    }

    /**
     * Remove all data from the tilemap
     * @returns {void}
     */
    removeData () {
        [].concat(this.gridContainer || [], this.backgroundContainers, this.decoratorContainers).forEach(container => {
            this.container.removeChild(container);
            container.destroy(true);
        });

        this.gridContainer          = null;
        this.backgroundContainers   = [];
        this.decoratorContainers    = [];
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
            this._onDebugChange();
        };

        image.src = path;
    }

    /**
     * Create a body with all logic
     * @private
     * @param {*} logic: logic data
     * @returns {void}
     */
    _loadLogic (logic) {
        let items = [];

        const { tilewidth, tileheight } = this.props,
            getDuplicateItems = (array, value, index = 0) => {
                let length = 0;

                array.some((v, i, arr) => {
                    if (i === arr.length - 1 && v === value) {
                        length = i - index + 1;

                        return true;
                    } else if (i < index || v === value) {
                        return false;
                    }

                    length = i - index;

                    return true;
                });

                return length;
            };

        this.bodies.forEach(body => this.scene.world.removeBody(body));
        this.bodies = [];

        logic.forEach((line, y) => {
            const currentLine   = [];

            let currentIndex    = 0,
                nextIndex       = -1;

            do {
                nextIndex = line.indexOf(1, currentIndex);

                if (nextIndex > -1) {
                    const length = getDuplicateItems(line, 1, nextIndex);

                    currentLine.push({ x: nextIndex * tilewidth, y: y * tileheight, width: length * tilewidth, height: tileheight });
                    currentIndex = nextIndex + length + 1;
                }
            } while (nextIndex !== -1);

            items = items.concat(currentLine);
        });

        this.bodies = items.map(item => {
            const body = new Body.RectangularBody(item.x, item.y, item.width, item.height, { mass: 0, gravityScale: 0, fixedX: true, fixedY: true });

            this.scene.world.addBody(body.data);

            return body;
        });
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


    /* EVENTS */

    /**
     * when debug attributes change
     * @return {void}
     */
    _onDebugChange () {
        this._debugs.forEach(_debug => _debug.kill());

        if (this.props.debug) {
            this._debugs = this.bodies.map(body => this.add(new Shape(), {
                x       : body.x,
                y       : body.y,
                type    : Shape.TYPE.RECTANGLE,
                width   : body.width,
                height  : body.height,
                stroke  : "#FF0000",
                fill    : "transparent"
            }));
        }
    }
}
