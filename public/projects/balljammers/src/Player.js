import Sprite from "src/Entity/Sprite";


export default class Player extends Sprite {

    /* LIFECYCLE */

    constructor () {
        super();

        this.size(64, 64);

        this.setSpritesheet("images/characters/chris.png", this.width, this.height);

        this.addAnimation("WALK_LEFT", 1, [0,1,2,3,4,5,6,7,8], 9);
        this.addAnimation("WALK_RIGHT", 1, [0,1,2,3,4,5,6,7,8], 11);
        this.addAnimation("WALK_DOWN", 1, [0,1,2,3,4,5,6,7,8], 10);
        this.addAnimation("WALK_UP", 1, [0,1,2,3,4,5,6,7,8], 12);


    }
}
