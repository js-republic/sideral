export default class Class {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {

        /**
         * Unique id of element
         * @type {string}
         */
        this.id = Class.generateId();
    }

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

    /**
     * Initialization of the element after it is created into the engine
     * @returns {void}
     */
    initialize () { }

    /* METHODS */

    /* GETTERS & SETTERS */

    /**
     * String identifier
     * @returns {string} the name of the class
     */
    get name () {
        return "Class";
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
