import { IModuleProps, ITextProps } from "./index";


export interface IGraphicsProps extends IModuleProps {
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
     * The alpha for the stroke
     */
    strokeAlpha: number;

    /**
     * The sickness of the stroke
     */
    strokeThickness: number;

    /**
     * The color of the fill
     */
    fill: string;

    /**
     * The alpha for the fill
     */
    fillAlpha: number;

    /**
     * The radius of the shape
     */
    radius: number;

    /**
     * The type of box (see Enum for more informations)
     */
    box: string;
}

export interface IButtonProps extends IGraphicsProps {

    /**
     * The label to be displayed within the button
     */
    label: ITextProps;

    /**
     * Properties when button is hover
     */
    hover: IButtonProps;

    /**
     * Know if the button is enabled or not
     */
    disabled: boolean;

    /**
     * The padding horizontal of the button
     */
    paddingHorizontal: number;

    /**
     * The padding vertical of the button
     */
    paddingVertical: number;

    /**
     * The id of the icon to display
     */
    iconId: string;

    /**
     * The background image id
     */
    backgroundImageId: string;

    /**
     * Automatic size the button related to the shape and text
     */
    sizeAuto: boolean;

    /**
     * Properties of the shape
     */
    shape: IShapeProps;
}

/**
 * Properties of a Progress Object
 */
export interface IProgressProps extends IGraphicsProps {

    /**
     * The minimum value
     */
    min: number;

    /**
     * The maximum value
     */
    max: number;

    /**
     * The value of the progress
     */
    value: number;

    /**
     * Type of box (see Enum.BOX)
     */
    box: string;

    /**
     * The color of the stroke
     */
    strokeColor: string;

    /**
     * The alpha of the stroke color
     */
    strokeAlpha: number;

    /**
     * The thickness of the stroke
     */
    strokeThickness: number;

    /**
     * The color of the background
     */
    backgroundColor: string;

    /**
     * The alpha of the background color
     */
    backgroundAlpha: number;
}