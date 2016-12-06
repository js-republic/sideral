"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Element2 = require("./../Element");

var _Element3 = _interopRequireDefault(_Element2);

var _Engine = require("./../Engine");

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