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
         * @readonly
         * @type {Array<{props: *, previousValues: {}, methods: Array<function>}>}
         */
        this.propagations       = [];

        /**
         * Current propagation to be created by chaining "when" and "change"
         * @type {*}
         */
        this.currentPropagation = null;

        /**
         * Get last value by reactivity
         * @readonly
         * @type {{}}
         */
        this.last               = {};

        // private

        /**
         * Last value of a props stocked temporarly
         * @type {{}}
         * @private
         */
        this._lastTempProps     = {};

        /**
         * Check if reactivity flux is updated
         * @type {boolean}
         * @private
         */
        this._updated           = false;
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
                propagation.method(previousValues);
            }
        });

        lastProps.forEach(prop => this.last[prop] = this._lastTempProps[prop]);
        this._updated = true;
    }

    /**
     * @nextCycle
     * @override
     */
    nextCycle () {
        if (!this._updated) {
            this.afterUpdate();
        }

        for (const i in this.last) {
            if (this.last.hasOwnProperty(i)) {
                this.last[i] = this.parent[i];
            }
        }

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

        this.currentPropagation = {
            props   : names,
            method  : null
        };

        return this;
    }

    /**
     * Add a propagation after the 'when' operator
     * @param {function} method: method to be called when the property value has changed
     * @returns {Reactivity} the current reactivity flux
     */
    change (method) {
        if (this.currentPropagation) {
            this.currentPropagation.method = method.bind(this.parent);
            this.propagations.push(this.currentPropagation);
        }

        return this;
    }

    /**
     * Sort current propagation before propagation containing names
     * @param {string} names: prop names
     * @returns {Reactivity} the current reactivity flux
     */
    before (...names) {
        if (this.currentPropagation) {
            const nextIndex = this.propagations.findIndex(propagation => Boolean(propagation.props.filter(prop => names.find(name => name === prop)))),
                oldIndex    = this.propagations.findIndex(propagation => propagation.method === this.currentPropagation.method);

            this.propagations.splice(nextIndex, 0, this.propagations.splice(oldIndex, 1)[0]);
        }

        return this;
    }

    /**
     * Sort current propagation after propagation containing names
     * @param {string} names: prop names
     * @returns {Reactivity} the current reactivity flux
     */
    after (...names) {
        if (this.currentPropagation) {
            if (this.currentPropagation) {
                this.propagations.splice(this.propagations.findIndex(propagation => propagation.method === this.currentPropagation.method), 1);
                this.propagations.splice(this.propagations.reverse().findIndex(propagation => Boolean(propagation.props.filter(prop => names.find(name => name === prop)))), 0, this.currentPropagation);
            }

            return this;
        }
    }

    /**
     * Remove reactivity with attributes names
     * @param {string} names: attributes names
     * @returns {Reactivity} the current reactivity flux
     */
    unbind (...names) {
        this.propagations = this.propagations.
            filter(propagation => names.
                map(name => propagation.props.find(prop => prop === name)).length === propagation.props.length);

        return this;
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
                    this.reactivity._lastTempProps[name]    = this.reactivity.props[name];
                    this.reactivity.last[name]              = this.reactivity.props[name];
                }

                this.reactivity.props[name] = nextValue;

                /*
                if (this.reactivity._immediatePropagation) {
                    this.reactivity.propagations.filter(propagation => propagation.props.find(prop => prop === name)).
                        forEach(propagation => propagation.method())
                } */
            }
        });
    }

    /**
     * Get previous values object for names prop that has been changed
     * @private
     * @param {string} names: prop names
     * @returns {{}} the previous values object
     */
    _getPreviousValues (...names) {
        const lastProps     = Object.keys(this._lastTempProps),
            previousValues  = {};

        names.filter(name => lastProps.find(prop => prop === name)).
            forEach(name => previousValues[name] = this._lastTempProps[name]);

        return previousValues;
    }
}
