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
            multipleHit     : false,
            oncePerHit      : true,
            maxHit          : 1,
            follow          : null
        });

        this.hit    = 0;
        this.type   = Enum.TYPE.GHOST;
        this.group  = Enum.GROUP.ENTITIES;

        this.signals.update.add(this.updateFollow.bind(this));
        this.signals.collision.add(this.onCollision.bind(this));
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.toggleDebug();
    }


    /* METHODS */

    /**
     * Add a new offset
     * @param {number} offsetX: number of offset in x axis
     * @param {number} offsetY: number of offset in y axis
     * @returns {void}
     */
    offset (offsetX, offsetY) {
        offsetX = typeof offsetX !== "undefined" ? offsetX : this.props.offsetX;
        offsetY = typeof offsetY !== "undefined" ? offsetY : this.props.offsetY;

        if (!this.initialized) {
            this.setProps({ offsetX: offsetX, offsetY: offsetY });

        } else {
            this.props.offsetX = offsetX;
            this.props.offsetY = offsetY;
        }
    }

    /* EVENTS */

    /**
     * Update coordinate of the following entity
     * @event update
     * @returns {void}
     */
    updateFollow () {
        const { offsetX, offsetY, width, follow } = this.props;

        if (follow) {
            this.props.x = follow.props.x + offsetX - (follow.props.flip ? width : 0);
            this.props.y = follow.props.y + offsetY;
        }
    }

    onCollision (otherName, other) {
        const result = this.onHit(otherName, other);

        if (result) {
            this.hit++;

            if (this.hit >= this.props.maxHit) {
                this.kill();
            }
        }
    }

    /**
     * Event fired when hitbox hit an entity
     * @param {string} otherName: name of the entity
     * @param {Entity} other: entity
     * @returns {boolean} Consider the hit like a correct hit
     */
    onHit (otherName, other) {
        return true;
    }
}
