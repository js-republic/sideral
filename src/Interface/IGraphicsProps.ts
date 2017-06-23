import { IModuleProps, ITextProps, IShapeProps } from "./index";


export interface IGraphicsProps extends IModuleProps {

    /**
     * If true, the graphic will have the state Activated on click
     */
    activable?: boolean;

    /**
     * Know if the graphic is enabled or not
     */
    isDisabled?: boolean;

    /**
     * Know if the graphic is activated or not
     */
    isActivated?: boolean;

    /**
     * Properties on hover
     */
    hover?: any;

    /**
     * Properties when activated
     */
    active?: any;

    /**
     * Properties when disabled
     */
    disabed?: any;
}

export interface IButtonProps extends IGraphicsProps {

    /**
     * If true, the label will be centered 
     */
    labelCentered?: boolean;

    /**
     * The id of the icon to display
     */
    iconId?: string;

    /**
     * The background image id
     */
    backgroundImageId?: string;

    /**
     * Automatic size the button related to the shape and text
     */
    sizeAuto?: boolean;
}

/**
 * Properties of a Dialog object
 */
export interface IDialogProps extends IGraphicsProps {

    /**
     * If true, the dialog will be centered relative to the scene size
     */
    centerScreen?: boolean;

    /**
     * If true, the dialog will have the size of the scene
     */
    fullScreen?: boolean;

    /**
     * Use an offset in x position (used with "centerScreen" or "fullScreen" properties)
     */
    offsetX?: number;

    /**
     * Use an offset in y position (used with "centerScreen" or "fullScreen" properties)
     */
    offsetY?: number;
}

/**
 * Properties of a Progress Object
 */
export interface IProgressProps extends IGraphicsProps {

    /**
     * The minimum value
     */
    min?: number;

    /**
     * The maximum value
     */
    max?: number;

    /**
     * The value of the progress
     */
    value?: number;
}

/**
 * Properties of a Spinner
 */
export interface ISpinnerProps extends IGraphicsProps {

    /**
     * Color of the spinner
     */
    color?: string;

    /**
     * Number of lines of the spinner
     */
    lines?: number;

    /**
     * Speed of rotation
     */
    speed?: number;

    /**
     * The width of a line
     */
    lineWidth?: number;

    /**
     * The height of a line
     */
    lineHeight?: number;

    /**
     * Center spacing between all lines
     */
    centerSpacing?: number;
}
