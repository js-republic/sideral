import Class from "./Class";
import Component from "./Component";


export default class Element extends Class {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {{ name: string, components: [], props: {} }} options: options for the element
     */
    constructor (options = {}) {
        super(options);

        /**
         * Name of the component
         * @readonly
         * @type {string}
         */
        this.name = "element";

        /**
         * List of all components by their names
         * @type {Array<string>}
         */
        this.components = [];

        /**
         * Lifecycle functions enhancement
         * @type {{}}
         */
        this.lifecycle = options;

        /**
         * Know if the element is destroyed and it is not usable
         * @readonly
         * @type {boolean}
         */
        this.destroyed = false;

        // Include all components
        if (options.components && options.components.length) {
            options.components.forEach(component => this.compose(component));
        }

        delete this.lifecycle.name;
        delete this.lifecycle.props;
        delete this.lifecycle.components;
    }

    /**
     * Called when attached to a parent
     * @initialize
     * @returns {void}
     */
    initialize () {
        if (this.lifecycle.initialize) {
            this.lifecycle.initialize.bind(this)();
        }
    }

    /**
     * Remove the element
     * @destroy
     * @returns {void}
     */
    destroy () {
        this.destroyed = true;
        this.components.map(name => this.decompose(name));

        if (this.lifecycle.destroy) {
            this.lifecycle.destroy.bind(this)();
        }
    }

    /**
     * Actions before update
     * @beforeUpdate
     * @returns {void}
     */
    beforeUpdate () {
        if (this.lifecycle.beforeUpdate) {
            this.lifecycle.beforeUpdate.bind(this)();
        }
    }

    /**
     * Update the element and these components
     * @update
     * @returns {void}
     */
    update () {
        this.beforeUpdate();
        super.update();
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
    onPropsChanged (changedProps) {
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
    render (context) {
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
    nextCycle () {
        for (const key in this.previousProps) {
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
    reset () {
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
    attach (element, arr, callback) {
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
    compose (component, callback) {
        if (!(component instanceof Component)) {
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
    decompose (componentName) {
        this.components = this.components.filter(name => name !== componentName);

        return this;
    }

    /**
     * Return true if the element has the component by its name
     * @param {string} componentName: The name of the component
     * @param {function=} callback: function to be executed if element is composed of the component
     * @returns {boolean|function} the element is composed of the component
     */
    isComposedOf (componentName, callback) {
        const exist = Boolean(this.components.find(name => name === componentName));

        return callback && exist ? callback() : exist;
    }

    /**
     * Call functions of components by name of the function
     * @param {...*} functionName: the name of the function and other arguments to be transmitted into components
     * @returns {void}
     */
    callComponentFunction (functionName) {
        this.components.forEach((name) => {
            if (this[name] && this[name][functionName]) {
                this[name][functionName](...Array.prototype.slice.call(arguments, 1));
            }
        });
    }
}
