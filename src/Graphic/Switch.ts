import { Graphic } from "./../Graphic";
import { Color, Enum } from "./../Tool";


export class Switch extends Graphic {

    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            activable: true
        });
    }

    initialize (props) {
        super.initialize(props);

        this.shape("shape", {
            width: 15,
            height: 15,
            stroke: Color.cyan400,
            strokeThickness: 3,
            fill: Color.black,
            fillAlpha: 0.5

        }, {
            active: {
                fill: Color.cyan400,
                fillAlpha: 1
            }

        }).text("label", {
            x: 30,
            y: -2,
            fill: Color.white,
            fontSize: 15
        });
    }
}