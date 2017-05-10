import Enum from "./Enum";
import Timer from "./Timer";
import Util from "./Util";


/**
 * Skill class
 */
class Skill {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {*} props: properties to merge
     */
    constructor (props = {}) {

        /**
         * Owner of the skill
         * @type Entity
         */
        this.owner          = props.owner;

        /**
         * Animation of the owner to run during the skill
         * @type {string}
         */
        this.animation      = props.animation;

        /**
         * Class to instanciate for the hitbox
         * @type {Entity}
         */
        this.hitboxClass    = props.hitboxClass;

        /**
         * Settings to pass to the hitbox when initialized
         * @type {*}
         */
        this.hitboxSettings = props.hitboxSettings;

        /**
         * Duration of the skill
         * @type {number}
         */
        this.duration       = props.duration;

        /**
         * Type of duration (see Enum.DURATION_TYPE)
         * @type {string}
         */
        this.durationType   = props.durationType || Enum.DURATION_TYPE.FRAME;

        /**
         * Cooldown of the skill
         * @type {number}
         */
        this.cooldown       = props.cooldown || 0;

        /**
         * Cooldown type (see Enum.DURATION_TYPE)
         * @type {string}
         */
        this.cooldownType   = props.cooldownType || Enum.DURATION_TYPE.FRAME;

        /**
         * If false, the skill can be stopped before it was finished
         * @type {boolean}
         */
        this.unstoppable    = typeof props.unstoppable === "undefined" ? true : props.unstoppable;

        // event

        /**
         * When skill is launched
         * @type {function}
         */
        this.onStart        = props.onStart;

        /**
         * Fired every step of the skill during its run
         * @type {function}
         */
        this.onUpdate       = props.onUpdate;

        /**
         * Fired when the cooldown ended
         * @type {function}
         */
        this.onCooldownEnd  = props.onCooldownEnd;

        /**
         * Fired when the skill is finished
         * @type {function}
         */
        this.onEnd          = props.onEnd;

        // read-only

        /**
         * Current timer
         * @readonly
         * @type {Timer}
         */
        this.timer  = null;

        /**
         * Timer of cooldown
         * @readonly
         * @type {Timer}
         */
        this.timerCooldown = null;

        /**
         * Current hitbox
         * @readonly
         * @type {Hitbox}
         */
        this.hitbox = null;

        /**
         * If this skill is active
         * @readonly
         * @type {boolean}
         */
        this.active = false;

        /**
         * If this skill is ready to be launched
         * @readonly
         * @type {boolean}
         */
        this.ready  = true;
    }

    /**
     * Update of the skill
     * @returns {void}
     */
    update () {
        if (this.timer) {
            this.timer.update();
        }

        if (this.timerCooldown) {
            this.timerCooldown.update();
        }
    }


    /* METHODS */

    /**
     * Run the skill
     * @returns {void}
     */
    run () {
        if (this.animation) {
            this.owner.sprite.setAnimation(this.animation, true);
        }

        this.active = true;
        this.ready  = !this.unstoppable;
        this.timer  = new Timer(this.getTimerDuration(this.duration, this.durationType), this.onTimerFinish.bind(this));

        if (this.hitboxClass) {
            this.hitbox = this._createHitbox(this.hitboxClass, this.hitboxSettings);
        }

        if (this.onStart) {
            this.onStart(this);
        }
    }

    /**
     * Stop the skill
     * @returns {void}
     */
    stop () {
        if (this.active) {
            this.timer.stop();
        }
    }

    /**
     * Get correct timer in frames
     * @param {number} duration: initial duration of the timer
     * @param {string} durationType: the type of duration
     * @returns {number} The duration in number of frames
     */
    getTimerDuration (duration, durationType) {
        let frames = duration;

        switch (durationType) {
            case Enum.DURATION_TYPE.ANIMATION_LOOP: frames = ((this.owner.sprite.getAnimation(this.animation).duration) * duration) - 1;
                break;

            case Enum.DURATION_TYPE.MS: frames = Util.msToFrame(duration);
                break;
        }

        return frames;
    }


    /* EVENTS */

    /**
     * When timer is finished
     * @returns {void}
     */
    onTimerFinish () {
        if (this.cooldown) {
            this.timerCooldown = new Timer(this.getTimerDuration(this.cooldown, this.cooldownType), this.onCooldownTimerFinish.bind(this));

        } else {
            this.onCooldownTimerFinish();

        }

        if (this.hitbox) {
            this.hitbox.kill();
            this.hitbox = null;
        }

        if (this.onEnd) {
            this.onEnd(this);
        }
    }

    /**
     * When timer of cooldown is finished
     * @returns {void}
     */
    onCooldownTimerFinish () {
        this.ready = true;

        if (this.onCooldownEnd) {
            this.onCooldownEnd();
        }
    }


    /* PRIVATE */

    /**
     * Instanciate a hitbox item for the time of the skill
     * @param {*} hitboxClass: The class to instanciate
     * @param {*} hitboxSettings: The settings to transmit to the hitbox instance
     * @returns {*} The hitbox instance
     * @private
     */
    _createHitbox (hitboxClass, hitboxSettings = {}) {
        const hitbox = new hitboxClass();

        hitboxSettings.follow   = typeof hitboxSettings.follow === "undefined" ? this.owner : hitboxSettings.follow;
        hitboxSettings.offsetX  = hitboxSettings.offsetX || 0;
        hitboxSettings.offsetY  = hitboxSettings.offsetY || 0;

        return this.owner.scene.addEntity(hitbox, (hitboxSettings.follow ? hitboxSettings.follow.props.x : 0) + hitboxSettings.offsetX, (hitboxSettings.follow ? hitboxSettings.follow.props.y : 0) + hitboxSettings.offsetY, hitboxSettings);
    }
}


/**
 * An helper class to manage all skills of an entity
 */
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
     * @returns {Boolean} Return true if the skill has ben launched
     */
    run (name) {
        const skill = this.get(name);

        if (!skill || (skill && !skill.ready) || (this.currentSkill && this.currentSkill.unstoppable)) {
            return false;
        }

        if (this.currentSkill) {
            this.currentSkill.stop();
        }

        this.currentSkill = skill;
        this.currentSkill.run();

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
                onEnd.bind(this.owner, skill);
            }
        };

        return event.bind(this);
    }
}
