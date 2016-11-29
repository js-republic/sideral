import Entity from "./Entity";
import Sprite from "./components/Sprite";
import Timer from "./components/Timer";


export default class Animation extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {string} path: Path of the sprite
     * @param {number} frameWidth: framewidth of the sprite
     * @param {number} frameHeight: frameheight of the sprite
     * @param {number=} duration: duration of the animation
     * @param {Array<number>=} frames: frames of animation
     * @param {{}} options: Other options for the animation
     */
    constructor (path, frameWidth, frameHeight, duration = 1, frames = [0], options = {}) {
        super();

        /**
         * Duration of the animation
         * @type {number}
         */
        this.duration = duration;

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
        this.path = path;

        /**
         * Frames of the animation
         * @type {Array<number>}
         */
        this.frames = frames;

        this.width(frameWidth);
        this.height(frameHeight);
    }

    /**
     * @initialize
     * @returns {void}
     */
    initialize () {
        super.initialize();

        this.compose(new Sprite(this.path, this.width(), this.height())).sprite.addAnimation("idle", this.duration, this.frames);
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
            this.x(this.follow.x() + (this.follow.width() / 2) - (this.width() / 2));
            this.y(this.follow.y() + (this.follow.height() / 2) - (this.height() / 2));
        }
    }

    /* GETTERS & SETTERS */

    /**
     * Name of the element
     * @returns {string} the name
     */
    get name () {
        return "animation";
    }
}
