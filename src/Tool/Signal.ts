import * as signals from "signals";

type EventFunction = (listener: Function, listenerContext?: any, priority?: number) => void;

export class Signal extends signals.Signal {
    keysBound = [];

    /**
     * @constructor
     * @param {function=} onBindEvent - Event fired when there is a new bind into this signal
     * @param {function=} onRemoveEvent - Event fired when there is a remove into this signal
     */
    constructor (private onBindEvent?: EventFunction, private onRemoveEvent?: EventFunction) {
        super();
    }

    /**
     * @override
     */
    add (listener: Function, listenerContext?: any, priority?: number): signals.SignalBinding {
        const signalBinding: signals.SignalBinding = super.add(listener, listenerContext, priority);

        if (this.onBindEvent) {
            this.onBindEvent(listener, listenerContext, priority);
        }

        return signalBinding;
    }

    /**
     * @override
     */
    addOnce (listener: Function, listenerContext?: any, priority?: any): signals.SignalBinding {
        const signalBinding: signals.SignalBinding = super.addOnce(listener, listenerContext, priority);

        if (this.onBindEvent) {
            this.onBindEvent(listener, listenerContext, priority);
        }

        return signalBinding;
    }

    /**
     * @override
     */
    remove (listener: Function, context?: any) {
        super.remove(listener, context);

        if (this.onRemoveEvent) {
            this.onRemoveEvent(listener, context);
        }

        return listener;
    }

    /**
     * @override
     */
    removeAll () {
        if (this.onRemoveEvent) {
            this.onRemoveEvent(null);
        }

        super.removeAll();
    }

    /**
     * Bind a listener when signal dispatch a key
     * @param {string|Array<string>} key: key to bind the listener
     * @param {Function} listener: Signal handler function
     * @returns {*} An Object representing the binding between the Signal and listener
     */
    bind (key: string | string[], listener: Function) {
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

    get listenerLength () {
        return (<any>this)._bindings.length;
    }
}
