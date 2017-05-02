import Entity from "src/Entity";


export default class Ball extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            width           : 32,
            height          : 32,
            friction        : 100,
            gravityFactor   : 1
        });

        this.name   = "ball";
        this.type   = Entity.TYPE.WEAK;
        this.box    = Entity.BOX.CIRCLE;

        this.signals.collision.bind("goal", this.onCollisionWithGoal.bind(this));

        this.addSprite("images/ball.png", this.props.width, this.props.height);
    }

    /**
     * @initialize
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.props.bounce = 1;
        this.respawn();
    }


    /* EVENTS */

    /**
     * When entering in collision with a goal entity
     * @param {Goal} goal: goal entity
     * @returns {void}
     */
    onCollisionWithGoal (goal) {
        this.respawn();
    }

    /* METHODS */

    /**
     * Respawn the ball to an other position
     * @returns {void}
     */
    respawn () {
        this.position((this.scene.props.width / 2) - 200 + Math.floor(Math.random() * 400), 50);

        this.props.vx = this.props.vy = 0;
    }
}
