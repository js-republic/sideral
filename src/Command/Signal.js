import Signals from "signals";

export default class Signal extends Signals {

    /**
     * @constructor
     */
    constructor () {
        super();

        this.keysBound = [];
    }

    /**
     * Bind a listener when signal dispatch a key
     * @param {string|Array<string>} key: key to bind the listener
     * @param {Function} listener: Signal handler function
     * @returns {*} An Object representing the binding between the Signal and listener
     */
    bind (key, listener) {
        const keys = [].concat(key);

        this.keysBound.push(keys);

        return this.add(function addListener (listenerKey) {
            if (keys.find(currentKey => currentKey === listenerKey)) {
                listener(...[].slice.call(arguments, 1));
            }
        });
    }

    /**
     * Dispatch all listener (even with listener linked to a key)
     * @returns {void}
     */
    dispatchAll () {
        this.dispatch();

        this.keysBound.forEach(keys => this.dispatch(keys[0]));
    }
}
