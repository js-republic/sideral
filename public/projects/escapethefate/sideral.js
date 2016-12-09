/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/*!****************************************************!*\
  !*** ./public/projects/escapethefate/src/index.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Engine = __webpack_require__(/*! src/Engine */ 507);
	
	var _Engine2 = _interopRequireDefault(_Engine);
	
	var _Keyboard = __webpack_require__(/*! src/Component/Keyboard */ 513);
	
	var _Keyboard2 = _interopRequireDefault(_Keyboard);
	
	var _SceneWorld = __webpack_require__(/*! ./scenes/SceneWorld */ 515);
	
	var _SceneWorld2 = _interopRequireDefault(_SceneWorld);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_Engine2.default.attachDOM(document.getElementById("sideral-app"));
	
	_Engine2.default.setProps({
	    width: 500,
	    height: 200
	});
	
	_Engine2.default.compose(new _Keyboard2.default()).compose(new _SceneWorld2.default());
	
	_Engine2.default.run();

/***/ },

/***/ 507:
/*!***********************!*\
  !*** ./src/Engine.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _Component2 = __webpack_require__(/*! ./Component */ 508);
	
	var _Component3 = _interopRequireDefault(_Component2);
	
	var _Scene = __webpack_require__(/*! ./Scene */ 509);
	
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
	                    _this2.dom.width = nextValue;
	                }
	
	                _this2.scenes.forEach(function (scene) {
	                    return scene.width = nextValue;
	                });
	            });
	
	            // Observe height
	            this.observeProp("height", function (previousValue, nextValue) {
	                if (_this2.dom) {
	                    _this2.dom.height = nextValue;
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
	         * @override
	         * @param {Component} component: component
	         * @param {function=} next: function callback
	         * @returns {Component} current instance
	         */
	
	    }, {
	        key: "compose",
	        value: function compose(component, next) {
	            _get(Engine.prototype.__proto__ || Object.getPrototypeOf(Engine.prototype), "compose", this).call(this, component, next);
	
	            if (component instanceof _Scene2.default) {
	                component.width = this.width;
	                component.height = this.height;
	
	                if (this.dom && component.has("canvas")) {
	                    component.canvas.setParentDOM(this.dom);
	                }
	            }
	
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
	            var _this3 = this;
	
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
	                if (scene.has("canvas")) {
	                    scene.canvas.setParentDOM(_this3.dom);
	                }
	            });
	
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

/***/ },

/***/ 508:
/*!********************************!*\
  !*** ./src/Component/index.js ***!
  \********************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Component = function () {
	
	    /* LIFECYCLE */
	
	    /**
	     * @constructor
	     * @param {Object=} props: properties
	     */
	    function Component() {
	        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	        _classCallCheck(this, Component);
	
	        /**
	         * Unique Id of the component
	         * @type {string}
	         */
	        this.id = Component.generateId();
	
	        /**
	         * Previous properties that has changed during the cycle
	         * @type {{}}
	         */
	        this.previousProps = {};
	
	        /**
	         * List of current components
	         * @type {Array<Component>}
	         */
	        this.components = [];
	
	        /**
	         * Parent which attach this component
	         * @type {Component|null}
	         */
	        this.parent = null;
	
	        /**
	         * Property to know if this component is destroyed and don't be usable until it has been trashed by Garbage Collector
	         * @readonly
	         * @type {boolean}
	         */
	        this.destroyed = true;
	
	        // Merge props
	        this.setProps(props);
	    }
	
	    /**
	     * Called when attached to an other component
	     * @initialize
	     * @param {Component=} parent: Component parent owner
	     * @returns {void}
	     */
	
	
	    _createClass(Component, [{
	        key: "initialize",
	        value: function initialize(parent) {
	            this.parent = parent;
	        }
	
	        /**
	         * Destroy a component
	         * @destroy
	         * @returns {void}
	         */
	
	    }, {
	        key: "destroy",
	        value: function destroy() {
	            if (this.parent) {
	                this.parent.decompose(this);
	            }
	
	            this.destroyed = true;
	        }
	
	        /**
	         * Update a component
	         * @update
	         * @returns {void|null} null
	         */
	
	    }, {
	        key: "update",
	        value: function update() {
	            this.components.forEach(function (component) {
	                return component.update();
	            });
	        }
	
	        /**
	         * Begin a new cycle
	         * @nextCycle
	         * @returns {void}
	         */
	
	    }, {
	        key: "nextCycle",
	        value: function nextCycle() {
	            this.previousProps = {};
	
	            this.components.forEach(function (component) {
	                return component.nextCycle();
	            });
	        }
	
	        /**
	         * Reset this component to its initial state
	         * @reset
	         * @returns {void}
	         */
	
	    }, {
	        key: "reset",
	        value: function reset() {
	            this.nextCycle();
	            this.destroyed = false;
	        }
	
	        /* METHODS */
	
	        /**
	         * Attach a component
	         * @param {Component} component: component to be attached
	         * @param {function=} next: function with the component attached in parameter
	         * @returns {Component} current instance
	         */
	
	    }, {
	        key: "compose",
	        value: function compose(component, next) {
	            if (!component || !(component instanceof Component)) {
	                throw new Error("Component.compose : parameter 1 must be an instance of Component.");
	            }
	
	            var name = component.name;
	
	            this.components.push(component);
	            component.initialize(this);
	
	            if (this.prototype) {
	                delete this.prototype[name];
	            }
	
	            Object.defineProperty(this, name, {
	                value: component,
	                writable: false,
	                configurable: true
	            });
	
	            if (next) {
	                next(component);
	            }
	
	            return this;
	        }
	
	        /**
	         * Decompose a component
	         * @param {Component} component: The component to be decomposed
	         * @returns {Component} current instance
	         */
	
	    }, {
	        key: "decompose",
	        value: function decompose(component) {
	            if (!component || !(component instanceof Component)) {
	                throw new Error("Component.decompose : parameter 1 must be an instance of Component.");
	            }
	
	            var name = component.name;
	
	            component.destroyed = true;
	            if (this.prototype) {
	                delete this.prototype[name];
	            }
	            this.components = this.components.filter(function (x) {
	                return x.name !== name;
	            });
	
	            return this;
	        }
	
	        /**
	         * Know if the component has component attached by his name
	         * @param {string} componentName: Name of the component
	         * @returns {boolean} result of the check
	         */
	
	    }, {
	        key: "has",
	        value: function has(componentName) {
	            return Boolean(this[componentName]);
	        }
	
	        /**
	         * Set/Add new properties to component
	         * @param {Object} nextProps: next properties to merge
	         * @returns {Component} the component
	         */
	
	    }, {
	        key: "setProps",
	        value: function setProps() {
	            var nextProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	            var clonedProps = Object.assign({}, nextProps);
	
	            for (var key in clonedProps) {
	                if (clonedProps.hasOwnProperty(key)) {
	                    this[key] = clonedProps[key];
	                }
	            }
	
	            return this;
	        }
	
	        /**
	         * Observe property
	         * @param {string} prop: property name
	         * @param {function} setFunction: function observable when property is changed
	         * @returns {void}
	         */
	
	    }, {
	        key: "observeProp",
	        value: function observeProp(prop, setFunction) {
	            var value = this[prop];
	
	            delete this[prop];
	            if (this.prototype) {
	                delete this.prototype[prop];
	            }
	
	            Object.defineProperty(this, prop, {
	                get: function get() {
	                    return value;
	                },
	                set: function set(nextValue) {
	                    if (setFunction) {
	                        setFunction(value, nextValue);
	                    }
	
	                    value = nextValue;
	                },
	
	
	                configurable: true
	            });
	        }
	
	        /* GETTERS & SETTERS */
	
	        /**
	         * Name identifier
	         * @returns {string} the name
	         */
	
	    }, {
	        key: "name",
	        get: function get() {
	            return "component";
	        }
	
	        /* STATICS */
	
	        /**
	         * Generate an unique id
	         * @returns {string} return the unique id
	         */
	
	    }], [{
	        key: "generateId",
	        value: function generateId() {
	            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	        }
	    }]);
	
	    return Component;
	}();
	
	exports.default = Component;

