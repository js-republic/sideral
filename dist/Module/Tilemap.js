"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Module_1 = require("./../Module");
var Tool_1 = require("./../Tool");
var Entity_1 = require("./../Entity");
/**
 * Class to generate tilemap
 */
var Tilemap = (function (_super) {
    __extends(Tilemap, _super);
    function Tilemap() {
        /* ATTRIBUTES */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * List of all wall
         * @readonly
         */
        _this.walls = [];
        /**
         * Grid of the tilemap
         */
        _this.grid = {};
        /**
         * Pixi containers of the backgrounds
         */
        _this.backgroundContainers = [];
        /**
         * Pixi containers of the decorators
         */
        _this.decoratorContainers = [];
        return _this;
    }
    /* METHODS */
    /**
     * Set a data to construct the tilemap
     * @param data - Data generaly provided by a json file
     */
    Tilemap.prototype.setData = function (data) {
        var _this = this;
        var loader = new PIXI.loaders.Loader();
        this.removeData();
        this.props.width = 0;
        this.props.height = 0;
        this.tilewidth = data.tilewidth;
        this.tileheight = data.tileheight;
        this.grid = data.grid;
        // Determine the size of the tilemap
        data.grid.forEach(function (layer) { return layer.forEach(function (line) {
            _this.props.width = line.length > _this.props.width ? line.length : _this.props.width;
        }); });
        this.props.width *= this.tilewidth;
        this.props.height = data.grid[0].length * this.tileheight;
        if (data.backgrounds) {
            Tool_1.Assets.getTexture(data.backgrounds.map(function (background) { return background.path; }), function (textures) { return _this._loadBackgrounds(data.backgrounds, textures); });
        }
        Tool_1.Assets.getImage(data.path, function (image) { return _this._loadGrids(data.grid, image); });
        if (data.decorators) {
            Tool_1.Assets.getTexture(Object.keys(data.decorators.data).map(function (key) { return data.decorators.data[key]; }), function (textures) { return _this._loadDecorators(data.decorators, textures); });
        }
        this._loadWalls(data.walls, data.debug);
    };
    /**
     * Remove all data from the tilemap
     */
    Tilemap.prototype.removeData = function () {
        var _this = this;
        [].concat(this.gridContainer || [], this.backgroundContainers, this.decoratorContainers).forEach(function (container) {
            _this.container.removeChild(container);
            container.destroy(true);
        });
        this.gridContainer = null;
        this.backgroundContainers = [];
        this.decoratorContainers = [];
    };
    /* PRIVATE */
    /**
     * Load all grids provided by the data
     * @private
     * @param grid - Grid provided by the data
     * @param image - Image data
     */
    Tilemap.prototype._loadGrids = function (grid, image) {
        var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
        var _a = this.props, width = _a.width, height = _a.height, _b = this, tilewidth = _b.tilewidth, tileheight = _b.tileheight;
        canvas.width = width;
        canvas.height = height;
        grid.forEach(function (layer) { return layer.forEach(function (line, y) { return line.forEach(function (tile, x) {
            ctx.drawImage(image, Math.floor(tile * tilewidth) % image.width, Math.floor(tile * tilewidth / image.width) * tileheight, tilewidth, tileheight, x * tilewidth, y * tileheight, tilewidth, tileheight);
        }); }); });
        this.gridContainer = PIXI.Sprite.from(canvas);
        this.container.addChildAt(this.gridContainer, 1);
    };
    /**
     * Load all backgrounds provided by the tilemap
     * @param backgrounds - Array of backgrounds data
     * @param textures - PIXI Textures
     * @private
     */
    Tilemap.prototype._loadBackgrounds = function (backgrounds, textures) {
        var _this = this;
        if (!backgrounds) {
            return null;
        }
        this.backgroundContainers = backgrounds.reverse().map(function (background, index) {
            var backgroundContainer = new PIXI.Sprite(textures.find(function (texture) { return texture.baseTexture.imageUrl === background.path; }));
            _this.container.addChildAt(backgroundContainer, 0);
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
    };
    /**
     * Load all decorators provided by the tilemap
     * @param decorators - array of decorators data
     * @param textures - PIXI Textures resources
     * @private
     */
    Tilemap.prototype._loadDecorators = function (decorators, textures) {
        var _this = this;
        if (!decorators || (decorators && !decorators.items)) {
            return null;
        }
        this.decoratorContainers = decorators.items.map(function (item) {
            var decoratorContainer = new PIXI.Sprite(textures.find(function (texture) { return texture.baseTexture.imageUrl === decorators.data[item[0]]; }));
            decoratorContainer.x = item[1];
            decoratorContainer.y = item[2];
            return decoratorContainer;
        }).forEach(function (decoratorContainer) { return _this.container.addChild(decoratorContainer); });
    };
    /**
     * Load all walls provided by the tilemap json
     * @param wallDatas - Datas provided by the tilemap json
     * @param debug - Set the debug mode for the walls
     * @private
     */
    Tilemap.prototype._loadWalls = function (wallDatas, debug) {
        var _this = this;
        if (wallDatas === void 0) { wallDatas = []; }
        if (debug === void 0) { debug = false; }
        this.walls = wallDatas.map(function (wallData) {
            var box = wallData[0], x = wallData[1], y = wallData[2], width = wallData[3], height = wallData[4], directionConstraint = wallData[5];
            return _this.spawn(new Entity_1.Wall(), x, y, { box: box, width: width, height: height, directionConstraint: directionConstraint, debug: debug });
        });
    };
    return Tilemap;
}(Module_1.Module));
exports.Tilemap = Tilemap;
