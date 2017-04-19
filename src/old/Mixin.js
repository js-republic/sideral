export default class Mixin {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        // readonly

        /**
         * Unique Id for the Comonent
         * @readonly
         * @type {string}
         */
        this.id = Mixin.generateId();

        /**
         * Name of the mixin
         * @readonly
         * @type {string}
         */
        this.name = "mixin";

        /**
         * Owner of the current instance
         * @readonly
         * @type {Component}
         */
        this.parent = null;

        /**
         * Array of mixins name
         * @readonly
         * @type {Array<String>}
         */
        this.mixins = [];

        /**
         * Check if this component must be collected by garbage
         * @readonly
         * @type {boolean}
         */
        this.destroyed = false;

        // private

        /**
         * List of all intercepted functions
         * @type {{}}
         * @private
         */
        this._interceptedFunctions = {};
    }

    /**
     * Check if the parent can use this class
     * @param {Mixin} parent: The parent
     * @returns {boolean} authorized or not
     */
    canBeUsed (parent) {
        return Boolean(parent);
    }

    /**
     * @initialize
     * @param {*=} props: props to be merged
     * @returns {void}
     */
    initialize (props = {}) {
        this.set(props);
    }

    /**
     * @update
     * @returns {void}
     */
    update () {
        this.mixins.forEach(mixin => this[mixin].update());
    }

    /**
     * Call just after update function
     * @returns {void}
     */
    afterUpdate () {
        this.mixins.forEach(mixin => this[mixin].afterUpdate());
    }

    /**
     * Call before the new loop cycle
     * @returns {void}
     */
    nextCycle () {
        this.mixins.forEach(mixin => this[mixin].nextCycle());
    }

    /**
     * @kill
     * @returns {void}
     */
    kill () {
        Object.keys(this._interceptedFunctions).forEach(functionName => this.parent[functionName] = this._interceptedFunctions[functionName].bind(this.parent));

        this._interceptedFunctions  = {};
        this.destroyed              = true;
        this.parent                 = null;
    }

    /* METHODS */

    /**
     * Set/Add new properties to component
     * @param {Object} nextProps: next properties to merge
     * @returns {Mixin} the current component
     */
    set (nextProps = {}) {
        const props = Object.assign({}, nextProps);

        for (const key in props) {
            if (props.hasOwnProperty(key)) {
                this[key] = props[key];
            }
        }

        return this;
    }

    /**
     * Add a new feature with the mixin passed by parameter
     * @param {Mixin} mixin: feature to add to the component
     * @param {*=} injectProps: props to inject after parent created
     * @param {*=} next: function callback after mixed
     * @returns {Mixin} the current Mixin instance
     */
    mix (mixin, injectProps = {}, next) {
        if (!(mixin instanceof Mixin)) {
            throw new Error("Component.mix", "Mixin must be an instance of Mixin.");
        }

        if (!mixin.canBeUsed(this)) {
            return this;
        }

        this.willReceiveMixin(mixin);

        const name = mixin.name;

        if (this.prototype) {
            delete this.prototype[name];
        }

        this[name]      = mixin;
        mixin.parent    = this;
        this.mixins.push(name);

        mixin.initialize(injectProps);

        if (next) {
            next(mixin);
        }

        return this;
    }

    /**
     * Check if a mixin exist
     * @param {string} name: name of the mixin
     * @returns {boolean} if the mixin exist
     */
    has (name) {
        return Boolean(this.mixins.find(mixin => mixin === name));
    }

    /**
     * Unmix a mixin
     * @param {Mixin} mixin: mixin to remove
     * @param {*=} next: function callback
     * @returns {Mixin} current mixin
     */
    unmix (mixin, next) {
        if (!(mixin instanceof Mixin)) {
            throw new Error("Component.mix", "Mixin must be an instance of Mixin.");
        }

        this.willLoseMixin(mixin);

        this.mixins = this.mixins.filter(x => x.id === mixin.id);

        if (this.prototype) {
            delete this.prototype[mixin.name];
        }

        mixin.kill();

        if (next) {
            next(mixin);
        }

        return this;
    }

    /**
     * Intercept a parent function to change it with the next function passed in the second parameter
     * @param {string} functionName: the name of the function to be intercepted
     * @param {function} nextFunction: the substitute function
     * @returns {void}
     */
    interceptFunction (functionName, nextFunction) {
        if (this.parent && this.parent[functionName]) {
            this._interceptedFunctions[functionName]    = this.parent[functionName];
            this.parent[functionName]                   = nextFunction.bind(this);
        }
    }

    /**
     * Event when a new mixin is added
     * @param {Mixin} mixin: mixin to be changed
     * @returns {void}
     */
    willReceiveMixin (mixin) { }

    /**
     * Event when mixin is removed
     * @param {Mixin} mixin: mixin to be changed
     * @returns {void}
     */
    willLoseMixin (mixin) { }

    /* STATICS */

    /**
     * Generate an unique id
     * @returns {string} return the unique id
     */
    static generateId () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
}
