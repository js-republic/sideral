import { Module } from "./../Module";
import { IGraphicsProps, IShapeProps } from "./../Interface";


export class Graphic extends Module {

    /* LIFECYCLE */

    /**
     * Properties of a graphics
     */
    props: IGraphicsProps;

    /**
     * List of graphics used by the props
     */
    graphics: any = {};

    /**
     * State of the graphic
     */
    state: string;

    /**
     * The PIXI Container of a Graphics
     */
    container: PIXI.Graphics = new PIXI.Graphics();


    /* METHODS */

    /**
     * Add a new graphic element
     * @param name - Name of the property linked to the graphic
     * @param graphic - The graphic element
     * @param props - Add some extra properties to the graphic
     */
    addGraphic (name: string, graphic: Graphic, props?: any): Graphic {
        const prop = this.props[name];

        if (prop) {
            this.graphics[name] = <Graphic> this.add(graphic, Object.assign({}, prop, props));
        }

        return prop && graphic;
    }

    /**
     * Update a graphic element by its name
     * @param name - Name of the graphic element
     * @param props - Other props to pass to the graphic element
     * @param saveProps - If true, the props passed by parameters will be saved into the current props of this graphic
     */
    updateGraphic (name: string, props?: any, saveProps: boolean = true): void {
        const graphic   = this.getGraphic(name),
            propsExists = props && typeof props === "object";

        let prop        = this.props[name];

        if (graphic && prop) {
            if (saveProps && propsExists) {
                if (typeof prop !== "object") {
                    prop = this.props[name] = {};
                }

                Object.keys(props).forEach(key => prop[key] = props[key]);
            }

            Object.keys(prop).forEach(key => graphic.props[key] = prop[key]);

            if (!saveProps && propsExists) {
                Object.keys(props).forEach(key => graphic.props[key] = props[key]);
            }
        }
    }

    /**
     * Get a graphic element by its name
     * @param name - Name of the graphic
     * @returns The graphic element
     */
    getGraphic (name: string): Graphic {
        return this.graphics[name];
    }

    /**
     * Get all graphics
     */
    getGraphics (): Array<Graphic> {
        return this.getGraphicsName().map(key => this.graphics[key]);
    }

    /**
     * Get all names of graphics element
     */
    getGraphicsName (): Array<string> {
        return Object.keys(this.graphics);
    }

    /**
     * Change the state of the graphic
     * @param state - The next state of the graphic
     */
    setState (state?: string): void {
        this.state = state;

        if (state && this.props[state]) {
            this.getGraphicsName().forEach(name => this.updateGraphic(name, this.props[state][name], false));

        } else if (!state) {
            this.getGraphicsName().forEach(name => this.updateGraphic(name, this.props[name]));
        }
    }
}
