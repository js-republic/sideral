import Sprite from "src/Entity/Sprite";


export default class Player extends Sprite {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name = "player";

        this.size(64, 64);

        this.setSpritesheet("images/characters/chris.png", this.width, this.height);
    }
}
