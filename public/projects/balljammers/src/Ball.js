import Sprite from "src/Entity/Sprite";


export default class Ball extends Sprite {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name           = "ball";

        // this.collision.mass = this.collision.MASS.WEAK;

        this.size(32, 32);

        this.setSpritesheet("images/ball.png", this.width, this.height);
    }
}
