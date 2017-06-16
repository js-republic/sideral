import { Graphics, Shape } from "./index";
import { Text } from "./../Module";
import { IButtonProps, ITextProps, IShapeProps } from "./../Interface";


/**
 * This Graphic helpers let you create a button easily
 */
export class Button extends Graphics {

    /* ATTRIBUTES */

    /**
     * Properties of a button
     */
    props: IButtonProps;

    /**
     * Label module
     */
    label: Text;

    /**
     * Container module
     */
    shape: Shape;


    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            paddingHorizontal: 0,
            paddingVertical: 0,
            sizeAuto: true
        });

        this.signals.propChange.bind(["width", "height", "paddingHorizontal", "paddingVertical"], this.onSizeChange.bind(this));
        this.signals.hoverStart.add(() => this.onStateChange("hover"));
        this.signals.hoverEnd.add(() => this.onStateChange());
    }

    initialize (props) {
        super.initialize(props);

        if (this.props.label) {
            this.label = <Text> this.add(new Text(), Object.assign({}, this.props.label));
        }

        if (this.props.sizeAuto) {
            this.label.signals.propChange.bind(["width", "height"], this.onLabelSizeChange.bind(this));
            this.setProps({
                width: this.label.container.width,
                height: this.label.container.height
            });
        }

        if (this.props.shape) {
            this.shape = <Shape> this.add(new Shape(), Object.assign({
                width: this.props.width + this.props.paddingHorizontal,
                height: this.props.height + this.props.paddingVertical
            }, this.props.shape), 0);
        }
    }


    /* METHODS */

    /**
     * Update the properties of the shape
     * @param props - Next properties of the shape
     */
    updateShapeProps (props?: IShapeProps): void {
        this._updateChildProps(this.shape, "shape", props);
    }

    /**
     * Update the properties of the label
     * @param props - Next properties of the label
     */
    updateLabelProps (props?: ITextProps): void {
        this._updateChildProps(this.label, "label", props);
    }


    /* EVENTS */

    /**
     * When "width" or "height" attributes of label has changed
     */
    onLabelSizeChange (): void {
        this.props.width    = this.label.props.width;
        this.props.height   = this.label.props.height;
    }

    /**
     * When size attributes has changed
     */
    onSizeChange (): void {
        if (this.label) {
            this.label.props.x = this.props.paddingHorizontal / 2;
            this.label.props.y = this.props.paddingVertical / 2;
        }

        if (this.shape && this.props.sizeAuto) {
            this.shape.props.width  = this.props.width + this.props.paddingHorizontal;
            this.shape.props.height = this.props.height + this.props.paddingVertical;
        }
    }

    /**
     * When state has changed
     * @param state - Next state of the button
     */
    onStateChange (state?: string): void {
        console.log("state change", state);
        switch (state) {
            case "hover":
                if (this.props.hover) {
                    this._updateChildProps(this.label, "label", null, "hover");
                    this._updateChildProps(this.shape, "shape", null, "hover");
                }
                break;

            default:
                this._updateChildProps(this.label, "label");
                this._updateChildProps(this.shape, "shape");
                break;
        }
    }
}