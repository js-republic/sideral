import { Graphic, Shape } from "./../Graphic";
import { Color, Util } from "./../Tool";
import { IProgressProps, IShapeProps } from "./../Interface";


export class Progress extends Graphic {

    /* ATTRIBUTES */

    /**
     * Properties of the progress Object
     */
    props: IProgressProps;

    /**
     * Container Shape for stroke
     */
    stroke: Shape;

    /**
     * Container Shape for fill
     */
    fill: Shape;


    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            strokeAlpha: 1,
            strokeThickness: 1,
            backgroundAlpha: 1,
            min: 0,
            max: 100,
            value: 0
        });

        this.signals.propChange.bind(["width", "height"], this.onSizeChange.bind(this));
        this.signals.propChange.bind(["min", "max", "value"], this.onValueChange.bind(this));
    }

    initialize (props) {
        super.initialize(props);

        this.fill = <Shape> this.add(new Shape(), {
            width: this.getRatioWidth(),
            height: this.props.height,
            stroke: Color.transparent,
            fill: this.props.backgroundColor,
            fillAlpha: this.props.backgroundAlpha
        });

        if (this.props.strokeColor && this.props.strokeColor !== Color.transparent) {
            this.stroke = <Shape> this.add(new Shape(), {
                width: this.props.width,
                height: this.props.height,
                fill: Color.transparent,
                stroke: this.props.strokeColor,
                strokeThickness: this.props.strokeThickness,
                strokeAlpha: this.props.strokeAlpha
            });
        }

        this.onValueChange();
    }


    /* METHODS */

    /**
     * Get the percentage of progression relative to the value and the max value
     * @returns The percentage
     */
    getPercentage (): number {
        const { min, max }  = this.props,
            value           = Util.limit(this.props.value, min, max);

        return (value / max) * 100;
    }

    /**
     * Get the width relative to the Percentage of progression
     * @returns The width rationed
     */
    getRatioWidth (): number {
        return (this.props.width * this.getPercentage()) / 100;
    }


    /* EVENTS */

    /**
     * When width or height attributes has changed
     */
    onSizeChange (): void {
        if (this.fill) {
            this.onValueChange();
            this.fill.props.height  = this.props.height;
        }

        if (this.stroke) {
            this.stroke.props.width     = this.props.width;
            this.stroke.props.height    = this.props.height;
        }
    }

    /**
     * When the ratio value has changed ("min", "max" or "value")
     */
    onValueChange (): void {
        if (this.fill) {
            this.fill.props.width = this.getRatioWidth();
        }
    }
}