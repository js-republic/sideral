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
     */
    function Component() {
        _classCallCheck(this, Component);

        /**
         * Element which using this component
         * @type {Element}
         */
        var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this));

        _this.composedBy = null;

        /**
         * List of all functions plugged to the parent
         * @type {Array}
         */
        _this.pluggedFunctions = [];
        return _this;
    }

    /**
     * Initialization of the component after it is composed
     * @returns {void}
     */


    _createClass(Component, [{
        key: "initialize",
        value: function initialize() {
            var _this2 = this;

            if (!this.composedBy) {
                throw new Error("Component.initialize : A Component must be composed by an element before calling Initiliaze.");
            }

            var functions = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(function (prop) {
                return prop !== "constructor" && prop !== "initialize";
            });

            this.pluggedFunctions = [];

            functions.map(function (key) {
                if (_this2.composedBy[key]) {
                    _this2.composedBy.addComponentFunction(_this2.name, key);
                    _this2.pluggedFunctions.push(key);
                }

                return null;
            });
        }

        /* METHODS */

        /* GETTERS & SETTERS */

        /**
         * Name of the component
         * @returns {string} the name
         */

    }, {
        key: "name",
        get: function get() {
            return "component";
        }
    }]);

    return Component;
}(_Class3.default);

exports.default = Component;