"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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
     * @param {{ name: string, components: [], props: {} }} options: options for the element
     */
    function Element() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Element);

        /**
         * Name of the component
         * @readonly
         * @type {string}
         */
        var _this = _possibleConstructorReturn(this, (Element.__proto__ || Object.getPrototypeOf(Element)).call(this, options));

        _this.name = "element";

        /**
         * List of all components by their names
         * @type {Array<string>}
         */
        _this.components = [];

        /**
         * Lifecycle functions enhancement
         * @type {{}}
         */
        _this.lifecycle = options;

        /**
         * Know if the element is destroyed and it is not usable
         * @readonly
         * @type {boolean}
         */
        _this.destroyed = false;

        // Include all components
        if (options.components && options.components.length) {
            options.components.forEach(function (component) {
                return _this.compose(component);
            });
        }

        delete _this.lifecycle.name;
        delete _this.lifecycle.props;
        delete _this.lifecycle.components;
        return _this;
    }

    /**
     * Called when attached to a parent
     * @initialize
     * @returns {void}
     */


    _createClass(Element, [{
        key: "initialize",
        value: function initialize() {
            if (this.lifecycle.initialize) {
                this.lifecycle.initialize.bind(this)();
            }
        }

        /**
         * Remove the element
         * @destroy
         * @returns {void}
         */

    }, {
        key: "destroy",
        value: function destroy() {
            var _this2 = this;

            this.destroyed = true;
            this.components.map(function (name) {
                return _this2.decompose(name);
            });

            if (this.lifecycle.destroy) {
                this.lifecycle.destroy.bind(this)();
            }
        }

        /**
         * Actions before update
         * @beforeUpdate
         * @returns {void}
         */

    }, {
        key: "beforeUpdate",
        value: function beforeUpdate() {
            if (this.lifecycle.beforeUpdate) {
                this.lifecycle.beforeUpdate.bind(this)();
            }
        }

        /**
         * Update the element and these components
         * @update
         * @returns {void}
         */

    }, {
        key: "update",
        value: function update() {
            this.beforeUpdate();
            _get(Element.prototype.__proto__ || Object.getPrototypeOf(Element.prototype), "update", this).call(this);
            this.callComponentFunction("update");

            if (this.lifecycle.update) {
                this.lifecycle.update.bind(this)();
            }
        }

        /**
         * Event fire when properties has changed
         * @param {*} changedProps: properties that has changed
         * @returns {void}
         */

    }, {
        key: "onPropsChanged",
        value: function onPropsChanged(changedProps) {
            if (this.lifecycle.onPropsChanged) {
                this.lifecycle.onPropsChanged.bind(this)(changedProps);
            }
        }

        /**
         * Called only when requestRender is true
         * @render
         * @param {*} context: canvas context
         * @returns {void}
         */

    }, {
        key: "render",
        value: function render(context) {
            this.callComponentFunction("render", context);

            if (this.lifecycle.render) {
                this.lifecycle.render.bind(this)(context);
            }
        }

        /**
         * Called after every cycle
         * @nextCycle
         * @returns {void}
         */

    }, {
        key: "nextCycle",
        value: function nextCycle() {
            for (var key in this.previousProps) {
                if (this.previousProps.hasOwnProperty(key)) {
                    this.previousProps[key] = this[key];
                }
            }

            this.requestRender = false;
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

        /* METHODS */

        /**
         * Attach an element to an array
         * @param {Element} element: element to attach
         * @param {Array<Element>} arr: Array to store elements
         * @param {function=} callback: callback with element added in parameter
         * @returns {Element} current element
         */

    }, {
        key: "attach",
        value: function attach(element, arr, callback) {
            if (!element) {
                return this;
            }

            if (arr && arr instanceof Array) {
                arr.push(element);
            }

            element.initialize();

            if (callback) {
                callback(element);
            }

            return this;
        }

        /**
         * Add a component into this element
         * @param {Component} component: The component to be added
         * @param {function=} callback: Callback with the element composed in parameter
         * @returns {Element} current element
         */

    }, {
        key: "compose",
        value: function compose(component, callback) {
            if (!(component instanceof _Component2.default)) {
                throw new Error("Element.compose : the component is not an instance of Component.");
            }

            component.composedBy = this;
            this[component.name] = component;
            this.components.push(component.name);
            component.initialize();

            if (callback) {
                callback(component);
            }

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
            this.components = this.components.filter(function (name) {
                return name !== componentName;
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
            var exist = Boolean(this.components.find(function (name) {
                return name === componentName;
            }));

            return callback && exist ? callback() : exist;
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

            this.components.forEach(function (name) {
                if (_this3[name] && _this3[name][functionName]) {
                    var _name;

                    (_name = _this3[name])[functionName].apply(_name, _toConsumableArray(Array.prototype.slice.call(_arguments, 1)));
                }
            });
        }
    }]);

    return Element;
}(_Class3.default);

exports.default = Element;