/***/ },

/***/ 509:
/*!****************************!*\
  !*** ./src/Scene/index.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _ComponentViewable2 = __webpack_require__(/*! ./../ComponentViewable */ 510);
	
	var _ComponentViewable3 = _interopRequireDefault(_ComponentViewable2);
	
	var _Entity = __webpack_require__(/*! ./../Entity */ 511);
	
	var _Entity2 = _interopRequireDefault(_Entity);
	
	var _Canvas = __webpack_require__(/*! ./../Component/Canvas */ 512);
	
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
	            context = this.canvas.context;
	            _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "render", this).call(this, context);
	        }
	
	        /**
	         * @override
	         */
	
	    }, {
	        key: "nextCycle",
	        value: function nextCycle() {
	            _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "nextCycle", this).call(this);
	
	            this.requestRender = true;
	        }
	
	        /* METHODS */
	
	        /**
	         * @override
	         */
	
	    }, {
	        key: "compose",
	        value: function compose(component, next) {
	            _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "compose", this).call(this, component, next);
	
	            if (component instanceof _Entity2.default) {
	                component.scene = this;
	            }
	
	            return this;
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

/***/ },

/***/ 510:
/*!**********************************!*\
  !*** ./src/ComponentViewable.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _Component2 = __webpack_require__(/*! ./Component */ 508);
	
	var _Component3 = _interopRequireDefault(_Component2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ComponentViewable = function (_Component) {
	    _inherits(ComponentViewable, _Component);
	
	    /* LIFECYCLE */
	
	    /**
	     * @constructor
	     * @param {{}} props: properties
	     */
	    function ComponentViewable(props) {
	        _classCallCheck(this, ComponentViewable);
	
	        /**
	         * Position x
	         * @type {number}
	         */
	        var _this = _possibleConstructorReturn(this, (ComponentViewable.__proto__ || Object.getPrototypeOf(ComponentViewable)).call(this, props));
	
	        _this.x = _this.x || 0;
	
	        /**
	         * Position y
	         * @type {number}
	         */
	        _this.y = _this.y || 0;
	
	        /**
	         * Width of the component
	         * @type {number}
	         */
	        _this.width = _this.width || 10;
	
	        /**
	         * Height of the component
	         * @type {number}
	         */
	        _this.height = _this.height || 10;
	
	        /**
	         * If debug mode, it will show the box on canvas
	         * @type {boolean}
	         */
	        _this.debug = _this.debug || false;
	
	        /**
	         * Set at true when component need to be render
	         * @readonly
	         * @type {boolean}
	         */
	        _this.requestRender = true;
	
	        // Observe default props for rendering
	        _this.observeRenderingProps(["x", "y", "width", "height"]);
	        return _this;
	    }
	
	    /**
	     * Render a component
	     * @render
	     * @param {context} context : context canvas 2d
	     * @returns {void|null} null
	     */
	
	
	    _createClass(ComponentViewable, [{
	        key: "render",
	        value: function render(context) {
	            if (!this.requestRender) {
	                return null;
	            }
	
	            this.components.forEach(function (component) {
	                if (component instanceof ComponentViewable) {
	                    component.render(context);
	                }
	            });
	
	            if (this.debug) {
	                context.strokeStyle = "red";
	                context.strokeRect(this.x, this.y, this.width, this.height);
	            }
	        }
	
	        /**
	         * @override
	         */
	
	    }, {
	        key: "nextCycle",
	        value: function nextCycle() {
	            _get(ComponentViewable.prototype.__proto__ || Object.getPrototypeOf(ComponentViewable.prototype), "nextCycle", this).call(this);
	
	            this.requestRender = false;
	        }
	
	        /* METHODS */
	
	        /**
	         * Observe properties that will request render if they change
	         * @param {Array<string>|string} props: property or list of properties name
	         * @returns {void}
	         */
	
	    }, {
	        key: "observeRenderingProps",
	        value: function observeRenderingProps(props) {
	            var _this2 = this;
	
	            if (typeof props === "string") {
	                props = [props];
	            }
	
	            props.forEach(function (prop) {
	                _this2.observeProp(prop, function (previousValue) {
	                    _this2.previousProps[prop] = previousValue;
	                    _this2.requestRender = true;
	                });
	            });
	        }
	    }]);
	
	    return ComponentViewable;
	}(_Component3.default);
	
	exports.default = ComponentViewable;

/***/ },

