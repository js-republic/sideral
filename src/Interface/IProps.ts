import * as p2 from "p2";

import { IFollow } from "./IFollow";
import { Entity } from "./../Entity";


/**
 * Properties for SideralObject
 */
export interface IProps {

}


/**
 * Properties for Module
 */
export interface IModuleProps extends IProps {

    /**
     * Position in x axis
     */
    x: number;

    /**
     * Position in y axis
     */
    y: number;

    /**
     * Width of the module
     */
    width: number;

    /**
     * Height of the module
     */
    height: number;

    /**
     * Know if the module is flipped or not (only in x axis)
     */
    flip: boolean;

    /**
     * The angle of the module (in degree)
     */
    angle: number;

    /**
     * Know if the module is visible or hidden
     */
    visible: boolean;

    /**
     * This property allows the module to follow an other module
     */
    follow: IFollow;
}


/**
 * Properties for Game
 */
export interface IGameProps extends IProps {

    /**
     * Width of the game
     */
    width: number;

    /**
     * Height of the game
     */
    height: number;

    /**
     * Background color of the game
     */
    background: string;
}

/**
 * Properties for Scene
 */
export interface ISceneProps extends IModuleProps {

    /**
     * Scale of the scene
     */
    scale: number;

    /**
     * If true, the size of the scene will be relative to the size of the game
     */
    sizeAuto: boolean;

    /**
     * The color of background of the scene
     */
    backgroundColor: string;

    /**
     * The alpha of the background color
     */
    backgroundAlpha: number;

    /**
     * The power of gravity (only in y axis)
     */
    gravity: number;

    /**
     * The speed of all motion ("1" represents the normal speed, set to "0" to freeze all motions)
     */
    motionFactor: number;
}

/**
 * Properties of a Timer
 */
export interface ITimerProps extends IProps {

    /**
     * Duration of the timer
     */
    duration: number;

    /**
     * Number of recurrence
     */
    recurrence: number;

    /**
     * Know if the timer is reversible or not
     */
    reversible: boolean;

    /**
     * Function called when timer has launched
     */
    init?: Function;

    /**
     * Function called every update of the timer
     */
    update?: Function;

    /**
     * Function called when the timer is completed or stopped
     */
    complete?: Function;
}

/**
 * Properties of an Entity
 */
export interface IEntityProps extends IModuleProps {

    /**
     * The velocity in x axis
     */
    vx: number;

    /**
     * The velocity in y axis
     */
    vy: number;

    /**
     * The acceleration speed in x axis
     */
    accelX: number;

    /**
     * The acceleration speed in y axis
     */
    accelY: number;

    /**
     * The factor of gravity
     */
    gravityFactor: number;

    /**
     * Factor of bounce
     */
    bounce: number;

    /**
     * The box shape of the entity (see Enum.BOX)
     */
    box: string;

    /**
     * The group linked to the entity (see Enum.GROUP)
     */
    group: number;

    /**
     * The type of the entity (see Enum.TYPE)
     */
    type: number;

    /**
     * Set or unset the fraction mode when moving
     */
    friction: boolean;

    /**
     * If true, the entity will enter in debug mode and display it's size on screen
     */
    debug: boolean;
}

/**
 * Properties of a Wall
 */
export interface IWallProps extends IEntityProps {

    /**
     * The direction constraint of the wall
     */
    directionConstraint: string;
}

/**
 * Properties of a Sprite
 */
export interface ISpriteProps extends IModuleProps {

    /**
     * The Assets id of the spritesheet image
     */
    imageId: string;

    /**
     * If true, the sprite will be killed after the animation has finished
     */
    autoKill: boolean;

    /**
     * Set to true if the image used is a spritesheet. Set to false consider the sprite to display the image
     */
    spritesheet: boolean;
}

/**
 * Properties of a particle
 */
export interface IParticlesProps extends IEntityProps {

    /**
     * Data algorithm for particles
     */
    config: any;

    /**
     * List of all images to use to generate particles
     */
    images: Array<string>;

    /**
     * Duration of particles (in ms)
     */
    duration: number;

    /**
     * If true, Particles will emit when initialized
     */
    autoRun: boolean;
}

/**
 * Properties of a Hitbox
 */
export interface IHitboxProps extends IEntityProps {

    offsetX: number;

    /**
     * If true, the hitbox will hits multiple targets
     */
    multipleHit: boolean;

    /**
     * If true, the hitbox will hit a target only once
     */
    oncePerHit: boolean;

    /**
     * The max number of hits before the destruction of the hitbox
     */
    maxHit: number;

    /**
     * The entity owner of the hitbox
     */
    owner: Entity;
}


/**
 * Properties of a Text
 */
export interface ITextProps extends IModuleProps {

    /**
     * The text to be drawn
     */
    text: string;

    /**
     * Alignment for multiline text ("left", "center" or "right"), does not affect single line text
     */
    align: string;

    /**
     * Indicates if lines can be wrapped within words, it needs wordWrap to be set to true
     */
    breakWords: boolean;

    /**
     * Set a drop shadow for the text
     */
    dropShadow: boolean;

    /**
     * Alpha of the drop shadow
     */
    dropShadowAlpha: number;

    /**
     * Angle of the drop shadow (in degree)
     */
    dropShadowAngle: number;

    /**
     * Blur radius of the drop shadow
     */
    dropShadowBlur: number;

    /**
     * Color of the drop shadow
     */
    dropShadowColor: string | number;

    /**
     * Distance of the drop shadow
     */
    dropShadowDistance: number;

    /**
     * The fill color of the text
     */
    fill: string | number;

    /**
     * The font family used to display the text (can be a array of font families)
     */
    fontFamily: string | Array<string>;

    /**
     * The size of the font
     */
    fontSize: number | string;

    /**
     * The style of the font ("normal", "italic" or "oblique")
     */
    fontStyle: string;

    /**
     * The variant of the font ("normal" or "smalcaps");
     */
    fontVariant: string;

    /**
     * The weight of the font ("normal", "bold", "bolder", "thin" or "lighter")
     */
    fontWeight: string;

    /**
     * The amount of spacing between letters
     */
    letterSpacing: number;

    /**
     * The vertical spaces between letters
     */
    lineHeight: number;

    /**
     * Padding of the text if its cropped
     */
    padding: number;

    /**
     * The stroke color of the text
     */
    stroke: number | string;

    /**
     * The thickness of the stroke style of the text
     */
    strokeThickness: number;

    /**
     * The baseline of the text
     */
    textBaseline: string;

    /**
     * Indicates if word wrap should be used
     */
    wordWrap: boolean;

    /**
     * The width at which text will wrap, it needs wordWrap to be set to true
     */
    wordWrapWidth: number;
}
