import { SideralObject } from "./../SideralObject";
import { SignalEvent } from "./SignalEvent";
import { Enum } from "./Enum";

import { IKeyboardSignals } from "./../Interface";


/**
 * Keyboard event utils
 */
export class Keyboard extends SideralObject {

    /* ATTRIBUTES */

    /**
     * Signals emitted by the Keyboard
     * @readonly
     */
    signals: IKeyboardSignals;

    /**
     * list of all inputs key released or pressed relative to the game looping
     * @readonly
     */
    inputs: any = {};

    /**
     * List of all inputs key released or pressed
     * @private
     */
    _inputs: any = {};

    /**
     * If true, the key event willnot be propaged
     */
    preventInputPropagation: boolean = true;


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.signals.keyChange  = new SignalEvent();
        this.signals.keyPress   = new SignalEvent();
        this.signals.keyRelease = new SignalEvent();

        this.signals.update.add(this._updateInputs.bind(this));
    }

    /**
     * @initialize
     */
    initialize (props) {
        super.initialize(props);

        window.addEventListener("keydown", this._onKeydown.bind(this));
        window.addEventListener("keyup", this._onKeyup.bind(this));
    }

    /**
     * @override
     */
    kill () {
        super.kill();

        window.removeEventListener("keydown", this._onKeydown.bind(this));
        window.removeEventListener("keyup", this._onKeydown.bind(this));
    }


    /* EVENTS */

    /**
     * Update all device inputs
     * @private
     * @returns {void}
     */
    _updateInputs () {
        for (const key in this._inputs) {
            if (!this._inputs.hasOwnProperty(key)) {
                continue;
            }

            const input = this.inputs[key],
                _input = this._inputs[key];

            // Pressed
            if (_input === Enum.KEY_STATE.PRESSED) {
                if (input === _input) {
                    this.inputs[key] = Enum.KEY_STATE.HOLD;

                } else if (input !== Enum.KEY_STATE.HOLD) {
                    this.inputs[key] = Enum.KEY_STATE.PRESSED;
                    this.signals.keyChange.dispatch(key, true);
                    this.signals.keyPress.dispatch(key);
                }

                // Released
            } else if (_input === Enum.KEY_STATE.RELEASED) {
                if (!input) {
                    this.inputs[key] = Enum.KEY_STATE.PRESSED;

                } else if (input === _input) {
                    delete this.inputs[key];
                    delete this._inputs[key];

                } else {
                    this.inputs[key] = Enum.KEY_STATE.RELEASED;
                    this.signals.keyChange.dispatch(key, false);
                    this.signals.keyRelease.dispatch(key);
                }
            }
        }
    }

    /**
     * event on keydown
     * @event keydown
     * @param {*} e - event
     * @returns {Boolean} Input propagation
     */
    _onKeydown (e) {
        if (this.preventInputPropagation) {
            e.preventDefault();
            e.stopPropagation();
        }

        this._inputs[e.keyCode] = Enum.KEY_STATE.PRESSED;

        return !this.preventInputPropagation;
    }

    /**
     * event on keyup
     * @event keyup
     * @param {*} e - event
     * @returns {Boolean} Input propagation
     */
    _onKeyup (e) {
        if (this.preventInputPropagation) {
            e.preventDefault();
            e.stopPropagation();
        }

        this._inputs[e.keyCode] = Enum.KEY_STATE.RELEASED;

        return !this.preventInputPropagation;
    }
}
