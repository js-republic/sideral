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
var p2_1 = require("p2");
var Entity_1 = require("./../Entity");
var _1 = require("./../Tool/");
/**
 * Module for wall tilemap
 */
var Wall = (function (_super) {
    __extends(Wall, _super);
    function Wall() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* LIFECYCLE */
    /**
     * @initialize
     * @override
     */
    Wall.prototype.initialize = function (props) {
        this.setProps({
            gravityFactor: 0,
            box: _1.Enum.BOX.RECTANGLE,
            type: _1.Enum.TYPE.STATIC,
            group: _1.Enum.GROUP.GROUND
        });
        _super.prototype.initialize.call(this, props);
    };
    /* METHODS */
    /**
     * Know if the entity is constrained by the DirectionConstraint
     * @param entity - The entity to check
     * @returns If the entity is constrained by the DirectionConstraint
     */
    Wall.prototype.isConstrainedByDirection = function (entity) {
        return !this.resolveDirectionConstraint(this.props.directionConstraint, this.props.x, this.props.y, this.props.width, this.props.height, entity);
    };
    /**
     * resolve the direction by constraint
     * @param directionConstraint - constraint of direction
     * @param x - position x of the first shape
     * @param y - position y of the first shape
     * @param width - width of the first shape
     * @param height - height of the first shape
     * @param entity - entity to check
     * @returns If true, the target is constrained by constraint direction of the wall
     */
    Wall.prototype.resolveDirectionConstraint = function (directionConstraint, x, y, width, height, entity) {
        switch (directionConstraint) {
            case "upper": return entity.props.y < y;
            case "lower": return entity.last.y > entity.props.y && entity.props.y + entity.props.height > y && (entity.props.y + (entity.props.height / 2)) >= (y + height);
            default: return true;
        }
    };
    return Wall;
}(Entity_1.Entity));
/* STATICS */
/**
 * Default material for Wall
 */
Wall.wallMaterial = new p2_1.Material(Wall.generateId());
exports.Wall = Wall;
