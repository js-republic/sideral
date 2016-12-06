import Component from "./Component";


export default class Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {Array<Component>} components: list of all components
     * @param {{}} defaultProps: default properties for the class
     * @param {{}} enhancedFunctions: list of functions to be plugged into lifecycle to enhance them
     */
    constructor (components = [], defaultProps = {}, enhancedFunctions = {}) {

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
        components.forEach(component => this.compose(component));

        // Add default props
        this.props(defaultProps);
    }

    initialize () {
        if (this.enhancedFunctions.initialized) {
            this.enhancedFunctions.initialized.bind(this)();
        }
    }

    destroy () {
        if (this.enhancedFunctions.destroyed) {
            this.enhancedFunctions.destroyed.bind(this)();
        }
    }

    update () {
        const changedProps = {};

        for (const key in this) {
            if (this.hasOwnProperty(key) && typeof this.previousProps[key] !== "undefined" && this.previousProps[key] !== this[key]) {
                changedProps[key] = this[key];
                this.requestUpdate = true;
            }
        }

        if (this.enhancedFunctions.updated) {
            this.enhancedFunctions.updated.bind(this)(changedProps);
        }
    }

    render () {
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
     * Set properties to current instance
     * @param {*} props: properties to merge
     * @returns {*} SideralClass: current instance
     */
    props (props = {}) {
        for (const key in props) {
            if (props.hasOwnProperty(key)) {
                this[key] = props[key];
            }
        }

        return this;
    }
}
