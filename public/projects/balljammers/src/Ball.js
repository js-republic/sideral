import Entity from "src/Entity";


export default class Ball extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            mass            : Entity.MASS.WEAK,
            bouncing        : 0.55,
            width           : 32,
            height          : 32,
            fricX           : 100,
            gravityFactor   : 1
        });

        this.type = Entity.TYPE.CIRCLE;

        this.addSprite("images/ball.png", this.props.width, this.props.height);
    }

    /**
     * @initialize
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.respawn();
    }

    /**
     * @update
     * @override
     */
    update () {
        super.update();

        // console.log(this.props.x, this.props.y);

        // console.log(this.props.x, this.body.position[0], this.props.y, this.body.position[1], this.props.angle, this.body.angle);
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
        // this.position((this.scene.props.width / 2) - 200 + Math.floor(Math.random() * 400), 50);
        this.props.vx = this.props.vy = 0;
    }
}
