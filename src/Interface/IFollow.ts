import { Module } from "./../Module";


/**
 * This interface allows module to follow an other module
 */
export interface IFollow {

    /**
     * The module object to follow
     */
    target: Module;

    /**
     * Know if the module should be centered relative to the target
     */
    centered: boolean;

    /**
     * Offset in x axis
     */
    offsetX: number;

    /**
     * Offset in y axis
     */
    offsetY: number;

    /**
     * Offset in x axis if the module is flipped (if the value is null, there will be no offset if the target is flipped)
     */
    offsetFlipX?: number;
}