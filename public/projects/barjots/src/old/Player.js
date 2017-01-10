import Entity from "src/Entity";
import Sprite from "src/Component/Sprite";


export default class Player extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {{}} props: properties
     */
    constructor (props) {
        super(props);

        this.debug  = true;
        this.width  = 30;
        this.height = 30;
        this.speed  = {x: 150, y: 150, dash: 700};

        this.force      = 400;
        this.dashing    = false;
    }

    /**
     * @initialize
     * @override
     */
    initialize (parent) {
        super.initialize(parent);

        if (this.has("sprite")) {
            this.sprite.offset = {x: 17, y: 34};
            this.sprite.addAnimation("idle", 0, [143]).
                addAnimation("move_up", 5, [104, 105, 106, 107, 108, 109, 110, 111, 112]).
                addAnimation("move_down", 5, [130, 131, 132, 133, 134, 135, 136, 137, 138]).
                addAnimation("move_left", 5, [117, 118, 119, 120, 121, 122, 123, 124, 125]).
                addAnimation("move_right", 5, [143, 144, 145, 146, 147, 148, 149, 150, 151]);

            this.idle();
        }
    }

    /**
     * @update
     * @override
     */
    update () {
        super.update();

        if (this.has("sprite")) {
            this.updateSprite();
        }
    }

    /**
     * Update the sprite compared to its direction
     * @returns {void}
     */
    updateSprite () {
        const direction = this.getDirectionName();

        this.sprite.currentAnimation(direction ? `move_${direction}` : "idle");
    }

    /* METHODS */

    /**
     * Get the name of the direction
     * @returns {string|null} the name
     */
    getDirectionName () {
        if (this.direction.y) {
            return this.direction.y < 0 ? "up" : "down";

        } else if (this.direction.x) {
            return this.direction.x < 0 ? "left" : "right";

        }

        return null;
    }

    /**
     * Set the player to its idle animation
     * @returns {void}
     */
    idle () {
        this.sprite.currentAnimation("idle");
        this.sprite.flip.x = this.flip;
    }

    /* GETTERS & SETTERS */

    get name () {
        return "player";
    }
}

export class PlayerChris extends Player {
    constructor (props) {
        super(props);

        this.compose(new Sprite({ path: "images/characters/chris.png", width: 64, height: 64 }));
    }

    get name () {
        return "chris";
    }
}

export class PlayerClems extends Player {
    constructor (props) {
        super(props);

        this.compose(new Sprite({ path: "images/characters/clems.png", width: 64, height: 64 }));
    }

    get name () {
        return "clems";
    }
}
