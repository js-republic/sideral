"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Element2 = require("./Element");

var _Element3 = _interopRequireDefault(_Element2);

var _Scene = require("./Scene");

var _Scene2 = _interopRequireDefault(_Scene);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Engine = function (_Element) {
    _inherits(Engine, _Element);

    /* LIFECYCLE */
    function Engine() {
        _classCallCheck(this, Engine);

        /**
         * Global data to store
         * @type {{}}
         */
        var _this = _possibleConstructorReturn(this, (Engine.__proto__ || Object.getPrototypeOf(Engine)).call(this));

        _this.storage = {};

        /**
         * List of scenes attached to engine
         * @type {Array}
         */
        _this.scenes = [];

        /**
         * Time since last update
         * @type {number}
         */
        _this.lastUpdate = 0;

        /**
         * Current FPS (Frames per second)
         * @type {number}
         */
        _this.fps = 60;

        /**
         * Current latence between each frame (in ms)
         * @type {number}
         */
        _this.latence = 0;

        /**
         * Current latence between each frame (in second)
         * @type {number}
         */
        _this.tick = 1;

        /**
         * DOM of the engine
         * @type {null}
         */
        _this.dom = null;

        /**
         * Stop the run
         * @type {boolean}
         * @readonly
         */
        _this.stopped = false;
        return _this;
    }

    /**
     * Update
     * @returns {void}
     */


    _createClass(Engine, [{
        key: "update",
        value: function update() {
            _get(Engine.prototype.__proto__ || Object.getPrototypeOf(Engine.prototype), "update", this).call(this);

            this.scenes.map(function (scene) {
                return scene.update();
            });
        }

        /**
         * Render
         * @param {*=} context: canvas render (Engine has no context, it's only for overriding)
         * @returns {void}
         */

    }, {
        key: "render",
        value: function render(context) {
            _get(Engine.prototype.__proto__ || Object.getPrototypeOf(Engine.prototype), "render", this).call(this, context);

            this.scenes.map(function (scene) {
                return scene.render(context);
            });
        }

        /**
         * Run the engine
         * @param {number=} timeStart: time sended by requestAnimationFrame
         * @returns {void|null} null
         */

    }, {
        key: "run",
        value: function run(timeStart) {
            if (this.stopped) {
                return null;
            }

            timeStart = timeStart || window.performance.now();
            requestAnimationFrame(this.run.bind(this));

            // 100ms latence max
            this.latence = Math.min(timeStart - this.lastUpdate, 100);
            this.fps = Math.floor(1000 / this.latence);
            this.tick = 1000 / (this.fps * 1000);

            this.update();
            this.render(null);

            this.lastUpdate = window.performance.now();
        }

        /**
         * Stop the loop
         * @returns {void}
         */

    }, {
        key: "stop",
        value: function stop() {
            this.stopped = true;
            this.tick = 0;
        }

        /**
         * Restart the loop
         * @returns {void}
         */

    }, {
        key: "restart",
        value: function restart() {
            this.stopped = false;
            this.run();
        }

        /**
         * Attach a scene to current engine
         * @param {*} scene: the scene to attach to the engine
         * @returns {Engine} the current engine
         */

    }, {
        key: "attachScene",
        value: function attachScene(scene) {
            if (!scene || scene && !(scene instanceof _Scene2.default)) {
                throw new Error("Engine.attachScene : scene must be an instance of Scene.");
            }

            scene.width(this.width());
            scene.height(this.height());

            this.scenes.push(scene);
            scene.initialize();

            return this;
        }

        /**
         * Attach a dom to the parent dom passed by parameter
         * @param {*} parentDOM: the dom to attach the engine
         * @returns {Engine} : the current Engine
         */

    }, {
        key: "attachDOM",
        value: function attachDOM(parentDOM) {
            if (!parentDOM) {
                throw new Error("Engine.initialize : dom must be passed to parameters and must be valid.");
            }

            if (!this.dom) {
                this.dom = document.createElement("div");
                this.dom.id = this.id;
                this.dom.className = "sideral-engine";
                this.dom.style.position = "relative";
            }

            parentDOM.appendChild(this.dom);

            return this;
        }

        /* GETTERS & SETTERS */

        /**
         * The name of the engine
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
                if (this.dom) {
                    this.dom.width = _width;
                }

                this.scenes.forEach(function (scene) {
                    scene.width(_width);
                });
            }

            return _get(Engine.prototype.__proto__ || Object.getPrototypeOf(Engine.prototype), "width", this).call(this, _width);
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
                if (this.dom) {
                    this.dom.height = _height;
                }

                this.scenes.forEach(function (scene) {
                    scene.height(_height);
                });
            }

            return _get(Engine.prototype.__proto__ || Object.getPrototypeOf(Engine.prototype), "height", this).call(this, _height);
        }
    }, {
        key: "name",
        get: function get() {
            return "engine";
        }
    }]);

    return Engine;
}(_Element3.default);

exports.default = new Engine();