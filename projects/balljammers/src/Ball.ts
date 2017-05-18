import { Entity } from "../../../src/Entity";

import { Enum } from "../../../src/Tool/Enum";


export class Ball extends Entity {
    name: string = 'ball';
    friction: boolean = true;
    type: number = Enum.TYPE.WEAK;
    box: string = Enum.BOX.CIRCLE;
    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            width           : 26,
            height          : 28,
            gravityFactor   : 1
        });

        this.signals.beginCollision.bind("goal", this.onCollisionWithGoal.bind(this));

        this.addSprite("images/ball.png", 32, 32, { x: -3, y: -2 });
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props: any) {
        super.initialize(props);

        this.setBounce(0.65);
        this.respawn();
    }

    /**
     * @update
     * @lifecycle
     * @override
     */
    update () {
        super.update();

        this.props.vx = this.props.vy = 0;
    }


    /* METHODS */

    /**
     * Respawn the ball to an other position
     * @returns {void}
     */
    respawn () {
        this.idle();
        this.position((this.scene.props.width / 2) - 200 + Math.floor(Math.random() * 400), 50);
    }


    /* EVENTS */

    /**
     * When entering in collision with a goal entity
     * @param {Goal} goal: goal entity
     * @returns {void}
     */
    onCollisionWithGoal (goal) {
        if (this.props.y > goal.props.y) {
            this.respawn();
        }
    }
}
