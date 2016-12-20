import Component from "./index";
import Bitmap from "../Util/Bitmap";


export default class Sprite extends Component {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {*} props: properties
     */
    constructor (props) {
        super(props);

        if (!this.path) {
            throw new Error("Sprite.constructor : a path must be provided");
        }

        /**
         * Flip deleguation of bitmap
         * @type {{x: boolean, y: boolean}}
         */
        this.flip = this.flip || {x: false, y: false};

        /**
         * Offset of the bitmap compared to the position of the Entity
         * @type {{x: number, y: number}}
         */
        this.offset = this.offset || {x: 0, y: 0};

        /**
         * Rotation of bitmap
         * @type {number}
         */
        this.rotation = this.rotation || 0;

        /**
         * Opacity of the bitmap
         * @type {number}
         */
        this.opacity = this.opacity || 1;

        /**
         * Picture of the sprite
         * @readonly
         * @type {Bitmap}
         */
        this.bitmap = new Bitmap();

        /**
         * List of all animation available on this sprite
         * @type {Array<Object>}
         */
        this.animations = [];

        /**
         * Current animation for this sprite
         * @type {*}
         */
        this.animation = null;

        if (this.width || this.height) {
            this.bitmap.tilesize = {width: this.width || 0, height: this.height || 0};
        }

        this.bitmap.load(this.path, () => {
            if (this.parent) {
                this.parent.requestRender();
            }
        });
    }

    /**
     * @override
     */
    update () {
        super.update();

        if (!this.animation || (this.animation && !this.animation.duration)) {
            return null;
        }

        this.animation.time++;

        if (this.animation.time >= this.animation.fraction) {
            if (this.parent) {
                this.parent.requestRender();
            }

            this.animation.time = 0;

            if (this.animation.frame >= (this.animation.frames.length - 1)) {
                this.animation.frame = 0;
                this.animation.loop++;

            } else {
                this.animation.frame++;
            }
        }
    }

    /**
     * Render
     * @param {*} context: canvas context
     * @returns {void|null} void
     */
    render (context) {
        if (!this.bitmap.loaded || !this.parent || (this.parent && !this.parent.scene)) {
            return null;
        }

        let offset  = {x: 0, y: 0};

        if (this.animation && this.animation.offset) {
            offset = this.animation.offset.flip ? {x: this.flip.x ? -this.animation.offset.x : this.animation.offset.x, y: this.flip.y ? -this.animation.offset.y : this.animation.offset.y} : this.animation.offset;

        } else if (this.offset) {
            offset = this.offset.flip ? {x: this.flip.x ? -this.offset.x : this.offset.x, y: this.flip.y ? -this.offset.y : this.offset.y} : this.offset;
        }

        context.clearRect((this.parent.previousProps.x || this.parent.x) - offset.x - this.parent.scene.camera.x,
            (this.parent.previousProps.y || this.parent.y) - offset.y - this.parent.scene.camera.y,
            this.width, this.height);

        this.bitmap.flip       = this.flip;
        this.bitmap.opacity    = this.opacity;
        this.bitmap.rotation   = this.rotation;
        this.bitmap.render(context, this.parent.x - offset.x - this.parent.scene.camera.x, this.parent.y - offset.y - this.parent.scene.camera.y, this.animation ? this.animation.frames[this.animation.frame] : 0);
    }

    /* METHODS */

    /**
     * Add a new animation
     * @param {string} name: name of the animation
     * @param {number} duration: duration of the animation
     * @param {Array<number>} frames: frames data in order to be render
     * @param {{x: number, y: number}|null} offset: offset bitmap compared to entity's position
     * @returns {Sprite} recursive function
     */
    addAnimation (name, duration, frames, offset = null) {
        if (!name || !frames) {
            throw new Error("Sprite.addAnimation : you must set a name, duration and frames");
        }

        this.animations.push({ name: name, duration: duration, time: 0, frames: frames, frame: 0, loop: 0, fraction: duration, offset: offset });

        return this;
    }

    /**
     * Remove an animation
     * @param {string} name: name of the animation
     * @returns {Sprite} current instance
     */
    removeAnimation (name) {
        const animationsFiltered = this.animations.filter(x => x.name !== name);

        if (animationsFiltered.length !== this.animations.length) {
            this.animations = animationsFiltered;
        }

        return this;
    }

    /**
     * Set the current animation
     * @param {string} name: name of the animation
     * @param {Boolean=} restart: if true, the animation restart to 0
     * @returns {Sprite} current instance
     */
    currentAnimation (name, restart = false) {
        this.animation = this.getAnimationByName(name);

        if (this.animation && restart) {
            this.animation.loop     = 0;
            this.animation.frame    = 0;
            this.animation.time     = 0;
        }

        if (this.parent) {
            this.parent.requestRender();
        }

        return this;
    }

    /* GETTERS & SETTERS */

    get name () {
        return "sprite";
    }

    /**
     * Get an animation by its name
     * @param {string} name: name of the animation
     * @returns {Object} the animation
     */
    getAnimationByName (name) {
        return this.animations.find(x => x.name === name);
    }

    /**
     * Get total duration of an animation to be totally rendered
     * @param {string} name: name of the animation
     * @param {number=} loop: number of loop
     * @returns {number} the duration
     */
    getAnimationDuration (name, loop = 0) {
        const animation = this.getAnimationByName(name);

        return animation ? animation.fraction * animation.frames.length * (loop + 1) : 0;
    }
}
