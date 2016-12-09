import Component from "./index";


export default class Keyboard extends Component {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {*} props: properties
     */
    constructor (props) {
        super(props);

        /**
         * Public input attributes
         * @type {{}}
         */
        this.input = {};

        /**
         * Private input attributes, do not use it
         * @type {{}}
         * @private
         */
        this._input = {};
    }

    /**
     * @override
     */
    initialize (parent) {
        super.initialize(parent);

        window.addEventListener("keydown", this.onKeydown.bind(this));
        window.addEventListener("keyup", this.onKeyup.bind(this));
    }

    /**
     * @override
     */
    update () {
        super.update();

        for (const key in this._input) {
            if (!this._input.hasOwnProperty(key)) {
                continue;
            }

            const input = this.input[key],
                _input = this._input[key];

            // Pressed
            if (_input === this.STATE.PRESSED) {
                if (input === _input) {
                    this.input[key] = this.STATE.HOLD;

                } else if (input !== this.STATE.HOLD) {
                    this.input[key] = this.STATE.PRESSED;
                }

            // Released
            } else if (_input === this.STATE.RELEASED) {
                if (!input) {
                    this.input[key] = this.STATE.PRESSED;

                } else if (input === _input) {
                    delete this.input[key];
                    delete this._input[key];

                } else {
                    this.input[key] = this.STATE.RELEASED;
                }

            }
        }
    }

    /* METHODS */

    /**
     * event on keydown
     * @event keydown
     * @param {*} e: event
     * @returns {void}
     */
    onKeydown (e) {
        this._input[e.keyCode] = this.STATE.PRESSED;
    }

    /**
     * event on keyup
     * @event keyup
     * @param {*} e: event
     * @returns {void}
     */
    onKeyup (e) {
        this._input[e.keyCode] = this.STATE.RELEASED;
    }

    /**
     * Get current state of a key
     * @param {string} key: keyboard key
     * @param {string} state: state of input
     * @param {*} optionalState: other state
     * @returns {boolean} the state is corresponding to state param
     */
    getKeyState (key, state, optionalState = null) {
        const input = this.input[typeof key === "string" ? this.KEY[key] : key];

        if (input && optionalState) {
            return input === this.STATE[state] || input === this.STATE[optionalState];
        }

        return input ? input === this.STATE[state] : false;
    }

    /**
     * Know if a key is pressed
     * @param {string} key: keyboard key
     * @returns {boolean} the key is pressed
     */
    isPressed (key) {
        return this.getKeyState(key, "PRESSED");
    }

    /**
     * Know if a key is held
     * @param {string} key: keyboard key
     * @returns {boolean} the key is held
     */
    isHeld (key) {
        return this.getKeyState(key, "PRESSED", "HOLD");
    }

    /**
     * Know if a key is released
     * @param {string} key: keyboard key
     * @returns {boolean} the key is released
     */
    isReleased (key) {
        return this.getKeyState(key, "RELEASED");
    }

    /* GETTERS & SETTERS */

    get name () {
        return "keyboard";
    }

    /**
     * List of all key usable
     * @type {*}
     */
    get KEY () {
        return {
            "BACKSPACE": 8,
            "TAB": 9,
            "ENTER": 13,
            "PAUSE": 19,
            "CAPS": 20,
            "ESC": 27,
            "SPACE": 32,
            "PAGE_UP": 33,
            "PAGE_DOWN": 34,
            "END": 35,
            "HOME": 36,
            "ARROW_LEFT": 37,
            "ARROW_UP": 38,
            "ARROW_RIGHT": 39,
            "ARROW_DOWN": 40,
            "INSERT": 45,
            "DELETE": 46,
            "NUM_0": 48,
            "NUM_1": 49,
            "NUM_2": 50,
            "NUM_3": 51,
            "NUM_4": 52,
            "NUM_5": 53,
            "NUM_6": 54,
            "NUM_7": 55,
            "NUM_8": 56,
            "NUM_9": 57,
            "A": 65,
            "B": 66,
            "C": 67,
            "D": 68,
            "E": 69,
            "F": 70,
            "G": 71,
            "H": 72,
            "I": 73,
            "J": 74,
            "K": 75,
            "L": 76,
            "M": 77,
            "N": 78,
            "O": 79,
            "P": 80,
            "Q": 81,
            "R": 82,
            "S": 83,
            "T": 84,
            "U": 85,
            "V": 86,
            "W": 87,
            "X": 88,
            "Y": 89,
            "Z": 90,
            "NUMPAD_0": 96,
            "NUMPAD_1": 97,
            "NUMPAD_2": 98,
            "NUMPAD_3": 99,
            "NUMPAD_4": 100,
            "NUMPAD_5": 101,
            "NUMPAD_6": 102,
            "NUMPAD_7": 103,
            "NUMPAD_8": 104,
            "NUMPAD_9": 105,
            "MULTIPLY": 106,
            "ADD": 107,
            "SUBSTRACT": 109,
            "DECIMAL": 110,
            "DIVIDE": 111,
            "F1": 112,
            "F2": 113,
            "F3": 114,
            "F4": 115,
            "F5": 116,
            "F6": 117,
            "F7": 118,
            "F8": 119,
            "F9": 120,
            "F10": 121,
            "F11": 122,
            "F12": 123,
            "SHIFT": 16,
            "CTRL": 17,
            "ALT": 18,
            "PLUS": 187,
            "COMMA": 188,
            "MINUS": 189,
            "PERIOD": 190
        };
    }

    /**
     * List of key state
     * @type {{}}
     */
    get STATE () {
        return {
            PRESSED: "pressed",
            RELEASED: "released",
            HOLD: "hold"
        };
    }
}
