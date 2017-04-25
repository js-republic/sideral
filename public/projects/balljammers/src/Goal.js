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

        console.log(this.props.x, this.props.y, this.body.position[0], this.body.position[1], this.props.width, this.props.height, this.body.shapes[0].width, this.body.shapes[0].height);
        this.spritesheet = this.addSprite("images/goal.png", this.props.width, this.props.height);
    }
}
