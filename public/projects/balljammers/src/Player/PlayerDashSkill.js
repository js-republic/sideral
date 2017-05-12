import Skill from "src/Command/Skill";

import Effect from "src/Module/Effect";


export default class PlayerDashSkill extends Skill {

    /**
     * @constructor
     */
    constructor () {
        super();

        this.movable    = false;
        this.duration   = 4;

        this.signals.skillStart.add(this.onSkillStart.bind(this));
        this.signals.skillUpdate.add(this.onSkillUpdate.bind(this));
    }

    /* EVENTS */

    /**
     * When skill starts
     * @returns {void}
     */
    onSkillStart () {
        this.owner.scene.addEntity(new Effect(), this.owner.props.x, this.owner.props.y, {
            path    : "images/effects/smoke.png",
            width   : 128,
            height  : 128,
            follow  : this.owner,
            centered: true,
            offsetX : this.owner.width / 2,
            offsetY : this.owner.height / 2,
            duration: 1
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
