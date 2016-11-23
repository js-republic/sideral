"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

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
        _this.tick = 0;

        /**
         * DOM of the engine
         * @type {null}
         */
        _this.dom = null;

        /**
         * Stop the run
         * @type {boolean}
         */
        _this.stopped = false;
        return _this;
    }

    /**
     * Run the engine
     * @param {number=} timeStart: time sended by requestAnimationFrame
     * @returns {void|null} null
     */


    _createClass(Engine, [{
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

            this.scenes.map(function (scene) {
                return scene.update();
            });
            this.scenes.map(function (scene) {
                return scene.render();
            });

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
        key: "name",
        get: function get() {
            return "engine";
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
            _set(Engine.prototype.__proto__ || Object.getPrototypeOf(Engine.prototype), "width", width, this);

            if (this.dom) {
                this.dom.width = width;
            }

            this.scenes.map(function (scene) {
                scene.width = width;

                return null;
            });
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
            _set(Engine.prototype.__proto__ || Object.getPrototypeOf(Engine.prototype), "height", height, this);

            if (this.dom) {
                this.dom.height = height;
            }

            this.scenes.map(function (scene) {
                scene.height = height;

                return null;
            });
        }
    }]);

    return Engine;
}(_Element3.default);

exports.default = new Engine();