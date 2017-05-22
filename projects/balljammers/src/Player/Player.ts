import { Entity } from "../../../../src/Entity";

import { Enum } from "../../../../src/Tool/Enum";

import { Ball } from '../Ball';
import { PlayerAttackSkill } from "./PlayerAttackSkill";
import { PlayerDashSkill } from "./PlayerDashSkill";
import { Arena } from '../Arena';


export class Player extends Entity {
    group:           number      = Enum.GROUP.ALL;
    type:            number      = Enum.TYPE.SOLID;
    name:            string      = "player";
    scene:           Arena       = null;
    speedFactor:     number      = 0;
    fallPressed:     boolean     = true;
    doubleJump:      boolean     = false;
    dashSide:        boolean     = false;
    holdLeft:        boolean     = false;
    holdRight:       boolean     = false;

    static SIDE = { LEFT: -1, RIGHT: 1, NONE: 0 };

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        // props
        this.setProps({
            speed       : 20,
            powerX      : 150,
            powerY      : 790,
            jump        : 600
        });

        // read-only
        this.group          = Enum.GROUP.ALL;
        this.type           = Enum.TYPE.SOLID;
        this.name           = "player";
        this.speedFactor    = 0;
        this.fallPressed    = true;
        this.doubleJump     = false;
        this.dashSide       = false;
        this.holdLeft       = false;
        this.holdRight      = false;

        // signals
        this.signals.beginCollision.bind("ball", this.onCollisionWithBall.bind(this));

        // skills
        this.skills.add("attack", new PlayerAttackSkill(this));
        this.skills.add("dash", new PlayerDashSkill(this));
    }

    /**
     * @update
     * @lifecycle
     * @override
     */
    update (tick) {
        this.props.vx = this.speedFactor * this.props.speed;

        super.update(tick);
    }

    /**
     * @nextCycle
     * @lifecycle
     * @override
     */
    nextCycle () {
        super.nextCycle();
        this._updateAnimation();

        this.props.vy = 0;
    }


    /* METHODS */

    /**
     * @event key left
     * @param {boolean} pressed: is pressed
     * @returns {void}
     */
    moveLeft (pressed: boolean) {
        this.holdLeft = pressed;

        if (pressed && !this.speedFactor) {
            this.speedFactor = -1;
            this.dash("left");

        } else if ((pressed && this.speedFactor === 1) || (!pressed && this.speedFactor === -1)) {
            this.speedFactor = 0;

        } else if (!pressed && this.holdRight) {
            this.speedFactor = 1;

        }
    }

    /**
     * @event key right
     * @param {boolean} pressed: is pressed
     * @returns {void}
     */
    moveRight (pressed: boolean) {
        this.holdRight = pressed;

        if (pressed && !this.speedFactor) {
            this.speedFactor = 1;
            this.dash("right");

        } else if ((pressed && this.speedFactor === -1) || (!pressed && this.speedFactor === 1)) {
            this.speedFactor = 0;

        } else if (!pressed && this.holdLeft) {
            this.speedFactor = -1;

        }
    }

    /**
     * @event key jump
     * @param {boolean} pressed: is pressed
     * @returns {void}
     */
    jump (pressed: boolean) {
        if (pressed) {
            let canJump = false;

            if (this.standing) {
                this.doubleJump = true;
                canJump         = true;

            } else if (this.doubleJump) {
                this.doubleJump = false;
                canJump         = true;
            }

            if (canJump) {
                this.dashSide       = null;
                this.fallPressed    = false;
                this.props.vy       = -Math.abs(this.props.jump);
            }

        }
    }

    /**
     * @event key fall
     * @param {boolean} pressed: is pressed
     * @returns {void}
     */
    fall (pressed: boolean) {
        if (pressed && !this.standing) {
            this.props.vy   += Math.abs(this.props.jump * 2);
            this.fallPressed = true;
        }
    }

    /**
     * @event key attack
     * @returns {void|null} -
     */
    attack () {
        this.skills.run("attack", { follow: this });
    }

    /**
     * run dash
     * @param {string} side: side of dash
     * @returns {void}
     */
    dash (side) {
        if (this.dashSide === side && !this.skills.isRunning("dash") && !this.timers.isFinished("dash")) {
            this.skills.run("dash", { side: side });

        } else {
            this.dashSide = side;
            this.timers.add("dash", 20, () => this.dashSide = false);
        }
    }


    /* EVENTS */

    /**
     * When entering in collision with ball
     * @param {Ball} ball: the ball
     * @returns {void}
     */
    onCollisionWithBall (ball: Ball) {
        if (
            !this.standing
            && this.props.y < ball.props.y
            && this.props.x + this.props.width > ball.props.x
            && this.props.x < ball.props.x + ball.props.width
        ) {
            const centerX   = this.props.x + (this.props.width / 2),
                ballCenterX = ball.props.x + (this.props.width / 2),
                factor      = this.fallPressed ? 1.5 : 0.3;

            switch (true) {
                case centerX < ballCenterX: ball.props.vx = this.props.power * factor;
                    break;
                case centerX > ballCenterX: ball.props.vx = this.props.power * -factor;
                    break;
                default: ball.props.vx = this.props.power * factor * (this.props.flip ? -1 : 1);
                    break;
            }

            ball.props.vy = 0;
        }
    }


    /* PRIVATE */

    /**
     * Update sprite animation
     * @private
     * @returns {void|null} -
     */
    _updateAnimation () {
        if (this.speedFactor) {
            this.props.flip = this.speedFactor === -1;
        }

        if (this.skills.currentSkill) {
            return null;
        }

        if (this.standing) {
            this.sprite.setAnimation(this.speedFactor ? "run" : "idle");

        } else {
            this.sprite.setAnimation("jump");
        }
    }
}

