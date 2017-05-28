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

    /**
     * the HTMLElement which will contain the game
     */
    container: HTMLElement;
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
     * The factor of gravity
     */
    gravityFactor: number;

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
     * The factor of bounce
     */
    bounce: number;

    /**
     * If true, the entity will enter in debug mode and display it's size on screen
     */
    debug: boolean;
}

/**
 * Properties of a Wall
 */
export interface IWallProps extends IModuleProps {

    /**
     * The type of box of the wall (rectangular, circular, etc.) see Enum
     */
    box: string;

    /**
     * The direction constraint of the wall
     */
    directionConstraint: string;

    /**
     * Set or remove the debug mode
     */
    debug: boolean;
}

/**
 * Properties of a Sprite
 */
export interface ISpriteProps extends IModuleProps {

    /**
     * The path of the spritesheet image
     */
    imagePath: string;

    /**
     * If true, the sprite will be killed after the animation has finished
     */
    autoKill: boolean;
}

/**
 * Properties of a Shape
 */
export interface IShapeProps extends IModuleProps {

    /**
     * The color of the stroke
     */
    stroke: string;

    /**
     * The color of the fill
     */
    fill: string;

    /**
     * The type of box (see Enum for more informations)
     */
    box: string;
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