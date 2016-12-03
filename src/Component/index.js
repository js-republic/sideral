import Class from "./../Class";


export default class Component extends Class {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        /**
         * Element which using this component
         * @type {Element}
         */
        this.composedBy = null;

        /**
         * List of all functions plugged to the parent
         * @type {Array}
         */
        this.pluggedFunctions = [];
    }

    /**
     * Initialization of the component after it is composed
     * @returns {void}
     */
    initialize () {
        if (!this.composedBy) {
            throw new Error("Component.initialize : A Component must be composed by an element before calling Initiliaze.");
        }

        const functions = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(prop => prop !== "constructor" && prop !== "initialize");

        this.pluggedFunctions = [];

        functions.map((key) => {
            if (this.composedBy[key]) {
                this.composedBy.addComponentFunction(this.name, key);
                this.pluggedFunctions.push(key);
            }

            return null;
        });
    }


    /* METHODS */

    /* GETTERS & SETTERS */

    /**
     * Name of the component
     * @returns {string} the name
     */
    get name () {
        return "component";
    }
}
