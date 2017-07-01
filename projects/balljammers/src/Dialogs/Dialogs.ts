import { Dialog } from "sideral/Graphic";
import { Scene, Shape, Text } from "sideral/Module";
import { Color } from "sideral/Tool";


export class Dialogs extends Dialog {

    /* ATTRIBUTES */


    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            opacity: 0,
            centerScreen: true
        });
    }


    /* EVENTS */

    updatePositionByScene (): void {
        const scene = this.context.scene,
            width   = scene.props.width,
            height  = scene.props.height;

        this.setProps({
            x: (width / 2) - (this.props.width / 2),
            y: (height / 2) - (this.props.height / 2)
        });

        this.text("label", (label: Text) => {
            const shape = <Shape> this.getGraphicItem("shape");

            return {
                x: (shape.props.width / 2) - (label.props.width / 2),
                y: 10
            };
        });
    }
}