/***/ 511:
/*!*****************************!*\
  !*** ./src/Entity/index.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _ComponentViewable2 = __webpack_require__(/*! ./../ComponentViewable */ 510);
	
	var _ComponentViewable3 = _interopRequireDefault(_ComponentViewable2);
	
	var _Engine = __webpack_require__(/*! ./../Engine */ 507);
	
	var _Engine2 = _interopRequireDefault(_Engine);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Entity = function (_ComponentViewable) {
	    _inherits(Entity, _ComponentViewable);
	
	    /* LIFECYCLE */
	
	    /**
	     * @constructor
	     * @param {*} props: properties
	     */
	    function Entity(props) {
	        _classCallCheck(this, Entity);
	
	        /**
	         * Mass of the entity (used for collision)
	         * @type {string}
	         */
	        var _this = _possibleConstructorReturn(this, (Entity.__proto__ || Object.getPrototypeOf(Entity)).call(this, props));
	
	        _this.mass = _this.mass || Entity.MASS.NONE;
	
	        /**
	         * Direction movement of the entity
	         * @type {{x: number, y: number}}
	         */
	        _this.direction = _this.direction || { x: 0, y: 0 };
	
	        /**
	         * Speed movement of the entity
	         * @type {{x: number, y: number}}
	         */
	        _this.speed = _this.speed || { x: 100, y: 100 };
	
	        /**
	         * Velocity of the entity
	         * @type {{x: number, y: number}}
	         * @readonly
	         */
	        _this.velocity = _this.velocity || { x: 0, y: 0 };
	
	        /**
	         * Factor of scene gravity
	         * @type {number}
	         */
	        _this.gravityFactor = _this.gravityFactor || 1;
	
	        /**
	         * Reference to the current scene
	         * @readonly
	         * @type {*}
	         */
	        _this.scene = null;
	
	        /**
	         * Know if the entity is standing on a ground (or over an entity)
	         * @type {boolean}
	         * @readonly
	         */
	        _this.standing = false;
	
	        /**
	         * Know if the entity is falling (used with gravity)
	         * @type {boolean}
	         * @readonly
	         */
	        _this.falling = false;
	        return _this;
	    }
	
	    /**
	     * @override
	     * @returns {void}
	     */
	
	
	    _createClass(Entity, [{
	        key: "update",
	        value: function update() {
	            _get(Entity.prototype.__proto__ || Object.getPrototypeOf(Entity.prototype), "update", this).call(this);
	
	            if (this.direction.x) {
	                this.velocity.x = this.speed.x * this.direction.x * _Engine2.default.tick;
	                this.x += this.velocity.x;
	            }
	
	            this.velocity.y = this.scene && this.scene.gravity && this.gravityFactor ? this.scene.gravity * this.gravityFactor * _Engine2.default.tick : 0;
	            if (this.velocity.y || this.direction.y) {
	                this.velocity.y += this.speed.y * this.direction.y * _Engine2.default.tick;
	                this.y += this.velocity.y;
	            }
	        }
	    }, {
	        key: "render",
	        value: function render(context) {
	            if (this.requestRender) {
	                context.clearRect((this.previousProps.x || this.x) - 1, (this.previousProps.y || this.y) - 1, (this.previousProps.width || this.width) + 2, (this.previousProps.height || this.height) + 2);
	            }
	
	            _get(Entity.prototype.__proto__ || Object.getPrototypeOf(Entity.prototype), "render", this).call(this, context);
	        }
	
	        /* METHODS */
	
	        /**
	         * Get distance between this entity and an other
	         * @param {Entity} entity: entity target
	         * @returns {number} distance from entity target
	         */
	
	    }, {
	        key: "distanceTo",
	        value: function distanceTo(entity) {
	            if (!entity) {
	                return 0;
	            }
	
	            var x = this.x + this.width / 2 - (entity.x + entity.width / 2),
	                y = this.y + this.height / 2 - (entity.y + entity.height / 2);
	
	            return Math.sqrt(x * x + y * y);
	        }
	
	        /**
	         * Compare coordinate to another entity to provide a coordinate direction
	         * @param {Entity} entity: entity to compare
	         * @returns {{x: number, y: number}} coordinate direction
	         */
	
	    }, {
	        key: "directionTo",
	        value: function directionTo(entity) {
	            var bottom = this.y + this.height,
	                right = this.x + this.width,
	                entBottom = entity.y + entity.height,
	                entRight = entity.x + entity.width,
	                colBottom = entBottom - this.y,
	                colTop = bottom - entity.y,
	                colLeft = right - entity.x,
	                colRight = entRight - this.x;
	
	            if (colTop < colBottom && colTop < colLeft && colTop < colRight) {
	                return { x: 0, y: 1 };
	            } else if (colBottom < colTop && colBottom < colLeft && colBottom < colRight) {
	                return { x: 0, y: -1 };
	            } else if (colLeft < colRight && colLeft < colTop && colLeft < colBottom) {
	                return { x: 1, y: 0 };
	            } else if (colRight < colLeft && colRight < colTop && colRight < colBottom) {
	                return { x: -1, y: 0 };
	            }
	
	            return { x: 0, y: 0 };
	        }
	
	        /**
	         * Know if the target entity and the current entity is intersecting
	         * @param {Entity} entity: entity to compare
	         * @returns {boolean} true if the entity intersect the entity target
	         */
	
	    }, {
	        key: "intersect",
	        value: function intersect(entity) {
	            return !(entity.x > this.x + this.width || entity.x + entity.width < this.x || entity.y > this.y + this.height || entity.x + entity.height < this.y);
	        }
	
	        /**
	         * Get position x relative
	         * @returns {number} the current relative position x
	         */
	
	    }, {
	        key: "relativeX",
	        value: function relativeX() {
	            return this.scene ? this.x - this.scene.camera.x : this.x;
	        }
	
	        /**
	         * Get position y relative
	         * @returns {number} the current relative position y
	         */
	
	    }, {
	        key: "relativeY",
	        value: function relativeY() {
	            return this.scene ? this.y - this.scene.camera.y : this.y;
	        }
	
	        /* GETTERS & SETTERS */
	
	    }, {
	        key: "moving",
	        get: function get() {
	            return this.direction.x || this.direction.y;
	        }
	    }, {
	        key: "name",
	        get: function get() {
	            return "entity";
	        }
	    }]);
	
	    return Entity;
	}(_ComponentViewable3.default);
	
	exports.default = Entity;
	
	
	Entity.MASS = {
	    SOLID: "solid",
	    WEAK: "weak",
	    NONE: "none"
	};

