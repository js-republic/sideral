import { Hitbox } from "src/Entity/Hitbox";
import { Ball } from '../Ball';
import { Skill } from "src/Tool/Skill";
import { Enum } from "src/Tool/Enum";


export class PlayerAttackHitbox extends Hitbox {

    /* LIFECYCLE */

    /**
     * @initialize
     * @override
     * @lifecycle
     */
    initialize (props: any) {
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
    onHit (name: string, other) {
        return name === "ball" ? this.onHitWithBall(other) : false;
    }

    /**
     * On collision with ball
     * @param {Ball} ball: the ball
     * @returns {Boolean} correct hit
     */
    onHitWithBall (ball: Ball) {
        const owner = this.props.owner;

        ball.props.vx   = owner.props.powerX * (owner.props.x < ball.props.x ? 1 : -1) * (owner.standing ? 1 : 2);
        ball.props.vy   = -Math.abs(owner.props.powerY);

        return true;
    }
}