import { Hitbox } from "../../../../src/Entity/Hitbox";
import { Entity } from '../../../../src/Entity';
import { Skill } from "../../../../src/Tool/Skill";
import { Enum } from "../../../../src/Tool/Enum";

import { PlayerAttackHitbox } from './PlayerAttackHitbox';

export class PlayerAttackSkill extends Skill {
    animation: string = "attack";
    duration: number = 1;
    durationType: string = Enum.DURATION_TYPE.ANIMATION_LOOP;
    hitboxClass: any = PlayerAttackHitbox;

    /**
     * @constructor
     * @override
     */
    constructor () {
        super();

        this.animation      = "attack";
        this.duration       = 1;
        this.durationType   = Enum.DURATION_TYPE.ANIMATION_LOOP;
        this.hitboxClass    = PlayerAttackHitbox;
    }

    addHitbox (hitboxClass: typeof Hitbox, hitboxSettings: any = {}) {
        hitboxSettings.follow = this.owner;

        return super.addHitbox(hitboxClass, hitboxSettings);
    }
}
