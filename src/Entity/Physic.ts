import { Body, Shape, Box, Circle, Material } from "p2";

import { IPoint, ISize } from "./../Interface";

import { Util, Enum, SignalEvent } from "./../Tool";


/**
 * Physic class for collision and gravity
 */
export class Physic {

    /* ATTRIBUTES */

    /**
     * Unique Id of the Physic
     */
    id: number;

    /**
     * Owner of the Physic engine
     * @readonly
     */
    owner: any;

    /**
     * Know if the physic engine is enabled
     * @readonly
     */
    enabled: boolean = false;

    /**
     * The body provided by p2.js
     * @readonly
     */
    body: Body;

    /**
     * The shape of the body
     * @readonly
     */
    shape: Shape;


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
    constructor (owner: any, x: number, y: number, width: number, height: number, type: number, box: string, props: any = {}) {
        this.owner  = owner;
        this.shape  = this.constructShape(box, width, height, props.group || Enum.GROUP.ALL);
        this.body   = this.constructBody(type, x + (width / 2), y + (height / 2), props.gravityFactor || 1);
        this.id     = this.body.id;
        this.shape.material = props.material || this.owner.context.scene.getDefaultMaterial();

        this.body.addShape(this.shape);
    }


    /* METHODS */

    /**
     * Enable the physic engine to the world
     */
    enable (): void {
        if (this.owner) {
            this.owner.context.scene.addPhysic(this);
            this.enabled = true;
        }
    }

    /**
     * Disable the physic engine to the world
     */
    disable (): void {
        if (this.owner) {
            this.owner.context.scene.removePhysic(this);
            this.enabled = false;
        }
    }

    /**
     * Get the real size of the body
     */
    getSize (): ISize {
        if (this.shape instanceof Circle) {
            const diameter = this.shape.radius * 2;

            return { width: diameter, height: diameter };
        }

        const shape = this.shape as Box;

        return { width: shape.width, height: shape.height };
    }

    /**
     * Get the position of the body
     * @returns The current position
     */
    getPosition (): IPoint {
        const size = this.getSize();

        return {
            x: Util.meterToPixel(this.body.interpolatedPosition[0] - (size.width / 2)),
            y: Util.meterToPixel(this.body.interpolatedPosition[1] - (size.height / 2))
        };
    }

    /**
     * Get the angle of the body (in Degree)
     * @returns The current angle
     */
    getAngle (): number {
        return Util.toDegree(this.body.interpolatedAngle);
    }

    /**
     * Get the velocity of the body
     * @returns The current velocity
     */
    getVelocity (): IPoint {
        return {
            x: Util.meterToPixel(this.body.velocity[0]),
            y: Util.meterToPixel(this.body.velocity[1])
        };
    }

    /**
     * Get the acceleration of the body
     * @returns The current acceleration
     */
    getAcceleration (): IPoint {
        return {
            x: Util.meterToPixel(this.body.force[0]),
            y: Util.meterToPixel(this.body.force[1])
        };
    }

    /**
     * Get the factor of gravity for the body
     * @returns The factor of gravity
     */
    getGravityFactor (): number {
        return this.body && this.body.gravityScale;
    }

    /**
     * Set a new factor of gravity for the body
     * @param value - The new factor of gravity
     */
    setGravityFactor (value: number): void {
        this.body.gravityScale = value;
    }

    /**
     * Set a new position for the body
     * @param x - The position in x axis
     * @param y - The position in y axis
     */
    setPosition (x?: number, y?: number): void {
        if (x || x === 0) {
            this.body.position[0] = Util.pixelToMeter(x);
        }

        if (y || y === 0) {
            this.body.position[1] = Util.pixelToMeter(y);
        }
    }

    /**
     * Set a new velocity for the body
     * @param x - Velocity in x axis
     * @param y - Velocity in y axis
     */
    setVelocity (x?: number, y?: number): void {
        if (x || x === 0) {
            this.body.velocity[0] = Util.pixelToMeter(x);
        }

        if (y || y === 0) {
            this.body.velocity[1] = Util.pixelToMeter(y);
        }
    }

