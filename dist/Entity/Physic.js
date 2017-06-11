"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var p2_1 = require("p2");
var Tool_1 = require("./../Tool");
/**
 * Physic class for collision and gravity
 */
var Physic = (function () {
    /* LIFECYCLE */
    /**
     * @constructor
     * @param owner - The owner of the physic
     * @param x - Position in x axis
     * @param y - Position in y axis
     * @param width - Width of the body
     * @param height - Height of the body
     * @param type - Type of body properties (see Enum.TYPE)
     * @param box - Shape of the body (see Enum.BOX)
     * @param props - Optional properties to pass to the body
     */
    function Physic(owner, x, y, width, height, type, box, props) {
        if (props === void 0) { props = {}; }
        /**
         * Know if the physic engine is enabled
         * @readonly
         */
        this.enabled = false;
        this.owner = owner;
        this.offsetX = width / 2;
        this.offsetY = height / 2;
        this.shape = this.constructShape(box, width, height, props.group || Tool_1.Enum.GROUP.ALL);
        this.body = this.constructBody(type, x + this.offsetX, y + this.offsetY, props.gravityFactor || 1);
        this.id = this.body.id;
        this.shape.material = props.material || this.owner.context.scene.getDefaultMaterial();
        this.body.addShape(this.shape);
        if (this.owner.props.bounce) {
            this.setBounciness(this.owner.props.bounce);
        }
    }
    /* METHODS */
    /**
     * Enable the physic engine to the world
     */
    Physic.prototype.enable = function () {
        if (this.owner) {
            this.owner.context.scene.addPhysic(this);
            this.enabled = true;
        }
    };
    /**
     * Disable the physic engine to the world
     */
    Physic.prototype.disable = function () {
        if (this.owner) {
            this.owner.context.scene.removePhysic(this);
            this.enabled = false;
        }
    };
    /**
     * Set a new factor of bounciness
     * @param bounce - The next factor of bounciness
     */
    Physic.prototype.setBounciness = function (bounce) {
        if (this.owner) {
            this.owner.context.scene.setPhysicBouncing(this, bounce);
        }
    };
    /**
     * Get the real size of the body
     */
    Physic.prototype.getSize = function () {
        if (this.shape instanceof p2_1.Circle) {
            var diameter = this.shape.radius * 2;
            return { width: diameter, height: diameter };
        }
        var shape = this.shape;
        return { width: shape.width, height: shape.height };
    };
    /**
     * Get the position of the body
     * @returns The current position
     */
    Physic.prototype.getPosition = function () {
        var size = this.getSize();
        return {
            x: Tool_1.Util.meterToPixel(this.body.interpolatedPosition[0]) - this.offsetX,
            y: Tool_1.Util.meterToPixel(this.body.interpolatedPosition[1]) - this.offsetY
        };
    };
    /**
     * Get the angle of the body (in Degree)
     * @returns The current angle
     */
    Physic.prototype.getAngle = function () {
        return Tool_1.Util.toDegree(this.body.interpolatedAngle);
    };
    /**
     * Get the velocity of the body
     * @returns The current velocity
     */
    Physic.prototype.getVelocity = function () {
        return {
            x: Tool_1.Util.meterToPixel(this.body.velocity[0]),
            y: Tool_1.Util.meterToPixel(this.body.velocity[1])
        };
    };
    /**
     * Get the acceleration of the body
     * @returns The current acceleration
     */
    Physic.prototype.getAcceleration = function () {
        return {
            x: Tool_1.Util.meterToPixel(this.body.force[0]),
            y: Tool_1.Util.meterToPixel(this.body.force[1])
        };
    };
    /**
     * Get the factor of gravity for the body
     * @returns The factor of gravity
     */
    Physic.prototype.getGravityFactor = function () {
        return this.body && this.body.gravityScale;
    };
    /**
     * Set a new factor of gravity for the body
     * @param value - The new factor of gravity
     */
    Physic.prototype.setGravityFactor = function (value) {
        this.body.gravityScale = value;
    };
    /**
     * Set a new position for the body
     * @param x - The position in x axis
     * @param y - The position in y axis
     */
    Physic.prototype.setPosition = function (x, y) {
        if (x || x === 0) {
            this.body.interpolatedPosition[0] = this.body.position[0] = Tool_1.Util.pixelToMeter(x + this.offsetX);
        }
        if (y || y === 0) {
            this.body.interpolatedPosition[1] = this.body.position[1] = Tool_1.Util.pixelToMeter(y + this.offsetY);
        }
    };
    /**
     * Set a new velocity for the body
     * @param x - Velocity in x axis
     * @param y - Velocity in y axis
     */
    Physic.prototype.setVelocity = function (x, y) {
        if (x || x === 0) {
            this.body.velocity[0] = Tool_1.Util.pixelToMeter(x);
        }
        if (y || y === 0) {
            this.body.velocity[1] = Tool_1.Util.pixelToMeter(y);
        }
    };
    /**
     * Set a new acceleration for the body
     * @param x - Acceleration in x axis
     * @param y - Acceleration in y axis
     */
    Physic.prototype.setAcceleration = function (x, y) {
        if (x || x === 0) {
            this.body.force[0] = Tool_1.Util.pixelToMeter(x);
        }
        if (y || y === 0) {
            this.body.force[1] = Tool_1.Util.pixelToMeter(y);
        }
    };
    /**
     * Set a new angle for the body
     * @param angle - The angle (in Degree)
     */
    Physic.prototype.setAngle = function (angle) {
        this.body.interpolatedAngle = this.body.angle = Tool_1.Util.toRadians(angle);
    };
    /**
     * Stop all movement of the physic body
     * @param stopGravity - If true, the body will be no longer moved by gravity
     */
    Physic.prototype.idle = function (stopGravity) {
        if (stopGravity === void 0) { stopGravity = false; }
        this.setVelocity(0, 0);
        this.setAcceleration(0, 0);
        if (stopGravity) {
            this.body.gravityScale = 0;
        }
    };
    /**
     * Set a Group of collision to a shape
     * @param shape - The Shape
     * @param group - The group enumeration (see Enum.GROUP)
     */
    Physic.prototype.setShapeGroup = function (shape, group) {
        var toMask = function (groupNumber) { return Math.pow(2, groupNumber); };
        shape.collisionGroup = toMask(group);
        switch (group) {
            case Tool_1.Enum.GROUP.ALL:
                shape.collisionMask = -1;
                break;
            case Tool_1.Enum.GROUP.NONE:
                shape.collisionMask = 0;
                break;
            case Tool_1.Enum.GROUP.GROUND:
                shape.collisionMask = -1;
                break;
            case Tool_1.Enum.GROUP.ALLY:
                shape.collisionMask = toMask(Tool_1.Enum.GROUP.ALL) | toMask(Tool_1.Enum.GROUP.GROUND) | toMask(Tool_1.Enum.GROUP.ENEMY) | toMask(Tool_1.Enum.GROUP.ENTITIES);
                break;
            case Tool_1.Enum.GROUP.ENEMY:
                shape.collisionMask = toMask(Tool_1.Enum.GROUP.ALL) | toMask(Tool_1.Enum.GROUP.GROUND) | toMask(Tool_1.Enum.GROUP.ALLY) | toMask(Tool_1.Enum.GROUP.ENTITIES);
                break;
            case Tool_1.Enum.GROUP.NEUTRAL:
                shape.collisionMask = toMask(Tool_1.Enum.GROUP.ALL) | toMask(Tool_1.Enum.GROUP.GROUND) | toMask(Tool_1.Enum.GROUP.ENTITIES);
                break;
            case Tool_1.Enum.GROUP.ENTITIES:
                shape.collisionMask = toMask(Tool_1.Enum.GROUP.ALL) | toMask(Tool_1.Enum.GROUP.ALLY) | toMask(Tool_1.Enum.GROUP.ENEMY);
                break;
        }
    };
    /**
     * Get the id of the p2.Body
     * @returns The id of the current body
     */
    Physic.prototype.getBodyId = function () {
        return this.body && this.body.id;
    };
    /**
     * Construct a p2.Shape by Enum.BOX
     * @param box - Box enumeration (see Enum.BOX)
     * @param width - The width of the shape
     * @param height - The height of the shape (not used for circle
     * @param group - Group enumeration (see Enum.GROUP)
     * @returns {Shape} A p2.Shape
     */
    Physic.prototype.constructShape = function (box, width, height, group) {
        var shape = null;
        switch (box) {
            case Tool_1.Enum.BOX.CIRCLE:
                shape = new p2_1.Circle({ radius: Tool_1.Util.pixelToMeter(width / 2) });
                break;
            default:
                shape = new p2_1.Box({ width: Tool_1.Util.pixelToMeter(width), height: Tool_1.Util.pixelToMeter(height) });
                break;
        }
        if (shape && group) {
            this.setShapeGroup(shape, group);
        }
        return shape;
    };
    /**
     * Construct a p2.Body by Enum.TYPE
     * @param type - Type enumeration (see Enum.TYPE)
     * @param x - Position in x axis of the body
     * @param y - Position in y axis of the body
     * @param gravityFactor - The factor of gravity (provided by the owner)
     * @returns A p2.Body
     */
    Physic.prototype.constructBody = function (type, x, y, gravityFactor) {
        if (gravityFactor === void 0) { gravityFactor = 1; }
        var settings = {
            position: [Tool_1.Util.pixelToMeter(x), Tool_1.Util.pixelToMeter(y)],
            mass: type < 0 ? 0 : type,
            gravityScale: gravityFactor,
            sensor: type === Tool_1.Enum.TYPE.GHOST,
            fixedRotation: type !== Tool_1.Enum.TYPE.WEAK
        };
        var body = new p2_1.Body(settings);
        return body;
    };
    return Physic;
}());
exports.Physic = Physic;
