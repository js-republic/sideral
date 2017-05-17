import Skill from "src/Tool/Skill";

import Effect from "src/Entity/Effect";


export default class PlayerDashSkill extends Skill {

    /**
     * @constructor
     */
    constructor () {
        super();

        this.movable    = false;
        this.duration   = 9;

        this.signals.skillStart.add(this.onSkillStart.bind(this));
        this.signals.skillUpdate.add(this.onSkillUpdate.bind(this));
    }

    /* EVENTS */

    /**
     * When skill starts
     * @returns {void}
     */
    onSkillStart () {
        this.owner.scene.addEntity(new Effect(), this.owner.props.x + (this.owner.props.width / 2) - 64, this.owner.props.y + (this.owner.props.height / 2) - 64, {
            path            : "images/effects/smoke.png",
            width           : 128,
            height          : 128,
            flip            : this.owner.props.flip,
            frames          : [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            duration        : 30,
            maxLoop         : 1
        });
    }

    /**
     * When skill updates
     * @returns {void}
     */
    onSkillUpdate () {
        this.owner.props.vx = this.owner.props.speed * (this.side === "left" ? -5 : 5);
        this.owner.body.vy  = this.owner.props.vy = 0;
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
