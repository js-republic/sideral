import AbstractModule from "./../Abstract/AbstractModule";


export default class Sprite extends AbstractModule {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            imagePath   : null,
            flip        : false
        });

        this.loaded     = false;
        this.image      = null;
        this.animations = [];
        this.animation  = null;
        this.container  = new PIXI.Sprite();

        this.container.anchor.set(0.5, 0.5);

        this.signals.propChange.bind("imagePath", this.onImagePathChange.bind(this));
        this.signals.propChange.bind("flip", this.onFlipChange.bind(this));
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props = {}) {
        const width = props.width || this.props.width,
            height  = props.height || this.props.height;

        props.x     = (props.x || 0) + (width / 2);
        props.y     = (props.y || 0) + (height / 2);

        super.initialize(props);
    }

    /**
     * @update
     * @lifecycle
     * @override
     */
    update () {
        super.update();

        this.updateAnimation();
    }


    /* METHODS */

    /**
     * Add an animation for the current sprite
     * @param {string} name: name of the animation
     * @param {number} duration: duration of the animation (in frames)
     * @param {Array<number>} frames: Array of frames to be displayed during the animation
     * @param {{x: number, y: number}=} offset: offset x and y related to the position of the Entity
     * @returns {Sprite} current instance to chain this function
     */
    addAnimation (name, duration, frames, offset) {
        if (!name || !frames) {
            throw new Error("Sprite.addAnimation: You must set a name, duration and frames.");
        }

        this.animations.push({ name: name, duration: duration, time: 0, frames: frames, frame: 0, loop: 0, fraction: Math.floor(duration / frames.length), offset: offset });

        if (this.animations.length === 1 && this.loaded) {
            this.setAnimation(name);
        }

        return this;
    }

    /**
     * Set the current animation for the sprite
     * @param {string} name: name of the animation
     * @param {boolean=} restart: if true, restart the entire information about the animation such as number of loop
     * @returns {void}
     */
    setAnimation (name, restart) {
        this.animation = this.getAnimation(name);

        if (this.animation) {
            if (restart) {
                this.animation.loop     = 0;
                this.animation.frame    = 0;
                this.animation.time     = 0;
            }

            if (this.animation.offset) {
                this.position(this.animation.offset.x, this.animation.offset.y);
            }

            this.renderFrame(0);
        }
    }

    /**
     * Get an existing animation for the sprite
     * @param {string} name: name of the animation
     * @returns {*} animation object
     */
    getAnimation (name) {
        return this.animations.find(animation => animation.name === name);
    }

    /**
     * Remove the animation by its name
     * @param {string} name: name of the animation to remove
     * @returns {void}
     */
    removeAnimation (name) {
        this.animations = this.animations.filter(animation => animation.name === name);
    }

    /**
     * Update the current animation
     * @returns {void|null} -
     */
    updateAnimation () {
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
     * Render the current number of frame
     * @param {number} frame: number of frame
     * @returns {void}
     */
    renderFrame (frame) {
        const { width, height } = this.image,
            frameWidth          = this.container.texture.frame.width;

        this.container.texture.frame.x = Math.floor(frame * frameWidth) % width;
        this.container.texture.frame.y = Math.floor(frame * frameWidth / width) * height;

        console.log(this.container.texture.frame.x, this.container.texture.frame.y);
    }


    /* EVENTS */

    /**
     * When imagePath attributes change
     * @returns {void}
     */
    onImagePathChange () {
        const loader = new PIXI.loaders.Loader();

        loader.add(this.props.imagePath).load(() => {
            const texture = loader.resources[this.props.imagePath].texture;

            texture.frame = new PIXI.Rectangle(0, 0, this.props.width, this.props.height);
            this.container.texture  = texture;
            this.loaded             = true;
            this.image              = loader.resources[this.props.imagePath].data;

            if (this.animations.length && !this.animation) {
                this.setAnimation(this.animations[0].name);
            }
        });
    }

    /**
     * when flip attributes change
     * @returns {void}
     */
    onFlipChange () {
        this.container.scale.x      = Math.abs(this.container.scale.x) * (this.props.flip ? -1 : 1);
        this.container.anchor.x     = this.props.flip ? -0.5 : 0.5;
    }
}
