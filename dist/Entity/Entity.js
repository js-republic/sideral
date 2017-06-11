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
var _1 = require("./../Tool/");
/**
 * Module with physics
 */
var Entity = (function (_super) {
    __extends(Entity, _super);
    /* LIFECYCLE */
    /**
     * @constructor
     */
    function Entity() {
        var _this = _super.call(this) || this;
        /**
         * Know if the entity is currently standing or not
         * @readonly
         */
        _this.standing = false;
        /**
         * Know if the entity is currently moving or not
         * @readonly
         */
        _this.moving = false;
        /**
         * All contact colliding
         * @readonly
         */
        _this.collides = [];
        _this.setProps({
            vx: 0,
            vy: 0,
            accelX: 0,
            accelY: 0,
            angle: 0,
            gravityFactor: 1,
            bounce: 0,
            box: _1.Enum.BOX.RECTANGLE,
            type: _1.Enum.TYPE.SOLID,
            group: _1.Enum.GROUP.ALL,
            friction: false
        });
        _this.signals.beginCollision = new _1.SignalEvent();
        _this.signals.collision = new _1.SignalEvent();
        _this.signals.endCollision = new _1.SignalEvent();
        _this.skills = _this.add(new index_1.SkillManager());
        _this.signals.propChange.bind(["width", "height"], _this.onSizeChange.bind(_this));
        _this.signals.propChange.bind(["x", "y"], _this.onPositionChange.bind(_this));
        _this.signals.propChange.bind("debug", _this.onDebugChange.bind(_this));
        _this.signals.propChange.bind("bounce", function () { return _this.physic && _this.physic.setBounciness(_this.props.bounce); });
        _this.signals.propChange.bind("angle", function () { return _this.physic && _this.physic.setAngle(_this.props.angle); });
        return _this;
    }
    /**
     * @override
     */
    Entity.prototype.initialize = function (props) {
        _super.prototype.initialize.call(this, props);
        if (this.props.type !== _1.Enum.TYPE.NONE) {
            this.physic = new index_1.Physic(this, this.props.x, this.props.y, this.props.width, this.props.height, this.props.type, this.props.box, {
                group: this.props.group,
                gravityFactor: this.props.gravityFactor
            });
            this.physic.enable();
        }
        this.onDebugChange();
    };
    /**
     * @override
     */
    Entity.prototype.kill = function () {
        _super.prototype.kill.call(this);
        if (this.physic) {
            this.physic.disable();
        }
    };
    /**
     * @override
     */
    Entity.prototype.nextCycle = function () {
        _super.prototype.nextCycle.call(this);
        if (this._beforePauseState) {
            return null;
        }
        if (this.physic) {
            var vel = this.physic.getVelocity(), pos = this.physic.getPosition(), angle = this.physic.getAngle();
            // this.physic.setAcceleration(this.props.accelX, this.props.accelY);
            this.physic.setVelocity((this.props.vx || (!this.props.vx && !this.props.friction)) && this.props.vx, this.props.vy || null);
            this.moving = Boolean(vel.x) || !this.standing;
            this.setProps({
                x: pos.x,
                y: pos.y,
                angle: angle
            });
            this.updateContainerPosition();
        }
        this.standing = Boolean(this.collides.find(function (collide) { return collide.isAbove; }));
    };
    /* METHODS */
    /**
     * Will pause the entity (will not be affected about gravity; collisions and velocity)
     * @access public
     * @param hide - If true, the entity will be invisible
     */
    Entity.prototype.pause = function (hide) {
        this._beforePauseState = {
            x: this.props.x,
            y: this.props.y,
            vx: this.props.vx,
            vy: this.props.vy,
            gf: this.props.gravityFactor
        };
        if (this.physic) {
            var vel = this.physic.getVelocity();
            this._beforePauseState.bodyVx = vel.x;
            this._beforePauseState.bodyVy = vel.y;
            this.physic.idle(true);
            this.physic.disable();
        }
        this.setProps({
            vx: 0,
            vy: 0
        });
        if (hide) {
            this.props.visible = false;
        }
    };
    /**
     * Will resume the entity (to be affected about gravity, collisions and velocity)
     * @access public
     * @param visible - If true, the entity will now be visible
     */
    Entity.prototype.resume = function (visible) {
        if (!this._beforePauseState) {
            return null;
        }
        this.setProps({
            vx: this._beforePauseState.vx,
            vy: this._beforePauseState.vy,
            gravityFactor: this._beforePauseState.gf
        });
        if (this.physic) {
            this.physic.setPosition(this.props.x, this.props.y);
            this.physic.setVelocity(this._beforePauseState.bodyVx, this._beforePauseState.bodyVy);
            this.physic.setGravityFactor(this._beforePauseState.gf);
            this.physic.enable();
        }
        this._beforePauseState = null;
        if (visible) {
            this.props.visible = true;
        }
    };
    /**
     * Add a new spritesheet to the current entity
     * @param imagePath - path to the media
     * @param tilewidth - width of a tile
     * @param tileheight - height of a tile
     * @param props - props to pass to the spritesheet module
     * @param index - z index position of the entity
     * @returns The current spritesheet
     */
    Entity.prototype.addSprite = function (imagePath, tilewidth, tileheight, props, index) {
        if (props === void 0) { props = {}; }
        props.imagePath = imagePath;
        props.width = tilewidth;
        props.height = tileheight;
        var sprite = this.add(new Module_1.Sprite(), props, index);
        if (!this.sprite) {
            this.sprite = sprite;
        }
        return sprite;
    };
    /**
     * Remove all velocity from the entity
     * @param removePhysicGravity - If true and if this Entity has a Physic, it will be no longer affected by gravity
     */
    Entity.prototype.idle = function (removePhysicGravity) {
        if (removePhysicGravity === void 0) { removePhysicGravity = false; }
        this.props.vx = this.props.vy = this.props.accelX = this.props.accelY = 0;
        if (this.physic) {
            this.physic.idle(removePhysicGravity);
        }
    };
    /* EVENTS */
    /**
     * When "debug" property has changed
     */
    Entity.prototype.onDebugChange = function () {
        if (this._debug) {
            this._debug.kill();
            this._debug = null;
        }
        if (this.props.debug) {
            this._debug = this.add(new Module_1.Shape(), {
                box: this.props.box,
                width: this.props.width,
                height: this.props.height,
                stroke: "#FF0000",
                fill: "transparent"
            });
        }
    };
    /**
     * onPositionChange
     * @override
     */
    Entity.prototype.onPositionChange = function () {
        if (this.physic) {
            this.physic.setPosition(this.props.x, this.props.y);
        }
    };
    /**
     * When "width" or "height" attributes change
     */
    Entity.prototype.onSizeChange = function () {
        if (this._debug) {
            this._debug.size(this.props.width, this.props.height);
        }
    };
    return Entity;
}(Module_1.Module));
exports.Entity = Entity;
