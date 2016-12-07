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
	
	var _Scene = __webpack_require__(/*! src/Scene */ 511);
	
	var _Scene2 = _interopRequireDefault(_Scene);
	
	var _Keyboard = __webpack_require__(/*! src/Component/Keyboard */ 514);
	
	var _Keyboard2 = _interopRequireDefault(_Keyboard);
	
	var _EntityPlayer = __webpack_require__(/*! ./entities/EntityPlayer */ 515);
	
	var _EntityPlayer2 = _interopRequireDefault(_EntityPlayer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	import Engine from "src/Engine";
	import Keyboard from "src/Component/Keyboard";
	
	import SceneWorld from "./scenes/SceneWorld";
	
	
	// Define the size of the engine
	Engine.width(500);
	Engine.height(200);
	
	// Let's start the engine
	Engine.compose(new Keyboard())
	    .attachScene(new SceneWorld());
	
	// Render the engine into a dom
	Engine.attachDOM(document.getElementById("sideral-app"));
	
	// Start the loop
	Engine.run();
	*/
	
	var scene = new _Scene2.default(),
	    entity = (0, _EntityPlayer2.default)({ x: 10, y: 10 });
	
	_Engine2.default.width = 500;
	_Engine2.default.height = 200;
	
	_Engine2.default.compose(new _Keyboard2.default()).attachScene(scene);
	
	_Engine2.default.attachDOM(document.getElementById("sideral-app"));
	
	_Engine2.default.run();
	
	scene.attachEntity(entity);
	
	window.setTimeout(function () {
	    entity.x = 20;
	}, 2000);

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
	
	var _Element2 = __webpack_require__(/*! ./Element */ 508);
	
	var _Element3 = _interopRequireDefault(_Element2);
	
	var _Scene = __webpack_require__(/*! ./Scene */ 511);
	
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
	    width: 50,
	    height: 50
	});

/***/ },

