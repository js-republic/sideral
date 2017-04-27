import p2 from "p2";

import Util from "./Util";


export default class Body {

    constructor (props = {}) {
        const { x, y, width, height } = props;

        delete props.x;
        delete props.y;
        delete props.width;
        delete props.height;

        this.offset = {
            x: width / 2,
            y: height / 2
        };

        this.shape  = props.shape || new p2.Box({ width: width, height: height });
        this.data   = new p2.Body(Object.assign({ position: [x + this.offset.x, y + this.offset.y] }, props));

        this.data.addShape(this.shape);
    }

    position (x, y) {
        if (typeof x !== "undefined") {
            this.x = x;
        }

        if (typeof y !== "undefined") {
            this.y = y;
        }
    }

    size (width, height) {
        this.shape.width    = width;
        this.shape.height   = height;
        this.offset.x       = width / 2;
        this.offset.y       = height / 2;
    }

    get x () {
        return this.data.position[0] - this.offset.x;
    }

    get y () {
        return this.data.position[1] - this.offset.y;
    }

    get width () {
        return this.shape.width;
    }

    get height () {
        return this.shape.height;
    }

    get angle () {
        return Util.toDegree(this.data.angle);
    }

    set x (value) {
        this.data.position[0] = value + this.offset.x;
    }

    set y (value) {
        this.data.position[1] = value + this.offset.y;
    }

    set angle (value) {
        this.data.angle = Util.toRadians(value);
    }

    set width (value) {
        this.shape.width    = value;
        this.offset.x       = value / 2;
    }

    set height (value) {
        this.shape.height   = value;
        this.offset.y       = value / 2;
    }
}

Body.RectangularBody = class extends Body {
    constructor (x, y, width, height, props = {}) {
        super(Object.assign(props, {
            x       : x,
            y       : y,
            width   : width,
            height  : height,
            shape   : new p2.Box({ width: width, height: height })
        }));
    }
};


Body.CircularBody = class extends Body {
    constructor (x, y, radius, props = {}) {
        super(Object.assign(props, {
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
