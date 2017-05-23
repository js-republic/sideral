import { Module } from "./../Module";

import {Util, Enum} from "../Tool/";


export class Shape extends Module {
    container = new PIXI.Graphics();

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

        this.signals.propChange.bind(["box", "fill", "stroke"], this._updateShape.bind(this));
    }

    initialize (props) {
        super.initialize(props);

        this._updateShape();
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
            fill        = this.props.fill === "transparent" ? 0x000000 : Util.colorToDecimal(this.props.fill);

        this.container.clear();

        if (this.props.stroke !== "transparent" && !isNaN(stroke)) {
            this.container.lineStyle(1, stroke, 1);
        }

        console.log(fill, stroke);
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
