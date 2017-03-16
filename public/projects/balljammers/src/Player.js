import Sprite from "src/Entity/Sprite";


export default class Player extends Sprite {

    /* LIFECYCLE */

    constructor () {
        super();

        this.size(30, 30);

        this.name           = "player";
        this.speed          = 250;
        this.power          = 100;
        this.hasAttacked    = 0;
        this.attackCooldown = 0;
        this.onLeft         = false;
        this.offset         = {x: 17, y: 34};
        this.doubleDash     = 0;
        this.currentMove    = {x: 0, y: 0};
        this.lastMove       = {x: 0, y: 0};

        this.setSpritesheet("images/characters/chris.png", 64, 64);
    }

    initialize (props) {
        super.initialize(props);

        this.x -= this.width / 2;
        this.y -= this.height / 2;
    }

    update () {
        super.update();

        const speedDash = this.doubleDash > 0 ? 1 : 1;

        this.vx = this.currentMove.x * this.speed * speedDash;
        this.vy = this.currentMove.y * this.speed * speedDash;

        if (this.doubleDash > 0) {
            console.log("double dash");
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

    /* METHODS */

    move (factorX = 0, factorY = 0) {
        this.lastMove.x = this.currentMove.x;
        this.lastMove.y = this.currentMove.y;

        this.currentMove = {x: factorX, y: factorY};

        if (!this.doubleDash && this.currentMove.x === this.lastMove.x && this.currentMove.y === this.lastMove.y) {
            this.doubleDash = 600;
        }
    }

    attack () {
        if (!this.hasAttacked) {
            this.hasAttacked    = 10;
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
}
