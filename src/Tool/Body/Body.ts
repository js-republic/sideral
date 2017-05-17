import * as p2 from "p2";

import Util from "../Util";
import Enum from "../Enum";


export class Body {
    offset: {x: number; y: number};
    scene: any;
    shape: p2.Box;
    data: p2.Body;
    id: number;

    /**
     * @constructor
     * @param {Scene} scene: scene world
     * @param {*=} props: properties to pass to p2
     */
    constructor (scene, props: any = {}) {
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

        this.scene          = scene;
        this.shape          = props.shape || new p2.Box({ width: width, height: height });
        this.data           = new p2.Body(Object.assign({ position: [x + this.offset.x, y + this.offset.y] }, props));
        this.shape.material = material || this.scene.DefaultMaterial;
        this.id             = this.data.id;

        this.data.addShape(this.shape);

        if (typeof group !== "undefined") {
            this.setGroup(group);
        }
    }

    /**
     * Set a new position of the body
     * @param {number} x: number of the position in x axis
     * @param {number} y: number of the position in y axis
     * @returns {void}
     */
    position (x, y) {
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
    get x () {
        return this.data.position[0] - this.offset.x;
    }

    /**
     * Get y position
     * @returns {number} the position y
     */
    get y () {
        return this.data.position[1] - this.offset.y;
    }

    /**
     * Get the width
     * @returns {number} the width of the shape
     */
    get width () {
        return this.shape.width;
    }

    /**
     * Get the height of the shape
     * @returns {number} the height of the shape
     */
    get height () {
        return this.shape.height;
    }

    /**
     * Get current angle of the body
     * @returns {number} angle in degree
     */
    get angle () {
        return Util.toDegree(this.data.angle);
    }

    /**
     * Set a new position in x axis
     * @param {number} value: next value
     * @returns {void}
     */
    set x (value) {
        this.data.position[0] = value + this.offset.x;
    }

    /**
     * Set a new position in y axis
     * @param {number} value: next value
     * @returns {void}
     */
    set y (value) {
        this.data.position[1] = value + this.offset.y;
    }

    /**
     * Set a new angle for the body
     * @param {number} value: next angle in degree
     * @returns {void}
     */
    set angle (value) {
        this.data.angle = Util.toRadians(value);
    }
}
