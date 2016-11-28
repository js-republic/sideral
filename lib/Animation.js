"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Entity2 = require("./Entity");

var _Entity3 = _interopRequireDefault(_Entity2);

var _Sprite = require("./components/Sprite");

var _Sprite2 = _interopRequireDefault(_Sprite);

var _Timer = require("./components/Timer");

var _Timer2 = _interopRequireDefault(_Timer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Animation = function (_Entity) {
  _inherits(Animation, _Entity);

  /* LIFECYCLE */

  /**
   * @constructor
   * @param {string} path: Path of the sprite
   * @param {number} frameWidth: framewidth of the sprite
   * @param {number} frameHeight: frameheight of the sprite
   * @param {number=} duration: duration of the animation
   * @param {Array<number>=} frames: frames of animation
   * @param {{}} options: Other options for the animation
   */
  function Animation(path, frameWidth, frameHeight) {
    var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var frames = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [0];
    var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

    _classCallCheck(this, Animation);

    /**
     * Duration of the animation
     * @type {number}
     */
    var _this = _possibleConstructorReturn(this, (Animation.__proto__ || Object.getPrototypeOf(Animation)).call(this));

    _this.duration = duration;

    /**
     * Other options of animation
     * @type {Entity}
     */
    _this.follow = options.follow;

    /**
     * Number of loop
     * @type {number}
     */
    _this.loop = typeof options.loop === "undefined" ? -1 : options.loop;

    /**
     * Path of the picture
     * @type {string}
     */
    _this.path = path;

    /**
     * Frames of the animation
     * @type {Array<number>}
     */
    _this.frames = frames;

    _this.width(frameWidth);
    _this.height(frameHeight);
    return _this;
  }

  /**
   * @initialize
   * @returns {void}
   */


  _createClass(Animation, [{
    key: "initialize",
    value: function initialize() {
      var _this2 = this;

      _get(Animation.prototype.__proto__ || Object.getPrototypeOf(Animation.prototype), "initialize", this).call(this);

      this.compose(new _Sprite2.default(this.path, this.width(), this.height())).sprite.addAnimation("idle", this.duration, this.frames);
      this.compose(new _Timer2.default(this.sprite.getAnimationDuration("idle", this.loop > 0 ? this.loop : 0), function () {
        return _this2.destroy();
      }));

      this.sprite.currentAnimation("idle");
    }

    /**
     * @update
     * @returns {void}
     */

  }, {
    key: "update",
    value: function update() {
      _get(Animation.prototype.__proto__ || Object.getPrototypeOf(Animation.prototype), "update", this).call(this);

      if (this.follow) {
        this.x(this.follow.x() + this.follow.width() / 2 - this.width() / 2);
        this.y(this.follow.y() + this.follow.height() / 2 - this.height() / 2);
      }
    }

    /* GETTERS & SETTERS */

    /**
     * Name of the element
     * @returns {string} the name
     */

  }, {
    key: "name",
    get: function get() {
      return "animation";
    }
  }]);

  return Animation;
}(_Entity3.default);

exports.default = Animation;