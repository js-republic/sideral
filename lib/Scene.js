"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _Element2 = require("./Element");

var _Element3 = _interopRequireDefault(_Element2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scene = function (_Element) {
    _inherits(Scene, _Element);

    function Scene() {
        _classCallCheck(this, Scene);

        return _possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).apply(this, arguments));
    }

    _createClass(Scene, [{
        key: "name",


        /* LIFECYCLE */

        /* GETTERS & SETTERS */

        /**
         * The name of the scene
         * @returns {string} the name
         */
        get: function get() {
            return "scene";
        }

        /**
         * get only width from size
         * @returns {number} width of engine
         */

    }, {
        key: "width",
        get: function get() {
            return this.size.width;
        }

        /**
         * Get only height from size
         * @returns {number} height of engine
         */
        ,


        /**
         * set only width from size
         * @param {number} width: the new width of the engine
         */
        set: function set(width) {
            _set(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "width", width, this);

            if (this.isComposedOf("canvas")) {
                this.canvas.width = width;
            }
        }

        /**
         * Set only height from size
         * @param {number} height: the new height of the engine
         */

    }, {
        key: "height",
        get: function get() {
            return this.size.height;
        },
        set: function set(height) {
            _set(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "height", height, this);

            if (this.isComposedOf("canvas")) {
                this.canvas.height = height;
            }
        }
    }]);

    return Scene;
}(_Element3.default);

exports.default = Scene;