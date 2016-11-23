"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Element = require("./Element");

var _Element2 = _interopRequireDefault(_Element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {

    /* LIFECYCLE */
    function Component() {
        _classCallCheck(this, Component);

        /**
         * Id of the component
         * @type {string}
         */
        this.id = _Element2.default.generateId();

        /**
         * Element which using this component
         * @type {Element}
         */
        this.composedBy = null;

        /**
         * List of all functions plugged to the parent
         * @type {Array}
         */
        this.pluggedFunctions = [];
    }

    /**
     * Initialization of the component after it is composed
     * @returns {void}
     */


    _createClass(Component, [{
        key: "initialize",
        value: function initialize() {
            var _this = this;

            if (!this.composedBy) {
                throw new Error("Component.initialize : A Component must be composed by an element before calling Initiliaze.");
            }

            var functions = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(function (prop) {
                return prop !== "constructor" && prop !== "initialize";
            });

            this.pluggedFunctions = [];

            functions.map(function (key) {
                if (_this.composedBy[key]) {
                    _this.composedBy.addComponentFunction(_this.name, key);
                    _this.pluggedFunctions.push(key);
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
}();

exports.default = Component;