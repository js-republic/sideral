import p2 from "p2";

import Util from "./Util";


export default class Body {

    /**
     * @constructor
     * @param {Scene} scene: scene world
     * @param {*=} props: properties to pass to p2
     */
    constructor (scene, props = {}) {
        const { x, y, width, height, friction, bounce } = props;

        delete props.x;
        delete props.y;
        delete props.width;
        delete props.height;
        delete props.friction;
        delete props.bounce;

        this.offset = {
            x: width / 2,
            y: height / 2
        };

        this.scene      = scene;
        this.friction   = friction;
        this.bounce     = bounce;
        this.shape      = props.shape || new p2.Box({ width: width, height: height });
        this.data       = new p2.Body(Object.assign({ position: [x + this.offset.x, y + this.offset.y] }, props));
        this.material   = new p2.Material();

        this.shape.material = this.material;
        this.data.addShape(this.shape);
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
     * Set a new size of the shape
     * @param {number} width: number corresponding of the width of the shape
     * @param {number} height: number corresponding of the height of the shape
     * @returns {void}
     */
    size (width, height) {
        this.shape.width    = width;
        this.shape.height   = height;
        this.offset.x       = width / 2;
        this.offset.y       = height / 2;
    }

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

    /**
     * Set a new width for the shape
     * @param {number} value: next value
     */
    set width (value) {
        this.shape.width    = value;
        this.offset.x       = value / 2;
    }

    /**
     * Set a new height for the shape
     * @param {number} value: next value
     */
    set height (value) {
        this.shape.height   = value;
        this.offset.y       = value / 2;
    }
}

Body.RectangularBody = class extends Body {
    constructor (scene, x, y, width, height, props = {}) {
        super(scene, Object.assign(props, {
            x       : x,
            y       : y,
            width   : width,
            height  : height,
            shape   : new p2.Box({ width: width, height: height })
        }));
    }
};


Body.CircularBody = class extends Body {
    constructor (scene, x, y, radius, props = {}) {
        super(scene, Object.assign(props, {
            x       : x,
            y       : y,
            width   : radius * 2,
            height  : radius * 2,
            shape   : new p2.Circle({ radius: radius })
        }));
    }
};

Body.BodyByType = type => {
    switch (type) {
    case "circle": return Body.CircularBody;
    default: return Body.RectangularBody;
    }
};
