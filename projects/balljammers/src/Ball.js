import Entity from "src/Entity";

import Particles from "src/Entity/Particles";

import Enum from "src/Tool/Enum";

import trailConfig from "./Particles/trail.json";


export default class Ball extends Entity {

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

        this.name       = "ball";
        this.friction   = true;
        this.type       = Enum.TYPE.WEAK;
        this.box        = Enum.BOX.CIRCLE;

        this.trail   = null;

        this.signals.beginCollision.bind("goal", this.onCollisionWithGoal.bind(this));
        this.signals.update.add(this.updateVelocity.bind(this));

        this.addSprite("images/ball.png", 32, 32, { x: -3, y: -2 });
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.setBounce(0.65);
        this.respawn();

        this.trail = this.scene.add(new Particles(), {
            follow: this.beFollowed(true),
            images: "images/particles/bolt.png",
            config: trailConfig,
            autoRun: false
        });
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
     * Update of the velocity
     * @returns {void}
     */
    updateVelocity () {
        const bodySpeed     = Math.abs(this.body.vx),
            trailRunning    = this.trail.isRunning();

        this.props.vx = this.props.vy = 0;

        if (!trailRunning && bodySpeed > 100) {
            this.trail.run();

        } else if (trailRunning && bodySpeed <= 100) {
            this.trail.stop();

        }
    }

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