/***/ 508:
/*!************************!*\
  !*** ./src/Element.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _Class2 = __webpack_require__(/*! ./Class */ 509);
	
	var _Class3 = _interopRequireDefault(_Class2);
	
	var _Component = __webpack_require__(/*! ./Component */ 510);
	
	var _Component2 = _interopRequireDefault(_Component);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Element = function (_Class) {
	    _inherits(Element, _Class);
	
	    /* LIFECYCLE */
	
	    /**
	     * @constructor
	     * @param {{ name: string, components: [], props: {} }} options: options for the element
	     */
	    function Element() {
	        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	        _classCallCheck(this, Element);
	
	        /**
	         * Name of the component
	         * @readonly
	         * @type {string}
	         */
	        var _this = _possibleConstructorReturn(this, (Element.__proto__ || Object.getPrototypeOf(Element)).call(this, options));
	
	        _this.name = "element";
	
	        /**
	         * Lifecycle functions enhancement
	         * @type {{}}
	         */
	        _this.lifecycle = options;
	
	        /**
	         * Know if the element is destroyed and it is not usable
	         * @readonly
	         * @type {boolean}
	         */
	        _this.destroyed = false;
	
	        // Include all components
	        if (options.components && options.components.length) {
	            options.components.forEach(function (component) {
	                return _this.compose(component);
	            });
	        }
	
	        delete _this.lifecycle.name;
	        delete _this.lifecycle.props;
	        delete _this.lifecycle.components;
	        return _this;
	    }
	
	    /**
	     * Called when attached to a parent
	     * @initialize
	     * @returns {void}
	     */
	
	
	    _createClass(Element, [{
	        key: "initialize",
	        value: function initialize() {
	            if (this.lifecycle.initialize) {
	                this.lifecycle.initialize.bind(this)();
	            }
	        }
	
	        /**
	         * Remove the element
	         * @destroy
	         * @returns {void}
	         */
	
	    }, {
	        key: "destroy",
	        value: function destroy() {
	            var _this2 = this;
	
	            this.destroyed = true;
	            this.components.map(function (name) {
	                return _this2.decompose(name);
	            });
	
	            if (this.lifecycle.destroy) {
	                this.lifecycle.destroy.bind(this)();
	            }
	        }
	
	        /**
	         * Actions before update
	         * @beforeUpdate
	         * @returns {void}
	         */
	
	    }, {
	        key: "beforeUpdate",
	        value: function beforeUpdate() {
	            if (this.lifecycle.beforeUpdate) {
	                this.lifecycle.beforeUpdate.bind(this)();
	            }
	        }
	
	        /**
	         * Update the element and these components
	         * @update
	         * @returns {void}
	         */
	
	    }, {
	        key: "update",
	        value: function update() {
	            this.beforeUpdate();
	            _get(Element.prototype.__proto__ || Object.getPrototypeOf(Element.prototype), "update", this).call(this);
	            this.callComponentFunction("update");
	
	            if (this.lifecycle.update) {
	                this.lifecycle.update.bind(this)();
	            }
	        }
	
	        /**
	         * Event fire when properties has changed
	         * @param {*} changedProps: properties that has changed
	         * @returns {void}
	         */
	
	    }, {
	        key: "onPropsChanged",
	        value: function onPropsChanged(changedProps) {
	            if (this.lifecycle.onPropsChanged) {
	                this.lifecycle.onPropsChanged.bind(this)(changedProps);
	            }
	        }
	
	        /**
	         * Called only when requestRender is true
	         * @render
	         * @param {*} context: canvas context
	         * @returns {void}
	         */
	
	    }, {
	        key: "render",
	        value: function render(context) {
	            this.callComponentFunction("render", context);
	
	            if (this.lifecycle.render) {
	                this.lifecycle.render.bind(this)(context);
	            }
	        }
	
	        /**
	         * Called after every cycle
	         * @nextCycle
	         * @returns {void}
	         */
	
	    }, {
	        key: "nextCycle",
	        value: function nextCycle() {
	            for (var key in this.previousProps) {
	                if (this.previousProps.hasOwnProperty(key)) {
	                    this.previousProps[key] = this[key];
	                }
	            }
	
	            this.requestRender = false;
	        }
	
	        /**
	         * Reset an element
	         * @returns {void}
	         */
	
	    }, {
	        key: "reset",
	        value: function reset() {
	            this.destroyed = false;
	        }
	
	        /* COMPONENTS */
	
	        /**
	         * Add a component into this element
	         * @param {Component} component: The component to be added
	         * @returns {Element} current element
	         */
	
	    }, {
	        key: "compose",
	        value: function compose(component) {
	            if (!(component instanceof _Component2.default)) {
	                throw new Error("Element.compose : the component is not an instance of Component.");
	            }
	
	            component.composedBy = this;
	            this[component.name] = component;
	            this.components.push(component.name);
	            component.initialize();
	
	            return this;
	        }
	
	        /**
	         * Remove a component from the element
	         * @param {string} componentName: The name of the component
	         * @returns {Element} current element
	         */
	
	    }, {
	        key: "decompose",
	        value: function decompose(componentName) {
	            var _this3 = this;
	
	            this.components.map(function (name, index) {
	                if (name === componentName) {
	                    _this3[name].pluggedFunctions.map(function (pluggedFunction) {
	                        if (_this3.componentFunctions[pluggedFunction]) {
	                            _this3.componentFunctions[pluggedFunction] = _this3.componentFunctions[pluggedFunction].filter(function (compName) {
	                                return compName !== name;
	                            });
	                        }
	
	                        return null;
	                    });
	
	                    _this3.components.splice(index, 1);
	                }
	
	                return null;
	            });
	
	            return this;
	        }
	
	        /**
	         * Return true if the element has the component by its name
	         * @param {string} componentName: The name of the component
	         * @param {function=} callback: function to be executed if element is composed of the component
	         * @returns {boolean|function} the element is composed of the component
	         */
	
	    }, {
	        key: "isComposedOf",
	        value: function isComposedOf(componentName, callback) {
	            var exist = Boolean(this.components.find(function (component) {
	                return component === componentName;
	            }));
	
	            return callback && exist ? callback() : exist;
	        }
	
	        /**
	         * Add a new component function to be executed before the parent function
	         * @param {string} componentName: the name of the component
	         * @param {string} functionName: the name of the function
	         * @returns {void|null} nothing
	         */
	
	    }, {
	        key: "addComponentFunction",
	        value: function addComponentFunction(componentName, functionName) {
	            if (!this.isComposedOf(componentName) || !this[functionName]) {
	                return null;
	            }
	
	            if (!this.componentFunctions[functionName]) {
	                this.componentFunctions[functionName] = [];
	            }
	
	            this.componentFunctions[functionName].push(componentName);
	        }
	
	        /**
	         * Call functions of components by name of the function
	         * @param {...*} functionName: the name of the function and other arguments to be transmitted into components
	         * @returns {void}
	         */
	
	    }, {
	        key: "callComponentFunction",
	        value: function callComponentFunction(functionName) {
	            var _this4 = this,
	                _arguments = arguments;
	
	            if (this.componentFunctions[functionName]) {
	                this.componentFunctions[functionName].map(function (name) {
	                    var _name;
	
	                    return (_name = _this4[name])[functionName].apply(_name, _toConsumableArray(Array.prototype.slice.call(_arguments, 1)));
	                });
	            }
	        }
	    }]);
	
	    return Element;
	}(_Class3.default);
	
	exports.default = Element;

