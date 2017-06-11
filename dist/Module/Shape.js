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
var _1 = require("./../Tool/");
/**
 * The module to display shapes
 */
var Shape = (function (_super) {
    __extends(Shape, _super);
    /* LIFECYCLE */
    /**
     * @constructor
     */
    function Shape() {
        var _this = _super.call(this) || this;
        /**
         * PIXI Container
         * @readonly
         */
        _this.container = new PIXI.Graphics();
        _this.setProps({
            stroke: "#FF0000",
            fill: "#FFFFFF",
            box: _1.Enum.BOX.RECTANGLE
        });
        _this.signals.propChange.bind(["box", "fill", "stroke", "width", "height"], _this._updateShape.bind(_this));
        return _this;
    }
    /**
     * @initialize
     */
    Shape.prototype.initialize = function (props) {
        _super.prototype.initialize.call(this, props);
        this._updateShape();
    };
    /* PRIVATE */
    /**
     * Update the current shape
     * @private
     */
    Shape.prototype._updateShape = function () {
        var stroke = _1.Util.colorToDecimal(this.props.stroke), fill = this.props.fill === "transparent" ? 0x000000 : _1.Util.colorToDecimal(this.props.fill);
        this.container.clear();
        if (this.props.stroke !== "transparent" && !isNaN(stroke)) {
            this.container.lineStyle(1, stroke, 1);
        }
        this.container.beginFill(fill, this.props.fill === "transparent" ? 0 : 1);
        this._drawShape();
        this.container.endFill();
    };
    /**
     * Draw the shape with the current type value
     * @private
     */
    Shape.prototype._drawShape = function () {
        var _a = this.props, x = _a.x, y = _a.y, width = _a.width, height = _a.height, box = _a.box;
        switch (box) {
            case _1.Enum.BOX.CIRCLE:
                if (width !== height) {
                    this.container.drawEllipse(width / 2, height / 2, width / 2, height / 2);
                }
                else {
                    this.container.drawCircle(width / 2, width / 2, width / 2);
                }
                break;
            default:
                this.container.drawRect(x, y, width, height);
                break;
        }
    };
    return Shape;
}(Module_1.Module));
exports.Shape = Shape;
