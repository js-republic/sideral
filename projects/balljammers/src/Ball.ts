import { Entity } from "src/Entity";

import { Particles } from "src/Entity/Particles";

import { Enum } from "src/Tool/Enum";

import * as trailConfig from "./Particles/trail.json";


export class Ball extends Entity {

    /* ATTRIBUTES */

    name: string        = "ball";
    friction: boolean   = true;
    type: number        = Enum.TYPE.WEAK;
    box: string         = Enum.BOX.CIRCLE;
    trail: Particles    = null;


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            width           : 26,
            height          : 26,
            gravityFactor   : 1
        });

        this.signals.beginCollision.bind("goal", this.onCollisionWithGoal.bind(this));
        this.signals.update.add(this.updateVelocity.bind(this));

        this.addSprite("images/ball.png", 32, 32, { x: -3, y: -2 });
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props: any) {
        super.initialize(props);

        // this.setBounce(0.65);

        this.trail = <Particles> this.context.scene.add(new Particles(), {
            follow  : this.beFollowed(true),
            images  : "images/particles/bolt.png",
            config  : trailConfig,
            autoRun : false
        });

      this.respawn();
    }


    /* METHODS */

    /**
     * Respawn the ball to an other position
     * @returns {void}
     */
    respawn () {
        this.resume(true);
        this.idle();
        this.position((this.context.scene.props.width / 2) - 200 + Math.floor(Math.random() * 400), 50);
    }


    /* EVENTS */

    /**
     * Update the velocity of the ball
     * @returns {void}
     */
    updateVelocity () {
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
     * @param {Goal} goal: goal entity
     * @returns {void}
     */
    onCollisionWithGoal (goal) {
        if (this.props.y > goal.props.y)
            this.trail.stop();
            this.pause(true);{
            this.context.scene.goal(goal);
        }
    }
}
