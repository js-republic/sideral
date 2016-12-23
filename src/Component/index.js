export default class Component {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {Object=} props: properties
     */
    constructor (props = {}) {

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
    initialize (parent) {
        this.parent = parent;
    }

    /**
     * Destroy a component
     * @destroy
     * @returns {void}
     */
    destroy () {
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
    update () {
        this.components.forEach(component => component.update());
    }

    /**
     * Begin a new cycle
     * @nextCycle
     * @returns {void}
     */
    nextCycle () {
        this.previousProps = {};

        this.components.forEach(component => component.nextCycle());
    }

    /**
     * Reset this component to its initial state
     * @reset
     * @returns {void}
     */
    reset () {
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
    compose (component, next) {
        if (!component || !(component instanceof Component)) {
            throw new Error("Component.compose : parameter 1 must be an instance of Component.");
        }

        const name = component.name;

        this.components.push(component);
        component.initialize(this);

        if (this.prototype) {
            delete this.prototype[name];
        }

        Object.defineProperty(this, name, {
            value       : component,
            writable    : false,
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
    decompose (component) {
        if (!component || !(component instanceof Component)) {
            throw new Error("Component.decompose : parameter 1 must be an instance of Component.");
        }

        const name = component.name;

        component.destroyed = true;
        if (this.prototype) {
            delete this.prototype[name];
        }
        this.components = this.components.filter(x => x.name !== name);

        return this;
    }

    /**
     * Know if the component has component attached by his name
     * @param {string} componentName: Name of the component
     * @returns {boolean} result of the check
     */
    has (componentName) {
        return Boolean(this[componentName]);
    }

    /**
     * Check if a prop has changed
     * @param {string} prop: name of the property
     * @param {function=} next: next function called if prop has changed
     * @returns {*|boolean} the result
     */
    hasChanged (prop, next) {
        const response = this.previousProps[prop] && this.previousProps[prop] !== this[prop];

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
    setProps (nextProps = {}) {
        const clonedProps = Object.assign({}, nextProps);

        for (const key in clonedProps) {
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
    observeProp (prop, setFunction) {
        this._cachedProps[prop] = this[prop];

        delete this[prop];
        if (this.prototype) {
            delete this.prototype[prop];
        }

        Object.defineProperty(this, prop, {
            get () {
                return this._cachedProps[prop];
            },

            set (nextValue) {
                if (setFunction) {
                    setFunction(this._cachedProps[prop], nextValue);
                }

                this.previousProps[prop]    = this._cachedProps[prop];
                this._cachedProps[prop]     = nextValue;
            },

            configurable: true
        });
    }

    /* GETTERS & SETTERS */

    /**
     * Name identifier
     * @returns {string} the name
     */
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
