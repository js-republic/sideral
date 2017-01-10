export default class Component {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {{}=} props: properties to merge
     */
    constructor (props) {

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
         * All reactive props that has been evolued
         * @readonly
         * @type {{}}
         */
        this.previousProps  = {};

        /**
         * Reactive props
         * @readonly
         * @type {{}}
         */
        this.props          = {};

        // Merge props
        this.set(props);
    }

    /**
     * Called by the parent
     * @param {Component} parent: the parent
     * @returns {void}
     */
    initialize (parent) {
        this.parent = parent;
    }

    /**
     * Update lifecycle
     * @returns {void}
     */
    update () {

    }

    /**
     * Render lifecycle
     * @returns {void}
     */
    render () { }

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
     * @param {*=} next: function callback
     * @returns {Component} current Component
     */
    compose (component, next) {
        if (!component || !(component instanceof Component)) {
            throw new Error("Component.compose : parameter 1 must be an instance of 'Component'.");
        }

        const name = component.name;

        this.children.push(component);
        component.initialize(this);

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

    /**
     * Set a property as a reactive property
     * @param {string} prop: property name
     * @param {function=} callback: function fire when property is changed
     * @returns {void}
     */
    reactiveProp (prop, callback) {
        this.props[prop] = this[prop];

        delete this[prop];

        if (this.prototype) {
            delete this.prototype[prop];
        }

        Object.defineProperty(this, prop, {
            get () {
                return this.props[prop];
            },

            set (nextValue) {
                this.previousProps[prop]    = this.props[prop];
                this.props[prop]            = nextValue;

                if (callback) {
                    callback(this.previousProps[prop], this.props[prop]);
                }
            },

            configurable: true
        });
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
