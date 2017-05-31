import { Hitbox, Skill } from "src/Entity";
import { Enum } from "src/Tool";

import { Player } from "./Player";
import { Ball } from "./../Ball";


export class PlayerAttackHitbox extends Hitbox {

    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            width: 20,
            height: 30
        });
    }


    /* EVENTS */

    /**
     * @event hit
     * @override
     */
    onHit (name: string, other) {
        console.log(name);

        return name === "ball" ? this.onHitWithBall(other) : false;
    }

    /**
     * On collision with ball
     * @param {Ball} ball: the ball
     * @returns {Boolean} correct hit
     */
    onHitWithBall (ball: Ball) {
        const owner = this.props.owner as Player;

        ball.props.vx   = owner.props.powerX * (owner.props.x < ball.props.x ? 1 : -1) * (owner.standing ? 1 : 2);
        ball.props.vy   = -Math.abs(owner.props.powerY);

        return true;
    }
}

/**
 * The skill to attack the ball
 */
export class PlayerAttackSkill extends Skill {

    /* ATTRIBUTES */

    /**
     * The animation of the owner
     */
    animation: string = "attack";

    /**
     * The duration of the skill
     */
    duration: number = 1;

    /**
     * The type of duration of the skill (we set the time from the duration of the animation
     */
    durationType: string = Enum.DURATION_TYPE.ANIMATION_LOOP;

    /**
     * The hitbox class used when launching this skill
     */
    hitboxClass: any = PlayerAttackHitbox;


    /* METHODS */

    /**
     * @override
     */
    addHitbox (hitboxObject: Hitbox, hitboxProps: any = {}) {
        hitboxProps.follow = this.owner.beFollowed(false, this.owner.props.width + 5, this.owner.props.height - hitboxObject.props.height, - hitboxObject.props.width - 5);

        return super.addHitbox(hitboxObject, hitboxProps);
    }
}
