"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _Bitmap = require("../Util/Bitmap");

var _Bitmap2 = _interopRequireDefault(_Bitmap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sprite = function (_Component) {
    _inherits(Sprite, _Component);

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {*} props: properties
     */
    function Sprite(props) {
        _classCallCheck(this, Sprite);

        var _this = _possibleConstructorReturn(this, (Sprite.__proto__ || Object.getPrototypeOf(Sprite)).call(this, props));

        if (!_this.path) {
            throw new Error("Sprite.constructor : a path must be provided");
        }

        /**
         * Flip deleguation of bitmap
         * @type {{x: boolean, y: boolean}}
         */
        _this.flip = _this.flip || { x: false, y: false };

        /**
         * Offset of the bitmap compared to the position of the Entity
         * @type {{x: number, y: number}}
         */
        _this.offset = _this.offset || { x: 0, y: 0 };

        /**
         * Rotation of bitmap
         * @type {number}
         */
        _this.rotation = _this.rotation || 0;

        /**
         * Opacity of the bitmap
         * @type {number}
         */
        _this.opacity = _this.opacity || 1;

        /**
         * Picture of the sprite
         * @readonly
         * @type {Bitmap}
         */
        _this.bitmap = new _Bitmap2.default();

        /**
         * List of all animation available on this sprite
         * @type {Array<Object>}
         */
        _this.animations = [];

        /**
         * Current animation for this sprite
         * @type {*}
         */
        _this.animation = null;

        if (_this.width || _this.height) {
            _this.bitmap.tilesize = { width: _this.width || 0, height: _this.height || 0 };
        }

        _this.bitmap.load(_this.path, function () {
            if (_this.parent) {
                _this.parent.requestRender();
            }
        });
        return _this;
    }

    /**
     * @override
     */


    _createClass(Sprite, [{
        key: "update",
        value: function update() {
            _get(Sprite.prototype.__proto__ || Object.getPrototypeOf(Sprite.prototype), "update", this).call(this);

            if (!this.animation || this.animation && !this.animation.duration) {
                return null;
            }

            this.animation.time++;

            if (this.animation.time >= this.animation.fraction) {
                if (this.parent) {
                    this.parent.requestRender();
                }

                this.animation.time = 0;

                if (this.animation.frame >= this.animation.frames.length - 1) {
                    this.animation.frame = 0;
                    this.animation.loop++;
                } else {
                    this.animation.frame++;
                }
            }
        }

        /**
         * Render
         * @param {*} context: canvas context
         * @returns {void|null} void
         */

    }, {
        key: "render",
        value: function render(context) {
            if (!this.bitmap.loaded || !this.parent || this.parent && !this.parent.scene) {
                return null;
            }

            var offset = { x: 0, y: 0 };

            if (this.animation && this.animation.offset) {
                offset = this.animation.offset.flip ? { x: this.flip.x ? -this.animation.offset.x : this.animation.offset.x, y: this.flip.y ? -this.animation.offset.y : this.animation.offset.y } : this.animation.offset;
            } else if (this.offset) {
                offset = this.offset.flip ? { x: this.flip.x ? -this.offset.x : this.offset.x, y: this.flip.y ? -this.offset.y : this.offset.y } : this.offset;
            }

            context.clearRect((this.parent.previousProps.x || this.parent.x) - offset.x - this.parent.scene.camera.x, (this.parent.previousProps.y || this.parent.y) - offset.y - this.parent.scene.camera.y, this.width, this.height);

            this.bitmap.flip = this.flip;
            this.bitmap.opacity = this.opacity;
            this.bitmap.rotation = this.rotation;
            this.bitmap.render(context, this.parent.x - offset.x - this.parent.scene.camera.x, this.parent.y - offset.y - this.parent.scene.camera.y, this.animation ? this.animation.frames[this.animation.frame] : 0);
        }

        /* METHODS */

        /**
         * Add a new animation
         * @param {string} name: name of the animation
         * @param {number} duration: duration of the animation
         * @param {Array<number>} frames: frames data in order to be render
         * @param {{x: number, y: number}|null} offset: offset bitmap compared to entity's position
         * @returns {Sprite} recursive function
         */

    }, {
        key: "addAnimation",
        value: function addAnimation(name, duration, frames) {
            var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            if (!name || !frames) {
                throw new Error("Sprite.addAnimation : you must set a name, duration and frames");
            }

            this.animations.push({ name: name, duration: duration, time: 0, frames: frames, frame: 0, loop: 0, fraction: duration, offset: offset });

            return this;
        }

        /**
         * Remove an animation
         * @param {string} name: name of the animation
         * @returns {Sprite} current instance
         */

    }, {
        key: "removeAnimation",
        value: function removeAnimation(name) {
            var animationsFiltered = this.animations.filter(function (x) {
                return x.name !== name;
            });

            if (animationsFiltered.length !== this.animations.length) {
                this.animations = animationsFiltered;
            }

            return this;
        }

        /**
         * Set the current animation
         * @param {string} name: name of the animation
         * @param {Boolean=} restart: if true, the animation restart to 0
         * @returns {Sprite} current instance
         */

    }, {
        key: "currentAnimation",
        value: function currentAnimation(name) {
            var restart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.animation = this.getAnimationByName(name);

            if (this.animation && restart) {
                this.animation.loop = 0;
                this.animation.frame = 0;
                this.animation.time = 0;
            }

            if (this.parent) {
                this.parent.requestRender();
            }

            return this;
        }

        /* GETTERS & SETTERS */

    }, {
        key: "getAnimationByName",


        /**
         * Get an animation by its name
         * @param {string} name: name of the animation
         * @returns {Object} the animation
         */
        value: function getAnimationByName(name) {
            return this.animations.find(function (x) {
                return x.name === name;
            });
        }

        /**
         * Get total duration of an animation to be totally rendered
         * @param {string} name: name of the animation
         * @param {number=} loop: number of loop
         * @returns {number} the duration
         */

    }, {
        key: "getAnimationDuration",
        value: function getAnimationDuration(name) {
            var loop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var animation = this.getAnimationByName(name);

            return animation ? animation.fraction * animation.frames.length * (loop + 1) : 0;
        }
    }, {
        key: "name",
        get: function get() {
            return "sprite";
        }
    }]);

    return Sprite;
}(_index2.default);

exports.default = Sprite;