/***/ },

/***/ 509:
/*!**********************!*\
  !*** ./src/Class.js ***!
  \**********************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Class = function () {
	
	    /* LIFECYCLE */
	
	    /**
	     * @constructor
	     * @param {{ name: string, components: [], props: {} }} options: options for the element
	     */
	    function Class() {
	        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	        _classCallCheck(this, Class);
	
	        /**
	         * Unique id of element
	         * @type {string}
	         */
	        this.id = Class.generateId();
	
	        /**
	         * Name of the class to be recognized
	         * @type {string}
	         */
	        this.name = "class";
	
	        /**
	         * Props before update
	         * @type {{}} properties
	         */
	        this.previousProps = Object.assign({}, options.props);
	
	        // Add default props
	        this.props(this.previousProps);
	    }
	
	    /**
	     * Initialization of the element after it is created into the engine
	     * @initialize
	     * @returns {void}
	     */
	
	
	    _createClass(Class, [{
	        key: "initialize",
	        value: function initialize() {}
	
	        /**
	         * Update lifecycle
	         * @update
	         * @returns {void}
	         */
	
	    }, {
	        key: "update",
	        value: function update() {
	            var changedProps = {};
	
	            for (var key in this.previousProps) {
	                if (this.previousProps.hasOwnProperty(key) && this[key] !== this[key]) {
	                    changedProps[key] = this[key];
	                    this.requestRender = true;
	                }
	            }
	
	            if (this.requestRender) {
	                this.onPropsChanged(changedProps);
	            }
	        }
	
	        /*eslint-disable*/
	        /**
	         * called when props has changed
	         * @param {*} changedProps: changed properties
	         * @return {void}
	         */
	
	    }, {
	        key: "onPropsChanged",
	        value: function onPropsChanged(changedProps) {}
	        /*eslint-enable*/
	
	        /* METHODS */
	
	        /**
	         * Set attributes to current instance
	         * @param {*} props: properties to merge
	         * @returns {*} SideralClass: current instance
	         */
	
	    }, {
	        key: "props",
	        value: function props() {
	            var _props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	            for (var key in _props) {
	                if (_props.hasOwnProperty(key)) {
	                    this[key] = _props[key];
	                }
	            }
	
	            return this;
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
	
	    return Class;
	}();
	
	exports.default = Class;

/***/ },

/***/ 510:
/*!********************************!*\
  !*** ./src/Component/index.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Class2 = __webpack_require__(/*! ./../Class */ 509);
	
	var _Class3 = _interopRequireDefault(_Class2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Component = function (_Class) {
	    _inherits(Component, _Class);
	
	    /* LIFECYCLE */
	
	    /**
	     * @constructor
	     */
	    function Component() {
	        _classCallCheck(this, Component);
	
	        /**
	         * Name of the component
	         * @readonly
	         * @type {string}
	         */
	        var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this));
	
	        _this.name = "component";
	
	        /**
	         * Element which using this component
	         * @type {Element}
	         */
	        _this.composedBy = null;
	
	        /**
	         * List of all functions plugged to the parent
	         * @type {Array}
	         */
	        _this.pluggedFunctions = [];
	        return _this;
	    }
	
	    /**
	     * Initialization of the component after it is composed
	     * @returns {void}
	     */
	
	
	    _createClass(Component, [{
	        key: "initialize",
	        value: function initialize() {
	            var _this2 = this;
	
	            if (!this.composedBy) {
	                throw new Error("Component.initialize : A Component must be composed by an element before calling Initiliaze.");
	            }
	
	            var functions = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(function (prop) {
	                return prop !== "constructor" && prop !== "initialize";
	            });
	
	            this.pluggedFunctions = [];
	
	            functions.map(function (key) {
	                if (_this2.composedBy[key]) {
	                    _this2.composedBy.addComponentFunction(_this2.name, key);
	                    _this2.pluggedFunctions.push(key);
	                }
	
	                return null;
	            });
	        }
	    }]);
	
	    return Component;
	}(_Class3.default);
	
	exports.default = Component;

