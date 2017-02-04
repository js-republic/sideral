export default class Reactivity {

    /**
     * Create a new reactivity flux within the container object
     * @constructor
     * @param {*} container: object that will containt the reactivity flux
     */
    constructor (container) {
        this.container          = container;
        this.props              = {};
        this.propagations       = [];
        this.currentPropagation = null;
        this.currentProps       = [];
    }

    /**
     * Add a new reactivity with the property name change its value
     * @param {string} names: name of the container prop that must be followed to be reactive
     * @returns {Reactivity} the current reactivity flux
     */
    when (...names) {
        names.forEach(name => this._createReactiveProp(name));

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
            previousValues  : {},
            methods         : [method.bind(this.container)]
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
        this.currentPropagation.methods.push(method.bind(this.container));

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

    /**
     * Call every methods that attributes has changed
     * @returns {void}
     */
    update () {
        this.propagations.forEach(propagation => {
            const keys = Object.keys(propagation.previousValues);

            if (keys.length) {
                propagation.methods.forEach(method => method(propagation.previousValues || {}));
            }

            propagation.previousValues = {};
        });
    }

    /**
     * Start the current flux with the current value of the property name passed into the 'when' operator
     * @returns {Reactivity} the current reactivity flux
     */
    start () {
        if (this.currentPropagation) {
            this.currentPropagation.methods.forEach(method => method());
        }

        return this;
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

        this.props[name] = this.container[name];

        delete this.container[name];

        Object.defineProperty(this.container, name, {
            get () {
                return this.reactivity.props[name];
            },

            set (nextValue) {
                const previousValue         = this.reactivity.props[name];

                if (nextValue === previousValue) {
                    return null;
                }

                this.reactivity.props[name] = nextValue;

                this.reactivity.propagations.
                    filter(propagation => Boolean(propagation.props.
                        find(prop => prop === name))).
                    forEach(propagation => propagation.previousValues[name] = previousValue);
            }
        });
    }
}
