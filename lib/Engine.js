"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Component2 = require("./Component");

var _Component3 = _interopRequireDefault(_Component2);

var _Scene = require("./Scene");

var _Scene2 = _interopRequireDefault(_Scene);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Engine = function (_Component) {
    _inherits(Engine, _Component);

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {*} props: properties
     */
    function Engine(props) {
        _classCallCheck(this, Engine);

        /**
         * Width of the Engine
         * @type {number}
         */
        var _this = _possibleConstructorReturn(this, (Engine.__proto__ || Object.getPrototypeOf(Engine)).call(this, props));

        _this.width = _this.width || 50;

        /**
         * Height of the Engine
         * @type {number}
         */
        _this.height = _this.height || 50;

        /**
         * Global data to store
         * @type {{}}
         */
        _this.storage = {};

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

        /**
         * Canvas as a layer
         * @readonly
         * @type {{}}
         */
        _this.layers = {};

        // Auto initialization
        _this.initialize(null);
        return _this;
    }

    /**
     * @override
     */


    _createClass(Engine, [{
        key: "initialize",
        value: function initialize(parent) {
            var _this2 = this;

            _get(Engine.prototype.__proto__ || Object.getPrototypeOf(Engine.prototype), "initialize", this).call(this, parent);

            // Observe width
            this.observeProp("width", function (previousValue, nextValue) {
                if (_this2.dom) {
                    _this2.dom.style.width = nextValue + "px";
                }

                _this2.scenes.forEach(function (scene) {
                    return scene.width = nextValue;
                });
            });

            // Observe height
            this.observeProp("height", function (previousValue, nextValue) {
                if (_this2.dom) {
                    _this2.dom.style.height = nextValue + "px";
                }

                _this2.scenes.forEach(function (scene) {
                    return scene.height = nextValue;
                });
            });
        }

        /**
         * Render scenes
         * @returns {void}
         */

    }, {
        key: "render",
        value: function render() {
            this.scenes.forEach(function (scene) {
                return scene.render();
            });
        }

        /* METHODS */

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
            this.render();
            this.nextCycle();

            if (this.debug && !this.debugtimer) {
                this.debug.innerHTML = "FPS: " + this.fps;
                this.debugtimer = 60;
            }

            this.debugtimer--;
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
         * Add a new canvas as a layer
         * @param {Component} canvas: Canvas component
         * @param {number} position: position of the canvas
         * @returns {void}
         */

    }, {
        key: "createLayer",
        value: function createLayer(canvas) {
            var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var keys = Object.keys(this.layers),
                getKey = function getKey(key) {
                return keys.find(function (x) {
                    return x === key;
                }) ? getKey(key + 1) : key;
            };

            if (canvas && canvas.dom) {
                var key = getKey(position);

                canvas.setParentDOM(this.dom);
                this.layers[key] = canvas;
                this.sortLayers();
            }
        }

        /**
         * Sort all layers by their position on the table
         * @returns {void}
         */

    }, {
        key: "sortLayers",
        value: function sortLayers() {
            var _this3 = this;

            var keys = Object.keys(this.layers);
            var position = 0;

            keys.sort().forEach(function (key) {
                var layer = _this3.layers[key];

                if (!layer.dom) {
                    return null;
                }

                if (position) {
                    layer.dom.style.position = "absolute";
                    layer.dom.style.top = 0;
                    layer.dom.style.left = 0;
                    layer.dom.style.zIndex = position;
                } else {
                    layer.dom.style.position = "static";
                }

                position++;
            });
        }

        /**
         * @override
         * @param {Component} component: component
         * @param {function=} next: function callback
         * @returns {Component} current instance
         */

    }, {
        key: "compose",
        value: function compose(component, next) {
            if (component instanceof _Scene2.default) {
                component.width = this.width;
                component.height = this.height;

                _get(Engine.prototype.__proto__ || Object.getPrototypeOf(Engine.prototype), "compose", this).call(this, component, next);

                if (this.dom && component.has("canvas")) {
                    this.createLayer(component.canvas);
                }

                return this;
            }

            return _get(Engine.prototype.__proto__ || Object.getPrototypeOf(Engine.prototype), "compose", this).call(this, component, next);
        }

        /**
         * Attach a dom to the parent dom passed by parameter
         * @param {*} parentDOM: the dom to attach the engine
         * @returns {Engine} : the current Engine
         */

    }, {
        key: "attachDOM",
        value: function attachDOM(parentDOM) {
            var _this4 = this;

            if (!parentDOM) {
                throw new Error("Engine.initialize : dom must be passed to parameters and must be valid.");
            }

            if (!this.dom) {
                this.dom = document.createElement("div");
                this.dom.id = this.id;
                this.dom.style.width = this.width + "px";
                this.dom.style.height = this.height + "px";
                this.dom.className = "sideral-engine";
                this.dom.style.position = "relative";
                this.dom.style.overflow = "hidden";
                this.dom.style.margin = "10px auto";

                var debug = document.createElement("div");

                debug.id = "debug";
                parentDOM.appendChild(debug);
                this.debug = debug;
            }

            parentDOM.appendChild(this.dom);

            this.scenes.forEach(function (scene) {
                if (scene.has("canvas")) {
                    scene.canvas.setParentDOM(_this4.dom);
                }
            });

            this.sortLayers();

            return this;
        }

        /* GETTERS & SETTERS */

    }, {
        key: "name",
        get: function get() {
            return "engine";
        }
    }, {
        key: "scenes",
        get: function get() {
            return this.components.filter(function (x) {
                return x instanceof _Scene2.default;
            });
        }
    }]);

    return Engine;
}(_Component3.default);

exports.default = new Engine();