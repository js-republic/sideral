import { Body } from "p2";

import { Module } from "../Module";
import { Scene } from "./../Scene";

import { Shape } from "./Shape";

import { Enum } from "../Tool/Enum";

import { Wall } from "../Module/Wall";


export class Tilemap extends Module {

    /* ATTRIBUTES */

    /**
     * The width of a tile
     */
    tilewidth: number;

    /**
     * The height of a tile
     */
    tileheight: number;

    /**
     * List of all wall
     * @readonly
     */
    walls: Array<Wall> = [];

    /**
     * Grid of the tilemap
     */
    grid: any = {};

    /**
     * The pixi container of the grid
     */
    gridContainer: PIXI.Sprite;

    /**
     * Pixi containers of the backgrounds
     */
    backgroundContainers: Array<PIXI.Sprite> = [];

    /**
     * Pixi containers of the decorators
     */
    decoratorContainers: Array<PIXI.Sprite> = [];


    /* METHODS */

    /**
     * Set a data to construct the tilemap
     * @param data - Data generaly provided by a json file
     */
    setData (data: any): void {
        const loader    = new PIXI.loaders.Loader();

        this.removeData();

        this.props.width    = 0;
        this.props.height   = 0;
        this.tilewidth      = data.tilewidth;
        this.tileheight     = data.tileheight;
        this.grid           = data.grid;

        // Determine the size of the tilemap
        data.grid.forEach(layer => layer.forEach(line => {
            this.props.width = line.length > this.props.width ? line.length : this.props.width;
        }));

        this.props.width *= this.tilewidth;
        this.props.height = data.grid[0].length * this.tileheight;

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
            this._loadWalls(data.walls, data.debug);
        });
    }

    /**
     * Remove all data from the tilemap
     */
    removeData (): void {
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
     * @param grid - Grid provided by the data
     * @param path - Path to the image
     */
    _loadGrids (grid: any, path: string): void {
        const canvas    = document.createElement("canvas"),
            ctx         = canvas.getContext("2d"),
            image       = new Image();

        const { width, height } = this.props,
            { tilewidth, tileheight} = this;

        canvas.width    = width;
        canvas.height   = height;

        // Render the tilemap into the canvas
        image.onload = () => {
            grid.forEach(layer => layer.forEach((line, y) => line.forEach((tile, x) => {
                ctx.drawImage(image,
                    Math.floor(tile * tilewidth) % image.width,
                    Math.floor(tile * tilewidth / image.width) * tileheight,
                    tilewidth, tileheight,
                    x * tilewidth, y * tileheight,
                    tilewidth, tileheight
                );
            })));

            this.gridContainer = PIXI.Sprite.from(canvas);
            this.container.addChildAt(this.gridContainer, 1);
        };

        image.src = path;
    }

    /**
     * Load all backgrounds provided by the tilemap
     * @param backgrounds - Array of backgrounds data
     * @param resources - PIXI Loader resources
     * @private
     */
    _loadBackgrounds (backgrounds: Array<any>, resources: Array<PIXI.Texture>): void {
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
     * @param decorators - array of decorators data
     * @param resources - PIXI Textures resources
     * @returns -
     * @private
     */
    _loadDecorators (decorators: any, resources: Array<PIXI.loaders.Resource>): void {
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

    /**
     * Load all walls provided by the tilemap json
     * @param wallDatas - Datas provided by the tilemap json
     * @param debug - Set the debug mode for the walls
     * @private
     */
    _loadWalls (wallDatas: Array<any> = [], debug: boolean = false): void {
        this.walls = <Array<Wall>> wallDatas.map(wall => {
            const [box, x, y, width, height, directionConstraint] = wall;

            return this.spawn(new Wall(), x, y, { box, width, height, directionConstraint,
                debug: debug
            });
        });
    }
}
