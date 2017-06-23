import { Graphic } from "./../Graphic";
import { Color, Util } from "./../Tool";
import { IProgressProps, IShapeProps } from "./../Interface";


export class Progress extends Graphic {

    /* ATTRIBUTES */

    /**
     * Properties of the progress Object
     */
    props: IProgressProps;

    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            min: 0,
            max: 100,
            value: 0
        });

        this.signals.propChange.bind(["width", "height"], this.onSizeChange.bind(this));
        this.signals.propChange.bind(["min", "max", "value"], this.onValueChange.bind(this));
    }

    initialize (props) {
        super.initialize(props);

        this.shape("fill", {
            width: this.getRatioWidth(),
            height: this.props.height,
            stroke: Color.transparent,
            fill: Color.white,
            fillAlpha: 1

        }).shape("shape", {
            width: this.props.width,
            height: this.props.height,
            fill: Color.transparent,
            stroke: Color.cyan400

        });

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
        this.onValueChange();

        this.shape("shape", {
            width: this.props.width,
            height: this.props.height
        });
    }

    /**
     * When the ratio value has changed ("min", "max" or "value")
     */
    onValueChange (): void {
        this.shape("fill", {
            width: this.getRatioWidth(),
            height: this.props.height
        });
    }
}