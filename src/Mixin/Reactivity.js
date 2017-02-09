import Mixin from "./../Mixin";


export default class Reactivity extends Mixin {

    /* LIFECYCLE */

    /**
     * Create a new reactivity flux within the container object
     * @constructor
     */
    constructor () {
        super();

        /**
         * Name of the mixin
         * @type {string}
         */
        this.name               = "reactivity";

        /**
         * All props observed
         * @type {{}}
         */
        this.props              = {};

        /**
         * All propagations object
         * @type {Array<{props: *, previousValues: {}, methods: Array<function>}>}
         */
        this.propagations       = [];

        /**
         * Current propagation to be created by chaining "when" and "change"
         * @type {*}
         */
        this.currentPropagation = null;

        /**
         * Current props to be added to the current propagation
         * @type {Array<*>}
         */
        this.currentProps       = [];

        /**
         * Get last value by reactivity
         * @type {{}}
         */
        this.last = {};

        /**
         * Last value of a props stocked temporarly
         * @type {{}}
         * @private
         */
        this._lastTempProps = {};
    }

    /**
     * @initialize
     * @override
     */
    initialize (props) {
        super.initialize(props);

        Object.defineProperty(this.parent, "last", {
            value       : this.last,
            writable    : false,
            enumerable  : true
        });
    }

    /**
     * @update
     * @override
     */
    update () { }

    /**
     * Unstack all changement to propagate them
     * @afterUpdate
     * @override
     */
    afterUpdate () {
        const lastProps = Object.keys(this._lastTempProps);

        this.propagations.forEach(propagation => {
            const propsChanged = propagation.props.filter(prop => Boolean(lastProps.find(x => x === prop)));

            if (propsChanged.length) {
                const previousValues = {};

                propsChanged.forEach(prop => previousValues[prop] = this._lastTempProps[prop]);
                propagation.methods.forEach(method => method(previousValues));
            }
        });

        lastProps.forEach(prop => this.last[prop] = this._lastTempProps[prop]);
    }

    /**
     * @nextCycle
     * @override
     */
    nextCycle () {
        this._lastTempProps = {};
    }

    /* METHODS */

    /**
     * Observe the property and set changement into the "last" attribute of the container
     * @param {string} names: names of the container prop that must be observed
     * @returns {Reactivity} the current reactivity flux
     */
    observe (...names) {
        names.forEach(name => this._createReactiveProp(name));

        return this;
    }

    /**
     * Add a new reactivity with the property name change its value
     * @param {string} names: name of the container prop that must be followed to be reactive
     * @returns {Reactivity} the current reactivity flux
     */
    when (...names) {
        this.observe(...names);

        this.currentProps       = names;
        this.currentPropagation = null;

        return this;
    }

    /**
     * Add a propagation after the 'when' operator
     * @param {function} method: method to be called when the property value has changed
     * @returns {Reactivity} the current reactivity flux
     */
    change (method) {
        this.currentPropagation = {
            props           : this.currentProps,
            methods         : [method.bind(this.parent)]
        };

        this.propagations.push(this.currentPropagation);

        return this;
    }

    /**
     * Add an other method of the propagation after the 'when' and 'change' operator
     * @param {function} method: method to be called when the property value has changed
     * @returns {Reactivity} the current reactivity flux
     */
    then (method) {
        this.currentPropagation.methods.push(method.bind(this.parent));

        return this;
    }

    /**
     * Remove reactivity with attributes names
     * @param {string} names: attributes names
     * @returns {Reactivity} the current reactivity flux
     */
    unbind (...names) {
        this.propagations = this.propagations.filter((propagation) => {
            return names.forEach((name) => {
                if (propagation.props.find(prop => prop === name)) {
                    return true;
                }
            });
        });

        return this;
    }

    unbindHasChanged (...names) {
        // TODO
    }

    /**
     * Know if prop names has changed during the cycle
     * @param {string} names: attributes names
     * @returns {boolean} At least one parameter has changed
     */
    hasChanged (...names) {
        return Boolean(names.map(name => Boolean(this._lastTempProps[name])).length);
    }

    /**
     * Set a new property to a reactive property
     * @private
     * @param {string} name: name of the container property
     * @returns {void|null} -
     */
    _createReactiveProp (name) {
        if (typeof this.props[name] !== "undefined") {
            return null;
        }

        this.last[name] = this.props[name] = this.parent[name];
        delete this.parent[name];

        Object.defineProperty(this.parent, name, {
            get () {
                return this.reactivity.props[name];
            },

            set (nextValue) {
                if (!this.reactivity._lastTempProps[name]) {
                    this.reactivity._lastTempProps[name] = this.reactivity.props[name];
                }

                this.reactivity.last[name]  = this.reactivity.props[name];
                this.reactivity.props[name] = nextValue;
            }
        });
    }
}
