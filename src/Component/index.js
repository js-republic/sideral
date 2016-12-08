import Class from "./../Class";


export default class Component extends Class {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {{}} options: options
     */
    constructor (options = {}) {
        super({ props: options });

        /**
         * Name of the component
         * @readonly
         * @type {string}
         */
        this.name = "component";

        /**
         * Element which using this component
         * @type {Element}
         */
        this.composedBy = null;
    }

    /**
     * Initialization of the component after it is composed
     * @returns {void}
     */
    initialize () {
        if (!this.composedBy) {
            throw new Error("Component.initialize : A Component must be composed by an element before calling Initiliaze.");
        }
    }
}
