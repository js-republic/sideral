import { Entity } from "./../Entity";

import { IHitboxProps } from "./../Interface";

import { Enum } from "./../Tool/Enum";


/**
 * Hitbox is an helper class extended from Entity to generate hitbox contact between the owner and targets
 */
export class Hitbox extends Entity {

    /* PROPERTIES */

    /**
     * Properties of a Hitbox
     */
    props: IHitboxProps;

    /**
     * The number of hits before destruction of the Hitbox
     * @readonly
     */
    hit: number = 0;

    type: number = Enum.TYPE.GHOST;

    group: number = Enum.GROUP.ENTITIES;


    /* LIFECYCLE */

    /**
     * @initialize
     */
    initialize (props) {
        this.setProps({
            owner           : null,
            gravityFactor   : 0,
            multipleHit     : false,
            oncePerHit      : true,
            maxHit          : 1
        });

        super.initialize(props);

        this.physic.signals.beginCollision.add(this.onCollision.bind(this));
    }


    /* EVENTS */

    /**
     * When entering in collision with an entity
     * @param otherName - Name of the other entity
     * @param other - The other entity
     */
    onCollision (otherName: string, other: Entity): void {
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
     * @param name - Name of the entity
     * @param target - The target
     * @returns If true the hit will be counted
     */
    onHit (name: string, target: Entity): boolean {
        return true;
    }
}
