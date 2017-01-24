import Entity from "./../Entity";
import Util from "./../Util";


export default class Shape extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name = "shape";

        this._container = new PIXI.Graphics();

        /**
         * Stroke color
         * @type {string}
         */
        this.stroke     = "#FF0000";

        /**
         * Fill color
         * @type {string}
         */
        this.fill       = "#FFFFFF";

        /**
         * Type of the Shape (see Shape.TYPE)
         * @type {string}
         */
        this.type       = Shape.TYPE.RECTANGLE;

        // auto-binding

        this._renderShape = this._renderShape.bind(this);
    }

    /**
     * @override
     */
    setReactivity () {
        this.reactivity.
            when("type").change(this._renderShape).
            start();
    }

    /* REACTIVITY */

    /**
     * Render the current shape
     * @private
     * @returns {void}
     */
    _renderShape () {
        const stroke    = Util.colorToDecimal(this.stroke),
            fill        = Util.colorToDecimal(this.fill);

        if (this.stroke !== "transparent" && !isNaN(stroke)) {
            this._container.lineStyle(1, stroke, 1);
        }

        this._container.beginFill(fill, this.fill === "transparent" ? 0 : 1);
        this._drawShape();
        this._container.endFill();
    }

    /**
     * Draw the shape with the current type value
     * @private
     * @returns {void}
     */
    _drawShape () {
        const withStroke = this.stroke !== "transparent",
            x = withStroke ? this.x : this.x,
            y = withStroke ? this.y : this.y,
            width = withStroke ? this.width - 1 : this.width,
            height = withStroke ? this.height - 1 : this.height;

        switch (this.type) {
            case Shape.TYPE.RECTANGLE:
                this._container.drawRect(x, y, width, height);
                break;
        }
    }
}

/**
 * All Shape Type
 * @type {{}}
 */
Shape.TYPE = {
    CIRCLE              : "circle",
    RECTANGLE           : "rectangle",
    POLYGON             : "polygon",
    ELLIPSE             : "ellipse",
    ROUNDED_RECTANGLE   : "roundedRectangle"
};