import { Body, Shape, Box, Circle, Material } from "p2";

import { Module } from "./../Module";
import { IPhysicProps, IBodyContact, IPhysicSignals } from "./../Interface";

import { Util, Enum, SignalEvent } from "./../Tool";


/**
 * Physic class for collision and gravity
 */
export class Physic extends Module {

    /* ATTRIBUTES */

    /**
     * Properties of a Physic
     */
    props: IPhysicProps;

    /**
     * Signals of the entity
     */
    signals: IPhysicSignals;

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

    /**
     * List of all physics colliding with it
     * @readonly
     */
    collides: Array<IBodyContact> = [];


    /* LIFECYCLE */

    constructor () {
        super();

        this.signals.beginCollision = new SignalEvent();
        this.signals.collision      = new SignalEvent();
        this.signals.endCollision   = new SignalEvent();
    }

    /**
     * @initialize
     */
    initialize (props): void {
        super.initialize(props);

        const { owner } = this.props;

        if (!owner || !(owner instanceof Module)) {
            throw new Error("Physic.initialize: Owner of the Physic must be at least a Module.");
        }

        this.shape  = this.constructShape(this.props.box, this.props.width, this.props.height, owner.group);
        this.body   = this.constructBody(owner.type, this.props.x, this.props.y, this.props.gravityFactor, owner.group);

        this.updateShapeMaterial();
        this.body.addShape(this.shape);

        this.signals.propChange.bind("vx", () => this.body.velocity[0] = Util.pixelToMeter(this.props.vx));
        this.signals.propChange.bind("vy", () => this.body.velocity[1] = Util.pixelToMeter(this.props.vy));
        this.signals.propChange.bind("x", () => this.body.position[0] = Util.pixelToMeter(this.props.x));
        this.signals.propChange.bind("y", () => this.body.position[1] = Util.pixelToMeter(this.props.y));
        this.signals.propChange.bind("angle", () => this.body.angle = Util.toRadians(this.props.angle));
        this.signals.propChange.bind("gravityFactor", () => this.body.gravityScale = this.props.gravityFactor);
        this.signals.propChange.bind("bounce", () => this.context.scene.setPhysicBouncing(this, this.props.bounce, this.last.bounce));

        this.props.owner.context.scene.addPhysic(this);
    }

    /**
     * @nextCycle
     */
    nextCycle (): void {
        super.nextCycle();

        if (this.body) {
            this.setProps({
                x       : Util.meterToPixel(this.body.interpolatedPosition[0]),
                y       : Util.meterToPixel(this.body.interpolatedPosition[1]),
                vx      : Util.meterToPixel(this.body.velocity[0]),
                vy      : Util.meterToPixel(this.body.velocity[1]),
                angle   : Util.toDegree(this.body.interpolatedAngle)
            });
        }

        this.collides.forEach(collide => collide.entity && !collide.entity._beforePauseState && this.signals.collision.dispatch(collide.entity.name, collide.entity));
    }


    /* METHODS */

    /**
     * Stop all movement of the physic body
     * @param stopGravity - If true, the body will be no longer moved by gravity
     */
    idle (stopGravity: boolean = false): void {
        this.props.vx       = 0;
        this.props.vy       = 0;
        this.props.accelX   = 0;
        this.props.accelY   = 0;

        if (stopGravity) {
            this.props.gravityFactor = 0;
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
     * Update the material of the Shape
     * @param material - The material
     */
    updateShapeMaterial (material?: Material): void {
        material = material || this.props.material;

        if (material) {
            this.shape.material = this.props.material;

        } else {
            const material      = this.props.owner.context.scene.getDefaultMaterial();

            this.shape.material = material;
            this.setProps({ material: material });
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
     * @param group - The group of collision
     * @returns A p2.Body
     */
    constructBody (type: number, x: number, y: number, gravityFactor: number = 1, group?: number): Body {
        const settings = {
            x               : Util.pixelToMeter(x),
            y               : Util.pixelToMeter(y),
            mass            : type < 0 ? 0 : type,
            gravityScale    : gravityFactor,
            group           : group,
            fixedRotation   : type !== Enum.TYPE.WEAK,
            angularVelocity : type === Enum.TYPE.WEAK ? 1 : 0
        };

        const body          = new Body(settings);

        body.damping        = 0;
        body.angularDamping = 0;

        return body;
    }
}
