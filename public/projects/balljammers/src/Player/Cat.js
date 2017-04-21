import Player from "./../Player";


export default class PlayerCat extends Player {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.size(25, 45);
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.props.debug = true;
        this.spritesheet = this.addSprite("images/characters/cat.png", 65, 65, { x: -15, y: -7 });
    }

    update () {
        super.update();

        if (this.props.playerLeft) {
            // console.log(this.body.position);
        }
    }
}
