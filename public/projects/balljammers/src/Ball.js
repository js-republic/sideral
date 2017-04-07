import Entity from "src/Entity";


export default class Ball extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            mass        : Entity.MASS.WEAK,
            bouncing    : 0.55,
            width       : 32,
            height      : 32,
            gravityFactor: 1
        });

        this.addSprite("images/ball.png", this.props.width, this.props.height, { y: 5 });
    }

    /**
     * @initialize
     * @override
     */
    initialize (props) {
        super.initialize(props);

        // this.pivx = 16;
        // this.pivy = 16;

        this.respawn();
    }

    /**
     * @update
     * @override
     */
    update () {
        super.update();

        // this.rotation += (Math.abs(this.vx) + Math.abs(this.vy)) / 10;
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
        this.position((this.scene.props.width / 2) - 200 + Math.floor(Math.random() * 400), 50);
        this.velocity(0, 0);
    }
}
