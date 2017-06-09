import { IPoint } from "./IPoint";


export interface IAnimation {

    /**
     * Name of the animation
     */
    name: string;

    /**
     * Duration of each frame of the animation
     */
    duration: number;

    /**
     * List of all frames of the spritesheet
     */
    frames: Array<number>;

    /**
     * The current index of the frame
     */
    frameIndex: number;

    /**
     * The current number of loop
     */
    loop: number;

    /**
     * The max number of looping authorized
     */
    maxLoop: number;

    /**
     * The offset of the sprite relative to its parent
     */
    offset: IPoint;

    /**
     * The texture corresponding of the frame
     */
    textureFrames: Array<PIXI.Rectangle>;
}