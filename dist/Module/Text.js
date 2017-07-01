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
var Text = (function (_super) {
    __extends(Text, _super);
    /* CONSTRUCTOR */
    function Text() {
        var _this = _super.call(this) || this;
        _this.setProps({
            text: "Hello world",
            defaultStyle: {}
        });
        _this.container = new PIXI.Text(_this.props.text);
        _this.signals.propChange.bind("text", _this._onTextChange.bind(_this));
        return _this;
    }
    Text.prototype.initialize = function (props) {
        _super.prototype.initialize.call(this, props);
        this.updateStyle(this.props.defaultStyle);
    };
    /* METHODS */
    Text.prototype.updateStyle = function (style) {
        var _this = this;
        Object.keys(style).forEach(function (key) { return _this.container.style[key] = style[key]; });
    };
    /* EVENTS */
    /**
     * When "text" property has changed
     */
    Text.prototype._onTextChange = function () {
        this.container.text = this.props.text;
    };
    return Text;
}(index_1.Module));
exports.Text = Text;
