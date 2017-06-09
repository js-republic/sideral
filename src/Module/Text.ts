import { Module } from "./index";
import { Util } from "./../Tool";
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
            defaultStyle: {}
        });

        this.container = new PIXI.Text(this.props.text);
        this.signals.propChange.bind("text", this._onTextChange.bind(this));
    }

    initialize (props) {
        super.initialize(props);

        this.updateStyle(this.props.defaultStyle);
    }


    /* METHODS */

    updateStyle (style: any): void {
        Object.keys(style).forEach(key => this.container.style[key] = style[key]);
    }


    /* EVENTS */

    /**
     * When "text" property has changed
     */
    _onTextChange (): void {
        this.container.text = this.props.text;
    }
}