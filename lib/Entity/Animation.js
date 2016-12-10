"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _Sprite = require("./../Component/Sprite");

var _Sprite2 = _interopRequireDefault(_Sprite);

var _Timer = require("./../Component/Timer");

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
   * @param {*} props: props
   */
  function Animation(props) {
    _classCallCheck(this, Animation);

    /**
     * Duration of the animation
     * @type {number}
     */
    var _this = _possibleConstructorReturn(this, (Animation.__proto__ || Object.getPrototypeOf(Animation)).call(this, props));

    _this.duration = _this.duration || 0;

    /**
     * Other options of animation
     * @type {Entity}
     */
    _this.follow = _this.follow || null;

    /**
     * Number of loop
     * @type {number}
     */
    _this.loop = typeof _this.loop === "undefined" ? -1 : _this.loop;

    /**
     * Path of the picture
     * @type {string}
     */
    _this.path = _this.path || "";

    /**
     * Frames of the animation
     * @type {Array<number>}
     */
    _this.frames = _this.frames || [];
    return _this;
  }

  /**
   * @override
   */


  _createClass(Animation, [{
    key: "initialize",
    value: function initialize(parent) {
      var _this2 = this;

      _get(Animation.prototype.__proto__ || Object.getPrototypeOf(Animation.prototype), "initialize", this).call(this, parent);

      this.compose(new _Sprite2.default({
        path: this.path,
        width: this.width,
        height: this.height

      })).compose(new _Timer2.default({
        duration: this.sprite.getAnimationDuration("idle", this.loop > 0 ? this.loop : 0),
        eventComplete: function eventComplete() {
          return _this2.destroy();
        }
      }));

      this.sprite.addAnimation("idle", this.duration, this.frames).currentAnimation("idle");
    }

    /**
     * @override
     */

  }, {
    key: "update",
    value: function update() {
      _get(Animation.prototype.__proto__ || Object.getPrototypeOf(Animation.prototype), "update", this).call(this);

      if (this.follow) {
        this.x = this.follow.x + this.follow.width / 2 - this.width / 2;
        this.y = this.follow.y + this.follow.height / 2 - this.height / 2;
      }
    }

    /* GETTERS & SETTERS */

  }, {
    key: "name",
    get: function get() {
      return "animation";
    }
  }]);

  return Animation;
}(_index2.default);

exports.default = Animation;