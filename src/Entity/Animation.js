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
        const props = options.props || {};

        /**
         * Duration of the animation
         * @type {number}
         */
        props.duration = props.duration || 0;

        /**
         * Other options of animation
         * @type {Entity}
         */
        props.follow = props.follow || null;

        /**
         * Number of loop
         * @type {number}
         */
        props.loop = typeof props.loop === "undefined" ? -1 : props.loop;

        /**
         * Path of the picture
         * @type {string}
         */
        props.path = props.path || "";

        /**
         * Frames of the animation
         * @type {Array<number>}
         */
        props.frames = props.frames || [];

        options.props = props;
        super(options);

        /**
         * Name of the element
         * @readonly
         * @type {string}
         */
        this.name = "animation";
    }

    /**
     * @initialize
     * @returns {void}
     */
    initialize () {
        super.initialize();

        this.compose(new Sprite({
            path        : this.path,
            width       : this.width,
            height      : this.height,
            animations  : [
                { name: "idle", duration: this.duration, frames: this.frames }
            ]
        }));

        this.compose(new Timer({
            duration: this.sprite.getAnimationDuration("idle", this.loop > 0 ? this.loop : 0),
            eventComplete: () => this.destroy()
        }));

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