/***/ },

/***/ 511:
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
	
	var _Element2 = __webpack_require__(/*! ../Element */ 508);
	
	var _Element3 = _interopRequireDefault(_Element2);
	
	var _Entity = __webpack_require__(/*! ../Entity */ 512);
	
	var _Entity2 = _interopRequireDefault(_Entity);
	
	var _Canvas = __webpack_require__(/*! ../Component/Canvas */ 513);
	
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
	     * @param {*} options: options
	     */
	    function Scene() {
	        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	        _classCallCheck(this, Scene);
	
	        /**
	         * Name of the element
	         * @readonly
	         * @type {string}
	         */
	        var _this = _possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).call(this, options));
	
	        _this.name = "scene";
	
	        /**
	         * List of entities
	         * @type {Array<Entity>}
	         */
	        _this.entities = [];
	
	        /**
	         * Gravity of the scene
	         * @type {number}
	         */
	        _this.gravity = options.gravity || 0;
	
	        /**
	         * Scale of all entities behind this scene
	         * @type {number}
	         */
	        _this.scale = options.scale || 1;
	
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
	         * @onPropsChanged
	         * @param {*} changedProps: changed properties
	         * @returns {void}
	         */
	
	    }, {
	        key: "onPropsChanged",
	        value: function onPropsChanged(changedProps) {
	            _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "onPropsChanged", this).call(this, changedProps);
	
	            if (this.isComposedOf("canvas")) {
	                if (changedProps.width) {
	                    this.canvas.width = changedProps.width;
	                }
	
	                if (changedProps.height) {
	                    this.canvas.height = changedProps.height;
	                }
	            }
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
	
	            this.entities.filter(function (x) {
	                return x.requestRender;
	            }).map(function (entity) {
	                return entity.render(context);
	            });
	        }
	
	        /**
	         * @nextCycle
	         * @returns {void}
	         */
	
	    }, {
	        key: "nextCycle",
	        value: function nextCycle() {
	            _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "nextCycle", this).call(this);
	
	            this.entities.forEach(function (entity) {
	                return entity.nextCycle();
	            });
	        }
	
	        /* METHODS */
	
	        /**
	         * Attach an entity to the scene
	         * @param {Entity} entity: entity to attach
	         * @returns {Scene} current instance
	         */
	
	    }, {
	        key: "attachEntity",
	        value: function attachEntity(entity) {
	            if (!entity || entity && !(entity instanceof _Entity2.default)) {
	                throw new Error("Scene.attachEntity : entity must be an instance of Entity");
	            }
	
	            this.entities.push(entity);
	            entity.scene = this;
	            entity.initialize();
	
	            return this;
	        }
	
	        /* GETTERS & SETTERS */
	
	        /**
	         * Get or set the width
	         * @param {number=} width: if exist, width will be setted
	         * @returns {number} the current width
	         */
	
	    }, {
	        key: "width",
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
	    }]);
	
	    return Scene;
	}(_Element3.default);
	
	exports.default = Scene;

