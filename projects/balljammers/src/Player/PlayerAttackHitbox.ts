import { Hitbox } from "src/Entity/Hitbox";

import { Player } from "./Player";
import { Ball } from "./../Ball";


export class PlayerAttackHitbox extends Hitbox {

    /* LIFECYCLE */

    /**
     * @initialize
     * @override
     * @lifecycle
     */
    initialize (props: any): void {
        this.size(20, 30);
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
        const owner = this.props.owner as Player;

        ball.props.vx   = owner.props.powerX * (owner.props.x < ball.props.x ? 1 : -1) * (owner.standing ? 1 : 2);
        ball.props.vy   = -Math.abs(owner.props.powerY);

        return true;
    }
}