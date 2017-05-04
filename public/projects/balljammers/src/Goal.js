import Entity from "src/Entity";

import Enum from "src/Command/Enum";


export default class Goal extends Entity {

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

        this.name   = "goal";
        this.type   = Enum.TYPE.STATIC;
        this.group  = Enum.GROUP.ALL;

        this.addSprite("images/goal.png", this.props.width, this.props.height);
    }
}
