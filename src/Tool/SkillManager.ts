import { Entity } from '../Entity';
import { Skill } from "./Skill";


export class SkillManager {
    owner: Entity;
    skills: {[skillName: string]: Skill} = {};
    currentSkill: Skill = null;
    lastSkill: Skill = null;

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {Entity} owner: owner of the skill manager
     */
    constructor (owner: Entity) {

        /**
         * Owner of this instance
         * @type {Entity}
         */
        this.owner          = owner;

        /**
         * List of all skills available
         * @type {{Skill}}
         */
        this.skills         = {};

        /**
         * Current skill
         * @type {Skill}
         */
        this.currentSkill   = null;

        /**
         * Last skill successfully launched
         * @type {Skill}
         */
        this.lastSkill      = null;
    }

    /**
     * Update skills
     * @returns {void}
     */
    update (tick) {
        Object.keys(this.skills).forEach(name => this.skills[name].update(tick));
    }


    /* METHODS */

    /**
     * Add a new skill
     * @param {string} name: name of the skill
     * @param {Skill} skill: Skill corresponding of the name
     * @returns {Skill} The skill created
     */
    add (name: string, skill: Skill): Skill {
        skill.owner = this.owner;
        skill.signals.skillComplete.add(this._onSkillComplete.bind(this));

        return this.skills[name] = skill;
    }

    /**
     * Get a skill
     * @param {string} name: name of the skill
     * @returns {Skill|null} The skill (or null if the skill doesn't exist)
     */
    get (name: string): Skill {
        return this.skills[name];
    }

    /**
     * Check if the skill with the name passed in parameter is running
     * @param {string} name: name of the skill
     * @returns {boolean} if the skill is running
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
