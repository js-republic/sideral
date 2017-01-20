import Reactivity from "./Reactivity";

export default class Mixin {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {

        /**
         * Unique Id for the Comonent
         * @type {string}
         */
        this.id = Mixin.generateId();

        /**
         * Owner of the current instance
         * @type {Component}
         */
        this.parent = null;

        /**
         * Define a flux of reactivity between attributes
         * @type {Reactivity}
         */
        this.reactivity = new Reactivity(this);

        /**
         * Check if this component must be collected by garbage
         * @type {boolean}
         */
        this.destroyed = false;

        // Add all reactivity logic here
        this.setReactivity();
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
     * @update
     * @returns {void}
     */
    initialize () {

    }

    /**
     * @update
     * @returns {void}
     */
    update () {

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
     * @returns {Mixin} the current Mixin instance
     */
    mix (mixin, injectProps = {}) {
        if (!(mixin instanceof Mixin)) {
            throw new Error("Component.mix", "Mixin must be an instance of Mixin.");
        }

        if (!mixin.canBeUsed(this)) {
            return this;
        }

        this[mixin.name] = mixin;

        mixin.set(injectProps);
        mixin.initialize();

        return this;
    }

    /* GETTERS & SETTERS */

    get name () {
        return "mixin";
    }

    /* STATICS */

    /**
     * Generate an unique id
     * @returns {string} return the unique id
     */
    static generateId () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
}
