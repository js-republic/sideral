"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component = require("./Component");

var _Component2 = _interopRequireDefault(_Component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entity = function () {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {Array<Component>} components: list of all components
     * @param {{}} defaultProps: default properties for the class
     * @param {{}} enhancedFunctions: list of functions to be plugged into lifecycle to enhance them
     */
    function Entity() {
        var components = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        var _this = this;

        var defaultProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var enhancedFunctions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, Entity);

        /**
         * Props before update
         * @type {{}} properties
         */
        this.previousProps = defaultProps;

        /**
         * EnhancedFunctions for lifecycle
         * @private
         * @type {{}}
         */
        this.enhancedFunctions = enhancedFunctions;

        /**
         * Request update is at true when an entity need to be updated and rendered
         * @readonly
         * @type {boolean}
         */
        this.requestUpdate = false;

        // Include all components
        components.forEach(function (component) {
            return _this.compose(component);
        });

        // Add default props
        this.props(defaultProps);
    }

    _createClass(Entity, [{
        key: "initialize",
        value: function initialize() {
            if (this.enhancedFunctions.initialized) {
                this.enhancedFunctions.initialized.bind(this)();
            }
        }
    }, {
        key: "destroy",
        value: function destroy() {
            if (this.enhancedFunctions.destroyed) {
                this.enhancedFunctions.destroyed.bind(this)();
            }
        }
    }, {
        key: "update",
        value: function update() {
            var changedProps = {};

            for (var key in this) {
                if (this.hasOwnProperty(key) && typeof this.previousProps[key] !== "undefined" && this.previousProps[key] !== this[key]) {
                    changedProps[key] = this[key];
                    this.requestUpdate = true;
                }
            }

            if (this.enhancedFunctions.updated) {
                this.enhancedFunctions.updated.bind(this)(changedProps);
            }
        }
    }, {
        key: "render",
        value: function render() {
            if (this.enhancedFunctions.rendered) {
                this.enhancedFunctions.rendered.bind(this)();
            }

            this.requestUpdate = false;
        }

        /* METHODS */

        /**
         * Add a component into this element
         * @param {Component} component: The component to be added
         * @returns {Element} current element
         */

    }, {
        key: "compose",
        value: function compose(component) {
            if (!(component instanceof _Component2.default)) {
                throw new Error("Element.compose : the component is not an instance of Component.");
            }

            component.composedBy = this;
            this[component.name] = component;
            this.components.push(component.name);
            component.initialize();

            return this;
        }

        /**
         * Set properties to current instance
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
    }]);

    return Entity;
}();

exports.default = Entity;