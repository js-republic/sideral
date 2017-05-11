import Enum from "./Enum";
import Timer from "./Timer";
import Util from "./Util";


export default class Skill {

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
        this.hitboxSettings = props.hitboxSettings || {};

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
         * Duration of the preparation
         * @type {number}
         */
        this.preparation    = props.preparation || 0;

        /**
         * Preparation type (see Enum.DURATION_TYPE)
         * @type {string}
         */
        this.preparationType = props.preparationType || Enum.DURATION_TYPE.FRAME;

        /**
         * Duration of the reloading
         * @type {number}
         */
        this.reload         = props.reload || 0;

        /**
         * Reload type (see Enum.DURATION_TYPE)
         * @type {string}
         */
        this.reloadType     = props.reloadType || Enum.DURATION_TYPE.FRAME;

        /**
         * If false, the skill can be stopped before it was finished
         * @type {boolean}
         */
        this.unstoppable    = typeof props.unstoppable === "undefined" ? true : props.unstoppable;

        /**
         * If false, the entity cannot move during preparation and duration of the skill
         * @type {boolean}
         */
        this.movable        = typeof props.movable === "undefined" ? true : props.movable;

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
         * Fired when the skill is finished
         * @type {function}
         */
        this.onEnd          = props.onEnd;

        /**
         * Fired when the reloading is started
         * @type {function}
         */
        this.onReloadStart  = props.onReloadStart;

        /**
         * Fired every step of the reloading
         * @type {function}
         */
        this.onReloadUpdate = props.onReloadUpdate;

        /**
         * Fired when the reloading is finished
         * @type {function}
         */
        this.onReloadEnd    = props.onReloadEnd;

        /**
         * Fired when the preparation is started
         * @type {function}
         */
        this.onPreparationStart     = props.onPreparationStart;

        /**
         * Fired when the preparation is updating
         * @type {function}
         */
        this.onPreparationUpdate    = props.onPreparationUpdate;

        /**
         * Fired when the preparation is ended
         * @type {function}
         */
        this.onPreparationEnd       = props.onPreparationEnd;

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
     * @param {Object=} settings: settings for the run
     * @returns {void}
     */
    run (settings = {}) {
        const startSkill = () => {
            Object.assign(this, settings);

            this.timer  = new Timer(this.getTimerDuration(this.duration, this.durationType), this.onTimerFinish.bind(this), {
                onUpdate: this.onUpdate
            });

            if (this.animation) {
                this.owner.sprite.setAnimation(this.animation, true);
            }

            if (this.hitboxClass) {
                this.hitboxSettings.owner   = this.hitboxSettings.owner || this.owner;
                this.hitbox                 = this._createHitbox(this.hitboxClass, this.hitboxSettings);
            }

            if (this.onStart) {
                this.onStart(this);
            }
        };

        this.active = true;
        this.ready  = !this.unstoppable;

        if (this.preparation) {
            this.timerPreparation = new Timer(this.getTimerDuration(this.preparation, this.preparationType), startSkill.bind(this), {
                onUpdate: this.onPreparationUpdate
            });

        } else {
            startSkill();

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
        if (this.reload) {
            this.timerReload = new Timer(this.getTimerDuration(this.reload, this.reloadType), this.onTimerReloadFinish.bind(this), {
                onUpdate: this.onReloadUpdate
            });

        } else {
            this.onTimerReloadFinish();
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
     * When timer of reloading is finished
     * @returns {void}
     */
    onTimerReloadFinish () {
        this.ready = true;

        if (this.onReloadEnd) {
            this.onReloadEnd();
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
        const hitbox            = new hitboxClass();

        return this.owner.scene.addEntity(hitbox, (hitboxSettings.follow ? hitboxSettings.follow.props.x : 0) + hitboxSettings.offsetX, (hitboxSettings.follow ? hitboxSettings.follow.props.y : 0) + hitboxSettings.offsetY, hitboxSettings);
    }
}