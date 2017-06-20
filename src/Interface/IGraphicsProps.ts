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
    stroke?: string;

    /**
     * The alpha for the stroke
     */
    strokeAlpha?: number;

    /**
     * The sickness of the stroke
     */
    strokeThickness?: number;

    /**
     * The color of the fill
     */
    fill?: string;

    /**
     * The alpha for the fill
     */
    fillAlpha?: number;

    /**
     * The radius of the shape
     */
    radius?: number;

    /**
     * The type of box (see Enum for more informations)
     */
    box?: string;
}

export interface IButtonProps extends IGraphicsProps {

    /**
     * The label to be displayed within the button
     */
    label?: ITextProps;

    /**
     * Properties when button is hover
     */
    hover?: IButtonProps;

    /**
     * Know if the button is enabled or not
     */
    disabled?: boolean;

    /**
     * The padding horizontal of the button
     */
    paddingHorizontal?: number;

    /**
     * The padding vertical of the button
     */
    paddingVertical?: number;

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

    /**
     * Properties of the shape
     */
    shape?: IShapeProps;
}

/**
 * Properties of a Dialog object
 */
export interface IDialogProps extends IGraphicsProps {

    /**
     * Properties of the title label
     */
    label?: ITextProps;

    /**
     * Properties of a shape
     */
    shape?: IShapeProps;

    /**
     * Padding horizontal of the shape
     */
    paddingHorizontal?: number;

    /**
     * Padding vertical of the shape
     */
    paddingVertical?: number;

    /**
     * The offset in x axis of the shape relative to its position
     */
    offsetX?: number;

    /**
     * The offset in y axis of the shape relative to its position
     */
    offsetY?: number;

    /**
     * If true, a cross close will appear
     */
    closable?: boolean;

    /**
     * Properties of the modal shape (background global)
     */
    modal?: IShapeProps;

    /**
     * List of all button actions for the dialog
     */
    actions?: Array<IButtonProps>;
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

    /**
     * Type of box (see Enum.BOX)
     */
    box?: string;

    /**
     * The color of the stroke
     */
    strokeColor?: string;

    /**
     * The alpha of the stroke color
     */
    strokeAlpha?: number;

    /**
     * The thickness of the stroke
     */
    strokeThickness?: number;

    /**
     * The color of the background
     */
    backgroundColor?: string;

    /**
     * The alpha of the background color
     */
    backgroundAlpha?: number;
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

/**
 * Properties of a Text
 */
export interface ITextProps extends IGraphicsProps {

    /**
     * The text to be drawn
     */
    text?: string;

    /**
     * Alignment for multiline text ("left", "center" or "right"), does not affect single line text
     */
    align?: string;

    /**
     * Indicates if lines can be wrapped within words, it needs wordWrap to be set to true
     */
    breakWords?: boolean;

    /**
     * Set a drop shadow for the text
     */
    dropShadow?: boolean;

    /**
     * Alpha of the drop shadow
     */
    dropShadowAlpha?: number;

    /**
     * Angle of the drop shadow (in degree)
     */
    dropShadowAngle?: number;

    /**
     * Blur radius of the drop shadow
     */
    dropShadowBlur?: number;

    /**
     * Color of the drop shadow
     */
    dropShadowColor?: string | number;

    /**
     * Distance of the drop shadow
     */
    dropShadowDistance?: number;

    /**
     * The fill color of the text
     */
    fill?: string | number;

    /**
     * The font family used to display the text (can be a array of font families)
     */
    fontFamily?: string | Array<string>;

    /**
     * The size of the font
     */
    fontSize?: number | string;

    /**
     * The style of the font ("normal", "italic" or "oblique")
     */
    fontStyle?: string;

    /**
     * The variant of the font ("normal" or "smalcaps");
     */
    fontVariant?: string;

    /**
     * The weight of the font ("normal", "bold", "bolder", "thin" or "lighter")
     */
    fontWeight?: string;

    /**
     * The amount of spacing between letters
     */
    letterSpacing?: number;

    /**
     * The vertical spaces between letters
     */
    lineHeight?: number;

    /**
     * Padding of the text if its cropped
     */
    padding?: number;

    /**
     * The stroke color of the text
     */
    stroke?: number | string;

    /**
     * The thickness of the stroke style of the text
     */
    strokeThickness?: number;

    /**
     * The baseline of the text
     */
    textBaseline?: string;

    /**
     * Indicates if word wrap should be used
     */
    wordWrap?: boolean;

    /**
     * The width at which text will wrap, it needs wordWrap to be set to true
     */
    wordWrapWidth?: number;
}
