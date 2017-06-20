import { Button } from "sideral/Graphic";
import { Color } from "sideral/Tool";
import { IButtonProps } from "sideral/Interface";


export class ButtonExtended extends Button {

    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            paddingHorizontal: 40,
            paddingVertical: 10,
            label: true,
            shape: true,

            hover: {
                shape: {
                    fill: Color.orange900
                }
            }
        });
    }

    initialize (props) {
        super.initialize(props);

        this.updateGraphic("label", {
            fill: Color.white,
            dropShadow: true,
            dropShadowColor: Color.black,
            dropShadowAngle: 80,
            dropShadowBlur: 30,
            dropShadowDistance: 1
        });

        this.updateGraphic("shape", {
            stroke: Color.amber500,
            strokeThickness: 2,
            fill: Color.black,
            fillAlpha: 0.5,
            radius: 5
        });
    }
}