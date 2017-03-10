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

        this.setSpritesheet("images/characters/chris.png", 64, 64);
    }

    initialize (props) {
        super.initialize(props);

        this.x -= this.width / 2;
        this.y -= this.height / 2;
    }

    update () {
        super.update();

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
        case "filet": this.x = entity.x < this.x ? entity.x + entity.width : entity.x - this.width;
            break;

        case "ball": this.onCollisionWithBall(entity);
            break;
        }
    }

    /* METHODS */

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
