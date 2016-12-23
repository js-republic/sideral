"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ComponentViewable2 = require("./../ComponentViewable");

var _ComponentViewable3 = _interopRequireDefault(_ComponentViewable2);

var _Entity = require("./../Entity");

var _Entity2 = _interopRequireDefault(_Entity);

var _Canvas = require("./../Component/Canvas");

var _Canvas2 = _interopRequireDefault(_Canvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scene = function (_ComponentViewable) {
    _inherits(Scene, _ComponentViewable);

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {*} props: properties
     */
    function Scene(props) {
        _classCallCheck(this, Scene);

        /**
         * Gravity of the scene
         * @type {number}
         */
        var _this = _possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).call(this, props));

        _this.gravity = _this.gravity || 0;

        /**
         * Scale of all entities behind this scene
         * @type {number}
         */
        _this.scale = _this.scale || 1;

        /**
         * Position of the camera
         * @type {{x: number, y: number, follow: Entity|null}}
         */
        _this.camera = { x: 0, y: 0, follow: null };

        /**
         * List of componentViewable needing to be render
         * @type {{}}
         */
        _this.renderRequested = {};
        return _this;
    }

    /**
     * @override
     */


    _createClass(Scene, [{
        key: "initialize",
        value: function initialize(parent) {
            var _this2 = this;

            _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "initialize", this).call(this, parent);

            this.compose(new _Canvas2.default({ width: this.width, height: this.height }));

            // Observe prop width
            this.observeProp("width", function (previousValue, nextValue) {
                _this2.canvas.width = nextValue;
            });

            // Observe prop height
            this.observeProp("height", function (previousValue, nextValue) {
                _this2.canvas.height = nextValue;
            });

            // Observe prop for scale and update it at next cycle
            this.observeProp("scale");
        }

        /**
         * @override
         */

    }, {
        key: "update",
        value: function update() {
            _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "update", this).call(this);

            if (this.camera.follow) {
                this.camera.x = this.camera.follow.x + this.camera.follow.width * this.scale / 2 - this.width / 2 / this.scale;
                this.camera.y = this.camera.follow.y + this.camera.follow.height * this.scale / 2 - this.height / 2 / this.scale;
            }
        }

        /**
         * @override
         */

    }, {
        key: "render",
        value: function render(context) {
            var _this3 = this;

            context = this.canvas.context;

            this.components.forEach(function (component) {
                if (_this3.renderRequested[component.id] && component.render) {
                    component.render(context);
                    delete _this3.renderRequested[component.id];
                }
            });

            return context;
        }

        /**
         * @override
         */

    }, {
        key: "nextCycle",
        value: function nextCycle() {
            var _this4 = this;

            this.hasChanged("scale", function (previousValue, nextValue) {
                if (_this4.has("canvas")) {
                    _this4.canvas.context.scale(nextValue / previousValue, nextValue / previousValue);
                }
            });

            _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "nextCycle", this).call(this);
        }

        /* METHODS */

        /**
         * @override
         */

    }, {
        key: "compose",
        value: function compose(component, next) {
            if (component && component instanceof _Entity2.default) {
                component.scene = this;
                this.renderRequested[component.id] = true;
            }

            return _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "compose", this).call(this, component, next);
        }

        /* GETTERS & SETTERS */

    }, {
        key: "name",
        get: function get() {
            return "scene";
        }
    }, {
        key: "entities",
        get: function get() {
            return this.components.filter(function (x) {
                return x instanceof _Entity2.default;
            });
        }
    }]);

    return Scene;
}(_ComponentViewable3.default);

exports.default = Scene;