/***/ },

/***/ 512:
/*!*********************************!*\
  !*** ./src/Component/Canvas.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _index = __webpack_require__(/*! ./index */ 508);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Canvas = function (_Component) {
	    _inherits(Canvas, _Component);
	
	    /* LIFECYCLE */
	    /**
	     * @constructor
	     * @param {*} props: properties
	     */
	    function Canvas(props) {
	        _classCallCheck(this, Canvas);
	
	        /**
	         * Width of the canvas
	         * @type {number}
	         */
	        var _this = _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this, props));
	
	        _this.width = _this.width || 10;
	
	        /**
	         * Height of the canvas
	         * @type {number}
	         */
	        _this.height = _this.height || 10;
	
	        /**
	         * DOM parent of the canvas
	         */
	        _this.parentDOM = _this.parentDOM || null;
	
	        /**
	         * Dom of the canvas
	         * @type {*}
	         */
	        _this.dom = null;
	
	        /**
	         * Context of the canvas
	         * @type {*}
	         */
	        _this.context = null;
	
	        /**
	         * Color of canvas when it is cleared
	         * @type {string}
	         */
	        _this.clearColor = null;
	
	        return _this;
	    }
	
	    /**
	     * @override
	     */
	
	
	    _createClass(Canvas, [{
	        key: "initialize",
	        value: function initialize(parent) {
	            var _this2 = this;
	
	            _get(Canvas.prototype.__proto__ || Object.getPrototypeOf(Canvas.prototype), "initialize", this).call(this, parent);
	
	            this.dom = document.createElement("canvas");
	            this.dom.id = this.id;
	            this.dom.width = this.width;
	            this.dom.height = this.height;
	            this.context = this.dom.getContext("2d");
	
	            this.setParentDOM();
	
	            // Observe prop width
	            this.observeProp("width", function (previousValue, nextValue) {
	                if (_this2.dom) {
	                    _this2.dom.width = nextValue;
	                }
	            });
	
	            // Observe prop height
	            this.observeProp("height", function (previousValue, nextValue) {
	                if (_this2.dom) {
	                    _this2.dom.height = nextValue;
	                }
	            });
	        }
	
	        /* METHODS */
	
	        /**
	         * Attach the canvas to the parent DOM
	         * @param {*=} dom: dom to attach the canvas
	         * @returns {void|null} null
	         */
	
	    }, {
	        key: "setParentDOM",
	        value: function setParentDOM(dom) {
	            dom = dom || this.parentDOM;
	
	            if (!dom || !this.dom) {
	                return null;
	            }
	
	            this.parentDOM = dom;
	            this.parentDOM.appendChild(this.dom);
	        }
	
	        /**
	         * Clear the canvas
	         * @param {string=} clearColor: color of the canvas when it will be cleared
	         * @returns {void}
	         */
	
	    }, {
	        key: "clear",
	        value: function clear(clearColor) {
	            var ctx = this.context;
	
	            ctx.clearRect(0, 0, this.width, this.height);
	
	            if (clearColor || this.clearColor) {
	                ctx.fillStyle = clearColor || this.clearColor;
	                ctx.fillRect(0, 0, this.width, this.height);
	            }
	        }
	
	        /* GETTERS & SETTERS */
	
	    }, {
	        key: "name",
	        get: function get() {
	            return "canvas";
	        }
	    }]);
	
	    return Canvas;
	}(_index2.default);
	
	exports.default = Canvas;

