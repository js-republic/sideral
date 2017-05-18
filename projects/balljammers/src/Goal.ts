import { Entity } from "../../../src/Entity";

import { Enum } from "../../../src/Tool/Enum";


export class Goal extends Entity {
    name = "goal";
    type = Enum.TYPE.STATIC;
    group = Enum.GROUP.ALL;

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

        this.addSprite("images/goal.png", (<any>this.props).width, (<any>this.props).height);
    }
}