/***/ },

/***/ 512:
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
	
	var _Element2 = __webpack_require__(/*! ./../Element */ 508);
	
	var _Element3 = _interopRequireDefault(_Element2);
	
	var _Engine = __webpack_require__(/*! ./../Engine */ 507);
	
	var _Engine2 = _interopRequireDefault(_Engine);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Entity = function (_Element) {
	  _inherits(Entity, _Element);
	
	  /* LIFECYCLE */
	
	  /**
	   * @constructor
	   * @param {*} options: options
	   */
	  function Entity(options) {
	    _classCallCheck(this, Entity);
	
	    /**
	     * Name of the element
	     * @readonly
	     * @type {string}
	     */
	    var _this = _possibleConstructorReturn(this, (Entity.__proto__ || Object.getPrototypeOf(Entity)).call(this, options));
	
	    _this.name = "entity";
	
	    /**
	     * Show more information about entity on screen
	     * @type {boolean}
	     */
	    _this.debug = options.debug;
	
	    /**
	     * Position on x axis
	     * @type {number}
	     */
	    _this.x = options.x || 0;
	
	    /**
	     * Position on y axis
	     * @type {number}
	     */
	    _this.y = options.y || 0;
	
	    /**
	     * Width of entity
	     * @type {number}
	     */
	    _this.width = options.width || 10;
	
	    /**
	     * Height of entity
	     * @type {number}
	     */
	    _this.height = options.height || 10;
	
	    /**
	     * Mass of the entity (used for collision)
	     * @type {string}
	     */
	    _this.mass = options.mass || Entity.MASS.NONE;
	
	    /**
	     * Direction movement of the entity
	     * @type {{x: number, y: number}}
	     */
	    _this.direction = options.direction || { x: 0, y: 0 };
	
	    /**
	     * Speed movement of the entity
	     * @type {{x: number, y: number}}
	     */
	    _this.speed = options.speed || { x: 100, y: 100 };
	
	    /**
	     * Velocity of the entity
	     * @type {{x: number, y: number}}
	     * @readonly
	     */
	    _this.velocity = options.velocity || { x: 0, y: 0 };
	
	    /**
	     * Factor of scene gravity
	     * @type {number}
	     */
	    _this.gravityFactor = options.gravityFactor || 1;
	
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
	   * @beforeUpdate
	   * @returns {void}
	   */
	
	
	  _createClass(Entity, [{
	    key: "beforeUpdate",
	    value: function beforeUpdate() {
	      _get(Entity.prototype.__proto__ || Object.getPrototypeOf(Entity.prototype), "beforeUpdate", this).call(this);
	
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
	
	    /**
	     * Render
	     * @param {*} context: canvas context
	     * @returns {void}
	     */
	
	  }, {
	    key: "render",
	    value: function render(context) {
	      _get(Entity.prototype.__proto__ || Object.getPrototypeOf(Entity.prototype), "render", this).call(this, context);
	
	      if (this.debug) {
	        context.strokeStyle = "rgb(255, 0, 0)";
	        context.strokeRect(this.x - this.scene.camera.x, this.y - this.scene.camera.y, this.width, this.height);
	      }
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
	  }]);
	
	  return Entity;
	}(_Element3.default);
	
	exports.default = Entity;
	
	
	Entity.MASS = {
	  SOLID: "solid",
	  WEAK: "weak",
	  NONE: "none"
	};

/***/ },

/***/ 513:
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
	
	var _index = __webpack_require__(/*! ./index */ 510);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Canvas = function (_Component) {
	  _inherits(Canvas, _Component);
	
	  /* LIFECYCLE */
	  /**
	   * Canvas constructor
	   * @constructor
	   * @param {*} options: options
	   */
	  function Canvas() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	    _classCallCheck(this, Canvas);
	
	    /**
	     * Name of the element
	     * @readonly
	     * @type {string}
	     */
	    var _this = _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this, options));
	
	    _this.name = "canvas";
	
	    /**
	     * DOM parent of the canvas
	     */
	    _this.parentDOM = options.parentDOM;
	
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
	
	    /**
	     * Width of the canvas
	     * @type {number}
	     */
	    _this.width = options.width;
	
	    /**
	     * Height of the canvas
	     * @type {number}
	     */
	    _this.height = options.height;
	    return _this;
	  }
	
	  /**
	   * @initialize
	   * @returns {void}
	   */
	
	
	  _createClass(Canvas, [{
	    key: "initialize",
	    value: function initialize() {
	      _get(Canvas.prototype.__proto__ || Object.getPrototypeOf(Canvas.prototype), "initialize", this).call(this);
	
	      this.dom = document.createElement("canvas");
	      this.dom.id = this.id;
	      this.dom.width = this.width;
	      this.dom.height = this.height;
	      this.context = this.dom.getContext("2d");
	
	      this.setParentDOM();
	    }
	
	    /**
	     * @onPropsChanged
	     * @param {*} changedProps: changed properties
	     * @returns {void}
	     */
	
	  }, {
	    key: "onPropsChanged",
	    value: function onPropsChanged(changedProps) {
	      _get(Canvas.prototype.__proto__ || Object.getPrototypeOf(Canvas.prototype), "onPropsChanged", this).call(this, changedProps);
	
	      if (this.dom) {
	        if (changedProps.width) {
	          this.dom.width = changedProps.width;
	        }
	
	        if (changedProps.height) {
	          this.dom.height = changedProps.height;
	        }
	      }
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
	  }]);
	
	  return Canvas;
	}(_index2.default);
	
	exports.default = Canvas;

