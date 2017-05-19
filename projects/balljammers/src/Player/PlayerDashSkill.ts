import { Skill } from "../../../../src/Tool/Skill";

import { Effect } from "../../../../src/Entity/Effect";
import { Player } from './Player';


export class PlayerDashSkill extends Skill {
    movable: boolean    = false;
    duration: number    = 6;
    side: string        = "";
    owner: Player;

    /**
     * @constructor
     */
    constructor () {
        super();

        this.signals.skillStart.add(this.onSkillStart.bind(this));
        this.signals.skillUpdate.add(this.onSkillUpdate.bind(this));
    }

    /* EVENTS */

    /**
     * When skill starts
     * @returns {void}
     */
    onSkillStart () {
        this.owner.scene.addEntity(new Effect(), this.owner.props.x + (this.owner.props.width / 2), this.owner.props.y + (this.owner.props.height / 2), {
            path            : "images/effects/smoke.png",
            width           : 128,
            height          : 128,
            follow          : this.owner,
            centered        : true,
            offsetX         : this.owner.props.width / 2,
            offsetY         : this.owner.props.height / 2,
            flip            : this.owner.props.flip,
            frames          : [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            duration        : 20,
            maxLoop         : 1
        });
    }

    /**
     * When skill updates
     * @returns {void}
     */
    onSkillUpdate () {
        this.owner.props.vx = this.owner.props.speed * (this.side === "left" ? -5 : 5);
    }

    /**
     * When skill is complete
     * @returns {void}
     */
    onSkillComplete () {
        super.onSkillComplete();

        this.owner.dashSide = false;
    }
}
