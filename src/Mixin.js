import Reactivity from "./Reactivity";

export default class Mixin {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {

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
         * Define a flux of reactivity between attributes
         * @readonly
         * @type {Reactivity}
         */
        this.reactivity = new Reactivity(this);

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

        /**
         * Get last value by reactivity
         * @readonly
         * @type {{}}
         */
        this.last = {};
    }

    /**
     * Instance all your reactive props here
     * @returns {void}
     */
    setReactivity () {

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
        this.setReactivity();
        this.set(props)
    }

    /**
     * @update
     * @returns {void}
     */
    update () {
        this.mixins.forEach(mixin => this[mixin].update());
    }

    /**
     * @kill
     * @returns {void}
     */
    kill() {
        this.destroyed  = true;
        this.parent     = null;
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
     * @param {{}=} injectProps: props to inject after parent created
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

        this[name] = mixin;
        this.mixins.push(name);

        mixin.initialize(injectProps);

        if (next) {
            next(mixin);
        }

        return this;
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
     * Event when a new mixin is added
     * @param mixin
     */
    willReceiveMixin (mixin) { }

    /**
     * Event when mixin is removed
     * @param mixin
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
