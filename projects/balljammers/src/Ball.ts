import { Entity } from "src/Entity";
import { Particles } from "src/Entity/Particles";
import { Enum } from "src/Tool";

import { Goal } from "./Goal";

import * as trailConfig from "./Particles/trail.json";


/**
 * The ball class
 */
export class Ball extends Entity {

    /* ATTRIBUTES */

    /**
     * The name of the ball
     */
    name: string = "ball";

    /**
     * Enable friction mode
     */
    friction: boolean = true;

    /**
     * We set the type Weak to get angular velocity
     */
    type: number = Enum.TYPE.WEAK;

    /**
     * A ball has a circle shape
     */
    box: string = Enum.BOX.CIRCLE;

    /**
     * Particles to emit when the ball has a high velocity
     */
    trail: Particles = null;


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            width           : 26,
            height          : 26,
            bounce          : 0.65,
            gravityFactor   : 1
        });

        console.log(this.signals);
        this.signals.beginCollision.bind("goal", this.onCollisionWithGoal.bind(this));
        this.signals.update.add(this.updateVelocity.bind(this));

        this.addSprite("images/ball.png", 32, 32, { x: -3, y: -2 });

        this.trail = <Particles> this.context.scene.add(new Particles(), {
            follow  : this.beFollowed(true),
            images  : "images/particles/bolt.png",
            config  : trailConfig,
            autoRun : false
        });
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props: any): void {
        super.initialize(props);
        this.respawn();
    }


    /* METHODS */

    /**
     * Respawn the ball to an other position
     */
    respawn (): void {
        this.resume(true);
        this.idle();
        this.position((this.context.scene.props.width / 2) - 200 + Math.floor(Math.random() * 400), 50);
    }


    /* EVENTS */

    /**
     * Update the velocity of the ball
     */
    updateVelocity (): void {
        const bodySpeed     = Math.abs(this.body.vx),
            trailRunning    = this.trail.isRunning();

        this.props.vx = this.props.vy = 0;

        if (!trailRunning && bodySpeed > 300) {
            this.trail.run();

        } else if (trailRunning && bodySpeed <= 300) {
            this.trail.stop();

        }
    }

    /**
     * When entering in collision with a goal entity
     * @param goal - Goal entity
     */
    onCollisionWithGoal (goal: Goal) {
        if (this.props.y > goal.props.y)
            this.trail.stop();
            this.pause(true);{
            this.context.scene.goal(goal);
        }
    }
}
