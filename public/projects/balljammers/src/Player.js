import Sprite from "src/Entity/Sprite";
import Collision from "src/Mixin/Collision";


export default class Player extends Sprite {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name = "player";

        /**
         * Speed of the player
         * @type {number}
         */
        this.speed = 250;

        this.size(64, 64);

        this.setSpritesheet("images/characters/chris.png", this.width, this.height);
    }
}
