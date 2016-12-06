'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Keyboard = function (_Component) {
    _inherits(Keyboard, _Component);

    /* LIFECYCLE */

    function Keyboard() {
        _classCallCheck(this, Keyboard);

        /**
         * Public input attributes
         * @type {{}}
         */
        var _this = _possibleConstructorReturn(this, (Keyboard.__proto__ || Object.getPrototypeOf(Keyboard)).call(this));

        _this.input = {};

        /**
         * Private input attributes, do not use it
         * @type {{}}
         * @private
         */
        _this._input = {};
        return _this;
    }

    /**
     * @initialize
     * @returns {void}
     */


    _createClass(Keyboard, [{
        key: 'initialize',
        value: function initialize() {
            _get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), 'initialize', this).call(this);

            window.addEventListener('keydown', this.onKeydown.bind(this));
            window.addEventListener('keyup', this.onKeyup.bind(this));
        }

        /**
         * @update
         * @returns {void}
         */

    }, {
        key: 'update',
        value: function update() {
            for (var key in this._input) {
                var input = this.input[key],
                    _input = this._input[key];

                // Pressed
                if (_input == this.STATE.PRESSED) {
                    if (input == _input) {
                        this.input[key] = this.STATE.HOLD;
                    } else if (input != this.STATE.HOLD) {
                        this.input[key] = this.STATE.PRESSED;
                    }

                    // Released
                } else if (_input == this.STATE.RELEASED) {
                    if (!input) {
                        this.input[key] = this.STATE.PRESSED;
                    } else if (input == _input) {
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

    }, {
        key: 'onKeydown',
        value: function onKeydown(e) {
            this._input[e.keyCode] = this.STATE.PRESSED;
        }

        /**
         * event on keyup
         * @event keyup
         * @param {*} e: event
         * @returns {void}
         */

    }, {
        key: 'onKeyup',
        value: function onKeyup(e) {
            this._input[e.keyCode] = this.STATE.RELEASED;
        }

        /**
         * Get current state of a key
         * @param key
         * @param state
         * @param optionalState
         * @returns {boolean}
         */

    }, {
        key: 'getKeyState',
        value: function getKeyState(key, state) {
            var optionalState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            var input = this.input[typeof key === 'string' ? this.KEY[key] : key];

            if (input && optionalState) {
                return input === this.STATE[state] || input === this.STATE[optionalState];
            }

            return input ? input === this.STATE[state] : false;
        }

        /**
         * Know if a key is pressed
         * @param key
         * @returns {boolean}
         */

    }, {
        key: 'isPressed',
        value: function isPressed(key) {
            return this.getKeyState(key, 'PRESSED');
        }

        /**
         * Know if a key is held
         * @param key
         * @returns {boolean}
         */

    }, {
        key: 'isHeld',
        value: function isHeld(key) {
            return this.getKeyState(key, 'PRESSED', 'HOLD');
        }

        /**
         * Know if a key is released
         * @param key
         * @returns {boolean}
         */

    }, {
        key: 'isReleased',
        value: function isReleased(key) {
            return this.getKeyState(key, 'RELEASED');
        }

        /* GETTERS & SETTERS */

        /**
         * Get name of the component
         * @returns {string} the name of the component
         */

    }, {
        key: 'name',
        get: function get() {
            return "keyboard";
        }

        /**
         * List of all key usable
         * @type {*}
         */

    }, {
        key: 'KEY',
        get: function get() {
            return {
                'BACKSPACE': 8,
                'TAB': 9,
                'ENTER': 13,
                'PAUSE': 19,
                'CAPS': 20,
                'ESC': 27,
                'SPACE': 32,
                'PAGE_UP': 33,
                'PAGE_DOWN': 34,
                'END': 35,
                'HOME': 36,
                'ARROW_LEFT': 37,
                'ARROW_UP': 38,
                'ARROW_RIGHT': 39,
                'ARROW_DOWN': 40,
                'INSERT': 45,
                'DELETE': 46,
                'NUM_0': 48,
                'NUM_1': 49,
                'NUM_2': 50,
                'NUM_3': 51,
                'NUM_4': 52,
                'NUM_5': 53,
                'NUM_6': 54,
                'NUM_7': 55,
                'NUM_8': 56,
                'NUM_9': 57,
                'A': 65,
                'B': 66,
                'C': 67,
                'D': 68,
                'E': 69,
                'F': 70,
                'G': 71,
                'H': 72,
                'I': 73,
                'J': 74,
                'K': 75,
                'L': 76,
                'M': 77,
                'N': 78,
                'O': 79,
                'P': 80,
                'Q': 81,
                'R': 82,
                'S': 83,
                'T': 84,
                'U': 85,
                'V': 86,
                'W': 87,
                'X': 88,
                'Y': 89,
                'Z': 90,
                'NUMPAD_0': 96,
                'NUMPAD_1': 97,
                'NUMPAD_2': 98,
                'NUMPAD_3': 99,
                'NUMPAD_4': 100,
                'NUMPAD_5': 101,
                'NUMPAD_6': 102,
                'NUMPAD_7': 103,
                'NUMPAD_8': 104,
                'NUMPAD_9': 105,
                'MULTIPLY': 106,
                'ADD': 107,
                'SUBSTRACT': 109,
                'DECIMAL': 110,
                'DIVIDE': 111,
                'F1': 112,
                'F2': 113,
                'F3': 114,
                'F4': 115,
                'F5': 116,
                'F6': 117,
                'F7': 118,
                'F8': 119,
                'F9': 120,
                'F10': 121,
                'F11': 122,
                'F12': 123,
                'SHIFT': 16,
                'CTRL': 17,
                'ALT': 18,
                'PLUS': 187,
                'COMMA': 188,
                'MINUS': 189,
                'PERIOD': 190
            };
        }

        /**
         * List of key state
         * @type {{}}
         */

    }, {
        key: 'STATE',
        get: function get() {
            return {
                PRESSED: 'pressed',
                RELEASED: 'released',
                HOLD: 'hold'
            };
        }
    }]);

    return Keyboard;
}(_index2.default);

exports.default = Keyboard;