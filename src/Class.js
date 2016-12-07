export default class Class {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {{ name: string, components: [], props: {} }} options: options for the element
     */
    constructor (options = {}) {

        /**
         * Unique id of element
         * @type {string}
         */
        this.id = Class.generateId();

        /**
         * Name of the class to be recognized
         * @type {string}
         */
        this.name = "class";

        /**
         * Props before update
         * @type {{}} properties
         */
        this.previousProps = Object.assign({}, options.props);

        // Add default props
        this.props(this.previousProps);
    }

    /**
     * Initialization of the element after it is created into the engine
     * @initialize
     * @returns {void}
     */
    initialize () { }

    /**
     * Update lifecycle
     * @update
     * @returns {void}
     */
    update () {
        const changedProps = {};

        for (const key in this.previousProps) {
            if (this.previousProps.hasOwnProperty(key) && this[key] !== this[key]) {
                changedProps[key] = this[key];
                this.requestRender = true;
            }
        }

        if (this.requestRender) {
            this.onPropsChanged(changedProps);
        }
    }

    /*eslint-disable*/
    /**
     * called when props has changed
     * @param {*} changedProps: changed properties
     * @return {void}
     */
    onPropsChanged (changedProps) { }
    /*eslint-enable*/

    /* METHODS */

    /**
     * Set attributes to current instance
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
