import { Graphic, Shape, Text } from "./index";
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
            paddingHorizontal: 0,
            paddingVertical: 0,
            sizeAuto: true
        });

        this.signals.propChange.bind(["width", "height", "paddingHorizontal", "paddingVertical"], this.onSizeChange.bind(this));
        this.signals.hoverStart.add(() => this.setState("hover"));
        this.signals.hoverEnd.add(() => this.setState());
    }

    initialize (props) {
        super.initialize(props);

        this.addGraphic("shape", new Shape(), {
            width: this.props.width + this.props.paddingHorizontal,
            height: this.props.height + this.props.paddingVertical
        });

        const label = this.addGraphic("label", new Text());


        if (this.props.sizeAuto && label) {
            label.signals.propChange.bind(["width", "height"], this.onLabelSizeChange.bind(this));
        }
    }


    /* EVENTS */

    /**
     * When "width" or "height" attributes of label has changed
     */
    onLabelSizeChange (): void {
        const label = this.getGraphic("label");

        this.props.width    = label.props.width;
        this.props.height   = label.props.height;
    }

    /**
     * When size attributes has changed
     */
    onSizeChange (): void {
        const label = this.getGraphic("label"),
            shape   = this.getGraphic("shape");

        if (label) {
            label.props.x = this.props.paddingHorizontal / 2;
            label.props.y = this.props.paddingVertical / 2;
        }

        if (shape && this.props.sizeAuto) {
            shape.props.width  = this.props.width + this.props.paddingHorizontal;
            shape.props.height = this.props.height + this.props.paddingVertical;
        }
    }
}