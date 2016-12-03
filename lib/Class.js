"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Class = function () {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    function Class() {
        _classCallCheck(this, Class);

        /**
         * Unique id of element
         * @type {string}
         */
        this.id = Class.generateId();
    }

    /**
     * Set attributes to current instance
     * @param {*} props: properties to merge
     * @returns {*} SideralClass: current instance
     */


    _createClass(Class, [{
        key: "props",
        value: function props() {
            var _props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            for (var key in _props) {
                if (_props.hasOwnProperty(key)) {
                    this[key] = _props[key];
                }
            }

            return this;
        }

        /**
         * Initialization of the element after it is created into the engine
         * @returns {void}
         */

    }, {
        key: "initialize",
        value: function initialize() {}

        /* METHODS */

        /* GETTERS & SETTERS */

        /**
         * String identifier
         * @returns {string} the name of the class
         */

    }, {
        key: "name",
        get: function get() {
            return "Class";
        }

        /* STATICS */

        /**
         * Generate an unique id
         * @returns {string} return the unique id
         */

    }], [{
        key: "generateId",
        value: function generateId() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
    }]);

    return Class;
}();

exports.default = Class;