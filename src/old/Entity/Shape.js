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
        this.type       = null;

        /**
         * Flip the shape
         * @type {boolean}
         */
        this.flip       = false;

        // auto-binding

        this._renderShape   = this._renderShape.bind(this);
        this._onFlipChange  = this._onFlipChange.bind(this);
    }

    /**
     * @override
     */
    setReactivity () {
        this.reactivity.
            when("type", "fill", "stroke").change(this._renderShape).
            when("flip").change(this._onFlipChange);
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

        this._container.clear();

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
            x = withStroke ? 1 : 0,
            y = withStroke ? 1 : 0,
            width = withStroke ? this.width - 1 : this.width,
            height = withStroke ? this.height - 1 : this.height;

        switch (this.type) {
        default:
            this._container.drawRect(x, y, width, height);
            break;
        }
    }

    /**
     * when flip attributes change
     * @private
     * @returns {void}
     */
    _onFlipChange () {
        this._container.scale.x = Math.abs(this._container.scale.x) * (this.flip ? -1 : 1);
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