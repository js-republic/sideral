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
