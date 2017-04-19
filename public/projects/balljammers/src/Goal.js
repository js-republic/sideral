import Entity from "src/Entity";


export default class Goal extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            width           : 45,
            height          : 130,
            gravityFactor   : 0,
            flip            : false,
            mass            : Entity.MASS.SOLID
        });

        this.bind(this.SIGNAL.VALUE_CHANGE("flip"), this.createAction(() => this.spritesheet && (this.spritesheet.props.flip = this.props.flip)));
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.spritesheet = this.addSprite("images/goal.png", this.props.width, this.props.height);
    }
}
