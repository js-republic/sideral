import { Graphic } from "./../Graphic";
import { Text } from "./../Module";
import { Color } from "./../Tool";
import { IDialogProps } from "./../Interface";


export class Dialog extends Graphic {

    /* ATTRIBUTES */

    /**
     * Properties of a dialog
     */
    props: IDialogProps;


    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            offsetX: 0,
            offsetY: 0
        });

        this.signals.propChange.bind(["width", "height"], this.onLabelSizeChange.bind(this));
    }

    initialize (props) {
        super.initialize(props);

        this.shape("shape", {
            width: this.props.width,
            height: this.props.height,
            stroke: Color.cyan400,
            strokeThickness: 2,
            fill: Color.black,
            fillAlpha: 0.7

        }).text("label", (label: Text) => {
            label.signals.propChange.bind("width", this.onLabelSizeChange.bind(this));

            return {
                fill: Color.white,
                y: 10
            }
        });

        this.context.scene.signals.propChange.bind(["width", "height"], this.onScreenSizeChange.bind(this));
        this.onScreenSizeChange();
    }


    /* EVENTS */

    /**
     * When the label width attributes has changed
     */
    onLabelSizeChange (): void {
        this.text("label", (label: Text) => {
            return {
                x: (this.props.width / 2) - (label.props.width / 2)
            };
        });
    }

    onScreenSizeChange (): void {
        const scene                         = this.context.scene,
            { width, height }               = scene.props,
            { centerScreen, fullScreen, offsetX, offsetY }    = this.props;

        if (!fullScreen && !centerScreen) {
            return null;
        }

        const pos = this.getRelativePosition();

        if (fullScreen) {
            this.props.x        = pos.x + offsetX;
            this.props.y        = pos.y + offsetY;
            this.props.width    = width;
            this.props.height   = height;

            this.shape("shape", {
                width: width,
                height: height
            });

        } else if (centerScreen) {
            this.props.x        = pos.x + offsetX + (width / 2) - (this.props.width / 2);
            this.props.y        = pos.y + offsetY + (height / 2) - (this.props.height / 2);

        }
    }
}