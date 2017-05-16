import Entity from "./../Entity";

import Enum from "./../Tool/Enum";


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
            offsetFlip      : null,
            multipleHit     : false,
            oncePerHit      : true,
            maxHit          : 1,
            follow          : null
        });

        this.hit    = 0;
        this.type   = Enum.TYPE.GHOST;
        this.group  = Enum.GROUP.ENTITIES;

        this.signals.update.add(this.updateFollow.bind(this));
        this.signals.beginCollision.add(this.onCollision.bind(this));
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        const owner = this.props.owner;

        this.props.x += this.props.offsetFlip !== null && owner.props.flip ? this.props.offsetFlip : this.props.offsetX || 0;
        this.props.y += this.props.offsetY || 0;
    }


    /* METHODS */

    /**
     * Add a new offset
     * @param {number} offsetX: number of offset in x axis
     * @param {number} offsetY: number of offset in y axis
     * @param {number} offsetFlip: number of offset in x axis when owner is flipping
     * @returns {void}
     */
    offset (offsetX, offsetY, offsetFlip) {
        offsetX     = typeof offsetX !== "undefined" ? offsetX : this.props.offsetX;
        offsetY     = typeof offsetY !== "undefined" ? offsetY : this.props.offsetY;
        offsetFlip  = typeof offsetFlip !== "undefined" ? offsetFlip : this.props.offsetFlip;

        if (!this.initialized) {
            this.setProps({ offsetX: offsetX, offsetY: offsetY, offsetFlip: offsetFlip });

        } else {
            this.props.offsetX      = offsetX;
            this.props.offsetY      = offsetY;
            this.props.offsetFlip   = offsetFlip;
        }
    }

    /* EVENTS */

    /**
     * Update coordinate of the following entity
     * @event update
     * @returns {void}
     */
    updateFollow () {
        const { offsetX, offsetY, offsetFlip, follow } = this.props;

        if (follow) {
            this.props.x = follow.props.x + (follow.props.flip && offsetFlip !== null ? offsetFlip : offsetX);
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
     * @param {string} name: name of the entity
     * @param {Entity} other: entity
     * @returns {boolean} Consider the hit like a correct hit
     */
    onHit (name, other) {
        return true;
    }
}
