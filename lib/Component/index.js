"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {Object=} props: properties
     */
    function Component() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Component);

        /**
         * Unique Id of the component
         * @type {string}
         */
        this.id = Component.generateId();

        /**
         * List of current components
         * @type {Array<Component>}
         */
        this.components = [];

        /**
         * Parent which attach this component
         * @type {Component|null}
         */
        this.parent = null;

        /**
         * Property to know if this component is destroyed and don't be usable until it has been trashed by Garbage Collector
         * @readonly
         * @type {boolean}
         */
        this.destroyed = true;

        /**
         * Props that are changed since the new cycle
         * @readonly
         * @type {{}}
         */
        this.previousProps = {};

        /**
         * Props Cached, do not modify
         * @private
         * @readonly
         * @type {{}}
         */
        this._cachedProps = {};

        // Merge props
        this.setProps(props);
    }

    /**
     * Called when attached to an other component
     * @initialize
     * @param {Component=} parent: Component parent owner
     * @returns {void}
     */


    _createClass(Component, [{
        key: "initialize",
        value: function initialize(parent) {
            this.parent = parent;
        }

        /**
         * Destroy a component
         * @destroy
         * @returns {void}
         */

    }, {
        key: "destroy",
        value: function destroy() {
            if (this.parent) {
                this.parent.decompose(this);
            }

            this.destroyed = true;
        }

        /**
         * Update a component
         * @update
         * @returns {void|null} null
         */

    }, {
        key: "update",
        value: function update() {
            this.components.forEach(function (component) {
                return component.update();
            });
        }

        /**
         * Begin a new cycle
         * @nextCycle
         * @returns {void}
         */

    }, {
        key: "nextCycle",
        value: function nextCycle() {
            this.previousProps = {};

            this.components.forEach(function (component) {
                return component.nextCycle();
            });
        }

        /**
         * Reset this component to its initial state
         * @reset
         * @returns {void}
         */

    }, {
        key: "reset",
        value: function reset() {
            this.nextCycle();
            this.destroyed = false;
        }

        /* METHODS */

        /**
         * Attach a component
         * @param {Component|*} component: component to be attached
         * @param {function=} next: function with the component attached in parameter
         * @returns {Component} current instance
         */

    }, {
        key: "compose",
        value: function compose(component, next) {
            if (!component || !(component instanceof Component)) {
                throw new Error("Component.compose : parameter 1 must be an instance of Component.");
            }

            var name = component.name;

            this.components.push(component);
            component.initialize(this);

            if (this.prototype) {
                delete this.prototype[name];
            }

            Object.defineProperty(this, name, {
                value: component,
                writable: false,
                configurable: true
            });

            if (next) {
                next(component);
            }

            return this;
        }

        /**
         * Decompose a component
         * @param {Component} component: The component to be decomposed
         * @returns {Component} current instance
         */

    }, {
        key: "decompose",
        value: function decompose(component) {
            if (!component || !(component instanceof Component)) {
                throw new Error("Component.decompose : parameter 1 must be an instance of Component.");
            }

            var name = component.name;

            component.destroyed = true;
            if (this.prototype) {
                delete this.prototype[name];
            }
            this.components = this.components.filter(function (x) {
                return x.name !== name;
            });

            return this;
        }

        /**
         * Know if the component has component attached by his name
         * @param {string} componentName: Name of the component
         * @returns {boolean} result of the check
         */

    }, {
        key: "has",
        value: function has(componentName) {
            return Boolean(this[componentName]);
        }

        /**
         * Check if a prop has changed
         * @param {string} prop: name of the property
         * @param {function=} next: next function called if prop has changed
         * @returns {*|boolean} the result
         */

    }, {
        key: "hasChanged",
        value: function hasChanged(prop, next) {
            var response = this.previousProps[prop] && this.previousProps[prop] !== this[prop];

            if (response) {
                next(this.previousProps[prop], this[prop]);
            }

            return response;
        }

        /**
         * Set/Add new properties to component
         * @param {Object} nextProps: next properties to merge
         * @returns {Component} the component
         */

    }, {
        key: "setProps",
        value: function setProps() {
            var nextProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var clonedProps = Object.assign({}, nextProps);

            for (var key in clonedProps) {
                if (clonedProps.hasOwnProperty(key)) {
                    this[key] = clonedProps[key];
                }
            }

            return this;
        }

        /**
         * Observe property
         * @param {string} prop: property name
         * @param {function=} setFunction: function observable when property is changed
         * @returns {void}
         */

    }, {
        key: "observeProp",
        value: function observeProp(prop, setFunction) {
            this._cachedProps[prop] = this[prop];

            delete this[prop];
            if (this.prototype) {
                delete this.prototype[prop];
            }

            Object.defineProperty(this, prop, {
                get: function get() {
                    return this._cachedProps[prop];
                },
                set: function set(nextValue) {
                    if (setFunction) {
                        setFunction(this._cachedProps[prop], nextValue);
                    }

                    this.previousProps[prop] = this._cachedProps[prop];
                    this._cachedProps[prop] = nextValue;
                },


                configurable: true
            });
        }

        /* GETTERS & SETTERS */

        /**
         * Name identifier
         * @returns {string} the name
         */

    }, {
        key: "name",
        get: function get() {
            return "component";
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

    return Component;
}();

exports.default = Component;