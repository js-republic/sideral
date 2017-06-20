import { Graphic, Shape, Text } from "./../Graphic";
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
            paddingHorizontal: 0,
            paddingVertical: 0
        });

        this.signals.propChange.bind(["width", "height", "paddingHorizontal", "paddingVertical"], this.onSizeChange.bind(this));
    }

    initialize (props) {
        super.initialize(props);

        this.addGraphic("modal", new Shape(), {
            width: this.context.scene.props.width,
            height: this.context.scene.props.height
        });

        this.addGraphic("shape", new Shape(), {
            width: this.props.width,
            height: this.props.height
        });

        const label = this.addGraphic("label", new Text(), {
            y: 10
        });

        if (label) {
            label.signals.propChange.bind("width", this.onLabelSizeChange.bind(this));
        }
    }


    /* EVENTS */

    /**
     * When size attributes has changed
     */
    onSizeChange (): void {
        this.updateGraphic("shape", {
            width: this.props.width,
            height: this.props.height
        });

        this.onLabelSizeChange();
    }

    /**
     * When the label width attributes has changed
     */
    onLabelSizeChange (): void {
        const label = this.getGraphic("label");

        if (label) {
            label.props.x = (this.props.width / 2) + (this.props.paddingHorizontal / 2) - (label.props.width / 2);
        }
    }
}