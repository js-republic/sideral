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
var SideralObject_2 = require("./../SideralObject");
var Tool_1 = require("./../Tool");
/**
 * The skill algorithm
 */
var Skill = (function (_super) {
    __extends(Skill, _super);
    /* LIFECYCLE */
    /**
     * @constructor
     */
    function Skill() {
        var _this = _super.call(this) || this;
        /**
         * Props of the Hitbox Class
         */
        _this.hitboxProps = {};
        /**
         * Duration of the skill
         */
        _this.duration = 0;
        /**
         * Type of duration
         */
        _this.durationType = Tool_1.Enum.DURATION_TYPE.MS;
        /**
         * Duration of the preparation
         */
        _this.preparation = 0;
        /**
         * Type of duration for the preparation
         */
        _this.preparationType = Tool_1.Enum.DURATION_TYPE.MS;
        /**
         * Duration of the reload
         */
        _this.reload = 0;
        /**
         * Type of duration for the reload
         */
        _this.reloadType = Tool_1.Enum.DURATION_TYPE.MS;
        /**
         * If true, the skill cannot be stopable
         */
        _this.unstoppable = true;
        /**
         * If true, the owner willnot move during the skill
         */
        _this.movable = true;
        /**
         * Know if the skill is currently active or not
         * @readonly
         */
        _this.active = false;
        /**
         * Know if the skill is ready to launch
         * @readonly
         */
        _this.ready = true;
        _this.timers = _this.add(new SideralObject_2.TimerManager());
        _this.signals.preparationStart = new Tool_1.SignalEvent();
        _this.signals.preparationUpdate = new Tool_1.SignalEvent();
        _this.signals.preparationComplete = new Tool_1.SignalEvent();
        _this.signals.skillStart = new Tool_1.SignalEvent();
        _this.signals.skillUpdate = new Tool_1.SignalEvent();
        _this.signals.skillComplete = new Tool_1.SignalEvent();
        _this.signals.reloadStart = new Tool_1.SignalEvent();
        _this.signals.reloadUpdate = new Tool_1.SignalEvent();
        _this.signals.reloadComplete = new Tool_1.SignalEvent();
        return _this;
    }
    /* METHODS */
    /**
     * Instanciate a hitbox item during the time of the skill
     * @param hitbox - The hitbox to add
     * @param hitboxProps - The props to transmit to the hitbox instance
     * @returns The hitbox instance
     */
    Skill.prototype.addHitbox = function (hitbox, hitboxProps) {
        if (hitboxProps === void 0) { hitboxProps = {}; }
        var x = typeof hitboxProps.x === "undefined" ? this.owner.props.x : hitboxProps.x, y = typeof hitboxProps.y === "undefined" ? this.owner.props.y : hitboxProps.y;
        delete hitboxProps.x;
        delete hitboxProps.y;
        hitboxProps.owner = this.owner;
        return this.owner.context.scene.spawn(hitbox, x, y, Object.assign({}, hitboxProps));
    };
    /**
     * Run the skill
     * @param params - Change attributes for the run
     */
    Skill.prototype.run = function (params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        var startSkill = function () {
            Object.assign(_this, params);
            _this.signals.preparationComplete.dispatch();
            _this.timers.addTimer("skill", _this.getTimerDuration(_this.duration, _this.durationType), _this._onSkillComplete.bind(_this), {
                init: _this.signals.skillStart.dispatch.bind(_this),
                update: _this.updateSkill.bind(_this)
            });
            if (_this.animation) {
                try {
                    _this.owner.sprite.setAnimation(_this.animation, true);
                }
                catch (e) {
                    throw Error(e);
                }
            }
            if (_this.hitboxClass) {
                _this.hitbox = _this.addHitbox(new (_this.hitboxClass)(), _this.hitboxProps);
            }
        };
        this.active = true;
        this.ready = !this.unstoppable;
        if (this.preparation) {
            this.timers.addTimer("preparation", this.getTimerDuration(this.preparation, this.preparationType), startSkill.bind(this), {
                init: this.signals.preparationStart.dispatch.bind(this),
                update: this.signals.preparationUpdate.dispatch.bind(this)
            });
        }
        else {
            startSkill();
        }
    };
    /**
     * Stop the skill
     */
    Skill.prototype.stop = function () {
        this.active = false;
        this.timers.removeAll();
    };
    /**
     * Get correct timer in ms
     * @param duration: initial duration of the timer
     * @param durationType: the type of duration
     * @returns The duration in ms
     */
    Skill.prototype.getTimerDuration = function (duration, durationType) {
        var ms = duration;
        switch (durationType) {
            case Tool_1.Enum.DURATION_TYPE.ANIMATION_LOOP:
                var animation = this.owner.sprite.getAnimation(this.animation);
                ms = animation.duration * duration * animation.frames.length;
                break;
            case Tool_1.Enum.DURATION_TYPE.FRAME:
                ms = SideralObject_2.Timer.frameToMs(duration, this.owner.context.game.fps);
                break;
        }
        return ms;
    };
    /* EVENTS */
    /**
     * Skill update
     * @param tick - The current tick of the timer
     * @param value - The current value of the timer
     * @param ratio - The ratio of the Timer (from 0 to 1)
     * @param duration - The total duration of the timer
     */
    Skill.prototype.updateSkill = function (tick, value, ratio, duration) {
        if (!this.movable) {
            this.owner.props.vy = this.owner.props.accelY = 0;
            this.owner.props.vx = this.owner.props.accelX = 0;
        }
        this.signals.skillUpdate.dispatch(tick, value, ratio, duration);
    };
    /**
     * When the skill is complete
     * @private
     */
    Skill.prototype._onSkillComplete = function () {
        var _this = this;
        this.signals.skillComplete.dispatch(this);
        if (this.reload) {
            this.timers.addTimer("reload", this.getTimerDuration(this.reload, this.reloadType), function () {
                _this.ready = true;
                _this.signals.reloadComplete.dispatch;
            }, {
                update: this.signals.reloadUpdate.dispatch.bind(this)
            });
        }
        this.ready = !this.reload;
        if (this.hitbox) {
            this.hitbox.kill();
            this.hitbox = null;
        }
    };
    return Skill;
}(SideralObject_1.SideralObject));
exports.Skill = Skill;
