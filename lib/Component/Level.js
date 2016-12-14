"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _Canvas = require("./Canvas");

var _Canvas2 = _interopRequireDefault(_Canvas);

var _Bitmap = require("./../Util/Bitmap");

var _Bitmap2 = _interopRequireDefault(_Bitmap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Level = function (_Component) {
  _inherits(Level, _Component);

  /* LIFECYCLE */

  /**
   * @constructor
   * @param {{}} props: properties
   */
  function Level(props) {
    _classCallCheck(this, Level);

    var _this = _possibleConstructorReturn(this, (Level.__proto__ || Object.getPrototypeOf(Level)).call(this, props));

    if (!_this.level) {
      throw new Error("Level.constructor : You must provide a 'level' attribute corresponding to a level.json");
    }

    /**
     * Width of the level
     * @type {number}
     */
    _this.width = 0;

    /**
     * Height of the level
     * @type {number}
     */
    _this.height = 0;

    /**
     * Width of a tile
     * @type {number}
     */
    _this.tilewidth = _this.level.tilesize.width;

    /**
     * Height of a tile
     * @type {number}
     */
    _this.tileheight = _this.level.tilesize.height;

    /**
     * Grid array for displaying map
     * @type {Array<number>}
     */
    _this.grid = _this.level.grid.visual;

    /**
     * Grid array for logic
     * @type {Array<number>}
     */
    _this.logic = _this.level.grid.logic;

    /**
     * Know if a level is fully loaded
     * @readonly
     * @type {boolean}
     */
    _this.loaded = false;

    /**
     * Set to true if you want to see more informations about the current level
     * @type {boolean}
     */
    _this.debug = false;

    _this.updateSize();

    _this.bitmap = new _Bitmap2.default(_this.level.path, function () {
      _this.loaded = true;
    });

    delete _this.level;
    return _this;
  }

  /**
   * @override
   */


  _createClass(Level, [{
    key: "initialize",
    value: function initialize(parent) {
      _get(Level.prototype.__proto__ || Object.getPrototypeOf(Level.prototype), "initialize", this).call(this, parent);

      this.compose(new _Canvas2.default({ width: this.parent.width, height: this.parent.height }));
    }

    /* METHODS */

    /**
     * Update width and height with the grid and tilesize
     * @returns {void}
     */

  }, {
    key: "updateSize",
    value: function updateSize() {
      var width = 0;

      this.grid.forEach(function (layer) {
        return layer.forEach(function (line) {
          return width = line.length > width ? line.length : width;
        });
      });

      this.width = width * this.tilewidth;
      this.height = this.grid[0].length * this.tileheight;
    }
  }]);

  return Level;
}(_index2.default);

exports.default = Level;