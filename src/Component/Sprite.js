import Component from "./index";
import Picture from "../Picture";


export default class Sprite extends Component {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {string} path: path of the picture
     * @param {number=} frameWidth: width of a tile
     * @param {number=} frameHeight: height of a tile
     * @param {function=} onPictureLoaded: callback when picture is loaded
     */
    constructor (path, frameWidth, frameHeight, onPictureLoaded) {
        super();

        if (!path) {
            throw new Error("Sprite.constructor : a path must be provided");
        }

        /**
         * Picture of the sprite
         * @type {Picture}
         */
        this.picture = new Picture();

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

        /**
         * Flip deleguation of picture
         * @type {{x: boolean, y: boolean}}
         */
        this.flip = {x: false, y: false};

        /**
         * Offset of the picture compared to the position of the Entity
         * @type {{x: number, y: number}}
         */
        this.offset = {x: 0, y: 0};

        /**
         * Rotation of picture
         * @type {number}
         */
        this.rotation = 0;

        /**
         * Opacity of the picture
         * @type {number}
         */
        this.opacity = 1;

        if (frameWidth || frameHeight) {
            this.picture.tilesize = {width: frameWidth || 0, height: frameHeight || 0};
        }

        this.picture.onImageLoaded = onPictureLoaded;
        this.picture.load(path);
    }

    /**
     * Update
     * @returns {void|null} void
     */
    update () {
        if (!this.animation || (this.animation && !this.animation.duration)) {
            return null;
        }

        this.animation.time++;

        if (this.animation.time >= this.animation.fraction) {
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
        if (!this.picture.loaded || !this.composedBy || (this.composedBy && !this.composedBy.scene)) {
            return null;
        }

        let offset  = {x: 0, y: 0};

        if (this.animation && this.animation.offset) {
            offset = this.animation.offset.flip ? {x: this.flip.x ? -this.animation.offset.x : this.animation.offset.x, y: this.flip.y ? -this.animation.offset.y : this.animation.offset.y} : this.animation.offset;

        } else if (this.offset) {
            offset = this.offset.flip ? {x: this.flip.x ? -this.offset.x : this.offset.x, y: this.flip.y ? -this.offset.y : this.offset.y} : this.offset;
        }

        this.picture.flip       = this.flip;
        this.picture.opacity    = this.opacity;
        this.picture.rotation   = this.rotation;
        this.picture.render(context, this.composedBy.x() - offset.x - this.composedBy.scene.camera.x, this.composedBy.y() - offset.y - this.composedBy.scene.camera.y, this.animation ? this.animation.frames[this.animation.frame] : 0);
    }

    /* METHODS */

    /**
     * Add a new animation
     * @param {string} name: name of the animation
     * @param {number} duration: duration of the animation
     * @param {Array<number>} frames: frames data in order to be render
     * @param {{x: number, y: number}=} offset: offset picture compared to entity's position
     * @returns {Sprite} recursive function
     */
    addAnimation (name, duration, frames, offset) {
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

        return this;
    }

    /* GETTERS & SETTERS */

    /**
     * Name of the component
     * @returns {string} the name
     */
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
