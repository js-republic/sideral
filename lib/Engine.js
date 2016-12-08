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

    /**
     * @constructor
     * @param {*} options: options
     */
    function Engine(options) {
        _classCallCheck(this, Engine);

        /**
         * Name of the element
         * @readonly
         * @type {string}
         */
        var _this = _possibleConstructorReturn(this, (Engine.__proto__ || Object.getPrototypeOf(Engine)).call(this, options));

        _this.name = "engine";

        /**
         * Global data to store
         * @type {{}}
         */
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
         * @nextCycle
         * @returns {void}
         */

    }, {
        key: "nextCycle",
        value: function nextCycle() {
            this.scenes.forEach(function (scene) {
                return scene.nextCycle();
            });
        }

        /**
         * @onPropsChanged
         * @param {*} changedProps: changed properties
         * @returns {void}
         */

    }, {
        key: "onPropsChanged",
        value: function onPropsChanged(changedProps) {
            _get(Engine.prototype.__proto__ || Object.getPrototypeOf(Engine.prototype), "onPropsChanged", this).call(this, changedProps);

            if (changedProps.width) {
                if (this.dom) {
                    this.dom.width = changedProps.width;
                }

                this.scenes.forEach(function (scene) {
                    scene.width = changedProps.width;
                });
            }

            if (changedProps.height) {
                if (this.dom) {
                    this.dom.height = changedProps.height;
                }

                this.scenes.forEach(function (scene) {
                    scene.height = changedProps.height;
                });
            }
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
            this.nextCycle();

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
         * @param {function=} callback: Callback with scene added in parameter
         * @returns {Element} the current engine
         */

    }, {
        key: "attachScene",
        value: function attachScene(scene, callback) {
            if (!scene || scene && !(scene instanceof _Scene2.default)) {
                throw new Error("Engine.attachScene : scene must be an instance of Scene.");
            }

            scene.width = this.width;
            scene.height = this.height;

            this.attach(scene, this.scenes, callback);

            if (this.dom && scene.isComposedOf("canvas")) {
                scene.canvas.setParentDOM(this.dom);
            }

            return this;
        }
    }, {
        key: "reorganizeCanvas",
        value: function reorganizeCanvas() {}

        /**
         * Attach a dom to the parent dom passed by parameter
         * @param {*} parentDOM: the dom to attach the engine
         * @returns {Engine} : the current Engine
         */

    }, {
        key: "attachDOM",
        value: function attachDOM(parentDOM) {
            var _this2 = this;

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

            this.scenes.forEach(function (scene) {
                if (scene.isComposedOf("canvas")) {
                    scene.canvas.setParentDOM(_this2.dom);
                }
            });

            return this;
        }
    }]);

    return Engine;
}(_Element3.default);

exports.default = new Engine({
    props: {
        width: 50,
        height: 50
    }
});