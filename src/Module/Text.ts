import { Module } from "./../Module";
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
    textContainer: PIXI.Text;

    /**
     * The last offset in x axis provided by the centering property
     * @private
     */
    _centerOffsetX: number = 0;

    /**
     * The last offset in y axis provided by the centering property
     * @private
     */
    _centerOffsetY: number = 0;


    /* CONSTRUCTOR */

    constructor () {
        super();

        this.setProps({
            text        : "",
            align       : "left",
            breakWords  : false,
            dropShadow  : false,
            dropShadowAlpha: 1,
            dropShadowAngle: 80,
            dropShadowColor: Color.black,
            dropShadowDistance: 0,
            dropShadowBlur: 2,
            fill: Color.black,
            fontFamily: "Verdana",
            fontSize: 20,
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

        this.textContainer = new PIXI.Text(this.props.text);

        this.container.addChild(this.textContainer);
        this.signals.propChange.bind("text", () => this.textContainer && (this.textContainer.text = this.props.text));
        this.signals.propChange.bind(["width", "height"], this._onSizeChange.bind(this));
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
     * When "width" or "height" properties has changed
     */
    _onSizeChange (): void {
        if (this.props.centered) {
            const midWidth  = this.props.width / 2,
                midHeight   = this.props.height / 2;

            this.props.x = this.props.x - midWidth + this._centerOffsetX;
            this.props.y = this.props.y - midHeight + this._centerOffsetY;
            this._centerOffsetX = midWidth;
            this._centerOffsetY = midHeight;
        }
    }

    /**
     * When a font style property has changed
     */
    _onStyleChange (): void {
        const { align, breakWords, dropShadow, dropShadowAlpha, dropShadowAngle, dropShadowBlur, dropShadowColor, dropShadowDistance, fill, fontFamily, fontSize, fontStyle, fontVariant, fontWeight,
            letterSpacing, lineHeight, padding, stroke, strokeThickness, textBaseline, wordWrap, wordWrapWidth } = this.props;

        this.textContainer.style.align = align;
        this.textContainer.style.breakWords = breakWords;
        this.textContainer.style.dropShadow = dropShadow;
        this.textContainer.style.dropShadowAlpha = dropShadowAlpha;
        this.textContainer.style.dropShadowAngle = Util.toRadians(dropShadowAngle);
        this.textContainer.style.dropShadowColor = dropShadowColor;
        this.textContainer.style.dropShadowBlur = dropShadowBlur;
        this.textContainer.style.dropShadowDistance = dropShadowDistance;
        this.textContainer.style.fill = fill;
        this.textContainer.style.fontFamily = fontFamily;
        this.textContainer.style.fontSize = fontSize;
        this.textContainer.style.fontStyle = fontStyle;
        this.textContainer.style.fontVariant = fontVariant;
        this.textContainer.style.fontWeight = fontWeight;
        this.textContainer.style.letterSpacing = letterSpacing;
        this.textContainer.style.lineHeight = lineHeight;
        this.textContainer.style.padding = padding;
        this.textContainer.style.stroke = stroke;
        this.textContainer.style.strokeThickness = strokeThickness;
        this.textContainer.style.textBaseline = textBaseline;
        this.textContainer.style.wordWrap = wordWrap;
        this.textContainer.style.wordWrapWidth = wordWrapWidth;
    }
}