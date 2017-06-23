import { Module, Text, Shape } from "./../Module";
import { Enum } from "./../Tool";
import { IGraphicsProps, IShapeProps } from "./../Interface";


export class Graphic extends Module {

    /* ATTRIBUTES */

    /**
     * Properties of a graphics
     */
    props: IGraphicsProps;

    /**
     * Graphics object
     */
    graphics: any = {};

    /**
     * State of the graphic
     */
    state: string = Enum.STATE.DEFAULT;

    /**
     * The PIXI Container of a Graphics
     */
    container: PIXI.Graphics = new PIXI.Graphics();


    /* LIFECYCLE */

    constructor () {
        super();

        this.signals.propChange.bind("disabled", this.onDisabledChange.bind(this));
        this.signals.propChange.bind("activable", this.onActivableChange.bind(this));
    }

    initialize (props) {
        super.initialize(props);

        this.onDisabledChange();
        this.onActivableChange();
    }


    /* METHODS */

    /**
     * Add a new graphic chaine
     * @param name - Name of the graphic
     * @param Item - Class of the item to be instanciated if the graphic doesnot exists
     * @param props - Properties to pass to the graphic
     * @param stateProps - Properties to pass to the graphic relative to the state of the current object
     * @return Current instance
     */
    graphic (name: string, Item: typeof Module, props?: any | Function, stateProps: any = {}): this {
        const item = this.graphics[name] ? this.graphics[name].item : new Item();

        if (typeof props === "function") {
            props = props(item);
        }

        if (!this.graphics[name]) {
            this.graphics[name] = {
                item    : <Module> this.add(item),
                default : Object.assign({}, props)
            };
        }

        const graphic = this.graphics[name];

        if (props) {
            graphic.default = Object.assign({}, graphic.default, props);
        }

        if (stateProps) {
            Object.keys(stateProps).forEach(state => graphic[state] = Object.assign({}, graphic[state] || {}, stateProps[state]));
        }

        return this.updateGraphic(name);
    }

    /**
     * Helper to create a shape as a graphic
     * @param name - Name of the shape
     * @param props - Properties to pass to the shape
     * @param stateProps - Properties to pass to the shape relative to the state of the current object
     * @return Current instace
     */
    shape (name: string, props?: any | Function, stateProps: any = {}): this {
        return this.graphic(name, Shape, props, stateProps);
    }

    /**
     * Helper to create a Text as a graphic
     * @param name - Name of the text
     * @param props - Properties to pass to the text
     * @param stateProps - Properties to pass to the text relative to the state of the current object
     * @return Current instance
     */
    text (name: string, props?: any | Function, stateProps: any = {}): this {
        return this.graphic(name, Text, props, stateProps);
    }

    /**
     * Remove a graphic object by its name
     * @param name - Name of the graphic to remove
     * @returns Current instance
     */
    removeGraphic (name: string): this {
        const item = this.graphics[name];

        if (item) {
            item.kill();
            delete this.graphics[item];
        }

        return this;
    }

    /**
     * Update the properties of a graphic object
     * @param name - Name of the graphic to update
     * @returns Current instance
     */
    updateGraphic (name: string): this {
        const graphic   = this.graphics[name],
            props       = graphic && graphic[this.state];

        if (props) {
            Object.keys(props).forEach(key => graphic.item.props[key] = props[key]);
        }

        return this;
    }

    /**
     * Get the graphic item by its name
     * @param name - Name of the graphic to get
     * @return The graphic item
     */
    getGraphicItem (name: string): Module {
        const graphic = this.graphics[name];

        return graphic && graphic.item;
    }

    /**
     * Change the state of the graphic
     * @param state - The next state of the graphic
     */
    setState (state?: string): void {
        this.state = state || Enum.STATE.DEFAULT;

        Object.keys(this.graphics).forEach(this.updateGraphic.bind(this));
    }

    /**
     * Show the graphic
     */
    show (duration: number = 250): void {
        this.addTransition("opacity", duration, {
            to: 1
        });
    }

    /**
     * Hide the graphic
     */
    hide (duration: number = 250): void {
        this.addTransition("opacity", duration, {
            to: 0
        });
    }

    /**
     * Toggle the graphic
     */
    toggle (): void {
        if (this.props.opacity > 0.5) {
            this.hide();

        } else {
            this.show();

        }
    }


    /* EVENTS */

    /**
     * When "disabled" property has changed
     */
    onDisabledChange (): void {
        if (this.props.isDisabled) {
            this.signals.hoverStart.remove(this._onHoverStartEvent.bind(this));
            this.signals.hoverEnd.remove(this._onHoverEndEvent.bind(this));
            this.setState(Enum.STATE.DISABLED);

        } else {
            this.signals.hoverStart.add(this._onHoverStartEvent.bind(this));
            this.signals.hoverEnd.add(this._onHoverEndEvent.bind(this));

            if (this.state === Enum.STATE.DISABLED) {
                this.setState(Enum.STATE.DEFAULT);
            }    
        }
    }

    /**
     * When "activable" property has changed
     */
    onActivableChange (): void {
        if (this.props.activable) {
            this.signals.click.add(this._onClickEvent.bind(this));

        } else {
            this.signals.click.remove(this._onClickEvent.bind(this));

        }
    }

    /**
     * Event fired on hover
     */
    _onHoverStartEvent (): void {
        if (!this.props.isDisabled) {
            this.setState(Enum.STATE.HOVER);
        }
    }

    /**
     * Event fired after hover
     */
    _onHoverEndEvent (): void {
        if (!this.props.isDisabled) {
            this.setState(this.props.isActivated ? Enum.STATE.ACTIVE : Enum.STATE.DEFAULT);
        }
    }

    /**
     * Event fired on click
     */
    _onClickEvent (): void {
        if (!this.props.isDisabled) {
            this.props.isActivated = this.props.activable ? !this.props.isActivated : false;
            this._onHoverEndEvent();
        }
    }
}
