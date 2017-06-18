import { Module } from "./../Module";
import { Assets } from "./../Tool";

import { IAnimation, ISpriteProps } from "./../Interface";


/**
 * Sprite module to generate animations from spritesheets
 */
export class Sprite extends Module {

    /* ATTRIBUTES */

    /**
     * Properties of a Sprite
     */
    props: ISpriteProps;

    /**
     * Know if the sprite is loaded and can be animated
     * @readonly
     */
    loaded: boolean = false;

    /**
     * The image data
     * @readonly
     */
    image: HTMLImageElement;

    /**
     * List of all animations
     * @readonly
     */
    animations: Array<IAnimation> = [];

    /**
     * Current animation
     * @readonly
     */
    animation: IAnimation;

    /**
     * The PIXI Container
     * @readonly
     */
    container: PIXI.Sprite = new PIXI.Sprite();


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            spritesheet : true,
            centered    : true
        });

        this.signals.propChange.bind("imageId", this.onImageIdChange.bind(this));
        this.signals.propChange.bind("centered", this.onCenteredChange.bind(this));
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props: any = {}) {
        const width     = props.width || this.props.width,
            height      = props.height || this.props.height,
            centered    = typeof props.centered !== "undefined" ? props.centered : this.props.centered;

        if (centered) {
            props.x     = (props.x || 0) + (width / 2);
            props.y     = (props.y || 0) + (height / 2);
        }

        super.initialize(props);
    }


    /* METHODS */

    /**
     * Add an animation for the current sprite
     * @param name - Name of the animation
     * @param duration - Duration of the animation (in ms)
     * @param frames - Array of frames to be displayed during the animation
     * @param maxLoop - number of loop. If loop === -1, there will be no limit of loop
     * @param offset - offset x and y related to the position of the Entity
     * @returns current instance to chain this function
     */
    addAnimation (name: string, duration: number, frames: Array<number>, maxLoop: number = -1, offset?: ({x: number, y: number})): this {
        if (!name || !frames) {
            throw new Error("Sprite.addAnimation: You must set a name, duration and frames.");
        }

        this.animations.push({
            name        : name,
            duration    : duration,
            frames      : frames,
            frameIndex  : 0,
            loop        : 0,
            maxLoop     : maxLoop,
            offset      : offset,
            textureFrames: this._framesToRectangles(frames)
        });

        if (this.animations.length === 1 && this.loaded) {
            this.setAnimation(name);
        }

        return this;
    }

    /**
     * Set the current animation for the sprite
     * @param name - Name of the animation
     * @param restart - If true, restart the entire information about the animation such as number of loop
     */
    setAnimation (name: string, restart: boolean = false): void {
        if (!restart && this.animation && this.animation.name === name) {
            return null;
        }

        this.animation = this.getAnimation(name);

        if (this.animation) {
            this.animation.loop         = 0;
            this.animation.frameIndex   = 0;

            if (this.animation.offset) {
                this.setProps({
                    x: this.animation.offset.x,
                    y: this.animation.offset.y
                });
            }

            if (this.loaded) {
                this.container.texture.frame = this.animation.textureFrames[this.animation.frameIndex];
                this.timers.addTimer("sprite", this.animation.duration, this.onNextSprite.bind(this));
            }
        }
    }

    /**
     * Get an existing animation for the sprite
     * @param name - Name of the animation
     * @returns The animation object
     */
    getAnimation (name: string): IAnimation {
        return this.animations.find(animation => animation.name === name);
    }

    /**
     * Remove the animation by its name
     * @param name - Name of the animation to remove
     */
    removeAnimation (name: string): void {
        this.animations = this.animations.filter(animation => animation.name === name);
    }

    /**
     * Convert frame indexes to pixi rectangles
     * @private
     * @param frames - Frames to convert
     * @returns Frames converted to pixi rectangles
     */
    _framesToRectangles (frames: Array<number>): Array<PIXI.Rectangle> {
        if (!this.image) {
            return [];
        }

        return frames.map(frame => new PIXI.Rectangle(
            Math.floor(frame * this.props.width) % this.image.width,
            Math.floor(frame * this.props.width / this.image.width) * this.props.height,
            this.props.width, this.props.height
        ));
    }


    /* EVENTS */

    /**
     * When "centered" attributes has changed
     */
    onCenteredChange (): void {
        if (this.props.centered) {
            this.container.anchor.set(0.5, 0.5);

        } else {
            this.container.anchor.set(0, 0);
        }
    }

    /**
     * When timer of a frame is finished
     */
    onNextSprite (): void {
        if (this.animation.frameIndex >= (this.animation.frames.length - 1)) {
            this.animation.loop++;
            this.animation.frameIndex = this.animation.maxLoop > -1 && this.animation.loop > this.animation.maxLoop ? this.animation.frames.length - 1 : 0;

        } else {
            this.animation.frameIndex++;
        }

        if (this.animation.maxLoop < 0 || this.animation.loop < this.animation.maxLoop) {
            this.container.texture.frame = this.animation.textureFrames[this.animation.frameIndex];
            this.timers.get("sprite").restart();

        } else if (this.props.autoKill) {
            this.kill();

        }
    }

    /**
     * When "imageId" attributes change
     */
    onImageIdChange (): void {
        Assets.get(this.props.imageId, resource => {
            const texture = resource.texture;

            this.container.texture  = texture;
            this.image              = resource.data;

            if (!this.props.spritesheet) {
                this.addAnimation("idle", 1, [0]);
                this.setProps({
                    width: this.image.width,
                    height: this.image.height
                });
            }

            texture.frame = new PIXI.Rectangle(0, 0, this.props.width, this.props.height);

            this.animations.forEach(animation => animation.textureFrames = this._framesToRectangles(animation.frames));

            this.loaded = true;

            if (this.animations.length && !this.animation) {
                this.setAnimation(this.animations[0].name, true);
            }
        });
    }
}
