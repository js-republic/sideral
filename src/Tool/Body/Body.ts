import * as p2 from "p2";

import { Util } from "../Util";
import { Enum } from "../Enum";
import { Module } from "./../../Module";


export class Body {
    offset: {x: number; y: number};
    shape: p2.Box;
    data: p2.Body;
    id: number;
    owner: Module;

    /**
     * @constructor
     * @param {Module} owner - Owner of the body
     * @param {*=} props: properties to pass to p2
     */
    constructor (owner: Module, props: any = {}) {
        const { x, y, width, height, group, material } = props;

        delete props.x;
        delete props.y;
        delete props.width;
        delete props.height;
        delete props.scene;
        delete props.group;
        delete props.material;

        this.offset = {
            x: width / 2,
            y: height / 2
        };

        this.owner          = owner;
        this.shape          = props.shape || new p2.Box({ width: Util.pixelToMeter(width), height: Util.pixelToMeter(height) });

        this.data           = new p2.Body(Object.assign({ position: [Util.pixelToMeter(x + this.offset.x), Util.pixelToMeter(y + this.offset.y)] }, props));
        this.data.damping           = 0;
        this.data.angularDamping    = 0;
        (<any>this.data).owner     = this.owner;

        this.shape.material = material || this.owner.context.scene.world.defaultMaterial;
        this.id             = this.data.id;

        this.data.addShape(this.shape);

        if (typeof group !== "undefined") {
            this.setGroup(group);
        }

        this.enable();
    }

    /**
     * Enable the body and add it into the scene
     * @returns {void}
     */
    enable () {
        if (this.owner.context.scene && this.owner.context.scene.world) {
            this.owner.context.scene.world.addBody(this.data);
        }
    }

    /**
     * Disable the body and remove it from the scene
     * @returns {void}
     */
    disable () {
        if (this.owner.context.scene && this.owner.context.scene.world) {
            this.owner.context.scene.world.removeBody(this.data);
        }
    }

    /**
     * Set a new position of the body
     * @param {number} x: number of the position in x axis
     * @param {number} y: number of the position in y axis
     * @returns {void}
     */
    position (x: number, y: number) {
        if (typeof x !== "undefined") {
            this.x = x;
        }

        if (typeof y !== "undefined") {
            this.y = y;
        }
    }

    /**
     * Set a new group for the shape of the body
     * @param {number} group: group number (see Enum.js)
     * @returns {null} -
     */
    setGroup (group) {
        if (!this.shape) {
            return null;
        }

        const toMask = groupNumber => Math.pow(2, groupNumber);

        this.shape.collisionGroup = toMask(group);

        switch (group) {
            case Enum.GROUP.ALL: this.shape.collisionMask       = -1;
                break;

            case Enum.GROUP.NONE: this.shape.collisionMask      = 0;
                break;

            case Enum.GROUP.GROUND: this.shape.collisionMask    = -1;
                break;

            case Enum.GROUP.ALLY: this.shape.collisionMask      = toMask(Enum.GROUP.ALL) | toMask(Enum.GROUP.GROUND) | toMask(Enum.GROUP.ENEMY) | toMask(Enum.GROUP.ENTITIES);
                break;

            case Enum.GROUP.ENEMY: this.shape.collisionMask     = toMask(Enum.GROUP.ALL) | toMask(Enum.GROUP.GROUND) | toMask(Enum.GROUP.ALLY) | toMask(Enum.GROUP.ENTITIES);
                break;

            case Enum.GROUP.NEUTRAL: this.shape.collisionMask   = toMask(Enum.GROUP.ALL) | toMask(Enum.GROUP.GROUND) | toMask(Enum.GROUP.ENTITIES);
                break;

            case Enum.GROUP.ENTITIES: this.shape.collisionMask  = toMask(Enum.GROUP.ALL) | toMask(Enum.GROUP.ALLY) | toMask(Enum.GROUP.ENEMY);
                break;
        }
    }


    /* ACCESSORS */

    /**
     * Get x position
     * @returns {number} the position x
     */
    get x (): number {
        return Util.meterToPixel(this.data.position[0]) - this.offset.x;
    }

    /**
     * Get y position
     * @returns {number} the position y
     */
    get y (): number {
        return Util.meterToPixel(this.data.position[1]) - this.offset.y;
    }

    /**
     * Get the velocity x of the body
     * @returns {number}
     */
    get vx (): number {
        return Util.meterToPixel(this.data.velocity[0]);
    }

    /**
     * Get the velocity y of the vody
     * @returns {number}
     */
    get vy (): number {
        return Util.meterToPixel(this.data.velocity[1]);
    }

    /**
     * Get the width
     * @returns {number} the width of the shape
     */
    get width (): number {
        return Util.meterToPixel((<any>this.shape).radius ? (<any>this.shape).radius * 2 : this.shape.width);
    }

    /**
     * Get the height of the shape
     * @returns {number} the height of the shape
     */
    get height (): number {
        return Util.meterToPixel((<any>this.shape).radius ? (<any>this.shape).radius * 2 : this.shape.height);
    }

    /**
     * Get current angle of the body
     * @returns {number} angle in degree
     */
    get angle (): number {
        return Util.toDegree(this.data.angle);
    }

    /**
     * Set a new position in x axis
     * @param {number} value: next value
     * @returns {void}
     */
    set x (value: number) {
        this.data.position[0] = Util.pixelToMeter(value + this.offset.x);
    }

    /**
     * Set a new position in y axis
     * @param {number} value: next value
     * @returns {void}
     */
    set y (value: number) {
        this.data.position[1] = Util.pixelToMeter(value + this.offset.y);
    }

    /**
     * Set a new angle for the body
     * @param {number} value: next angle in degree
     * @returns {void}
     */
    set angle (value: number) {
        this.data.angle = Util.toRadians(value);
    }

    /**
     * Set a new velocity in x axis
     * @param {number} value - The new velocity in x axis
     * @returns {void}
     */
    set vx (value: number) {
        this.data.velocity[0] = Util.pixelToMeter(value);
    }

    /**
     * Set a new velocity in y axis
     * @param {number} value - The new velocity in y axis
     * @returns {void}
     */
    set vy (value: number) {
        this.data.velocity[1] = Util.pixelToMeter(value);
    }

}
