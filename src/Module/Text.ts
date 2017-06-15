import { Module } from "./index";
import { Util, Color } from "./../Tool";
import { ITextProps } from "./../interface";


export class Text extends Module {

    /* ATTRIBUTES */

    /**
     * Properties of a text
     */
    props: ITextProps;

    /**
     * Special container for Text
     */
    container: PIXI.Text;


    /* CONSTRUCTOR */

    constructor () {
        super();

        this.setProps({
            text        : "Hello world",
            align       : "left",
            breakWords  : false,
            dropShadow  : false,
            dropShadowAlpha: 1,
            dropShadowAngle: 80,
            dropShadowColor: Color.black,
            dropShadowDistance: 5,
            fill: Color.black,
            fontFamily: "Arial",
            fontSize: 26,
            fontStyle: "normal",
            fontVariant: "normal",
            fontWeight: "normal",
            letterSpacing: 0,
            lineHeight: null,
            padding: 0,
            stroke: Color.black,
            strokeThickness: 0,
            textBaseline: "alphabetic",
            wordWrap: false,
            wordWrapWidth: 100
        });

        this.container = new PIXI.Text(this.props.text);
        this.signals.propChange.bind("text", this._onTextChange.bind(this));
        this.signals.propChange.bind(["align", "breakWords", "dropShadow", "dropShadowAlpha", "dropShadowAngle", "dropShadowColor", "dropShadowDistance", "fill", "fontFamily", "fontSize", "fontStyle", "fontVariant",
            "fontWeight", "letterSpacing", "lineHeight", "padding", "stroke", "strokeThickness", "textBaseline", "wordWrap", "wordWrapWidth"], this._onStyleChange.bind(this));
    }

    update (tick) {
        super.update(tick);

        if (this.container) {
            this.props.width    = this.container.width;
            this.props.height   = this.container.height;
        }
    }


    /* EVENTS */

    /**
     * When "text" property has changed
     */
    _onTextChange (): void {
        this.container.text = this.props.text;
    }

    /**
     * When a font style property has changed
     */
    _onStyleChange (): void {
        const { align, breakWords, dropShadow, dropShadowAlpha, dropShadowAngle, dropShadowColor, dropShadowDistance, fill, fontFamily, fontSize, fontStyle, fontVariant, fontWeight,
            letterSpacing, lineHeight, padding, stroke, strokeThickness, textBaseline, wordWrap, wordWrapWidth } = this.props;

        this.container.style.align = align;
        this.container.style.breakWords = breakWords;
        this.container.style.dropShadow = dropShadow;
        this.container.style.dropShadowAlpha = Util.toRadians(dropShadowAlpha);
        this.container.style.dropShadowAngle = dropShadowAngle;
        this.container.style.dropShadowColor = dropShadowColor;
        this.container.style.dropShadowDistance = dropShadowDistance;
        this.container.style.fill = fill;
        this.container.style.fontFamily = fontFamily;
        this.container.style.fontSize = fontSize;
        this.container.style.fontStyle = fontStyle;
        this.container.style.fontVariant = fontVariant;
        this.container.style.fontWeight = fontWeight;
        this.container.style.letterSpacing = letterSpacing;
        this.container.style.lineHeight = lineHeight;
        this.container.style.padding = padding;
        this.container.style.stroke = stroke;
        this.container.style.strokeThickness = strokeThickness;
        this.container.style.textBaseline = textBaseline;
        this.container.style.wordWrap = wordWrap;
        this.container.style.wordWrapWidth = wordWrapWidth;
    }
}