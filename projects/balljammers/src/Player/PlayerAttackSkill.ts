import { Hitbox } from "src/Entity/Hitbox";
import { Skill, Enum } from "src/Tool";

import { PlayerAttackHitbox } from './PlayerAttackHitbox';


/**
 * The skill to attack the ball
 */
export class PlayerAttackSkill extends Skill {

    /* ATTRIBUTES */

    /**
     * The animation of the owner
     */
    animation: string = "attack";

    /**
     * The duration of the skill
     */
    duration: number = 1;

    /**
     * The type of duration of the skill (we set the time from the duration of the animation
     */
    durationType: string = Enum.DURATION_TYPE.ANIMATION_LOOP;

    /**
     * The hitbox class used when launching this skill
     */
    hitboxClass: any = PlayerAttackHitbox;


    /* METHODS */

    /**
     * @override
     */
    addHitbox (hitboxObject: Hitbox, hitboxProps: any = {}) {
        hitboxProps.follow = this.owner.beFollowed(false, this.owner.props.width, (this.owner.props.height / 2) - hitboxObject.props.height, -hitboxObject.props.width);

        return super.addHitbox(hitboxObject, hitboxProps);
    }
}
