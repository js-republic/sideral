import Element from "./Element";


export default class Component {

    /* LIFECYCLE */
    constructor () {

        /**
         * Id of the component
         * @type {string}
         */
        this.id = Element.generateId();

        /**
         * Name of the component
         * @type {string}
         */
        this.name = "component";

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

}
