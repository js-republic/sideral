import Sprite from "src/Entity/Sprite";


export default class Goald extends Sprite {

    /* LIFECYCLE */

    constructor () {
        super();

        this.size(45, 140);

        this.gravityFactor  = 0;
        this.collision.mass = this.collision.MASS.SOLID;

        this.setSpritesheet("images/goal.png", this.width, this.height);
    }
}
