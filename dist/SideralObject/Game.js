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
var index_1 = require("./index");
var Module_1 = require("./../Module");
var Tool_1 = require("./../Tool");
/**
 * The engine of the game
 * @class Game
 * @extends SideralObject
 */
var Game = (function (_super) {
    __extends(Game, _super);
    /* LIFECYCLE */
    /**
     * @constructor
     */
    function Game() {
        var _this = _super.call(this) || this;
        /**
         * Properties of the game
         */
        _this.props = {
            width: 10,
            height: 10,
            background: "#DDDDDD"
        };
        _this.container = document.getElementById("sideral");
        /**
         * The current frame per second of the game
         * @readonly
         */
        _this.fps = 60;
        /**
         * The current latency of the game (in ms)
         * @readonly
         */
        _this.latency = 0;
        /**
         * The factor of time to avoid framerate dependance
         * @readonly
         */
        _this.tick = 1;
        /**
         * The date of the current update in timestamp
         * @readonly
         */
        _this.currentUpdate = 0;
        /**
         * The date of the last update in timestamp
         * @readonly
         */
        _this.lastUpdate = 0;
        /**
         * Know if the game is currently running or not
         */
        _this.stopped = true;
        _this.renderer = PIXI.autoDetectRenderer(_this.props.width, _this.props.height, { autoResize: true, roundPixels: false });
        _this.context.game = _this;
        _this.signals.propChange.bind(["width", "height"], _this._resizeGame.bind(_this));
        _this.signals.propChange.bind("background", _this._backgroundChange.bind(_this));
        return _this;
    }
    /**
     * Update loop
     * @param performance - Performance returned by the navigator
     */
    Game.prototype.update = function (performance) {
        var _this = this;
        if (this.stopped) {
            return null;
        }
        performance = performance || window.performance.now();
        requestAnimationFrame(this.update.bind(this));
        // 100ms latency max
        this.currentUpdate = performance;
        this.latency = Tool_1.Util.limit(performance - this.lastUpdate, 0, 100);
        this.fps = Math.floor(1000 / this.latency);
        this.tick = 1000 / (this.fps * 1000);
        this.tick = this.tick < 0 ? 0 : this.tick;
        this.children.forEach(function (child) { return child.update(_this.tick); });
        this.getScenes().forEach(function (scene) { return _this.renderer.render(scene.container); });
        this.nextCycle();
        this.lastUpdate = window.performance.now();
    };
    /* METHODS */
    /**
     * Start the game loop
     * @acess public
     * @param width - width of the game
     * @param height - height of the game
     * @param container - container to attach the game
     * @returns current instance
     */
    Game.prototype.start = function (width, height, container) {
        var _this = this;
        this.setProps({
            width: width || this.props.width,
            height: height || this.props.height
        });
        if (!this.props.width || !this.props.height) {
            throw new Error("Engine.start: You must set 'width', 'height' and a 'container' container");
        }
        this.stopped = false;
        this.attach(container);
        this._resizeGame();
        // Load the global assets
        Tool_1.Assets.load(function () { return _this.update(); });
        return this;
    };
    /**
     * resize the current canvas
     */
    Game.prototype.resize = function () {
        if (!this.renderer) {
            return null;
        }
        this.renderer.resize(this.props.width, this.props.height);
    };
    /**
     * Enable keyboard events
     * @param preventInputPropagation - If true, the event provided by the keyboard will not be propaged outside the Sideral engine
     * @returns The current instance of Keyboard
     */
    Game.prototype.enableKeyboard = function (preventInputPropagation) {
        this.keyboard = this.add(new index_1.Keyboard());
        this.keyboard.preventInputPropagation = preventInputPropagation;
        return this.keyboard;
    };
    /**
     * Disable keyboard events
     */
    Game.prototype.disableKeyboard = function () {
        if (this.keyboard) {
            this.keyboard.kill();
        }
        this.keyboard = null;
    };
    /**
     * Get all scenes from the current game
     * @returns Scenes
     */
    Game.prototype.getScenes = function () {
        return this.children.filter(function (child) { return child instanceof Module_1.Scene; });
    };
    /**
     * Attach the game to a dom
     */
    Game.prototype.attach = function (container) {
        container = container || this.container;
        if (this.container) {
            try {
                this.container.removeChild(this.renderer.view);
            }
            catch (e) { }
        }
        this.container = container;
        this.container.appendChild(this.renderer.view);
    };
    /* PRIVATE */
    /**
     * When width or height attributes change
     * @private
     */
    Game.prototype._resizeGame = function () {
        if (!this.renderer) {
            return null;
        }
        this.renderer.resize(this.props.width, this.props.height);
    };
    /**
     * When background attribute changes
     * @private
     */
    Game.prototype._backgroundChange = function () {
        var color = Tool_1.Util.colorToDecimal(this.props.background);
        if (!isNaN(color)) {
            this.renderer.backgroundColor = color;
        }
    };
    return Game;
}(index_1.SideralObject));
exports.Game = Game;
PIXI.utils.skipHello();
