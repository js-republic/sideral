import Entity from "src/Entity";
import Sprite from "src/Component/Sprite";


export default class ninja extends Entity {

    /* LIFECYCLE */

    constructor (props) {
        super(props);

        this.debug      = true;
        this.grab       = false;
        this.dbljump    = false;
        this.jump       = 300;
        this.width      = 25;
        this.height     = 25;

        this.compose(new Sprite({ path: "images/ninja.png", width: this.width, height: this.height }));
    }

    initialize (parent) {
        super.initialize(parent);

        this.sprite.addAnimation("idle", 10, [0, 1, 2, 3]).
            currentAnimation("idle");
    }

    /* GETTERS & SETTERS */

    get name () {
        return "ninja";
    }
}
