import Entity from "src/Entity";
import Game from "src/Game";


export default class Player extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            speed       : 250,
            power       : 100,
            side        : Player.SIDE.NONE,
            doubleDash  : false,
            doubleJump  : false,
            mass        : Entity.MASS.SOLID,
            vxFactor    : 0,
            holdLeft    : false,
            holdRight   : false
        });
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);
    }

    /**
     * @override
     */
    updateVelocity () {
        this.props.vx = this.props.vxFactor * this.props.speed;
        super.updateVelocity()
    }


    /* METHODS */

    /**
     * Set the current player like a playable character with left keyboard keys
     * @returns {void}
     */
    setPlayerLeft () {
        Game.unbind(Game.SIGNAL.KEY_PRESS(Game.KEY.ARROW_LEFT), this.createAction(this.onPressLeft)).
            unbind(Game.SIGNAL.KEY_PRESS(Game.KEY.ARROW_LEFT), this.createAction(this.onPressRight)).
            unbind(Game.SIGNAL.KEY_PRESS(Game.KEY.ARROW_UP), this.createAction(this.onPressJump));

        Game.bind(Game.SIGNAL.KEY_PRESS(Game.KEY.Q), this.createAction(this.onPressLeft)).
            bind(Game.SIGNAL.KEY_PRESS(Game.KEY.D), this.createAction(this.onPressRight)).
            bind(Game.SIGNAL.KEY_PRESS(Game.KEY.Z), this.createAction(this.onPressJump));
    }

    /**
     * Set the current player like a playable character with right keyboard keys
     * @returns {void}
     */
    setPlayerRight () {
        Game.unbind(Game.SIGNAL.KEY_PRESS(Game.KEY.Q), this.createAction(this.onPressLeft)).
            unbind(Game.SIGNAL.KEY_PRESS(Game.KEY.D), this.createAction(this.onPressRight)).
            unbind(Game.SIGNAL.KEY_PRESS(Game.KEY.Z), this.createAction(this.onPressJump));

        Game.bind(Game.SIGNAL.KEY_PRESS(Game.KEY.ARROW_LEFT), this.createAction(this.onPressLeft)).
            bind(Game.SIGNAL.KEY_PRESS(Game.KEY.ARROW_RIGHT), this.createAction(this.onPressRight)).
            bind(Game.SIGNAL.KEY_PRESS(Game.KEY.ARROW_UP), this.createAction(this.onPressJump));
    }

    /**
     * @event key left
     * @param {boolean} pressed: is pressed
     * @returns {void}
     */
    onPressLeft (pressed) {
        this.props.holdLeft = pressed;

        if (pressed && !this.props.vxFactor) {
            this.props.vxFactor = -1;

        } else if ((pressed && this.props.vxFactor === 1) || (!pressed && this.props.vxFactor === -1)) {
            this.props.vxFactor = 0;

        } else if (!pressed && this.props.holdRight) {
            this.props.vxFactor = 1;

        }
    }

    /**
     * @event key right
     * @param {boolean} pressed: is pressed
     * @returns {void}
     */
    onPressRight (pressed) {
        this.props.holdRight = pressed;

        if (pressed && !this.props.vxFactor) {
            this.props.vxFactor = 1;

        } else if ((pressed && this.props.vxFactor === -1) || (!pressed && this.props.vxFactor === 1)) {
            this.props.vxFactor = 0;

        } else if (!pressed && this.props.holdLeft) {
            this.props.vxFactor = -1;

        }
    }

    /**
     * @event key jump
     * @param {boolean} pressed: is pressed
     * @returns {void}
     */
    onPressJump (pressed) {
        if (pressed) {
            console.log(this.standing);
        }

        if (pressed && this.standing) {
            this.props.vy = -1000;
        }
    }

    /*
    update () {
        super.update();

        const speedDash = this.doubleDash > 0 ? 10 : 1;

        this.vx = this.currentMove.x * this.speed * speedDash;
        this.vy = this.currentMove.y * this.speed * speedDash;

        if (this.doubleDash > 0) {
            this.doubleDash--;
        }

        if (this.attackCooldown) {
            this.attackCooldown--;
        }

        if (this.hasAttacked) {
            this.hasAttacked--;

            if (!this.hasAttacked) {
                this.attackCooldown = 10;
            }
        }
    }

    onCollisionWith (entity) {
        super.onCollisionWith(entity);

        switch (entity.name) {
        case "ball": this.onCollisionWithBall(entity);
            break;
        }
    }

    move (factorX = 0, factorY = 0) {
        if (this.currentMove.x || this.currentMove.y) {
            this.lastMove.x = this.currentMove.x;
            this.lastMove.y = this.currentMove.y;
        }

        this.currentMove = {x: factorX, y: factorY};

        if (!this.doubleDash && !this._timers.dash && (factorX || factorY) && this.currentMove.x === this.lastMove.x && this.currentMove.y === this.lastMove.y) {
            this.doubleDash = 3;
            this.addTimer("dash", 30, () => this.lastMove = {x: 0, y: 0});

        } else if (this.doubleDash && (this.currentMove.x !== this.lastMove.x || this.currentMove.y !== this.lastMove.y || (factorX && factorY))) {
            this.doubleDash = 0;

        }
    }

    attack () {
        if (!this.hasAttacked) {
            this.hasAttacked    = 50;
            this.attackCooldown = 0;
        }
    }

    onCollisionWithBall (ball) {
        if (!this.hasAttacked) {
            return null;
        }

        if (ball.vx) {
            ball.vx = ball.vx > 0 ? ball.vx + this.power : ball.vx - this.power;
        }

        if (ball.vy) {
            ball.vy = ball.vy > 0 ? ball.vy + this.power : ball.vy - this.power;
        }

        if (!this.vy) {
            ball.vy = 0;
        }
    }
    */
}

Player.SIDE = {
    LEFT    : -1,
    RIGHT   : 1,
    NONE    : 0
};
