import AbstractModule from "./../Abstract/AbstractModule";
import Util from "./../Command/Util";


export default class Shape extends AbstractModule {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            stroke  : "#FF0000",
            fill    : "#FFFFFF",
            type    : Shape.TYPE.RECTANGLE
        });

        this.container = new PIXI.Graphics();

        this.bind(this.SIGNAL.VALUE_CHANGE(["type", "fill", "stroke"]), this.createAction(this._updateShape));
    }


    /* EVENTS */

    onSizeChange () {
        this._updateShape();
    }

    /* PRIVATE */

    /**
     * Update the current shape
     * @private
     * @returns {void}
     */
    _updateShape () {
        const stroke    = Util.colorToDecimal(this.props.stroke),
            fill        = Util.colorToDecimal(this.props.fill);

        this.container.clear();

        if (this.props.stroke !== "transparent" && !isNaN(stroke)) {
            this.container.lineStyle(1, stroke, 1);
        }

        this.container.beginFill(fill, this.props.fill === "transparent" ? 0 : 1);
        this._drawShape();
        this.container.endFill();
    }

    /**
     * Draw the shape with the current type value
     * @private
     * @returns {void}
     */
    _drawShape () {
        const withStroke = this.props.stroke !== "transparent",
            x = withStroke ? this.props.x + 1 : this.props.x,
            y = withStroke ? this.props.y + 1 : this.props.y,
            width = withStroke ? this.props.width - 1 : this.props.width,
            height = withStroke ? this.props.height - 1 : this.props.height;

        switch (this.props.type) {
        default: this.container.drawRect(x, y, width, height);
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
