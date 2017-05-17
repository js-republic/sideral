import Hitbox from "../../../../src/Entity/Hitbox";

import Skill from "../../../../src/Tool/Skill";
import Enum from "../../../../src/Tool/Enum";


class PlayerAttackHitbox extends Hitbox {

    /* LIFECYCLE */

    /**
     * @initialize
     * @override
     * @lifecycle
     */
    initialize (props) {
        const owner = props.owner;

        this.size(20, 30);
        this.offset(owner.props.width, owner.props.height - this.props.height, -this.props.width);

        super.initialize(props);
    }


    /* EVENTS */

    /**
     * @event hit
     * @override
     */
    onHit (name, other) {
        return name === "ball" ? this.onHitWithBall(other) : false;
    }

    /**
     * On collision with ball
     * @param {Ball} ball: the ball
     * @returns {Boolean} correct hit
     */
    onHitWithBall (ball) {
        const owner = this.props.owner;

        ball.props.vx   = owner.props.power * (owner.props.x < ball.props.x ? 1 : -1) * (owner.standing ? 1 : 2);
        ball.props.vy   -= 200;

        return true;
    }
}

export default class PlayerAttackSkill extends Skill {

    /**
     * @constructor
     * @override
     */
    constructor () {
        super();

        this.animation      = "attack";
        this.duration       = 1;
        this.durationType   = Enum.DURATION_TYPE.ANIMATION_LOOP;
        this.hitboxClass    = PlayerAttackHitbox;
    }

    addHitbox (hitboxClass, hitboxSettings = {}) {
        hitboxSettings.follow = this.owner;

        return super.addHitbox(hitboxClass, hitboxSettings);
    }
}
