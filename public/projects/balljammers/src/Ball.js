import Entity from "src/Entity";

import Goal from "./Goal";


export default class Ball extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            mass            : Entity.MASS.WEAK,
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

        this.props.bounce = 1;
        this.respawn();
    }


    /**
     * @onCollisionWith
     * @override
     */
    onCollisionWith (entity) {
        super.onCollisionWith(entity);

        switch (true) {
        case entity instanceof Goal: this.respawn();
            break;
        }
    }

    /* METHODS */

    respawn () {
        this.position((this.scene.props.width / 2) - 200 + Math.floor(Math.random() * 400), 50);

        this.props.vx = this.props.vy = 0;
    }
}
