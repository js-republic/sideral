import Sprite from "src/Entity/Sprite";


export default class Ball extends Sprite {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name               = "ball";
        this.visible            = false;
        this.collision.mass     = this.collision.MASS.WEAK;
        this.collision.bouncing = 1;

        this.size(32, 32);

        this.setSpritesheet("images/ball.png", this.width, this.height);
    }

    /**
     * @initialize
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.pivx = 16;
        this.pivy = 16;

        this.respawn();
    }

    /**
     * @update
     * @override
     */
    update () {
        super.update();

        this.rotation += (Math.abs(this.vx) + Math.abs(this.vy)) / 10;
    }

    /**
     * @onCollisionWith
     * @override
     */
    onCollisionWith (entity) {
        super.onCollisionWith(entity);

        switch (entity.name) {
        case "goal": this.respawn();
            break;
        }
    }

    /* METHODS */

    respawn () {
        const scene = this.getScene();

        this.position(
            (scene.width / 2) - 200 + Math.floor(Math.random() * 400),
            (scene.height / 2) - 25 + Math.floor(Math.random() * 50)
        );

        this.velocity(0, 0);
    }
}
