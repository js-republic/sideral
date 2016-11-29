"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Element2 = require("./Element");

var _Element3 = _interopRequireDefault(_Element2);

var _Entity = require("./Entity");

var _Entity2 = _interopRequireDefault(_Entity);

var _Canvas = require("./components/Canvas");

var _Canvas2 = _interopRequireDefault(_Canvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scene = function (_Element) {
    _inherits(Scene, _Element);

    /* LIFECYCLE */

    /**
     * @constructor
     */
    function Scene() {
        _classCallCheck(this, Scene);

        /**
         * List of entities
         * @type {Array<Entity>}
         */
        var _this = _possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).call(this));

        _this.entities = [];

        /**
         * Gravity of the scene
         * @type {number}
         */
        _this.gravity = 0;

        /**
         * Scale of all entities behind this scene
         * @type {number}
         */
        _this.scale = 1;

        /**
         * Position of the camera
         * @type {{x: number, y: number, follow: Entity|null}}
         */
        _this.camera = { x: 0, y: 0, following: null };
        return _this;
    }

    /**
     * Initialization
     * @returns {void}
     */


    _createClass(Scene, [{
        key: "initialize",
        value: function initialize() {
            _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "initialize", this).call(this);

            this.compose(new _Canvas2.default(this.width(), this.height()));
        }

        /**
         * Update
         * @returns {void}
         */

    }, {
        key: "update",
        value: function update() {
            _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "update", this).call(this);

            if (this.camera.follow) {
                this.camera.x = this.camera.follow.x() + this.camera.follow.width() * this.scale / 2 - this.width() / 2 / this.scale;
                this.camera.y = this.camera.follow.y() + this.camera.follow.height() * this.scale / 2 - this.height() / 2 / this.scale;
            }

            this.entities.map(function (entity) {
                return entity.update();
            });
        }

        /**
         * Render
         * @param {*} context: context of the canvas (created inside this function)
         * @returns {void}
         */

    }, {
        key: "render",
        value: function render(context) {
            context = this.canvas.context;
            _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "render", this).call(this, context);

            this.entities.map(function (entity) {
                return entity.render(context);
            });
        }

        /* METHODS */

        /**
         * Attach an entity to the scene
         * @param {Entity} entity: entity to attach
         * @param {number} x: position x of entity
         * @param {number} y: position y of entity
         * @returns {Scene} current instance
         */

    }, {
        key: "attachEntity",
        value: function attachEntity(entity) {
            var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            if (!entity || entity && !(entity instanceof _Entity2.default)) {
                throw new Error("Scene.attachEntity : entity must be an instance of Entity");
            }

            // Entity pooling mode
            if (entity.pooling) {
                var entityPooling = this.entities.find(function (x) {
                    return x.pooling && x.destroyed;
                });

                if (entityPooling) {
                    entityPooling.x(x);
                    entityPooling.y(y);
                    entityPooling.reset();

                    return this;
                }
            }

            this.entities.push(entity);
            entity.x(x);
            entity.y(y);
            entity.scene = this;

            entity.initialize();

            return this;
        }

        /* GETTERS & SETTERS */

        /**
         * The name of the scene
         * @returns {string} the name
         */

    }, {
        key: "width",


        /**
         * Get or set the width
         * @param {number=} width: if exist, width will be setted
         * @returns {number} the current width
         */
        value: function width(_width) {
            if (typeof _width !== "undefined") {
                if (this.isComposedOf("canvas")) {
                    this.canvas.width(_width);
                }
            }

            return _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "width", this).call(this, _width);
        }

        /**
         * Get or set the height
         * @param {number=} height: if exist, height will be setted
         * @returns {number} the current height
         */

    }, {
        key: "height",
        value: function height(_height) {
            if (typeof _height !== "undefined") {
                if (this.isComposedOf("canvas")) {
                    this.canvas.height(_height);
                }
            }

            return _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "height", this).call(this, _height);
        }
    }, {
        key: "name",
        get: function get() {
            return "scene";
        }
    }]);

    return Scene;
}(_Element3.default);

exports.default = Scene;