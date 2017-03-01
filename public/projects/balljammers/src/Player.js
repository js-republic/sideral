import Sprite from "src/Entity/Sprite";


export default class Player extends Sprite {

    constructor () {
        super();

        this.size(30, 30);

        this.name   = "player";
        this.speed  = 250;
        this.power  = 100;
        this.offset = {x: 17, y: 34};

        this.setSpritesheet("images/characters/chris.png", 64, 64);
    }

    initialize (props) {
        super.initialize(props);

        this.x -= this.width / 2;
        this.y -= this.height / 2;
    }

    onCollisionWith (entity) {
        switch (entity.name) {
        case "filet": this.x = entity.x < this.x ? entity.x + entity.width : entity.x - this.width;
            break;

        case "ball":
            if (entity.vx) {
                entity.vx = entity.vx > 0 ? entity.vx + this.power : entity.vx - this.power;
            }

            if (entity.vy) {
                entity.vy = entity.vy > 0 ? entity.vy + this.power : entity.vy - this.power;
            }

            if (!this.vy) {
                entity.vy = 0;
            }
            break;
        }
    }
}
