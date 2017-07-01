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
var Tool_1 = require("src/Tool");
/**
 * Sprite module to generate animations from spritesheets
 */
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    /* LIFECYCLE */
    /**
     * @constructor
     */
    function Sprite() {
        var _this = _super.call(this) || this;
        /**
         * Know if the sprite is loaded and can be animated
         * @readonly
         */
        _this.loaded = false;
        /**
         * List of all animations
         * @readonly
         */
        _this.animations = [];
        /**
         * The PIXI Container
         * @readonly
         */
        _this.container = new PIXI.Sprite();
        _this.container.anchor.set(0.5, 0.5);
        _this.signals.propChange.bind("imagePath", _this.onImagePathChange.bind(_this));
        return _this;
    }
    /**
     * @initialize
     * @lifecycle
     * @override
     */
    Sprite.prototype.initialize = function (props) {
        if (props === void 0) { props = {}; }
        var width = props.width || this.props.width, height = props.height || this.props.height;
        props.x = (props.x || 0) + (width / 2);
        props.y = (props.y || 0) + (height / 2);
        _super.prototype.initialize.call(this, props);
    };
    /* METHODS */
    /**
     * Add an animation for the current sprite
     * @param name - Name of the animation
     * @param duration - Duration of the animation (in ms)
     * @param frames - Array of frames to be displayed during the animation
     * @param maxLoop - number of loop. If loop === -1, there will be no limit of loop
     * @param offset - offset x and y related to the position of the Entity
     * @returns current instance to chain this function
     */
    Sprite.prototype.addAnimation = function (name, duration, frames, maxLoop, offset) {
        if (maxLoop === void 0) { maxLoop = -1; }
        if (!name || !frames) {
            throw new Error("Sprite.addAnimation: You must set a name, duration and frames.");
        }
        this.animations.push({
            name: name,
            duration: duration,
            frames: frames,
            frameIndex: 0,
            loop: 0,
            maxLoop: maxLoop,
            offset: offset,
            textureFrames: this._framesToRectangles(frames)
        });
        if (this.animations.length === 1 && this.loaded) {
            this.setAnimation(name);
        }
        return this;
    };
    /**
     * Set the current animation for the sprite
     * @param name - Name of the animation
     * @param restart - If true, restart the entire information about the animation such as number of loop
     */
    Sprite.prototype.setAnimation = function (name, restart) {
        if (restart === void 0) { restart = false; }
        if (!restart && this.animation && this.animation.name === name) {
            return null;
        }
        this.animation = this.getAnimation(name);
        if (this.animation) {
            this.animation.loop = 0;
            this.animation.frameIndex = 0;
            if (this.animation.offset) {
                this.setProps({
                    x: this.animation.offset.x,
                    y: this.animation.offset.y
                });
            }
            if (this.loaded) {
                this.container.texture.frame = this.animation.textureFrames[this.animation.frameIndex];
                this.timers.addTimer("sprite", this.animation.duration, this.onNextSprite.bind(this));
            }
        }
    };
    /**
     * Get an existing animation for the sprite
     * @param name - Name of the animation
     * @returns The animation object
     */
    Sprite.prototype.getAnimation = function (name) {
        return this.animations.find(function (animation) { return animation.name === name; });
    };
    /**
     * Remove the animation by its name
     * @param name - Name of the animation to remove
     */
    Sprite.prototype.removeAnimation = function (name) {
        this.animations = this.animations.filter(function (animation) { return animation.name === name; });
    };
    /**
     * Convert frame indexes to pixi rectangles
     * @private
     * @param frames - Frames to convert
     * @returns Frames converted to pixi rectangles
     */
    Sprite.prototype._framesToRectangles = function (frames) {
        var _this = this;
        if (!this.image) {
            return [];
        }
        return frames.map(function (frame) { return new PIXI.Rectangle(Math.floor(frame * _this.props.width) % _this.image.width, Math.floor(frame * _this.props.width / _this.image.width) * _this.props.height, _this.props.width, _this.props.height); });
    };
    /* EVENTS */
    /**
     * When timer of a frame is finished
     */
    Sprite.prototype.onNextSprite = function () {
        if (this.animation.frameIndex >= (this.animation.frames.length - 1)) {
            this.animation.loop++;
            this.animation.frameIndex = this.animation.maxLoop > -1 && this.animation.loop > this.animation.maxLoop ? this.animation.frames.length - 1 : 0;
        }
        else {
            this.animation.frameIndex++;
        }
        if (this.animation.maxLoop < 0 || this.animation.loop < this.animation.maxLoop) {
            this.container.texture.frame = this.animation.textureFrames[this.animation.frameIndex];
            this.timers.get("sprite").restart();
        }
        else if (this.props.autoKill) {
            this.kill();
        }
    };
    /**
     * When "imagePath" attributes change
     */
    Sprite.prototype.onImagePathChange = function () {
        var _this = this;
        Tool_1.Assets.get(this.props.imagePath, function (resource) {
            var texture = resource.texture;
            texture.frame = new PIXI.Rectangle(0, 0, _this.props.width, _this.props.height);
            _this.container.texture = texture;
            _this.image = resource.data;
            _this.animations.forEach(function (animation) { return animation.textureFrames = _this._framesToRectangles(animation.frames); });
            _this.loaded = true;
            if (_this.animations.length && !_this.animation) {
                _this.setAnimation(_this.animations[0].name, true);
            }
        });
    };
    return Sprite;
}(Module_1.Module));
exports.Sprite = Sprite;
