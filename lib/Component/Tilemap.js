"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _Canvas = require("./Canvas");

var _Canvas2 = _interopRequireDefault(_Canvas);

var _Bitmap = require("./../Util/Bitmap");

var _Bitmap2 = _interopRequireDefault(_Bitmap);

var _Engine = require("./../Engine");

var _Engine2 = _interopRequireDefault(_Engine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tilemap = function (_Component) {
    _inherits(Tilemap, _Component);

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {{}} props: properties
     */
    function Tilemap() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Tilemap);

        /**
         * Size of a tile in width and height
         * @type {{}}
         */
        var _this = _possibleConstructorReturn(this, (Tilemap.__proto__ || Object.getPrototypeOf(Tilemap)).call(this, props));

        _this.tilesize = _this.tilesize || { width: 0, height: 0 };

        /**
         * Debug mode
         * @type {boolean}
         */
        _this.debug = _this.debug || false;

        /**
         * Path of the bitmap
         * @type {*}
         */
        _this.path = _this.path || null;

        /**
         * Grid of the tilemap
         * @type {{}}
         */
        _this.grid = _this.grid || {};

        /**
         * Check if bitmap is loaded
         * @readonly
         * @type {boolean}
         */
        _this.loaded = false;

        /**
         * Camera propagation from the parent scene
         * @readonly
         * @type {{x: number, y: number}}
         */
        _this.camera = { x: 0, y: 0 };

        /**
         * Total width of the level
         * @type {number}
         */
        _this.width = 0;

        /**
         * Total height of the level
         * @type {number}
         */
        _this.height = 0;

        _this.bitmap = new _Bitmap2.default(_this.path, function () {
            _this.loaded = true;
            _this.render();
        });

        _this.bitmap.tilesize = _this.tilesize;
        return _this;
    }

    /**
     * @initialize
     * @override
     * @param {Component} parent: parent
     */


    _createClass(Tilemap, [{
        key: "initialize",
        value: function initialize(parent) {
            var _this2 = this;

            _get(Tilemap.prototype.__proto__ || Object.getPrototypeOf(Tilemap.prototype), "initialize", this).call(this, parent);

            this.updateSize();

            this.compose(new _Canvas2.default({ width: this.width, height: this.height, clearColor: "red" }));
            this.canvas.clear();

            _Engine2.default.createLayer(this.canvas, -1);

            this.observeProp("camera", function (previousValue, nextValue) {
                if (_this2.has("canvas")) {
                    _this2.canvas.dom.style.marginLeft = -nextValue.x + "px";
                    _this2.canvas.dom.style.marginTop = -nextValue.y + "px";
                }
            });
        }

        /**
         * @update
         * @override
         * @returns {null} null
         */

    }, {
        key: "update",
        value: function update() {
            _get(Tilemap.prototype.__proto__ || Object.getPrototypeOf(Tilemap.prototype), "update", this).call(this);

            if (!this.has("canvas") || !this.parent) {
                return null;
            }

            if (this.camera.x !== this.parent.camera.x || this.camera.y !== this.parent.camera.y) {
                this.camera = { x: this.parent.camera.x, y: this.parent.camera.y };
            }
        }

        /**
         * @render
         * @override
         * @returns {*} Canvas context
         */

    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            if (!this.loaded) {
                return null;
            }

            this.grid.visual.forEach(function (layer) {
                layer.forEach(function (line, y) {
                    return line.forEach(function (tile, x) {
                        _this3.bitmap.render(_this3.canvas.context, x * _this3.tilesize.width, y * _this3.tilesize.height, tile);
                    });
                });
            });
        }

        /* METHODS */

        /**
         * Determine total size of the level
         * @returns {void}
         */

    }, {
        key: "updateSize",
        value: function updateSize() {
            var width = 0;

            this.grid.visual.forEach(function (layer) {
                layer.forEach(function (line) {
                    width = line.length > width ? line.length : width;
                });
            });

            this.width = width * this.tilesize.width;
            this.height = this.grid.visual[0].length * this.tilesize.height;
        }
    }]);

    return Tilemap;
}(_index2.default);

exports.default = Tilemap;