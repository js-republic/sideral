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
var Tool_1 = require("./../Tool");
/**
 * Keyboard event utils
 */
var Keyboard = (function (_super) {
    __extends(Keyboard, _super);
    /* LIFECYCLE */
    /**
     * @constructor
     */
    function Keyboard() {
        var _this = _super.call(this) || this;
        /**
         * list of all inputs key released or pressed relative to the game looping
         * @readonly
         */
        _this.inputs = {};
        /**
         * List of all inputs key released or pressed
         * @private
         */
        _this._inputs = {};
        /**
         * If true, the key event willnot be propaged
         */
        _this.preventInputPropagation = true;
        _this.signals.keyChange = new Tool_1.SignalEvent();
        _this.signals.keyPress = new Tool_1.SignalEvent();
        _this.signals.keyRelease = new Tool_1.SignalEvent();
        _this.signals.update.add(_this._updateInputs.bind(_this));
        return _this;
    }
    /**
     * @initialize
     */
    Keyboard.prototype.initialize = function (props) {
        _super.prototype.initialize.call(this, props);
        window.addEventListener("keydown", this._onKeydown.bind(this));
        window.addEventListener("keyup", this._onKeyup.bind(this));
    };
    /**
     * @override
     */
    Keyboard.prototype.kill = function () {
        _super.prototype.kill.call(this);
        window.removeEventListener("keydown", this._onKeydown.bind(this));
        window.removeEventListener("keyup", this._onKeydown.bind(this));
    };
    /* EVENTS */
    /**
     * Update all device inputs
     * @private
     * @returns {void}
     */
    Keyboard.prototype._updateInputs = function () {
        for (var key in this._inputs) {
            if (!this._inputs.hasOwnProperty(key)) {
                continue;
            }
            var input = this.inputs[key], _input = this._inputs[key];
            // Pressed
            if (_input === Tool_1.Enum.KEY_STATE.PRESSED) {
                if (input === _input) {
                    this.inputs[key] = Tool_1.Enum.KEY_STATE.HOLD;
                }
                else if (input !== Tool_1.Enum.KEY_STATE.HOLD) {
                    this.inputs[key] = Tool_1.Enum.KEY_STATE.PRESSED;
                    this.signals.keyChange.dispatch(key, true);
                    this.signals.keyPress.dispatch(key);
                }
                // Released
            }
            else if (_input === Tool_1.Enum.KEY_STATE.RELEASED) {
                if (!input) {
                    this.inputs[key] = Tool_1.Enum.KEY_STATE.PRESSED;
                }
                else if (input === _input) {
                    delete this.inputs[key];
                    delete this._inputs[key];
                }
                else {
                    this.inputs[key] = Tool_1.Enum.KEY_STATE.RELEASED;
                    this.signals.keyChange.dispatch(key, false);
                    this.signals.keyRelease.dispatch(key);
                }
            }
        }
    };
    /**
     * event on keydown
     * @event keydown
     * @param {*} e - event
     * @returns {Boolean} Input propagation
     */
    Keyboard.prototype._onKeydown = function (e) {
        if (this.preventInputPropagation) {
            e.preventDefault();
            e.stopPropagation();
        }
        this._inputs[e.keyCode] = Tool_1.Enum.KEY_STATE.PRESSED;
        return !this.preventInputPropagation;
    };
    /**
     * event on keyup
     * @event keyup
     * @param {*} e - event
     * @returns {Boolean} Input propagation
     */
    Keyboard.prototype._onKeyup = function (e) {
        if (this.preventInputPropagation) {
            e.preventDefault();
            e.stopPropagation();
        }
        this._inputs[e.keyCode] = Tool_1.Enum.KEY_STATE.RELEASED;
        return !this.preventInputPropagation;
    };
    return Keyboard;
}(index_1.SideralObject));
exports.Keyboard = Keyboard;
