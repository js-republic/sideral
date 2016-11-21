"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Component2 = require("./../Component");

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
     * Name of the canvas
     * @type {string}
     */
    var _this = _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this));

    _this.name = "canvas";

    /**
     * Size of canvas
     * @type {{width: number, height: number}}
     */
    _this.size = { width: width, height: height };

    /**
     * DOM parent of the canvas
     */
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
    _this.clearColor = "whitesmoke";
    return _this;
  }

  _createClass(Canvas, [{
    key: "initialize",
    value: function initialize() {
      _get(Canvas.prototype.__proto__ || Object.getPrototypeOf(Canvas.prototype), "initialize", this).call(this);

      this.dom = document.createElement("canvas");
      this.dom.id = this.id;
      this.dom.width = this.size.width;
      this.dom.height = this.size.height;
      this.context = this.dom.getContext("2d");

      this.setParentDOM();
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
     * Set a new size for the canvas
     * @param {number=} width: width of the canvas
     * @param {number=} height: height of the canvas
     * @returns {void}
     */

  }, {
    key: "setSize",
    value: function setSize(width, height) {
      if (this.dom) {
        this.setWidth(width);
        this.setHeight(height);
      }
    }

    /**
     * resize width of the canvas
     * @param {number} width: width of the canvas
     * @returns {void}
     */

  }, {
    key: "setWidth",
    value: function setWidth(width) {
      if (width) {
        this.size.width = width;
        this.dom.width = width;
      }
    }

    /**
     * Resize height of the canvas
     * @param {number} height: height of the canvas
     * @returns {void}
     */

  }, {
    key: "setHeight",
    value: function setHeight(height) {
      if (height) {
        this.size.height = height;
        this.dom.height = height;
      }
    }

    /**
     * Clear the canvas
     * @param {string} clearColor: color of the canvas when it will be cleared
     * @returns {void}
     */

  }, {
    key: "clear",
    value: function clear(clearColor) {
      var ctx = this.context;

      ctx.fillStyle = clearColor || this.clearColor;
      ctx.clearRect(0, 0, this.size.width, this.size.height);
      ctx.fillRect(0, 0, this.size.width, this.size.height);
    }
  }]);

  return Canvas;
}(_Component3.default);

exports.default = Canvas;