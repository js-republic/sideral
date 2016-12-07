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
/*!*****************************************************!*\
  !*** ./public/projects/theblackknight/src/index.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Engine = __webpack_require__(/*! src/Engine */ 507);
	
	var _Engine2 = _interopRequireDefault(_Engine);
	
	var _Scene = __webpack_require__(/*! src/Scene */ 511);
	
	var _Scene2 = _interopRequireDefault(_Scene);
	
	var _Entity = __webpack_require__(/*! src/Entity */ 512);
	
	var _Entity2 = _interopRequireDefault(_Entity);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Define the size of the engine
	_Engine2.default.width(500);
	_Engine2.default.height(200);
	
	// Render the engine into a dom
	_Engine2.default.attachDOM(document.getElementById("sideral-app"));
	
	// Start the loop
	_Engine2.default.run();
	
	// Custom code
	var scene = new _Scene2.default(),
	    entity = new _Entity2.default();
	
	entity.debug = true;
	
	scene.attachEntity(entity, 10, 10);
	_Engine2.default.attachScene(scene);
	
	scene.canvas.clearColor = "whitesmoke";

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
	     */
	    function Element() {
	        _classCallCheck(this, Element);
	
	        /**
	         * List of components added to this element by their names
	         * @type {Array<string>}
	         */
	        var _this = _possibleConstructorReturn(this, (Element.__proto__ || Object.getPrototypeOf(Element)).call(this));
	
	        _this.components = [];
	
	        /**
	         * List of all component functions to be called
	         * @type {Array<Array<string>>}
	         */
	        _this.componentFunctions = {};
	
	        /**
	         * Know if this component is detroyed or not
	         * @type {boolean}
	         * @private
	         */
	        _this.destroyed = false;
	
	        /**
	         * Size of the element
	         * @type {{width: number, height: number}}
	         * @readonly
	         */
	        _this.size = { width: 0, height: 0 };
	        return _this;
	    }
	
	    /**
	     * Update the element
	     * @returns {void}
	     */
	
	
	    _createClass(Element, [{
	        key: "update",
	        value: function update() {
	            this.callComponentFunction("update");
	        }
	
	        /**
	         * Render the element
	         * @param {*} context: context to render the element
	         * @returns {void}
	         */
	
	    }, {
	        key: "render",
	        value: function render(context) {
	            this.callComponentFunction("render", context);
	        }
	
	        /* METHODS */
	
	        /**
	         * Destroy the element
	         * @returns {void}
	         */
	
	    }, {
	        key: "destroy",
	        value: function destroy() {
	            var _this2 = this;
	
	            this.components.map(function (name) {
	                return _this2.decompose(name);
	            });
	            this.destroyed = true;
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
	
	        /* GETTERS & SETTERS */
	
	        /**
	         * Name of the element
	         * @returns {string} the name
	         */
	
	    }, {
	        key: "width",
	
	
	        /**
	         * Get or set a width
	         * @param {number=} width: if exist, width will be setted
	         * @returns {number} the current width
	         */
	        value: function width(_width) {
	            if (typeof _width !== "undefined") {
	                this.size.width = _width;
	            }
	
	            return this.size.width;
	        }
	
	        /**
	         * Get or set a height
	         * @param {number=} height: if exist, height will be setted
	         * @returns {number} the current height
	         */
	
	    }, {
	        key: "height",
	        value: function height(_height) {
	            if (typeof _height !== "undefined") {
	                this.size.height = _height;
	            }
	
	            return this.size.height;
	        }
	    }, {
	        key: "name",
	        get: function get() {
	            return "element";
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
	     */
	    function Class() {
	        _classCallCheck(this, Class);
	
	        /**
	         * Unique id of element
	         * @type {string}
	         */
	        this.id = Class.generateId();
	    }
	
	    /**
	     * Set attributes to current instance
	     * @param {*} props: properties to merge
	     * @returns {*} SideralClass: current instance
	     */
	
	
	    _createClass(Class, [{
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
	
	        /**
	         * Initialization of the element after it is created into the engine
	         * @returns {void}
	         */
	
	    }, {
	        key: "initialize",
	        value: function initialize() {}
	
	        /* METHODS */
	
	        /* GETTERS & SETTERS */
	
	        /**
	         * String identifier
	         * @returns {string} the name of the class
	         */
	
	    }, {
	        key: "name",
	        get: function get() {
	            return "Class";
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
	         * Element which using this component
	         * @type {Element}
	         */
	        var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this));
	
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
	
	        /* METHODS */
	
	        /* GETTERS & SETTERS */
	
	        /**
	         * Name of the component
	         * @returns {string} the name
	         */
	
	    }, {
	        key: "name",
	        get: function get() {
	            return "component";
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
	                var entityPooling = this.entities.find(function (poolX) {
	                    return poolX.pooling && poolX.destroyed;
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
	     */
	    function Entity() {
	        _classCallCheck(this, Entity);
	
	        /**
	         * Show more information about entity on screen
	         * @type {boolean}
	         */
	        var _this = _possibleConstructorReturn(this, (Entity.__proto__ || Object.getPrototypeOf(Entity)).call(this));
	
	        _this.debug = false;
	
	        /**
	         * Reference to the current scene
	         * @type {*}
	         */
	        _this.scene = null;
	
	        /**
	         * Position of entity
	         * @type {{x: number, y: number}}
	         * @readonly
	         */
	        _this.position = { x: 0, y: 0 };
	
	        /**
	         * Last position of entity
	         * @type {{x: number, y: number}}
	         * @readonly
	         */
	        _this.lastPosition = { x: 0, y: 0 };
	
	        /**
	         * If true, the position of this entity will be compared to the camera position
	         * @type {boolean}
	         */
	        _this.relativePosition = false;
	
	        /**
	         * Mass of the entity (used for collision)
	         * @type {string}
	         */
	        _this.mass = Entity.MASS.NONE;
	
	        /**
	         * Direction movement of the entity
	         * @type {{x: number, y: number}}
	         */
	        _this.direction = { x: 0, y: 0 };
	
	        /**
	         * Speed movement of the entity
	         * @type {{x: number, y: number}}
	         */
	        _this.speed = { x: 100, y: 100 };
	
	        /**
	         * Velocity of the entity
	         * @type {{x: number, y: number}}
	         * @readonly
	         */
	        _this.velocity = { x: 0, y: 0 };
	
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
	
	        /**
	         * Factor of scene gravity
	         * @type {number}
	         */
	        _this.gravityFactor = 1;
	
	        /**
	         * If true, this entity will pass into "pooling mode" (for memory sake)
	         * @type {boolean}
	         */
	        _this.pooling = false;
	
	        _this.width(10);
	        _this.height(10);
	        return _this;
	    }
	
	    /**
	     * Destroy the element
	     * @returns {void}
	     */
	
	
	    _createClass(Entity, [{
	        key: "destroy",
	        value: function destroy() {
	            if (!this.pooling) {
	                _get(Entity.prototype.__proto__ || Object.getPrototypeOf(Entity.prototype), "destroy", this).call(this);
	            }
	
	            this.destroyed = true;
	        }
	
	        /**
	         * Update
	         * @returns {void}
	         */
	
	    }, {
	        key: "update",
	        value: function update() {
	            _get(Entity.prototype.__proto__ || Object.getPrototypeOf(Entity.prototype), "update", this).call(this);
	
	            if (this.direction.x) {
	                this.velocity.x = this.speed.x * this.direction.x * _Engine2.default.tick;
	                this.x(this.x() + this.velocity.x);
	            }
	
	            this.velocity.y = this.scene && this.scene.gravity && this.gravityFactor ? this.scene.gravity * this.gravityFactor * _Engine2.default.tick : 0;
	            if (this.velocity.y || this.direction.y) {
	                this.velocity.y += this.speed.y * this.direction.y * _Engine2.default.tick;
	                this.y(this.y() + this.velocity.y);
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
	                context.strokeRect(this.x() - this.scene.camera.x, this.y() - this.scene.camera.y, this.width(), this.height());
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
	
	            var x = this.x() + this.width() / 2 - (entity.x() + entity.width() / 2),
	                y = this.y() + this.height() / 2 - (entity.y() + entity.height() / 2);
	
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
	            var bottom = this.y() + this.height(),
	                right = this.x() + this.width(),
	                entBottom = entity.y() + entity.height(),
	                entRight = entity.x() + entity.width(),
	                colBottom = entBottom - this.y(),
	                colTop = bottom - entity.y(),
	                colLeft = right - entity.x(),
	                colRight = entRight - this.x();
	
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
	            return !(entity.x() > this.x() + this.width() || entity.x() + entity.width() < this.x() || entity.y() > this.y() + this.height() || entity.x() + entity.height() < this.y());
	        }
	
	        /* GETTERS & SETTERS */
	
	        /**
	         * Name of the entity
	         * @returns {string} name
	         */
	
	    }, {
	        key: "x",
	
	
	        /**
	         * Get or set x position
	         * @param {number=} x: if exist, x will be setted
	         * @returns {number} the current position x
	         */
	        value: function x(_x) {
	            if (typeof _x !== "undefined") {
	                this.lastPosition.x = this.position.x;
	                this.position.x = Math.round(_x);
	            }
	
	            return this.relativePosition && this.scene ? this.position.x - this.scene.camera.x : this.position.x;
	        }
	
	        /**
	         * Get or set y position
	         * @param {number=} y: if exist, y will be setted
	         * @returns {number} the current position y
	         */
	
	    }, {
	        key: "y",
	        value: function y(_y) {
	            if (typeof _y !== "undefined") {
	                this.lastPosition.y = this.position.y;
	                this.position.y = Math.round(_y);
	            }
	
	            return this.relativePosition && this.scene ? this.position.y - this.scene.camera.y : this.position.y;
	        }
	    }, {
	        key: "name",
	        get: function get() {
	            return "entity";
	        }
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
	     * @param {number} width: width of the canvas
	     * @param {number} height: height of the canvas
	     * @param {*=} parentDOM: DOM node to attach the canvas
	     */
	    function Canvas(width, height, parentDOM) {
	        _classCallCheck(this, Canvas);
	
	        /**
	         * DOM parent of the canvas
	         */
	        var _this = _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this));
	
	        _this.parentDOM = parentDOM;
	
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
	         * Size of the canvas
	         * @type {{width: number, height: number}}
	         * @readonly
	         */
	        _this.size = { width: width || 0, height: height || 0 };
	        return _this;
	    }
	
	    _createClass(Canvas, [{
	        key: "initialize",
	        value: function initialize() {
	            _get(Canvas.prototype.__proto__ || Object.getPrototypeOf(Canvas.prototype), "initialize", this).call(this);
	
	            this.dom = document.createElement("canvas");
	            this.dom.id = this.id;
	            this.dom.width = this.width();
	            this.dom.height = this.height();
	            this.context = this.dom.getContext("2d");
	
	            this.setParentDOM();
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            this.clear();
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
	
	            ctx.clearRect(0, 0, this.width(), this.height());
	
	            if (clearColor || this.clearColor) {
	                ctx.fillStyle = clearColor || this.clearColor;
	                ctx.fillRect(0, 0, this.width(), this.height());
	            }
	        }
	
	        /* GETTERS & SETTERS */
	
	        /**
	         * The name of the component
	         * @returns {string} name
	         */
	
	    }, {
	        key: "width",
	
	
	        /**
	         * Get or set the width
	         * @param {number=} width: if exist, the width will be setted
	         * @returns {number} the current width
	         */
	        value: function width(_width) {
	            if (typeof _width !== "undefined") {
	                this.size.width = _width;
	
	                if (this.dom) {
	                    this.dom.width = _width;
	                }
	            }
	
	            return this.size.width;
	        }
	
	        /**
	         * Get or set the height
	         * @param {number=} height: if exist, the height will be setted
	         * @returns {number} the current height
	         */
	
	    }, {
	        key: "height",
	        value: function height(_height) {
	            if (typeof _height !== "undefined") {
	                this.size.height = _height;
	
	                if (this.dom) {
	                    this.dom.height = _height;
	                }
	            }
	
	            return this.size.height;
	        }
	    }, {
	        key: "name",
	        get: function get() {
	            return "canvas";
	        }
	    }]);
	
	    return Canvas;
	}(_index2.default);
	
	exports.default = Canvas;

/***/ }

/******/ });
//# sourceMappingURL=sideral.js.map