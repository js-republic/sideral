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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var SideralObject_1 = require("./../SideralObject");
var Timer_1 = require("./Timer");
/**
 * A manager for all timers
 */
var TimerManager = (function (_super) {
    __extends(TimerManager, _super);
    function TimerManager() {
        /* ATTRIBUTES */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * List of all current timers
         */
        _this.timers = {};
        return _this;
    }
    /* METHODS */
    /**
     * Add a new timer
     * @param name: Name of the timer
     * @param duration: Duration of the timer in ms
     * @param onComplete: Callback function when finished
     * @param options: Options to implement to the timer
     * @returns Rhe timer created
     */
    TimerManager.prototype.addTimer = function (name, duration, onComplete, options) {
        if (options === void 0) { options = {}; }
        var timer = this.add(new Timer_1.Timer(), __assign({ duration: duration, complete: onComplete }, options));
        timer.name = name;
        return this.timers[name] = timer;
    };
    /**
     * Get a timer by its name
     * @param {string} name: name of the timer
     * @returns {Timer} The timer
     */
    TimerManager.prototype.get = function (name) {
        return this.timers[name];
    };
    /**
     * Remove a timer by its name
     * @param {string} name: name of the timer
     * @returns {void}
     */
    TimerManager.prototype.remove = function (name) {
        var timer = this.timers[name];
        if (timer) {
            timer.kill();
        }
        delete this.timers[name];
    };
    /**
     * Remove all timers
     */
    TimerManager.prototype.removeAll = function () {
        var _this = this;
        Object.keys(this.timers).forEach(function (key) { return _this.timers[key] && _this.timers[key].kill(); });
        this.timers = {};
    };
    /**
     * Check if a timer is finished or not
     * @acess public
     * @param {string} name - The name of the timer
     * @returns {boolean} The timer is finished ?
     */
    TimerManager.prototype.isFinished = function (name) {
        var timer = this.timers[name];
        return timer ? timer.finished : true;
    };
    return TimerManager;
}(SideralObject_1.SideralObject));
exports.TimerManager = TimerManager;
