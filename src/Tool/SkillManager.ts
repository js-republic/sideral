import { SideralObject } from "./../SideralObject";


import { Entity } from '../Entity';
import { Skill } from "./Skill";


/**
 * Manager of skill of an Entity
 */
export class SkillManager extends SideralObject {

    /**
     * List of all skills
     */
    skills: {[skillName: string]: Skill} = {};

    /**
     * Current skill launched
     */
    currentSkill: Skill = null;

    /**
     * Last skill launched
     */
    lastSkill: Skill = null;


    /* METHODS */

    /**
     * Add a new skill
     * @param name - Name of the skill
     * @param skill - Object instance of Skill corresponding of the name
     * @returns The skill created
     */
    addSkill (name: string, skill: Skill): Skill {
        skill.name  = name;
        skill.owner = <Entity> this.parent;
        skill.signals.skillComplete.add(this._onSkillComplete.bind(this));

        return this.skills[name] = <Skill> this.add(<SideralObject> skill);
    }

    /**
     * Get a skill
     * @param name - Name of the skill
     * @returns The skill (or null if the skill doesn't exist)
     */
    get (name: string): Skill {
        return this.skills[name];
    }

    /**
     * Check if the skill with the name passed in parameter is running
     * @param name - Name of the skill
     * @returns Know if the skill is running
     */
    isRunning (name: string): boolean {
        return this.currentSkill && this.currentSkill[name] === this.skills[name] && this.currentSkill.active;
    }

    /**
     * Run a skill
     * @param {string} name: name of the skill
     * @param {Object=} props: properties to add for the run
     * @returns {Boolean} Return true if the skill has ben launched
     */
    run (name: string, props?: any): boolean {
        const skill = this.get(name);

        if (!skill || (skill && !skill.ready) || (this.currentSkill && this.currentSkill.unstoppable)) {
            return false;
        }

        if (this.currentSkill) {
            this.currentSkill.stop();
        }

        this.currentSkill = skill;
        this.currentSkill.run(props);

        return true;
    }

    /**
     * Remove a skill by its name
     * @param {string} name: name of the skill
     * @returns {void}
     */
    remove (name: string) {
        delete this.skills[name];
    }


    /* PRIVATE */

    /**
     * When a skill is complete
     * @param {Skill} skill: skill
     * @returns {void}
     * @private
     */
    _onSkillComplete (skill: Skill) {
        if (this.currentSkill.name === skill.name) {
            this.currentSkill = null;
        }

        this.lastSkill = skill;
    }
}