/***/ },

/***/ 513:
/*!***********************************!*\
  !*** ./src/Component/Keyboard.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _index = __webpack_require__(/*! ./index */ 508);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Keyboard = function (_Component) {
	    _inherits(Keyboard, _Component);
	
	    /* LIFECYCLE */
	
	    /**
	     * @constructor
	     * @param {*} props: properties
	     */
	    function Keyboard(props) {
	        _classCallCheck(this, Keyboard);
	
	        /**
	         * Public input attributes
	         * @type {{}}
	         */
	        var _this = _possibleConstructorReturn(this, (Keyboard.__proto__ || Object.getPrototypeOf(Keyboard)).call(this, props));
	
	        _this.input = {};
	
	        /**
	         * Private input attributes, do not use it
	         * @type {{}}
	         * @private
	         */
	        _this._input = {};
	        return _this;
	    }
	
	    /**
	     * @override
	     */
	
	
	    _createClass(Keyboard, [{
	        key: "initialize",
	        value: function initialize(parent) {
	            _get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), "initialize", this).call(this, parent);
	
	            window.addEventListener("keydown", this.onKeydown.bind(this));
	            window.addEventListener("keyup", this.onKeyup.bind(this));
	        }
	
	        /**
	         * @override
	         */
	
	    }, {
	        key: "update",
	        value: function update() {
	            _get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), "update", this).call(this);
	
	            for (var key in this._input) {
	                if (!this._input.hasOwnProperty(key)) {
	                    continue;
	                }
	
	                var input = this.input[key],
	                    _input = this._input[key];
	
	                // Pressed
	                if (_input === this.STATE.PRESSED) {
	                    if (input === _input) {
	                        this.input[key] = this.STATE.HOLD;
	                    } else if (input !== this.STATE.HOLD) {
	                        this.input[key] = this.STATE.PRESSED;
	                    }
	
	                    // Released
	                } else if (_input === this.STATE.RELEASED) {
	                    if (!input) {
	                        this.input[key] = this.STATE.PRESSED;
	                    } else if (input === _input) {
	                        delete this.input[key];
	                        delete this._input[key];
	                    } else {
	                        this.input[key] = this.STATE.RELEASED;
	                    }
	                }
	            }
	        }
	
	        /* METHODS */
	
	        /**
	         * event on keydown
	         * @event keydown
	         * @param {*} e: event
	         * @returns {void}
	         */
	
	    }, {
	        key: "onKeydown",
	        value: function onKeydown(e) {
	            this._input[e.keyCode] = this.STATE.PRESSED;
	        }
	
	        /**
	         * event on keyup
	         * @event keyup
	         * @param {*} e: event
	         * @returns {void}
	         */
	
	    }, {
	        key: "onKeyup",
	        value: function onKeyup(e) {
	            this._input[e.keyCode] = this.STATE.RELEASED;
	        }
	
	        /**
	         * Get current state of a key
	         * @param {string} key: keyboard key
	         * @param {string} state: state of input
	         * @param {*} optionalState: other state
	         * @returns {boolean} the state is corresponding to state param
	         */
	
	    }, {
	        key: "getKeyState",
	        value: function getKeyState(key, state) {
	            var optionalState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	
	            var input = this.input[typeof key === "string" ? this.KEY[key] : key];
	
	            if (input && optionalState) {
	                return input === this.STATE[state] || input === this.STATE[optionalState];
	            }
	
	            return input ? input === this.STATE[state] : false;
	        }
	
	        /**
	         * Know if a key is pressed
	         * @param {string} key: keyboard key
	         * @returns {boolean} the key is pressed
	         */
	
	    }, {
	        key: "isPressed",
	        value: function isPressed(key) {
	            return this.getKeyState(key, "PRESSED");
	        }
	
	        /**
	         * Know if a key is held
	         * @param {string} key: keyboard key
	         * @returns {boolean} the key is held
	         */
	
	    }, {
	        key: "isHeld",
	        value: function isHeld(key) {
	            return this.getKeyState(key, "PRESSED", "HOLD");
	        }
	
	        /**
	         * Know if a key is released
	         * @param {string} key: keyboard key
	         * @returns {boolean} the key is released
	         */
	
	    }, {
	        key: "isReleased",
	        value: function isReleased(key) {
	            return this.getKeyState(key, "RELEASED");
	        }
	
	        /* GETTERS & SETTERS */
	
	    }, {
	        key: "name",
	        get: function get() {
	            return "keyboard";
	        }
	
	        /**
	         * List of all key usable
	         * @type {*}
	         */
	
	    }, {
	        key: "KEY",
	        get: function get() {
	            return {
	                "BACKSPACE": 8,
	                "TAB": 9,
	                "ENTER": 13,
	                "PAUSE": 19,
	                "CAPS": 20,
	                "ESC": 27,
	                "SPACE": 32,
	                "PAGE_UP": 33,
	                "PAGE_DOWN": 34,
	                "END": 35,
	                "HOME": 36,
	                "ARROW_LEFT": 37,
	                "ARROW_UP": 38,
	                "ARROW_RIGHT": 39,
	                "ARROW_DOWN": 40,
	                "INSERT": 45,
	                "DELETE": 46,
	                "NUM_0": 48,
	                "NUM_1": 49,
	                "NUM_2": 50,
	                "NUM_3": 51,
	                "NUM_4": 52,
	                "NUM_5": 53,
	                "NUM_6": 54,
	                "NUM_7": 55,
	                "NUM_8": 56,
	                "NUM_9": 57,
	                "A": 65,
	                "B": 66,
	                "C": 67,
	                "D": 68,
	                "E": 69,
	                "F": 70,
	                "G": 71,
	                "H": 72,
	                "I": 73,
	                "J": 74,
	                "K": 75,
	                "L": 76,
	                "M": 77,
	                "N": 78,
	                "O": 79,
	                "P": 80,
	                "Q": 81,
	                "R": 82,
	                "S": 83,
	                "T": 84,
	                "U": 85,
	                "V": 86,
	                "W": 87,
	                "X": 88,
	                "Y": 89,
	                "Z": 90,
	                "NUMPAD_0": 96,
	                "NUMPAD_1": 97,
	                "NUMPAD_2": 98,
	                "NUMPAD_3": 99,
	                "NUMPAD_4": 100,
	                "NUMPAD_5": 101,
	                "NUMPAD_6": 102,
	                "NUMPAD_7": 103,
	                "NUMPAD_8": 104,
	                "NUMPAD_9": 105,
	                "MULTIPLY": 106,
	                "ADD": 107,
	                "SUBSTRACT": 109,
	                "DECIMAL": 110,
	                "DIVIDE": 111,
	                "F1": 112,
	                "F2": 113,
	                "F3": 114,
	                "F4": 115,
	                "F5": 116,
	                "F6": 117,
	                "F7": 118,
	                "F8": 119,
	                "F9": 120,
	                "F10": 121,
	                "F11": 122,
	                "F12": 123,
	                "SHIFT": 16,
	                "CTRL": 17,
	                "ALT": 18,
	                "PLUS": 187,
	                "COMMA": 188,
	                "MINUS": 189,
	                "PERIOD": 190
	            };
	        }
	
	        /**
	         * List of key state
	         * @type {{}}
	         */
	
	    }, {
	        key: "STATE",
	        get: function get() {
	            return {
	                PRESSED: "pressed",
	                RELEASED: "released",
	                HOLD: "hold"
	            };
	        }
	    }]);
	
	    return Keyboard;
	}(_index2.default);
	
	exports.default = Keyboard;

