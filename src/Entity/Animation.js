import Entity from "./index";
import Sprite from "../Component/Sprite";
import Timer from "../Component/Timer";


export default class Animation extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {*} options: options
     */
    constructor (options = {}) {
        super(options);

        /**
         * Name of the element
         * @readonly
         * @type {string}
         */
        this.name = "animation";

        /**
         * Duration of the animation
         * @type {number}
         */
        this.duration = options.duration || 0;

        /**
         * Other options of animation
         * @type {Entity}
         */
        this.follow = options.follow;

        /**
         * Number of loop
         * @type {number}
         */
        this.loop = typeof options.loop === "undefined" ? -1 : options.loop;

        /**
         * Path of the picture
         * @type {string}
         */
        this.path = options.path;

        /**
         * Frames of the animation
         * @type {Array<number>}
         */
        this.frames = options.frames;
    }

    /**
     * @initialize
     * @returns {void}
     */
    initialize () {
        super.initialize();

        this.compose(new Sprite(this.path, this.width, this.height)).sprite.addAnimation("idle", this.duration, this.frames);
        this.compose(new Timer(this.sprite.getAnimationDuration("idle", this.loop > 0 ? this.loop : 0), () => this.destroy()));

        this.sprite.currentAnimation("idle");
    }

    /**
     * @update
     * @returns {void}
     */
    update () {
        super.update();

        if (this.follow) {
            this.x = this.follow.x + (this.follow.width / 2) - (this.width / 2);
            this.y = this.follow.y + (this.follow.height / 2) - (this.height / 2);
        }
    }
}
