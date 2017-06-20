import { Graphic } from "./../Graphic";

import { IShapeProps } from "./../Interface";

import { Util, Enum, Color } from "./../Tool/";


/**
 * The module to display shapes
 */
export class Shape extends Graphic {

    /* ATTRIBUTES */

    /**
     * Properties of a Shape
     */
    props: IShapeProps;

    /**
     * PIXI Container
     * @readonly
     */
    container: PIXI.Graphics = new PIXI.Graphics();


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            stroke  : Color.transparent,
            strokeAlpha: 1,
            strokeThickness: 1,
            fill    : Color.white,
            fillAlpha: 1,
            box     : Enum.BOX.RECTANGLE
        });

        this.signals.propChange.bind(["box", "fill", "stroke", "strokeThickness", "strokeAlpha", "fillAlpha", "width", "height", "radius"], this._updateShape.bind(this));
    }


    /* PRIVATE */

    /**
     * Update the current shape
     * @private
     */
    _updateShape (): void {
        const stroke    = Util.colorToDecimal(this.props.stroke),
            fill        = this.props.fill === "transparent" ? 0x000000 : Util.colorToDecimal(this.props.fill);

        this.container.clear();

        if (this.props.stroke !== Color.transparent && !isNaN(stroke)) {
            this.container.lineStyle(this.props.strokeThickness, stroke, this.props.strokeAlpha);
        }

        this.container.beginFill(fill, this.props.fill === Color.transparent ? 0 : this.props.fillAlpha);
        this._drawShape();
        this.container.endFill();
    }

    /**
     * Draw the shape with the current type value
     * @private
     */
    _drawShape (): void {
        const { x, y, width, height, radius, box } = this.props;

        switch (box) {
            case Enum.BOX.CIRCLE:
                if (width !== height) {
                    this.container.drawEllipse(width / 2, height / 2, width / 2, height / 2);
                } else {
                    this.container.drawCircle(width / 2, width / 2, width / 2);
                }
                break;

            default: 
                if (this.props.radius) {
                    this.container.drawRoundedRect(x, y, width, height, radius);
                } else {
                    this.container.drawRect(x, y, width, height);
                }
                break;
        }
    }
}
