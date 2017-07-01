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
var Enum_1 = require("./../Tool/Enum");
/**
 * Hitbox is an helper class extended from Entity to generate hitbox contact between the owner and targets
 */
var Hitbox = (function (_super) {
    __extends(Hitbox, _super);
    /* LIFECYCLE */
    /**
     * @constructor
     */
    function Hitbox() {
        var _this = _super.call(this) || this;
        /**
         * The number of hits before destruction of the Hitbox
         * @readonly
         */
        _this.hit = 0;
        _this.setProps({
            type: Enum_1.Enum.TYPE.GHOST,
            group: Enum_1.Enum.GROUP.ENTITIES,
            owner: null,
            gravityFactor: 0,
            multipleHit: false,
            oncePerHit: true,
            maxHit: 1
        });
        _this.signals.beginCollision.add(_this.onCollision.bind(_this));
        return _this;
    }
    /* EVENTS */
    /**
     * When entering in collision with an entity
     * @param otherName - Name of the other entity
     * @param other - The other entity
     */
    Hitbox.prototype.onCollision = function (otherName, other) {
        var result = this.onHit(otherName, other);
        if (result) {
            this.hit++;
            if (this.hit >= this.props.maxHit) {
                this.kill();
            }
        }
    };
    /**
     * Event fired when hitbox hit an entity
     * @param name - Name of the entity
     * @param target - The target
     * @returns If true the hit will be counted
     */
    Hitbox.prototype.onHit = function (name, target) {
        return true;
    };
    return Hitbox;
}(Entity_1.Entity));
exports.Hitbox = Hitbox;
