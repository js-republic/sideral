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

        this.signals.propChange.bind(["type", "fill", "stroke"], this._updateShape.bind(this));
    }


    /* EVENTS */

    /**
     * @override
     */
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
            width = withStroke ? this.props.width - 1 : this.props.width,
            height = withStroke ? this.props.height - 1 : this.props.height;

        switch (this.props.type) {
        case Shape.TYPE.CIRCLE:

            if (width !== height) {
                this.container.drawEllipse(width / 2, height / 2, width / 2, height / 2);
            } else {
                this.container.drawCircle(width / 2, width / 2, width / 2);
            }
            break;

        default: this.container.drawRect(0, 0, width, height);
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
    ROUNDED_RECTANGLE   : "roundedRectangle"
};
