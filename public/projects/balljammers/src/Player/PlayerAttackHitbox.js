import Hitbox from "src/Module/Hitbox";


export default class PlayerAttackHitbox extends Hitbox {

    /* LIFECYCLE */

    /**
     * @initialize
     * @override
     * @lifecycle
     */
    initialize (props) {
        const owner = props.owner;

        this.offset(owner.props.width, owner.props.height - 20);
        this.size(50, 20);

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

        ball.props.vx   = owner.props.power * (owner.props.x < ball.props.x ? 1 : -1);
        ball.props.vy   -= 200;

        return true;
    }
}
