"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Class2 = require("./Class");

var _Class3 = _interopRequireDefault(_Class2);

var _Component = require("./Component");

var _Component2 = _interopRequireDefault(_Component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = function (_Class) {
    _inherits(Element, _Class);

    /* LIFECYCLE */

    /**
     * @constructor
     */
    function Element() {
        _classCallCheck(this, Element);

        /**
         * List of components added to this element by their names
         * @type {Array<string>}
         */
        var _this = _possibleConstructorReturn(this, (Element.__proto__ || Object.getPrototypeOf(Element)).call(this));

        _this.components = [];

        /**
         * List of all component functions to be called
         * @type {Array<Array<string>>}
         */
        _this.componentFunctions = {};

        /**
         * Know if this component is detroyed or not
         * @type {boolean}
         * @private
         */
        _this.destroyed = false;

        /**
         * Size of the element
         * @type {{width: number, height: number}}
         * @readonly
         */
        _this.size = { width: 0, height: 0 };
        return _this;
    }

    /**
     * Update the element
     * @returns {void}
     */


    _createClass(Element, [{
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
         * Destroy the element
         * @returns {void}
         */

    }, {
        key: "destroy",
        value: function destroy() {
            var _this2 = this;

            this.components.map(function (name) {
                return _this2.decompose(name);
            });
            this.destroyed = true;
        }

        /**
         * Reset an element
         * @returns {void}
         */

    }, {
        key: "reset",
        value: function reset() {
            this.destroyed = false;
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
            var _this3 = this;

            this.components.map(function (name, index) {
                if (name === componentName) {
                    _this3[name].pluggedFunctions.map(function (pluggedFunction) {
                        if (_this3.componentFunctions[pluggedFunction]) {
                            _this3.componentFunctions[pluggedFunction] = _this3.componentFunctions[pluggedFunction].filter(function (compName) {
                                return compName !== name;
                            });
                        }

                        return null;
                    });

                    _this3.components.splice(index, 1);
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
            var _this4 = this,
                _arguments = arguments;

            if (this.componentFunctions[functionName]) {
                this.componentFunctions[functionName].map(function (name) {
                    var _name;

                    return (_name = _this4[name])[functionName].apply(_name, _toConsumableArray(Array.prototype.slice.call(_arguments, 1)));
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
    }]);

    return Element;
}(_Class3.default);

exports.default = Element;