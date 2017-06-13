import { Entity } from "sideral/Entity";
import { Enum, Assets } from "sideral/Tool";


Assets.preload("goal", "images/goal.png");

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
        this.addSprite("goal", this.props.width, this.props.height);
    }
}
