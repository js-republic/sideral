export default class Element {

    /* LIFECYCLE */
    constructor () {
        /**
         * Unique id of element
         * @type {string}
         */
        this.id = Element.generateId();

        /**
         * Parent element
         * @type {Element}
         */
        this.parent = null;

        /**
         * Elements children
         * @type {Array<Element>}
         */
        this.children = [];

        /**
         * Know if this component is detroyed or not
         * @type {boolean}
         * @private
         */
        this.destroyed = false;
    }

    /**
     * Initialization of the element after it is created into the engine
     * @returns {void}
     */
    initialize () { }


    /* METHODS */

    /**
     * Generate an unique id
     * @returns {string} return the unique id
     */
    static generateId () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).
            substring(1);
    }
}
