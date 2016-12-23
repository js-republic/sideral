"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("./Component");

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
            this.components.forEach(function (component) {
                if (component.render) {
                    component.render(context);
                }
            });
        }

        /**
         * Get the parent scene
         * @returns {Scene} scene of the component
         */

    }, {
        key: "getScene",
        value: function getScene() {
            var recursive = function recursive(component) {
                if (!component.parent) {
                    return null;
                }

                if (component.has("canvas") && component.camera) {
                    return component.parent;
                }

                return recursive(component.parent);
            };

            return recursive(this);
        }

        /**
         * Call the parent scene to request a new render
         * @returns {void}
         */

    }, {
        key: "requestRender",
        value: function requestRender() {
            var scene = this.getScene();

            if (scene) {
                scene.renderRequested[this.id] = true;
            }
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
                    _this2.requestRender();
                });
            });
        }
    }]);

    return ComponentViewable;
}(_Component3.default);

exports.default = ComponentViewable;