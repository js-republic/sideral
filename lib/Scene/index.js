"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Element2 = require("../Element");

var _Element3 = _interopRequireDefault(_Element2);

var _Entity = require("../Entity");

var _Entity2 = _interopRequireDefault(_Entity);

var _Canvas = require("../Component/Canvas");

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

    var props = options.props || {};

    /**
     * Width of the scene
     * @type {number}
     */
    props.width = props.width || 10;

    /**
     * Height of the scene
     * @type {number}
     */
    props.height = props.height || 10;

    /**
     * Position of the camera
     * @type {{x: number, y: number, follow: Entity|null}}
     */
    props.camera = { x: 0, y: 0, follow: null };

    /**
     * Gravity of the scene
     * @type {number}
     */
    props.gravity = props.gravity || 0;

    /**
     * Scale of all entities behind this scene
     * @type {number}
     */
    props.scale = props.scale || 1;

    options.props = props;

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

      this.compose(new _Canvas2.default({ width: this.width, height: this.height }));
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
        this.camera.x = this.camera.follow.x + this.camera.follow.width * this.scale / 2 - this.width / 2 / this.scale;
        this.camera.y = this.camera.follow.y + this.camera.follow.height * this.scale / 2 - this.height / 2 / this.scale;
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
     * @param {function=} callback: callback with entity added in parameter
     * @returns {Element} current instance
     */

  }, {
    key: "attachEntity",
    value: function attachEntity(entity, callback) {
      if (!entity || entity && !(entity instanceof _Entity2.default)) {
        throw new Error("Scene.attachEntity : entity must be an instance of Entity");
      }

      entity.scene = this;

      return this.attach(entity, this.entities, callback);
    }
  }]);

  return Scene;
}(_Element3.default);

exports.default = Scene;