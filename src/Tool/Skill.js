import Enum from "./Enum";
import Timer from "./Timer";
import Util from "./Util";
import Signal from "./Signal";


export default class Skill {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {

        /**
         * Owner of the skill
         * @type Entity
         */
        this.owner          = null;

        /**
         * Animation of the owner to run during the skill
         * @type {string}
         */
        this.animation      = null;

        /**
         * Class to instanciate for the hitbox
         * @type {Entity}
         */
        this.hitboxClass    = null;

        /**
         * Settings to pass to the hitbox when initialized
         * @type {*}
         */
        this.hitboxSettings = {};

        /**
         * Duration of the skill
         * @type {number}
         */
        this.duration       = 0;

        /**
         * Type of duration (see Enum.DURATION_TYPE)
         * @type {string}
         */
        this.durationType   = Enum.DURATION_TYPE.FRAME;

        /**
         * Duration of the preparation
         * @type {number}
         */
        this.preparation    = 0;

        /**
         * Preparation type (see Enum.DURATION_TYPE)
         * @type {string}
         */
        this.preparationType = Enum.DURATION_TYPE.FRAME;

        /**
         * Duration of the reloading
         * @type {number}
         */
        this.reload         = 0;

        /**
         * Reload type (see Enum.DURATION_TYPE)
         * @type {string}
         */
        this.reloadType     = Enum.DURATION_TYPE.FRAME;

        /**
         * If false, the skill can be stopped before it was finished
         * @type {boolean}
         */
        this.unstoppable    = true;

        /**
         * If false, the entity cannot move during preparation and duration of the skill
         * @type {boolean}
         */
        this.movable        = true;

        // read-only

        /**
         * Current timer
         * @readonly
         * @type {Timer}
         */
        this.timer  = null;

        /**
         * Timer of reload
         * @readonly
         * @type {Timer}
         */
        this.timerReload = null;

        /**
         * Timer of preparation of the skill
         * @readonly
         * @type {Timer}
         */
        this.timerPreparation = null;

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

        /**
         * List of all signals
         * @type {*}
         */
        this.signals = {
            preparationStart    : new Signal(),
            preparationUpdate   : new Signal(),
            preparationComplete : new Signal(),
            skillStart          : new Signal(),
            skillUpdate         : new Signal(),
            skillComplete       : new Signal(),
            reloadStart         : new Signal(),
            reloadUpdate        : new Signal(),
            reloadComplete      : new Signal()
        };

        // signals

        this.signals.skillComplete.add(this.onSkillComplete.bind(this));
    }

    /**
     * Update of the skill
     * @returns {void}
     */
    update () {
        const inPreparation = this.timerPreparation && !this.timerPreparation.finished,
            inLaunching     = this.timer && !this.timer.finished;

        if (!this.movable && (inPreparation || inLaunching)) {
            this.owner.props.vy = this.owner.props.accelY = 0;

            if (this.owner.standing || !this.owner.props.gravityFactor) {
                this.owner.props.vx = this.owner.props.accelX = 0;
            }
        }

        if (inPreparation) {
            this.timerPreparation.update();

        } else if (inLaunching) {
            this.timer.update();

        } else if (this.timerReload && !this.timerReload.finished) {
            this.timerReload.update();
        }
    }


    /* METHODS */

    /**
     * Run the skill
     * @param {Object=} props: properties for the run
     * @returns {void}
     */
    run (props = {}) {
        const startSkill = () => {
            Object.assign(this, props);

            this.timer  = new Timer(this.getTimerDuration(this.duration, this.durationType), () => this.signals.skillComplete.dispatch(this), {
                onUpdate: (value, ratio, duration) => this.signals.skillUpdate.dispatch(this, value, ratio, duration)
            });

            if (this.animation) {
                this.owner.sprite.setAnimation(this.animation, true);
            }

            if (this.hitboxClass) {
                this.hitboxSettings.owner   = this.hitboxSettings.owner || this.owner;
                this.hitbox                 = this.addHitbox(new this.hitboxClass(), this.hitboxSettings);
            }

            this.signals.skillStart.dispatch(this);
        };

        this.active = true;
        this.ready  = !this.unstoppable;

        if (this.preparation) {
            this.signals.preparationStart.dispatch(this);

            this.timerPreparation = new Timer(this.getTimerDuration(this.preparation, this.preparationType), () => {
                this.signals.preparationComplete.dispatch(this);
                startSkill();

            }, { onUpdate: (value, ratio, duration) => this.signals.preparationUpdate.dispatch(this, value, ratio, duration) });

        } else {
            startSkill();

        }
    }

    /**
     * Stop the skill
     * @returns {void}
     */
    stop () {
        if (this.timerPreparation) {
            this.timerPreparation.stop();
        }

        if (this.timer) {
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
     * When the skill is complete
     * @returns {void}
     */
    onSkillComplete () {
        if (this.reload) {
            this.timerReload = new Timer(this.getTimerDuration(this.reload, this.reloadType), () => {
                this.ready = true;
                this.signals.reloadComplete.dispatch(this);
            }, { onUpdate: (value, ratio, duration) => this.signals.reloadUpdate.dispatch(this, value, ratio, duration) });
        }

        this.ready = !this.reload;

        if (this.hitbox) {
            this.hitbox.kill();
            this.hitbox = null;
        }
    }


    /* PRIVATE */

    /**
     * Instanciate a hitbox item for the time of the skill
     * @param {*} hitboxObject: The object to add
     * @param {*} hitboxSettings: The settings to transmit to the hitbox instance
     * @returns {*} The hitbox instance
     */
    addHitbox (hitboxObject, hitboxSettings = {}) {
        let x           = this.owner.props.x,
            y           = this.owner.props.y;

        switch (true) {
            case hitboxSettings.follow:
                x = hitboxSettings.follow.props.x;
                y = hitboxSettings.follow.props.y;
                break;

            case typeof hitboxSettings.x !== "undefined" || typeof hitboxSettings.y !== "undefined":
                x = hitboxSettings.x || 0;
                y = hitboxSettings.y || 0;
                break;
        }

        return this.owner.scene.addEntity(hitboxObject, x, y, Object.assign({}, hitboxSettings));
    }
}
