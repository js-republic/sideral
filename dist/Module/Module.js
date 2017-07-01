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
var SideralObject_1 = require("./../SideralObject");
var Tool_1 = require("./../Tool");
/**
 * SideralObject visible on screen
 */
var Module = (function (_super) {
    __extends(Module, _super);
    /* LIFECYCLE */
    /**
     * @constructor
     */
    function Module() {
        var _this = _super.call(this) || this;
        /**
         * PIXI Container (a module must have a pixi container)
         * @readonly
         */
        _this.container = new PIXI.Container();
        _this.setProps({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            flip: false,
            angle: 0,
            visible: true
        });
        _this.timers = _this.add(new SideralObject_1.TimerManager());
        _this.signals.click = new Tool_1.SignalEvent(_this.onBindClick.bind(_this), _this.onRemoveClick.bind(_this));
        _this.signals.propChange.bind("visible", _this.onVisibleChange.bind(_this));
        _this.signals.propChange.bind(["x", "y", "width", "height", "angle"], _this.updateContainerPosition.bind(_this));
        _this.signals.propChange.bind("flip", _this.onFlipChange.bind(_this));
        _this.signals.update.add(_this.updateFollow.bind(_this));
        return _this;
    }
    /**
     * @initialize
     */
    Module.prototype.initialize = function (props) {
        // We call the updateFollow to update the position of the module before create the Physic
        if (props.follow) {
            this.updateFollow(null, props.follow);
            props.x = this.props.x;
            props.y = this.props.y;
        }
        _super.prototype.initialize.call(this, props);
        this.updateContainerPosition();
    };
    /**
     * @override
     */
    Module.prototype.kill = function () {
        _super.prototype.kill.call(this);
        this.container.destroy();
    };
    /* METHODS */
    /**
     * Set a new position of the module
     * @param x - The position in x axis
     * @param y - The position in y axis
     */
    Module.prototype.position = function (x, y) {
        x = typeof x === "undefined" ? this.props.x : x;
        y = typeof y === "undefined" ? this.props.y : y;
        if (!this.initialized) {
            this.setProps({ x: x, y: y });
        }
        else {
            this.props.x = x;
            this.props.y = y;
        }
    };
    /**
     * Set a new size of the module
     * @param width - The next width of the module
     * @param height - The next height of the module
     */
    Module.prototype.size = function (width, height) {
        width = typeof width === "undefined" ? this.props.width : width;
        height = typeof height === "undefined" ? this.props.height : height;
        if (!this.initialized) {
            this.setProps({ width: width, height: height });
        }
        else {
            this.props.width = width;
            this.props.height = height;
        }
    };
    /**
     * Add an item to the current object. The item added will enter into the lifecycle of the object and will become a children
     * of this object. The method "initialize" of the item will be called.
     * @access public
     * @param item - A SideralObject
     * @param props - Props to merge to the item
     * @param z - The z index of the item
     * @returns The item initialized
     */
    Module.prototype.add = function (item, props, z) {
        if (props === void 0) { props = {}; }
        if (typeof z !== "undefined") {
            props.z = z;
        }
        _super.prototype.add.call(this, item, props);
        if (item instanceof Module) {
            if (typeof props.z !== "undefined") {
                this.container.addChildAt(item.container, z);
            }
            else {
                this.container.addChild(item.container);
            }
        }
        return item;
    };
    /**
     * This method is an helper to add a module. It is much faster than add when you must give a "x" and "y" properties
     * @access public
     * @param item - Module to add
     * @param x - The position in x axis
     * @param y - The position in y axis
     * @param props - Other properties to merge to the module
     * @param z - The z index of the item
     * @returns The module initialize
     */
    Module.prototype.spawn = function (item, x, y, props, z) {
        if (props === void 0) { props = {}; }
        if (!(item instanceof Module)) {
            throw new Error("Module.spawn : The item must ben an instance of Module");
        }
        props.x = x;
        props.y = y;
        return this.add(item, props, z);
    };
    /**
     * Spawn multiple modules
     * @param params - Parameters of the multiple spawn
     */
    Module.prototype.spawnMultiple = function (params) {
        params.forEach(function (param) {
            if (!param.props) {
                param.props = {};
            }
            param.props.x = param.x;
            param.props.y = param.y;
            param.props.z = param.z;
        });
        _super.prototype.addMultiple.call(this, params);
    };
    /**
     * Swap the current PIXI container to another PIXI container. This is usefull if you want to change
     * the PIXI Object without destroy children and parent relationship.
     * @access protected
     * @param nextContainer: PIXI Container
     * @returns -
     */
    Module.prototype.swapContainer = function (nextContainer) {
        var _this = this;
        if (!this.parent || !(this.parent instanceof Module)) {
            return null;
        }
        var containerIndex = this.parent.container.children.findIndex(function (child) { return child === _this.container; }), children = this.container.children.slice(0);
        this.parent.container.removeChild(this.container);
        this.container.destroy();
        if (containerIndex > -1) {
            this.parent.container.addChildAt(nextContainer, containerIndex);
        }
        else {
            this.parent.container.addChild(nextContainer);
        }
        this.container = nextContainer;
        children.forEach(function (child) { return _this.container.addChild(child); });
    };
    /**
     * Use this method to follow this entity by an other entity
     * @param centered - if True, the follower will be centered to the followed
     * @param offsetX - Offset in x axis
     * @param offsetY - Offset in y axis
     * @param offsetFlipX - Set a special offset in x axis if the followed is flipped
     * @returns Configuration object to follow this entity
     */
    Module.prototype.beFollowed = function (centered, offsetX, offsetY, offsetFlipX) {
        if (centered === void 0) { centered = false; }
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        if (offsetFlipX === void 0) { offsetFlipX = null; }
        return {
            target: this,
            centered: centered,
            offsetX: offsetX,
            offsetY: offsetY,
            offsetFlipX: offsetFlipX
        };
    };
    /* EVENTS */
    /**
     * Update the position of the pixi container
     */
    Module.prototype.updateContainerPosition = function () {
        if (this.container) {
            this.container.pivot.set(this.props.width / 2, this.props.height / 2);
            this.container.position.set(this.props.x + this.container.pivot.x, this.props.y + this.container.pivot.y);
            this.container.rotation = Tool_1.Util.toRadians(this.props.angle);
        }
    };
    /**
     * Update the position of this entity if it follows a target
     */
    Module.prototype.updateFollow = function (tick, follow) {
        follow = follow || this.props.follow;
        if (follow) {
            var offsetX = follow.offsetX, offsetY = follow.offsetY, offsetFlipX = follow.offsetFlipX, centered = follow.centered, target = follow.target;
            this.props.x = target.props.x + (target.props.flip && offsetFlipX !== null ? offsetFlipX : offsetX) + (centered ? (target.props.width / 2) - (this.props.width / 2) : 0);
            this.props.y = target.props.y + offsetY + (centered ? (target.props.height / 2) - (this.props.height / 2) : 0);
        }
    };
    /**
     * When "visible" property has change
     */
    Module.prototype.onVisibleChange = function () {
        this.container.visible = this.props.visible;
    };
    /**
     * When "flip" attribute change
     */
    Module.prototype.onFlipChange = function () {
        this.container.scale.x = Math.abs(this.container.scale.x) * (this.props.flip ? -1 : 1);
        if (this.container instanceof PIXI.Sprite) {
            this.container.anchor.x = this.props.flip ? -0.5 : 0.5;
        }
        this.updateContainerPosition();
    };
    /**
     * Fired when a listener is added to the signal click
     */
    Module.prototype.onBindClick = function () {
        if (this.container && this.signals.click.listenerLength === 1) {
            this.container.interactive = true;
            this.container.buttonMode = true;
            this.container.on("click", this.signals.click.dispatch.bind(this));
        }
    };
    /**
     * Fired when a listener is removed from the signal click
     */
    Module.prototype.onRemoveClick = function () {
        if (this.container && !this.signals.click.listenerLength) {
            this.container.interactive = false;
            this.container.buttonMode = false;
            this.container.off("click", this.signals.click.dispatch.bind(this));
        }
    };
    return Module;
}(SideralObject_1.SideralObject));
exports.Module = Module;
