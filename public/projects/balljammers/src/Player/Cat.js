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

        this.addSprite("images/characters/cat.png", 65, 65, { x: -20, y: -14 })
            .addAnimation("idle", 80, [18, 19, 20, 21, 22, 23, 24, 25, 26, 27], true);
    }
}
