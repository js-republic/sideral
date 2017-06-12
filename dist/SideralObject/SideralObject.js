"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tool_1 = require("./../Tool");
/**
 * The entry class of all object in Sideral
 */
var SideralObject = (function () {
    function SideralObject() {
        /* ATTRIBUTES */
        /**
         * Unique id of the object
         * @readonly
         */
        this.id = SideralObject.generateId();
        /**
         * Name of the object (used to identify object, you should not forget to fill this value)
         * @type {string}
         */
        this.name = "";
        /**
         * Properties of the object
         */
        this.props = {};
        /**
         * Last values of properties of the object
         */
        this.last = {};
        /**
         * Context is a object which you can store anything, the content of the context will be passed to its children
         */
        this.context = {};
        /**
         * List of all signals of the element
         */
        this.signals = {
            update: new Tool_1.SignalEvent(),
            propChange: new Tool_1.SignalEvent(),
            addChild: new Tool_1.SignalEvent(),
            removeChild: new Tool_1.SignalEvent()
        };
        /**
         * List of all children of this object
         */
        this.children = [];
        /**
         * Parent of this object
         */
        this.parent = null;
        /**
         * Know if this object has been initialized
         * @readonly
         */
        this.initialized = false;
        /**
         * Know if this object has been killed
         * @readonly
         */
        this.killed = false;
    }
    /* LIFECYCLE */
    /**
     * Lifecycle - When initialized by a parent (called only once when the instance is attached to the lifecycle of the game)
     * @access public
     * @param props - properties to merge
     */
    SideralObject.prototype.initialize = function (props) {
        var _this = this;
        if (props === void 0) { props = {}; }
        Object.keys(props).forEach(function (key) { return _this.props[key] = props[key]; });
        this.initialized = true;
    };
    /**
     * Lifecycle - Destroy the current instance
     * @access public
     */
    SideralObject.prototype.kill = function () {
        var _this = this;
        Object.keys(this.signals).forEach(function (key) { return _this.signals[key].removeAll(); });
        this.children.forEach(function (child) { return child.kill(); });
        if (this.parent) {
            this.parent.children = this.parent.children.filter(function (child) { return child.id !== _this.id; });
        }
        this.killed = true;
        this.parent.signals.removeChild.dispatch(this.name, this);
    };
    /**
     * Lifecycle - Called every loop
     * @access protected
     * @param {number} tick - The tick factor (to prevent the dependance of the framerate)
     * @returns {void}
     */
    SideralObject.prototype.update = function (tick) {
        this.children.forEach(function (child) { return child.update(tick); });
        this.signals.update.dispatch(tick);
    };
    /**
     * Lifecycle - Called before a next game loop
     * @access protected
     * @returns {void}
     */
    SideralObject.prototype.nextCycle = function () {
        var _this = this;
        var propChanged = [];
        this.children.forEach(function (child) { return child.nextCycle(); });
        Object.keys(this.props).forEach(function (key) {
            var prop = _this.props[key];
            if (prop !== _this.last[key]) {
                propChanged.push(key);
                _this.last[key] = _this.props[key];
            }
        });
        propChanged.forEach(function (prop) { return _this.signals.propChange.dispatch(prop, _this.props[prop]); });
    };
    /* METHODS */
    /**
     * Set new properties to the object. All attribute contained in "props" are public and can be edited by external source.
     * Properties can be observe via the "propChange" event. Update a property attribute via "setProps" will not fire the "propChange" event.
     * @access public
     * @param {Object} props - properties to merge
     * @returns {*} current instance
     * @example
     *  this.setProps({
     *      test: 1
     *  });
     *
     *  this.props.test; // 1
     */
    SideralObject.prototype.setProps = function (props) {
        var _this = this;
        Object.keys(props).forEach(function (key) { return _this.last[key] = _this.props[key] = props[key]; });
        return this;
    };
    /**
     * Add an item to the current object. The item added will enter into the lifecycle of the object and will become a children
     * of this object. The method "initialize" of the item will be called.
     * @access public
     * @param item - A SideralObject
     * @param props - Props to merge to the item
     * @returns The item initialized
     */
    SideralObject.prototype.add = function (item, props) {
        var _this = this;
        if (props === void 0) { props = {}; }
        if (!(item instanceof SideralObject)) {
            throw new Error("SideralObject.add : item must be an instance of Sideral Abstract Class");
        }
        item.parent = this;
        Object.keys(this.context).forEach(function (key) { return item.context[key] = _this.context[key]; });
        this.children.push(item);
        item.initialize(props);
        this.signals.addChild.dispatch(item.name, item);
        return item;
    };
    /**
     * Add multiple items
     * @param params - Parameters of the multiple add
     */
    SideralObject.prototype.addMultiple = function (params) {
        var _this = this;
        params.forEach(function (param) {
            _this.add(param.item, param.props);
            if (param.assign) {
                _this[param.assign] = param.item;
            }
            if (param.callback) {
                param.callback(param.item);
            }
        });
    };
    /**
     * Check if a property (an attribute from "this.props") has changed
     * @access public
     * @param propName - name of the property to check
     * @returns Property has changed ?
     */
    SideralObject.prototype.hasChanged = function (propName) {
        if (!this.props[propName]) {
            return false;
        }
        return this.props[propName] !== this.last[propName];
    };
    /* STATICS */
    /**
     * Generate an unique id
     * @returns The unique id
     */
    SideralObject.generateId = function () {
        return Math.floor((1 + Math.random()) * 0x100000);
    };
    return SideralObject;
}());
exports.SideralObject = SideralObject;
