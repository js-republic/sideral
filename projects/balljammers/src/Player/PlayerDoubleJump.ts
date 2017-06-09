import { Skill } from "src/Entity";
import { Sprite } from "src/Module";
import { Enum } from "src/Tool";

import { Player } from "./Player";


export class PlayerDoubleJumpSkill extends Skill {

    /* ATTRIBUTES */

    owner: Player;
    angleFactor: number;


    /* LIFECYCLE */

    constructor () {
        super();

        this.duration       = 300;
        this.angleFactor    = 360 / (this.duration * 0.001);

        this.signals.skillStart.add(this.onSkillStart.bind(this));
        this.signals.skillUpdate.add(this.onSkillUpdate.bind(this));
        this.signals.skillComplete.add(this.onSkillComplete.bind(this));
    }


    /* EVENTS */

    /**
     * When skill starts
     */
    onSkillStart (): void {
        (<Sprite> this.owner.context.scene.add(new Sprite(), {
            imagePath   : "images/effects/smoke.png",
            width       : 128,
            height      : 128,
            x           : this.owner.props.x + (this.owner.props.width / 2) - 64,
            y           : this.owner.props.y + (this.owner.props.height / 2) - 64,
            autoKill    : true

        })).addAnimation("idle", 25, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 1);

        this.owner.props.vy = -Math.abs(this.owner.props.jump);
    }

    /**
     * When skill updates
     */
    onSkillUpdate (tick: number): void {
        const nextAngle = this.angleFactor * tick;

        this.owner.props.angle += this.owner.props.flip ? -nextAngle : nextAngle;

        if (this.owner.props.angle > 360) {
            this.owner.props.angle = 360;
        }
    }

    onSkillComplete (): void {
        this.owner.props.angle = 0;
    }
}