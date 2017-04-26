import Player from "./../Player";


export default class PlayerCat extends Player {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            width: 25,
            height: 45,
            debug: true
        });
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.spritesheet = this.addSprite("images/characters/cat.png", 65, 65, { x: -15, y: -7 });
    }

    update () {
        super.update();

        if (this.props.playerLeft) {
            // console.log(thisthis.body.position[1]);
        }
    }
}