    /**
     * Set a new acceleration for the body
     * @param x - Acceleration in x axis
     * @param y - Acceleration in y axis
     */
    setAcceleration (x?: number, y?: number): void {
        if (x || x === 0) {
            this.body.force[0] = Util.pixelToMeter(x);
        }

        if (y || y === 0) {
            this.body.force[1] = Util.pixelToMeter(y);
        }
    }

    /**
     * Set a new angle for the body
     * @param angle - The angle (in Degree)
     */
    setAngle (angle): void {
        this.body.angle = Util.toRadians(angle);
    }

    /**
     * Stop all movement of the physic body
     * @param stopGravity - If true, the body will be no longer moved by gravity
     */
    idle (stopGravity: boolean = false): void {
        this.setVelocity(0, 0);
        this.setAcceleration(0, 0);

        if (stopGravity) {
            this.body.gravityScale = 0;
        }
    }

    /**
     * Set a Group of collision to a shape
     * @param shape - The Shape
     * @param group - The group enumeration (see Enum.GROUP)
     */
    setShapeGroup (shape: Shape, group: number): void {
        const toMask = groupNumber => Math.pow(2, groupNumber);

        shape.collisionGroup = toMask(group);

        switch (group) {
            case Enum.GROUP.ALL: shape.collisionMask       = -1;
                break;

            case Enum.GROUP.NONE: shape.collisionMask      = 0;
                break;

            case Enum.GROUP.GROUND: shape.collisionMask    = -1;
                break;

            case Enum.GROUP.ALLY: shape.collisionMask      = toMask(Enum.GROUP.ALL) | toMask(Enum.GROUP.GROUND) | toMask(Enum.GROUP.ENEMY) | toMask(Enum.GROUP.ENTITIES);
                break;

            case Enum.GROUP.ENEMY: shape.collisionMask     = toMask(Enum.GROUP.ALL) | toMask(Enum.GROUP.GROUND) | toMask(Enum.GROUP.ALLY) | toMask(Enum.GROUP.ENTITIES);
                break;

            case Enum.GROUP.NEUTRAL: shape.collisionMask   = toMask(Enum.GROUP.ALL) | toMask(Enum.GROUP.GROUND) | toMask(Enum.GROUP.ENTITIES);
                break;

            case Enum.GROUP.ENTITIES: shape.collisionMask  = toMask(Enum.GROUP.ALL) | toMask(Enum.GROUP.ALLY) | toMask(Enum.GROUP.ENEMY);
                break;
        }
    }

    /**
     * Get the id of the p2.Body
     * @returns The id of the current body
     */
    getBodyId (): number {
        return this.body && this.body.id;
    }

    /**
     * Construct a p2.Shape by Enum.BOX
     * @param box - Box enumeration (see Enum.BOX)
     * @param width - The width of the shape
     * @param height - The height of the shape (not used for circle
     * @param group - Group enumeration (see Enum.GROUP)
     * @returns {Shape} A p2.Shape
     */
    constructShape (box: string, width: number, height?: number, group?: number): Shape {
        let shape = null;

        switch (box) {
            case Enum.BOX.CIRCLE: shape = new Circle({ radius: Util.pixelToMeter(width / 2) });
                break;

            default: shape = new Box({ width: Util.pixelToMeter(width), height: Util.pixelToMeter(height) });
                break;
        }

        if (shape && group) {
            this.setShapeGroup(shape, group);
        }

        return shape;
    }

    /**
     * Construct a p2.Body by Enum.TYPE
     * @param type - Type enumeration (see Enum.TYPE)
     * @param x - Position in x axis of the body
     * @param y - Position in y axis of the body
     * @param gravityFactor - The factor of gravity (provided by the owner)
     * @returns A p2.Body
     */
    constructBody (type: number, x: number, y: number, gravityFactor: number = 1): Body {
        const settings = {
            position        : [Util.pixelToMeter(x), Util.pixelToMeter(y)],
            mass            : type < 0 ? 0 : type,
            gravityScale    : gravityFactor,
            fixedRotation   : type !== Enum.TYPE.WEAK,
            angularVelocity : type === Enum.TYPE.WEAK ? 1 : 0
        };

        const body          = new Body(settings);

        body.damping        = 0;
        body.angularDamping = 0;

        return body;
    }
}
