"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ComponentViewable2 = require("./../ComponentViewable");

var _ComponentViewable3 = _interopRequireDefault(_ComponentViewable2);

var _Engine = require("./../Engine");

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