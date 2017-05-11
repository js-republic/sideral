import Skill from "./Skill";


export default class SkillManager {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {Entity} owner: owner of the skill manager
     */
    constructor (owner) {

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
    update () {
        Object.keys(this.skills).forEach(name => this.skills[name].update());
    }


    /* METHODS */

    /**
     * Add a new skill
     * @param {string} name: name of the skill
     * @param {*} props: properties to transmit to the skill
     * @returns {Skill} The skill created
     */
    add (name, props = {}) {
        props.owner = this.owner;
        props.onEnd = this._createEventSkillEnd(props.onEnd);

        const skill = new Skill(props);

        this.skills[name] = skill;

        return skill;
    }

    /**
     * Get a skill
     * @param {string} name: name of the skill
     * @returns {Skill|null} The skill (or null if the skill doesn't exist)
     */
    get (name) {
        return this.skills[name];
    }

    /**
     * Run a skill
     * @param {string} name: name of the skill
     * @param {Object=} settings: settings to add for the run
     * @returns {Boolean} Return true if the skill has ben launched
     */
    run (name, settings) {
        const skill = this.get(name);

        if (!skill || (skill && !skill.ready) || (this.currentSkill && this.currentSkill.unstoppable)) {
            return false;
        }

        if (this.currentSkill) {
            this.currentSkill.stop();
        }

        this.currentSkill = skill;
        this.currentSkill.run(settings);

        return true;
    }

    /**
     * Remove a skill by its name
     * @param {string} name: name of the skill
     * @returns {void}
     */
    remove (name) {
        delete this.skills[name];
    }


    /* PRIVATE */

    /**
     * Encaps the event onEnd with SkillManager process
     * @param {function} onEnd: function to encaps
     * @returns {function(this:SkillManager)} New Event
     * @private
     */
    _createEventSkillEnd (onEnd) {
        const event = skill => {
            if (this.currentSkill.name === skill.name) {
                this.currentSkill = null;
            }

            this.lastSkill      = skill;

            if (onEnd) {
                onEnd.bind(this.owner, skill)();
            }
        };

        return event.bind(this);
    }
}
