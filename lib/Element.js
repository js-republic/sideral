"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component = require("./Component");

var _Component2 = _interopRequireDefault(_Component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = function () {

    /* LIFECYCLE */
    function Element() {
        _classCallCheck(this, Element);

        /**
         * Unique id of element
         * @type {string}
         */
        this.id = Element.generateId();

        /**
         * List of components added to this element by their names
         * @type {Array<string>}
         */
        this.components = [];

        /**
         * List of all component functions to be called
         * @type {Array<Array<string>>}
         */
        this.componentFunctions = {};

        /**
         * Know if this component is detroyed or not
         * @type {boolean}
         * @private
         */
        this.destroyed = false;

        /**
         * Size of the element
         * @type {{width: number, height: number}}
         * @readonly
         */
        this.size = { width: 0, height: 0 };
    }

    /**
     * Initialization of the element after it is created into the engine
     * @returns {void}
     */


    _createClass(Element, [{
        key: "initialize",
        value: function initialize() {}

        /**
         * Update the element
         * @returns {void}
         */

    }, {
        key: "update",
        value: function update() {
            this.callComponentFunction("update");
        }

        /**
         * Render the element
         * @param {*} context: context to render the element
         * @returns {void}
         */

    }, {
        key: "render",
        value: function render(context) {
            this.callComponentFunction("render", context);
        }

        /* METHODS */

        /**
         * Generate an unique id
         * @returns {string} return the unique id
         */

    }, {
        key: "destroy",


        /**
         * Destroy the element
         * @returns {void}
         */
        value: function destroy() {
            var _this = this;

            this.components.map(function (name) {
                return _this.decompose(name);
            });
            this.destroyed = true;
        }

        /* COMPONENTS */

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
         * Remove a component from the element
         * @param {string} componentName: The name of the component
         * @returns {Element} current element
         */

    }, {
        key: "decompose",
        value: function decompose(componentName) {
            var _this2 = this;

            this.components.map(function (name, index) {
                if (name === componentName) {
                    _this2[name].pluggedFunctions.map(function (pluggedFunction) {
                        if (_this2.componentFunctions[pluggedFunction]) {
                            _this2.componentFunctions[pluggedFunction] = _this2.componentFunctions[pluggedFunction].filter(function (compName) {
                                return compName !== name;
                            });
                        }

                        return null;
                    });

                    _this2.components.splice(index, 1);
                }

                return null;
            });

            return this;
        }

        /**
         * Return true if the element has the component by its name
         * @param {string} componentName: The name of the component
         * @param {function=} callback: function to be executed if element is composed of the component
         * @returns {boolean|function} the element is composed of the component
         */

    }, {
        key: "isComposedOf",
        value: function isComposedOf(componentName, callback) {
            var exist = Boolean(this.components.find(function (component) {
                return component === componentName;
            }));

            return callback && exist ? callback() : exist;
        }

        /**
         * Add a new component function to be executed before the parent function
         * @param {string} componentName: the name of the component
         * @param {string} functionName: the name of the function
         * @returns {void|null} nothing
         */

    }, {
        key: "addComponentFunction",
        value: function addComponentFunction(componentName, functionName) {
            if (!this.isComposedOf(componentName) || !this[functionName]) {
                return null;
            }

            if (!this.componentFunctions[functionName]) {
                this.componentFunctions[functionName] = [];
            }

            this.componentFunctions[functionName].push(componentName);
        }

        /**
         * Call functions of components by name of the function
         * @param {...*} functionName: the name of the function and other arguments to be transmitted into components
         * @returns {void}
         */

    }, {
        key: "callComponentFunction",
        value: function callComponentFunction(functionName) {
            var _this3 = this,
                _arguments = arguments;

            if (this.componentFunctions[functionName]) {
                this.componentFunctions[functionName].map(function (name) {
                    var _name;

                    return (_name = _this3[name])[functionName].apply(_name, _toConsumableArray(Array.prototype.slice.call(_arguments, 1)));
                });
            }
        }

        /* GETTERS & SETTERS */

        /**
         * Name of the element
         * @returns {string} the name
         */

    }, {
        key: "width",


        /**
         * Get or set a width
         * @param {number=} width: if exist, width will be setted
         * @returns {number} the current width
         */
        value: function width(_width) {
            if (typeof _width !== "undefined") {
                this.size.width = _width;
            }

            return this.size.width;
        }

        /**
         * Get or set a height
         * @param {number=} height: if exist, height will be setted
         * @returns {number} the current height
         */

    }, {
        key: "height",
        value: function height(_height) {
            if (typeof _height !== "undefined") {
                this.size.height = _height;
            }

            return this.size.height;
        }
    }, {
        key: "name",
        get: function get() {
            return "element";
        }
    }], [{
        key: "generateId",
        value: function generateId() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
    }]);

    return Element;
}();

exports.default = Element;