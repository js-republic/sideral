import { Entity } from "src/Entity";
import { Enum } from "src/Tool";
import { IEntityProps } from "src/Interface/IProps";

import { Ball } from "./../Ball";
import { PlayerAttackSkill } from "./PlayerAttackSkill";
import { PlayerDashSkill } from "./PlayerDashSkill";


export interface IPlayerProps extends IEntityProps {

    /**
     * The speed of the player
     */
    speed: number;

    /**
     * The power in x axis when attacking the ball
     */
    powerX: number;

    /**
     * The power in y axis when attacking the ball
     */
    powerY: number;

    /**
     * The power of jump
     */
    jump: number;
}


/**
 * The class for players
 */
export class Player extends Entity {

    /* ATTRIBUTES */

    /**
     * Properties of a Player
     */
    props: IPlayerProps;

    /**
     * We group the player to "ALL" to collides from all groups
     */
    group: number = Enum.GROUP.ALL;

    /**
     * We set the type to "solid" to avoid angular velocity and large projection
     */
    type: number = Enum.TYPE.SOLID;

    /**
     * The name of the player class
     */
    name: string = "player";

    /**
     * The current speed factor of the player to determine if it goes to the left or to the right
     */
    speedFactor: number = 0;

    /**
     * The current side of the dash (left or right)
     */
    dashSide: number = 0;

    /**
     * Know if the player has pressed the fall button
     * @readonly
     */
    fallPressed: boolean = true;

    /**
     * Know if the player can use the double jump
     * @readonly
     */
    doubleJump: boolean = false;

    /**
     * Know if the player has held the left button
     * @readonly
     */
    holdLeft: boolean = false;

    /**
     * Know if the player has held the right button
     * @readonly
     */
    holdRight: boolean = false;

    /**
     * The side enumeration
     */
    static SIDE: any = { LEFT: -1, RIGHT: 1, NONE: 0 };


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        // props
        this.setProps({
            speed       : 280,
            powerX      : 150,
            powerY      : 790,
            jump        : 600
        });

        // signals
        this.signals.beginCollision.bind("ball", this.onCollisionWithBall.bind(this));

        // skills
        this.skills.addSkill("attack", new PlayerAttackSkill());
        this.skills.addSkill("dash", new PlayerDashSkill());
    }

    /**
     * @update
     * @lifecycle
     * @override
     */
    update (tick): void {
        this.props.vx = this.speedFactor * this.props.speed;

        super.update(tick);
    }

    /**
     * @nextCycle
     * @lifecycle
     * @override
     */
    nextCycle (): void {
        super.nextCycle();
        this._updateAnimation();

        this.props.vy = 0;
    }


    /* METHODS */

    /**
     * When pressing the key left
     * @param pressed - If it is pressed
     */
    moveLeft (pressed: boolean): void {
        this.holdLeft = pressed;

        if (pressed && !this.speedFactor) {
            this.speedFactor = -1;
            this.dash(Player.SIDE.LEFT);

        } else if ((pressed && this.speedFactor === 1) || (!pressed && this.speedFactor === -1)) {
            this.speedFactor = 0;

        } else if (!pressed && this.holdRight) {
            this.speedFactor = 1;

        }
    }

    /**
     * When pressing the key right
     * @param pressed - If it is pressed
     */
    moveRight (pressed: boolean): void {
        this.holdRight = pressed;

        if (pressed && !this.speedFactor) {
            this.speedFactor = 1;
            this.dash(Player.SIDE.RIGHT);

        } else if ((pressed && this.speedFactor === -1) || (!pressed && this.speedFactor === 1)) {
            this.speedFactor = 0;

        } else if (!pressed && this.holdLeft) {
            this.speedFactor = -1;

        }
    }

    /**
     * When pressing the key jump
     * @param pressed - If key is pressed
     */
    jump (pressed: boolean): void {
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
     * When pressing the key fall
     * @param pressed - If key is pressed
     */
    fall (pressed: boolean): void {
        if (pressed && !this.standing) {
            this.props.vy   += Math.abs(this.props.jump * 2);
            this.fallPressed = true;
        }
    }

    /**
     * When pressing the key attack
     */
    attack (): void {
        this.skills.run("attack", { follow: this });
    }

    /**
     * Run dash
     * @param side - side of dash
     */
    dash (side): void {
        if (this.dashSide === side && !this.skills.isRunning("dash") && !this.timers.isFinished("dash")) {
            this.skills.run("dash", { side: side });

        } else {
            this.dashSide = side;
            this.timers.addTimer("dash", 100, () => this.dashSide = Player.SIDE.NONE);
        }
    }


    /* EVENTS */

    /**
     * When entering in collision with ball
     * @param ball - The ball
     */
    onCollisionWithBall (ball: Ball): void {
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
                case centerX < ballCenterX: ball.props.vx = this.props.powerX * factor;
                    break;
                case centerX > ballCenterX: ball.props.vx = this.props.powerX * -factor;
                    break;
                default: ball.props.vx = this.props.powerX * factor * (this.props.flip ? -1 : 1);
                    break;
            }

            ball.props.vy = 0;
        }
    }


    /* PRIVATE */

    /**
     * Update sprite animation
     * @private
     */
    _updateAnimation (): void {
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

