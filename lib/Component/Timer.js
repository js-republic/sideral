"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Engine = require("../Engine");

var _Engine2 = _interopRequireDefault(_Engine);

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Timer = function (_Component) {
  _inherits(Timer, _Component);

  /* LIFECYCLE */
  /**
   * Timer constructor
   * @param {*} props: properties
   */
  function Timer(props) {
    _classCallCheck(this, Timer);

    /**
     * Duration of the timer
     * @type {number}
     */
    var _this = _possibleConstructorReturn(this, (Timer.__proto__ || Object.getPrototypeOf(Timer)).call(this, props));

    _this.duration = _this.duration || 0;

    /**
     * Number of time the timer must reset after complete
     * @type {number}
     */
    _this.recurrence = _this.recurrence || 0;

    /**
     * If reversible, the timer will go t o it's initial value after complete
     * @type {boolean}
     */
    _this.reversible = Boolean(_this.reversible);

    /**
     * Event fired when initialize
     * @type {function}
     */
    _this.eventInit = _this.eventInit || null;

    /**
     * Event fired when completed
     * @type {function}
     */
    _this.eventComplete = _this.eventComplete || null;

    /**
     * Tendance value (used with reversible)
     * @type {number}
     */
    _this.tendance = _this.duration < 0 ? 1 : -1;

    /**
     * Current value of the timer
     * @type {number}
     */
    _this.value = _this.duration;

    /**
     * If true, the timer will pause
     * @type {boolean}
     */
    _this.pause = false;

    /**
     * Setted to true if the timer is complete
     * @type {boolean}
     */
    _this.finished = false;
    return _this;
  }

  /**
   * Initialization
   * @returns {void}
   */


  _createClass(Timer, [{
    key: "initialize",
    value: function initialize() {
      _get(Timer.prototype.__proto__ || Object.getPrototypeOf(Timer.prototype), "initialize", this).call(this);

      if (this.eventInit) {
        this.eventInit();
      }
    }

    /**
     * @override
     */

  }, {
    key: "reset",
    value: function reset() {
      _get(Timer.prototype.__proto__ || Object.getPrototypeOf(Timer.prototype), "reset", this).call(this);

      this.value = this.duration;
      this.tendance = this.duration < 0 ? 1 : -1;
      this.pause = false;
      this.finished = false;
    }

    /**
     * Update
     * @returns {void|null} null
     */

  }, {
    key: "update",
    value: function update() {
      if (this.pause || this.finished) {
        return null;
      }

      this.value = this.value + this.tendance;
      var finished = !this.value || Math.abs(this.value) === Math.abs(this.duration);

      if (finished && this.recurrence) {
        this.recurrence--;

        if (this.reversible) {
          this.tendance = -this.tendance;
        } else {
          this.value = this.duration;
        }
      } else if (finished && !this.recurrence) {
        this.stop();
      }
    }

    /* METHODS */

    /**
     * Get value with ration (0 to 1)
     * @param {boolean=} reversed: reverse the ration (from 0 to 1 or from 1 to 0)
     * @returns {number} the value rationed
     */

  }, {
    key: "getValueRationed",
    value: function getValueRationed(reversed) {
      return reversed ? (this.duration - this.value) / this.duration : this.value / this.duration;
    }

    /**
     * Stop the timer
     * @param {boolean} avoidCompleteEvent: if true, the event complete won't be fired
     * @returns {void}
     */

  }, {
    key: "stop",
    value: function stop() {
      var avoidCompleteEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (this.eventComplete && !avoidCompleteEvent) {
        this.eventComplete();
      }

      this.finished = true;
    }

    /* GETTERS & SETTERS */

  }, {
    key: "name",
    get: function get() {
      return "timer";
    }

    /* STATIC */

    /**
     * convert a number of frame into ms (with latency)
     * @param {number} frame: number of frame to convert to ms
     * @returns {number} frame converted to ms
     */

  }], [{
    key: "toMs",
    value: function toMs(frame) {
      return frame / _Engine2.default.fps;
    }
  }]);

  return Timer;
}(_index2.default);

exports.default = Timer;