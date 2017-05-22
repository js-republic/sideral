import { Hitbox } from "src/Entity/Hitbox";
import { Skill } from "src/Tool/Skill";
import { Enum } from "src/Tool/Enum";

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
    constructor (owner) {
        super(owner);

        // @TODO should we keep this ???
        // (<any>this).size(25, 30);

        this.animation      = "attack";
        this.duration       = 1;
        this.durationType   = Enum.DURATION_TYPE.ANIMATION_LOOP;
        this.hitboxClass    = PlayerAttackHitbox;
    }

    addHitbox (hitboxObject: any, hitboxSettings: any = {}) {
        hitboxSettings.follow = this.owner.beFollowed(false, this.owner.props.width, (this.owner.props.height / 2) - hitboxObject.props.height, -hitboxObject.props.width);

        return super.addHitbox(hitboxObject, hitboxSettings);
    }
}
