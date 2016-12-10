"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Canvas = function (_Component) {
    _inherits(Canvas, _Component);

    /* LIFECYCLE */
    /**
     * @constructor
     * @param {*} props: properties
     */
    function Canvas(props) {
        _classCallCheck(this, Canvas);

        /**
         * Width of the canvas
         * @type {number}
         */
        var _this = _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this, props));

        _this.width = _this.width || 10;

        /**
         * Height of the canvas
         * @type {number}
         */
        _this.height = _this.height || 10;

        /**
         * DOM parent of the canvas
         */
        _this.parentDOM = _this.parentDOM || null;

        /**
         * Dom of the canvas
         * @type {*}
         */
        _this.dom = null;

        /**
         * Context of the canvas
         * @type {*}
         */
        _this.context = null;

        /**
         * Color of canvas when it is cleared
         * @type {string}
         */
        _this.clearColor = null;

        return _this;
    }

    /**
     * @override
     */


    _createClass(Canvas, [{
        key: "initialize",
        value: function initialize(parent) {
            var _this2 = this;

            _get(Canvas.prototype.__proto__ || Object.getPrototypeOf(Canvas.prototype), "initialize", this).call(this, parent);

            this.dom = document.createElement("canvas");
            this.dom.id = this.id;
            this.dom.width = this.width;
            this.dom.height = this.height;
            this.context = this.dom.getContext("2d");

            this.setParentDOM();

            // Observe prop width
            this.observeProp("width", function (previousValue, nextValue) {
                if (_this2.dom) {
                    _this2.dom.width = nextValue;
                }
            });

            // Observe prop height
            this.observeProp("height", function (previousValue, nextValue) {
                if (_this2.dom) {
                    _this2.dom.height = nextValue;
                }
            });
        }

        /* METHODS */

        /**
         * Attach the canvas to the parent DOM
         * @param {*=} dom: dom to attach the canvas
         * @returns {void|null} null
         */

    }, {
        key: "setParentDOM",
        value: function setParentDOM(dom) {
            dom = dom || this.parentDOM;

            if (!dom || !this.dom) {
                return null;
            }

            this.parentDOM = dom;
            this.parentDOM.appendChild(this.dom);
        }

        /**
         * Clear the canvas
         * @param {string=} clearColor: color of the canvas when it will be cleared
         * @returns {void}
         */

    }, {
        key: "clear",
        value: function clear(clearColor) {
            var ctx = this.context;

            ctx.clearRect(0, 0, this.width, this.height);

            if (clearColor || this.clearColor) {
                ctx.fillStyle = clearColor || this.clearColor;
                ctx.fillRect(0, 0, this.width, this.height);
            }
        }

        /* GETTERS & SETTERS */

    }, {
        key: "name",
        get: function get() {
            return "canvas";
        }
    }]);

    return Canvas;
}(_index2.default);

exports.default = Canvas;