import { Entity } from "src/Entity";
import { Enum, Assets } from "src/Tool";


Assets.preload("images/goal.png");

/**
 * The goal class
 */
export class Goal extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name = "goal";

        this.setProps({
            type            : Enum.TYPE.STATIC,
            width           : 45,
            height          : 130
        });
    }

    initialize (props) {
        super.initialize(props);
        this.addSprite("images/goal.png", this.props.width, this.props.height);
    }
}
