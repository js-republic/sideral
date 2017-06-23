import { Graphic } from "./../Graphic";
import { Color } from "./../Tool";
import { IButtonProps, ITextProps, IShapeProps } from "./../Interface";


/**
 * This Graphic helpers let you create a button easily
 */
export class Button extends Graphic {

    /* ATTRIBUTES */

    /**
     * Properties of a button
     */
    props: IButtonProps;


    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            sizeAuto: false,
            labelCentered: true
        });

        this.signals.propChange.bind(["width", "height"], this.updateLabelPosition.bind(this));
    }

    initialize (props) {
        super.initialize(props);

        if (!this.props.width && !this.props.height) {
            this.props.sizeAuto = true;
        }

        this.shape("shape", {
            width: this.props.width,
            height: this.props.height,
            stroke: Color.cyan400,
            strokeThickness: 2,
            fill: Color.black,
            fillAlpha: 0.5,
            radius: 5

        }, {
            hover: {
                fill: Color.cyan900,
                fillAlpha: 1
            }

        }).text("label", {
            fill: Color.white,
            dropShadow: true,
            dropShadowColor: Color.black,
            dropShadowAngle: 80,
            dropShadowBlur: 30,
            dropShadowDistance: 1

        });

        this.graphics.label.item.signals.propChange.bind(["width", "height"], this.updateLabelPosition.bind(this));
    }


    /* EVENTS */

    /**
     * Update the position of the label when a size has changed
     */
    updateLabelPosition (): void {
        if (this.props.labelCentered) {
            this.text("label", label => {
                return {
                    x: (this.props.width / 2) - (label.props.width / 2),
                    y: (this.props.height / 2) - (label.props.height / 2)
                }
            });
        }
    }
}