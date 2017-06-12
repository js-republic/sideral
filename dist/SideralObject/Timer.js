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
/**
 * The timer object (replace window.setTimeout and window.setInterval)
 */
var Timer = (function (_super) {
    __extends(Timer, _super);
    /* LIFECYCLE */
    /**
     * @constructor
     */
    function Timer() {
        var _this = _super.call(this) || this;
        _this.signals.propChange.bind("duration", _this.onDurationChange.bind(_this));
        _this.signals.update.add(_this.updateTimers.bind(_this));
        return _this;
    }
    /* METHODS */
    /**
     * Get value with ration (0 to 1)
     * @param reversed - To 0 to 1 or to 1 to 0
     * @returns The value rationed
     */
    Timer.prototype.getValueRationed = function (reversed) {
        return reversed ? (this.props.duration - this.value) / this.props.duration : this.value / this.props.duration;
    };
    /**
     * Stop the timer
     * @param bypassComplete - if true, the event complete won't be fired
     */
    Timer.prototype.stop = function (bypassComplete) {
        if (bypassComplete === void 0) { bypassComplete = false; }
        this.finished = true;
        if (this.props.complete && !bypassComplete) {
            this.props.complete();
        }
    };
    /**
     * Restart the timer with it default value
     */
    Timer.prototype.restart = function () {
        this.value = this.props.duration * 0.001;
        this.tendance = this.props.duration < 0 ? 1 : -1;
        this.pause = false;
        this.finished = false;
    };
    /* EVENTS */
    /**
     * update all timers
     * @returns -
     */
    Timer.prototype.updateTimers = function (tick) {
        if (this.pause || this.finished) {
            return null;
        }
        this.value = this.value + (tick * this.tendance);
        var finished = this.value <= 0 || (Math.abs(this.value) >= Math.abs(this.props.duration));
        if (this.props.update) {
            this.props.update(tick, this.props.duration - this.value, this.getValueRationed(true), this.props.duration);
        }
        if (finished && this.props.recurrence) {
            this.props.recurrence--;
            if (this.props.reversible) {
                this.tendance = -this.tendance;
            }
            else {
                this.value = this.props.duration;
            }
        }
        else if (finished && !this.props.recurrence) {
            this.stop();
        }
    };
    /**
     * When "duration" property has changed
     */
    Timer.prototype.onDurationChange = function () {
        this.restart();
        if (this.props.init) {
            this.props.init();
        }
    };
    /* STATICS */
    /**
     * Convert frame to ms
     * @param frame - Number of frame
     * @param fps - Current fps (provided by the Game Object)
     * @returns number of ms
     */
    Timer.frameToMs = function (frame, fps) {
        return (frame / fps) * 1000;
    };
    /**
     * Convert ms to frame
     * @param ms - Number of milliseconds
     * @param fps - Current fps (provided by the Game object)
     * @returns Number of frames
     */
    Timer.msToFrame = function (ms, fps) {
        return (ms / 1000) * fps;
    };
    return Timer;
}(SideralObject_1.SideralObject));
exports.Timer = Timer;
