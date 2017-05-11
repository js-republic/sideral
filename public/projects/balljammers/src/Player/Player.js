import Entity from "src/Entity";

import Enum from "src/Command/Enum";

import PlayerAttackHitbox from "./PlayerAttackHitbox";


export default class Player extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            speed       : 100,
            power       : 300,
            jump        : 300,
            doubleDash  : false,
            vxFactor    : 0,
            holdLeft    : false,
            holdRight   : false
        });

        this.group          = Enum.GROUP.ALLY;
        this.type           = Enum.TYPE.SOLID;
        this.name           = "player";
        this.doubleJump     = false;

        this.skills.add("attack", {
            animation       : "attack",
            movable         : false,
            duration        : 1,
            durationType    : Enum.DURATION_TYPE.ANIMATION_LOOP,
            hitboxClass     : PlayerAttackHitbox
        });
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

    }

    /**
     * @update
     * @lifecycle
     * @override
     */
    update () {
        this.props.vx = this.props.vxFactor * this.props.speed;

        super.update();
    }

    /**
     * @nextCycle
     * @lifecycle
     * @override
     */
    nextCycle () {
        super.nextCycle();
        this._updateAnimation();

        this.props.vy = 0;
    }


    /* METHODS */

    /**
     * @event key left
     * @param {boolean} pressed: is pressed
     * @returns {void}
     */
    moveLeft (pressed) {
        this.props.holdLeft = pressed;

        if (pressed && !this.props.vxFactor) {
            this.props.vxFactor = -1;

        } else if ((pressed && this.props.vxFactor === 1) || (!pressed && this.props.vxFactor === -1)) {
            this.props.vxFactor = 0;

        } else if (!pressed && this.props.holdRight) {
            this.props.vxFactor = 1;

        }
    }

    /**
     * @event key right
     * @param {boolean} pressed: is pressed
     * @returns {void}
     */
    moveRight (pressed) {
        this.props.holdRight = pressed;

        if (pressed && !this.props.vxFactor) {
            this.props.vxFactor = 1;

        } else if ((pressed && this.props.vxFactor === -1) || (!pressed && this.props.vxFactor === 1)) {
            this.props.vxFactor = 0;

        } else if (!pressed && this.props.holdLeft) {
            this.props.vxFactor = -1;

        }
    }

    /**
     * @event key jump
     * @param {boolean} pressed: is pressed
     * @returns {void}
     */
    jump (pressed) {
        if (pressed) {
            let canJump = false;

            if (this.standing) {
                this.doubleJump = true;
                canJump         = true;

            } else if (this.doubleJump) {
                this.doubleJump = false;
                canJump         = true;
            }

            if (canJump) {
                this.props.vy = -Math.abs(this.props.jump);
            }

        }
    }

    /**
     * @event key fall
     * @param {boolean} pressed: is pressed
     * @returns {void}
     */
    fall (pressed) {
        if (pressed) {
            this.props.vy += Math.abs(this.props.jump * 2);
        }
    }

    /**
     * @event key attack
     * @returns {void|null} -
     */
    attack () {
        this.skills.run("attack");
    }


    /* PRIVATE */

    /**
     * Update sprite animation
     * @private
     * @returns {void|null} -
     */
    _updateAnimation () {
        if (this.props.vxFactor) {
            this.props.flip = this.props.vxFactor === -1;
        }

        if (this.skills.currentSkill) {
            return null;
        }

        if (this.standing) {
            this.sprite.setAnimation(this.props.vxFactor ? "run" : "idle");

        } else {
            this.sprite.setAnimation("jump");
        }
    }
}

Player.SIDE = {
    LEFT    : -1,
    RIGHT   : 1,
    NONE    : 0
};
