import Entity from "./../Entity";

import Enum from "./../Command/Enum";


export default class Hitbox extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            gravityFactor   : 0,
            offsetX         : 0,
            offsetY         : 0,
            onHit           : null,
            multipleHit     : false,
            oncePerHit      : true,
            follow          : null
        });

        this.type   = Enum.TYPE.GHOST;
        this.group  = Enum.GROUP.ENTITIES;

        this.signals.update.add(this.updateFollow.bind(this));
        this.signals.collision.add(this.onCollision.bind(this));
    }

    initialize (props) {
        super.initialize(props);

        this.toggleDebug();
    }


    /* EVENTS */

    /**
     * Update coordinate of the following entity
     * @event update
     * @returns {void}
     */
    updateFollow () {
        if (this.follow) {
            this.props.x = this.follow.props.x + this.props.offsetX;
            this.props.y = this.follow.props.y + this.props.offsetY;
        }
    }

    /**
     * When entering in collision with other
     * @event collision
     * @param {string} otherName: name of the other entity
     * @param {Entity} other: other entity
     * @returns {void}
     */
    onCollision (otherName, other) {
        console.log("collision");
    }
}
