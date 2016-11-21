import Component from "./Component";


export default class Element {

    /* LIFECYCLE */
    constructor () {

        /**
         * Unique id of element
         * @type {string}
         */
        this.id = Element.generateId();

        /**
         * Name of the element
         * @type {string}
         */
        this.name = "Element";

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
    }

    /**
     * Initialization of the element after it is created into the engine
     * @returns {void}
     */
    initialize () { }


    /* METHODS */

    /**
     * Generate an unique id
     * @returns {string} return the unique id
     */
    static generateId () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).
            substring(1);
    }

    /**
     * Destroy the element
     * @returns {void}
     */
    destroy () {
        this.components.map(name => this.decompose(name));
        this.destroyed = true;
    }


    /* COMPONENTS */

    /**
     * Add a component into this element
     * @param {Component} component: The component to be added
     * @returns {Element} current element
     */
    compose (component) {
        if (!(component instanceof Component)) {
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
    decompose (componentName) {
        this.components.map((name, index) => {
            if (name === componentName) {
                this[name].pluggedFunctions.map((pluggedFunction) => {
                    if (this.componentFunctions[pluggedFunction]) {
                        this.componentFunctions[pluggedFunction] = this.componentFunctions[pluggedFunction].filter(compName => compName !== name);
                    }

                    return null;
                });

                this.components.splice(index, 1);
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
    isComposedOf (componentName, callback) {
        const exist = Boolean(this.components.find(component => component === componentName));

        return callback && exist ? callback() : exist;
    }

    /**
     * Add a new component function to be executed before the parent function
     * @param {string} componentName: the name of the component
     * @param {string} functionName: the name of the function
     * @returns {void|null} nothing
     */
    addComponentFunction (componentName, functionName) {
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
    callComponentFunction (functionName) {
        if (this.componentFunctions[functionName]) {
            this.componentFunctions[functionName].map((name) => this[name][functionName](...Array.prototype.slice.call(arguments, 1)));
        }
    }
}
