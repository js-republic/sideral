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
var Entity_1 = require("./../Entity");
var Tool_1 = require("./../Tool");
require("pixi-particles");
/**
 * Generator of particles
 */
var Particles = (function (_super) {
    __extends(Particles, _super);
    /* LIFECYCLE */
    /**
     * @constructor
     */
    function Particles() {
        var _this = _super.call(this) || this;
        /**
         * Know if the particles is loaded and ready to emit
         */
        _this.loaded = false;
        _this.setProps({
            type: Tool_1.Enum.TYPE.NONE,
            config: null,
            images: [],
            duration: 0,
            autoRun: true
        });
        _this.emitter = new PIXI.particles.Emitter(_this.container, null, { emit: false });
        _this.signals.propChange.bind("config", _this.onConfigurationChange.bind(_this));
        _this.signals.update.add(_this.updateFollow.bind(_this));
        return _this;
    }
    /**
     * @override
     */
    Particles.prototype.kill = function () {
        _super.prototype.kill.call(this);
        if (this.emitter) {
            this.emitter.destroy();
        }
    };
    /**
     * @update
     * @override
     */
    Particles.prototype.update = function (tick) {
        _super.prototype.update.call(this, tick);
        if (this.emitter.emit && this.loaded) {
            this.emitter.resetPositionTracking();
            this.emitter.updateSpawnPos(this.props.x, this.props.y);
            this.emitter.update(tick);
        }
    };
    /* METHODS */
    /**
     * Run the particles emitter
     */
    Particles.prototype.run = function () {
        if (this.props.duration) {
            this.timers.addTimer("duration", this.props.duration, this.kill.bind(this));
        }
        this.emitter.emit = true;
    };
    /**
     * Stop the current emitter
     */
    Particles.prototype.stop = function () {
        this.timers.remove("duration");
        this.emitter.cleanup();
        this.emitter.emit = false;
    };
    /**
     * Know if this object is emitting
     */
    Particles.prototype.isRunning = function () {
        return this.emitter.emit;
    };
    /* EVENTS */
    /**
     * @override
     */
    Particles.prototype.updateContainerPosition = function () { };
    /**
     * When property "configuration" has changed
     * @access protected
     */
    Particles.prototype.onConfigurationChange = function () {
        this.emitter.cleanup();
        this.emitter.init([].concat(this.props.images).map(function (image) { return PIXI.Texture.fromImage(image); }), this.props.config);
        this.loaded = true;
        if (this.props.autoRun) {
            this.run();
        }
        else {
            this.emitter.emit = false;
        }
    };
    return Particles;
}(Entity_1.Entity));
exports.Particles = Particles;
