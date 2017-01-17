import Reactivity from "./Reactivity";


export default class Component {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {

        /**
         * Define a flux of reactivity between attributes
         * @type {Reactivity}
         */
        this.reactivity = new Reactivity(this);

        /**
         * Unique Id for the Comonent
         * @type {string}
         */
        this.id = Component.generateId();

        /**
         * List of all components children
         * @type {Array<Component>}
         */
        this.children = [];

        /**
         * Parent component
         * @type {Component}
         */
        this.parent = null;

        /**
         * Check if this component must be collected by garbage
         * @type {boolean}
         */
        this.destroyed = false;

        /**
         * If true, the component can be render into the current parent scene
         * @type {boolean}
         */
        this.viewable   = false;

        // Add all reactivity logic here
        this.setReactivity();
    }

    /**
     * Instance all your reactive props here
     * @returns {void}
     */
    setReactivity () { }

    /**
     * Called when all parent components are initialized
     * @param {{}=} props: properties to merge
     * @returns {void}
     */
    initialize (props) {
        this.set(props);
    }

    /**
     * Update lifecycle
     * @returns {void}
     */
    update () {
        this.children.forEach(child => child.update());
    }

    /**
     * Render lifecycle
     * @returns {void}
     */
    render () {
        this.children.forEach(child => child.render());
    }

    /* METHODS */

    /**
     * Set/Add new properties to component
     * @param {Object} nextProps: next properties to merge
     * @returns {Component} the current component
     */
    set (nextProps = {}) {
        const clonedProps = Object.assign({}, nextProps);

        for (const key in clonedProps) {
            if (clonedProps.hasOwnProperty(key)) {
                this[key] = clonedProps[key];
            }
        }

        return this;
    }

    /**
     * Compose a component and set it has a children of the current Component
     * @param {Component} component: child
     * @param {{}=} injectProps: props to inject after parent created
     * @param {*=} next: function callback
     * @returns {Component} current Component
     */
    compose (component, injectProps = {}, next = null) {
        if (!component || !(component instanceof Component)) {
            throw new Error("Component.compose : parameter 1 must be an instance of 'Component'.");
        }

        const name = component.name;

        this.children.push(component);
        component.parent = this;
        component.initialize(injectProps);

        if (this.prototype) {
            delete this.prototype[name];
        }

        Object.defineProperty(this, name, {
            value           : component,
            writable        : false,
            configurable    : true
        });

        if (next) {
            next(component);
        }

        return this;
    }

    /* GETTERS & SETTERS */

    get name () {
        return "component";
    }

    /* STATICS */

    /**
     * Generate an unique id
     * @returns {string} return the unique id
     */
    static generateId () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).
        substring(1);
    }
}