/***/ },

/***/ 514:
/*!********************************************************************!*\
  !*** ./public/projects/escapethefate/src/entities/EntityPlayer.js ***!
  \********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _Entity2 = __webpack_require__(/*! src/Entity */ 511);
	
	var _Entity3 = _interopRequireDefault(_Entity2);
	
	var _Engine = __webpack_require__(/*! src/Engine */ 507);
	
	var _Engine2 = _interopRequireDefault(_Engine);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var EntityPlayer = function (_Entity) {
	    _inherits(EntityPlayer, _Entity);
	
	    /* LIFECYCLE */
	
	    function EntityPlayer(props) {
	        _classCallCheck(this, EntityPlayer);
	
	        var _this = _possibleConstructorReturn(this, (EntityPlayer.__proto__ || Object.getPrototypeOf(EntityPlayer)).call(this, props));
	
	        _this.setProps({
	            width: 20,
	            height: 20,
	            debug: true
	        });
	        return _this;
	    }
	
	    _createClass(EntityPlayer, [{
	        key: "update",
	        value: function update() {
	            _get(EntityPlayer.prototype.__proto__ || Object.getPrototypeOf(EntityPlayer.prototype), "update", this).call(this);
	
	            if (_Engine2.default.keyboard.isHeld(_Engine2.default.keyboard.KEY.ARROW_RIGHT)) {
	                this.x += 10;
	            } else if (_Engine2.default.keyboard.isHeld(_Engine2.default.keyboard.KEY.ARROW_LEFT)) {
	                this.x -= 10;
	            } else if (_Engine2.default.keyboard.isHeld(_Engine2.default.keyboard.KEY.ARROW_UP)) {
	                this.y -= 10;
	            } else if (_Engine2.default.keyboard.isHeld(_Engine2.default.keyboard.KEY.ARROW_DOWN)) {
	                this.y += 10;
	            }
	        }
	    }]);
	
	    return EntityPlayer;
	}(_Entity3.default);
	
	exports.default = EntityPlayer;

