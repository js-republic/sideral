"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Component2 = require("./Component");

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Canvas = function (_Component) {
    _inherits(Canvas, _Component);

    /* LIFECYCLE */
    /**
     * Canvas constructor
     * @param {number} width: width of the canvas
     * @param {number} height: height of the canvas
     * @param {*=} parentDOM: DOM node to attach the canvas
     */
    function Canvas(width, height, parentDOM) {
        _classCallCheck(this, Canvas);

        /**
         * DOM parent of the canvas
         */
        var _this = _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this));

        _this.parentDOM = parentDOM;

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

        /**
         * Size of the canvas
         * @type {{width: number, height: number}}
         * @readonly
         */
        _this.size = { width: width || 0, height: height || 0 };
        return _this;
    }

    _createClass(Canvas, [{
        key: "initialize",
        value: function initialize() {
            _get(Canvas.prototype.__proto__ || Object.getPrototypeOf(Canvas.prototype), "initialize", this).call(this);

            this.dom = document.createElement("canvas");
            this.dom.id = this.id;
            this.dom.width = this.width();
            this.dom.height = this.height();
            this.context = this.dom.getContext("2d");

            this.setParentDOM();
        }
    }, {
        key: "render",
        value: function render() {
            this.clear();
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

            ctx.clearRect(0, 0, this.width(), this.height());

            if (clearColor || this.clearColor) {
                ctx.fillStyle = clearColor || this.clearColor;
                ctx.fillRect(0, 0, this.width(), this.height());
            }
        }

        /* GETTERS & SETTERS */

        /**
         * The name of the component
         * @returns {string} name
         */

    }, {
        key: "width",


        /**
         * Get or set the width
         * @param {number=} width: if exist, the width will be setted
         * @returns {number} the current width
         */
        value: function width(_width) {
            if (typeof _width !== "undefined") {
                this.size.width = _width;

                if (this.dom) {
                    this.dom.width = _width;
                }
            }

            return this.size.width;
        }

        /**
         * Get or set the height
         * @param {number=} height: if exist, the height will be setted
         * @returns {number} the current height
         */

    }, {
        key: "height",
        value: function height(_height) {
            if (typeof _height !== "undefined") {
                this.size.height = _height;

                if (this.dom) {
                    this.dom.height = _height;
                }
            }

            return this.size.height;
        }
    }, {
        key: "name",
        get: function get() {
            return "canvas";
        }
    }]);

    return Canvas;
}(_Component3.default);

exports.default = Canvas;