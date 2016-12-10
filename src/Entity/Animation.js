import Entity from "./index";
import Sprite from "./../Component/Sprite";
import Timer from "./../Component/Timer";


export default class Animation extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {*} props: props
     */
    constructor (props) {
        super(props);

        /**
         * Duration of the animation
         * @type {number}
         */
        this.duration = this.duration || 0;

        /**
         * Other options of animation
         * @type {Entity}
         */
        this.follow = this.follow || null;

        /**
         * Number of loop
         * @type {number}
         */
        this.loop = typeof this.loop === "undefined" ? -1 : this.loop;

        /**
         * Path of the picture
         * @type {string}
         */
        this.path = this.path || "";

        /**
         * Frames of the animation
         * @type {Array<number>}
         */
        this.frames = this.frames || [];
    }

    /**
     * @override
     */
    initialize (parent) {
        super.initialize(parent);

        this.compose(new Sprite({
            path        : this.path,
            width       : this.width,
            height      : this.height

        })).compose(new Timer({
            duration: this.sprite.getAnimationDuration("idle", this.loop > 0 ? this.loop : 0),
            eventComplete: () => this.destroy()
        }));

        this.sprite.addAnimation("idle", this.duration, this.frames).currentAnimation("idle");
    }

    /**
     * @override
     */
    update () {
        super.update();

        if (this.follow) {
            this.x = this.follow.x + (this.follow.width / 2) - (this.width / 2);
            this.y = this.follow.y + (this.follow.height / 2) - (this.height / 2);
        }
    }

    /* GETTERS & SETTERS */

    get name () {
        return "animation";
    }
}