/***/ },

/***/ 515:
/*!****************************************************************!*\
  !*** ./public/projects/escapethefate/src/scenes/SceneWorld.js ***!
  \****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _Scene2 = __webpack_require__(/*! src/Scene */ 509);
	
	var _Scene3 = _interopRequireDefault(_Scene2);
	
	var _EntityPlayer = __webpack_require__(/*! ./../entities/EntityPlayer */ 514);
	
	var _EntityPlayer2 = _interopRequireDefault(_EntityPlayer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SceneWorld = function (_Scene) {
	    _inherits(SceneWorld, _Scene);
	
	    function SceneWorld() {
	        _classCallCheck(this, SceneWorld);
	
	        return _possibleConstructorReturn(this, (SceneWorld.__proto__ || Object.getPrototypeOf(SceneWorld)).apply(this, arguments));
	    }
	
	    _createClass(SceneWorld, [{
	        key: "initialize",
	
	
	        /* LIFECYCLE */
	
	        value: function initialize(parent) {
	            _get(SceneWorld.prototype.__proto__ || Object.getPrototypeOf(SceneWorld.prototype), "initialize", this).call(this, parent);
	
	            this.canvas.clearColor = "whitesmoke";
	            this.player = new _EntityPlayer2.default({ x: 10, y: 10 });
	
	            this.compose(this.player);
	        }
	    }]);
	
	    return SceneWorld;
	}(_Scene3.default);
	
	exports.default = SceneWorld;

/***/ }

/******/ });
//# sourceMappingURL=sideral.js.map