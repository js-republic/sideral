import Signal from "./../Module/Signal";


export default class AbstractClass {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {

        /**
         * Properties of the class
         * @type {{}}
         */
        this.props      = {};

        /**
         * Last value of properties of the class
         * @type {{}}
         */
        this.last       = {};

        /**
         * Slots for signals
         * @type {Array<Signal>}
         */
        this.signals    = [];

        /**
         * Children of AbstractClass
         * @type {Array<AbstractClass>}
         */
        this.children   = [];

        /**
         * PIXI Container
         * @type {*}
         */
        this.container  = new PIXI.Container();

        /**
         * List of all signals of the class
         * @type {{}}
         */
        this.SIGNAL     = {
            VALUE_CHANGE: properties => new Signal("VALUE_CHANGE", properties)
        };
    }

    /**
     * Kill event
     * @lifecycle
     * @returns {void}
     */
    kill () {
        this.children.forEach(child => child.kill());

        if (this.container) {
            this.container.destroy();
        }
    }

    /**
     * Update called every loop
     * @lifecycle
     * @returns {void}
     */
    update () {
        this.children.forEach(child => child.update());
    }

    /**
     * Called before a new game loop
     * @lifecycle
     * @returns {void}
     */
    nextCycle () {
        this.children.forEach(child => child.nextCycle());

        Object.keys(this.props).forEach(key => {
            if (this.props[key] !== this.last[key]) {
                this.trigger(this.SIGNAL.VALUE_CHANGE(key), this.props[key]);
            }

            this.last[key] = this.props[key];
        });
    }


    /* METHODS */

    /**
     * Set new properties to the object
     * @param {{}} props: properties to merge
     * @returns {*} current instance
     */
    setProps (props) {
        Object.keys(props).forEach(key => this.last[key] = this.props[key] = props[key]);

        return this;
    }

    /**
     * Bind a signal to an action
     * @param {Signal} signal: Signal to bind
     * @param {function} action: action to bind into the Signal
     * @returns {*} Current object
     */
    bind (signal, action) {
        let currentSignal = this.findSignal(signal.name, signal.properties);

        if (!currentSignal) {
            currentSignal = signal;
            this.signals.push(currentSignal);
        }

        currentSignal.actions.push(action);

        return this;
    }

    /**
     * Find a signal of signal by the name of a signal and properties
     * @param {string} signalName: name of the signal
     * @param {Array<*>} properties: array of properties
     * @returns {Signal} the signal
     */
    findSignal (signalName, properties) {
        return this.signals.find(signal => signal.name === signalName && signal.hasProperties(properties));
    }

    /**
     * Trigger a signal
     * @param {Signal} signalReference: signal to trigger
     * @param {*} value: value of the changement
     * @returns {void}
     */
    trigger (signalReference, value) {
        const signal = this.findSignal(signalReference.name, signalReference.properties);

        if (signal) {
            signal.trigger(value);
        }
    }
}