/***/ },

/***/ 514:
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
	
	var _index = __webpack_require__(/*! ./index */ 510);
	
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
	     * @param {*} options: options
	     */
	    function Keyboard(options) {
	        _classCallCheck(this, Keyboard);
	
	        /**
	         * The name of the component
	         * @readonly
	         * @type {string}
	         */
	        var _this = _possibleConstructorReturn(this, (Keyboard.__proto__ || Object.getPrototypeOf(Keyboard)).call(this, options));
	
	        _this.name = "keyboard";
	
	        /**
	         * Public input attributes
	         * @type {{}}
	         */
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
	     * @initialize
	     * @returns {void}
	     */
	
	
	    _createClass(Keyboard, [{
	        key: "initialize",
	        value: function initialize() {
	            _get(Keyboard.prototype.__proto__ || Object.getPrototypeOf(Keyboard.prototype), "initialize", this).call(this);
	
	            window.addEventListener("keydown", this.onKeydown.bind(this));
	            window.addEventListener("keyup", this.onKeyup.bind(this));
	        }
	
	        /**
	         * @update
	         * @returns {void}
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

/***/ 515:
/*!********************************************************************!*\
  !*** ./public/projects/escapethefate/src/entities/EntityPlayer.js ***!
  \********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Entity = __webpack_require__(/*! src/Entity */ 512);
	
	var _Entity2 = _interopRequireDefault(_Entity);
	
	var _Engine = __webpack_require__(/*! src/Engine */ 507);
	
	var _Engine2 = _interopRequireDefault(_Engine);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    return new _Entity2.default({
	        components: [],
	
	        props: Object.assign({
	            width: 20,
	            height: 20,
	            debug: true
	        }, props),
	
	        beforeUpdate: function beforeUpdate() {
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
	    });
	};

/***/ }

/******/ });
//# sourceMappingURL=sideral.js.map