import { Module } from "./../Module";

import { IShapeProps } from "./../Interface";

import { Util, Enum } from "./../Tool/";


/**
 * The module to display shapes
 */
export class Shape extends Module {

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
            stroke  : "#FF0000",
            fill    : "#FFFFFF",
            box     : Enum.BOX.RECTANGLE
        });

        this.signals.propChange.bind(["box", "fill", "stroke", "width", "height"], this._updateShape.bind(this));
    }

    /**
     * @initialize
     */
    initialize (props): void {
        super.initialize(props);

        this._updateShape();
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
     */
    _drawShape (): void {
        const { x, y, width, height, box } = this.props;

        switch (box) {
            case Enum.BOX.CIRCLE:
                if (width !== height) {
                    this.container.drawEllipse(width / 2, height / 2, width / 2, height / 2);
                } else {
                    this.container.drawCircle(width / 2, width / 2, width / 2);
                }
                break;

            default: this.container.drawRect(x, y, width, height);
                break;
        }
    }
}
