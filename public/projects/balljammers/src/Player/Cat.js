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
            height: 45
        });

        this.addSprite("images/characters/cat.png", 65, 65, { x: -15, y: -7 })
            .addAnimation("idle", 1, [5, 16, 17]);
    }

    /**
     * @update
     * @lifecycle
     * @override
     */
    update () {
        super.update();

        if (this.props.playerLeft) {
            // console.log(thisthis.body.position[1]);
        }
    }
}
