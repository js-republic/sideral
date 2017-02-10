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

        this.size(64, 64);

        this.setSpritesheet("images/characters/chris.png", this.width, this.height);

        // Define collision mixin
        /* this.mix(new Collision(), null, collision => {
            collision.mass = collision.MASS.WEAK;
        });
        */
    }
}
