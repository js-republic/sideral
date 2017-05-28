import { Entity } from "src/Entity";
import { Enum } from "src/Tool";


/**
 * The goal class
 */
export class Goal extends Entity {

    /* ATTRIBUTES */

    /**
     * The name  of the goal
     */
    name: string = "goal";

    /**
     * We set the type to static to be not affected by gravity and cannot be moved
     */
    type: number = Enum.TYPE.STATIC;


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            width           : 45,
            height          : 130
        });

        this.addSprite("images/goal.png", this.props.width, this.props.height);
    }
}
