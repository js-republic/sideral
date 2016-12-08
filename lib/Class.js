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
     * @param {{ name: string, components: [], props: {} }} options: options for the element
     */
    function Class() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Class);

        /**
         * Unique id of element
         * @type {string}
         */
        this.id = Class.generateId();

        /**
         * Name of the class to be recognized
         * @type {string}
         */
        this.name = "class";

        /**
         * Props before update
         * @type {{}} properties
         */
        this.previousProps = Object.assign({}, options.props);

        // Add default props
        this.props(this.previousProps);
    }

    /**
     * Initialization of the element after it is created into the engine
     * @initialize
     * @returns {void}
     */


    _createClass(Class, [{
        key: "initialize",
        value: function initialize() {}

        /**
         * Update lifecycle
         * @update
         * @returns {void}
         */

    }, {
        key: "update",
        value: function update() {
            var changedProps = {};

            for (var key in this.previousProps) {
                if (this.previousProps.hasOwnProperty(key) && this.previousProps[key] !== this[key]) {
                    changedProps[key] = this[key];
                    this.requestRender = true;
                }
            }

            if (this.requestRender) {
                this.onPropsChanged(changedProps);
            }
        }

        /*eslint-disable*/
        /**
         * called when props has changed
         * @param {*} changedProps: changed properties
         * @return {void}
         */

    }, {
        key: "onPropsChanged",
        value: function onPropsChanged(changedProps) {}
        /*eslint-enable*/

        /* METHODS */

        /**
         * Set attributes to current instance
         * @param {*} props: properties to merge
         * @returns {*} SideralClass: current instance
         */

    }, {
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