"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Class2 = require("./../Class");

var _Class3 = _interopRequireDefault(_Class2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = function (_Class) {
  _inherits(Component, _Class);

  /* LIFECYCLE */

  /**
   * @constructor
   * @param {{}} options: options
   */
  function Component() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    /**
     * Name of the component
     * @readonly
     * @type {string}
     */
    var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this, { props: options }));

    _this.name = "component";

    /**
     * Element which using this component
     * @type {Element}
     */
    _this.composedBy = null;
    return _this;
  }

  /**
   * Initialization of the component after it is composed
   * @returns {void}
   */


  _createClass(Component, [{
    key: "initialize",
    value: function initialize() {
      if (!this.composedBy) {
        throw new Error("Component.initialize : A Component must be composed by an element before calling Initiliaze.");
      }
    }
  }]);

  return Component;
}(_Class3.default);

exports.default = Component;