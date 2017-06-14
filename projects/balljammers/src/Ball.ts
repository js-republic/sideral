import { Entity } from "sideral/Entity";
import { Particles } from "sideral/Entity/Particles";
import { Enum, Assets } from "sideral/Tool";

import { Goal } from "./Goal";
import { Player } from "./Player/Player";
import { Arena } from "./Arena";

import * as trailConfig from "./Particles/trail.json";


Assets.preload("ball", "images/ball.png")
    .preload("bolt", "images/particles/bolt.png")
    .preloadSound("ball", "sounds/ball.wav");

/**
 * The ball class
 */
export class Ball extends Entity {

    /* ATTRIBUTES */

    /**
     * Particles to emit when the ball has a high velocity
     */
    trail: Particles = null;

    lastPlayer: Player;


    /* LIFECYCLE */

    constructor () {
        super();

        this.name = "ball";

        this.setProps({
            box     : Enum.BOX.CIRCLE,
            type    : Enum.TYPE.WEAK,
            friction: 0.5,
            bounce  : 0.52,
            width   : 26,
            height  : 26
        });

        this.signals.beginCollision.bind("goal", this.onCollisionWithGoal.bind(this));
        this.signals.beginCollision.bind("player", this.onCollisionWithPlayer.bind(this));
        this.signals.wallCollision.add(this.onCollision.bind(this));
        this.signals.update.add(this.updateVelocity.bind(this));
    }

    /**
     * @initialize
     */
    initialize (props) {
        super.initialize(props);

        this.addSprite("ball", 32, 32, { x: -3, y: -3 });

        this.trail = <Particles> this.context.scene.add(new Particles(), {
            follow  : this.beFollowed(true),
            images  : "bolt",
            config  : trailConfig,
            autoRun : false
        });

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

    onCollision () {
         Assets.getSound().play("ball");
    }

    /**
     * Update the velocity of the ball
     */
    updateVelocity (): void {
        const bodySpeed     = Math.abs(this.physic.getVelocity().x),
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
        if (this.props.y > goal.props.y) {
            this.trail.stop();
            this.pause(true);
            (<Arena> this.context.scene).goal(goal);
        }
    }

    /**
     * When entering in collision with a player entity
     * @param player - Player which entered in colision with this ball
     */
    onCollisionWithPlayer (player: Player) {
        this.lastPlayer = player;
    }
}
