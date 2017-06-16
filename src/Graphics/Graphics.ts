import { Module } from "./../Module";
import { IGraphicsProps, IShapeProps } from "./../Interface";


export class Graphics extends Module {

    /* LIFECYCLE */

    /**
     * Properties of a graphics
     */
    props: IGraphicsProps;

    /**
     * The PIXI Container of a Graphics
     */
    container: PIXI.Graphics = new PIXI.Graphics();


    /* METHODS */

    /**
     * Update the properties of a child by its own props
     * @param child - Module target
     * @param propName - The name of the property
     * @param props - Next properties
     * @param state - The state of the button ("hover", "active" or "disabled")
     */
    _updateChildProps (child: any, propName: string, props?: any, state?: string): void {
        if (child) {
            const propTarget = state ? this.props[state] : this.props;

            if (!propTarget) {
                return null;
            }

            if (props && typeof props === "object") {
                Object.keys(props).forEach(key => propTarget[propName][key] = props[key]);
            }

            if (!propTarget[propName]) {
                return null;
            }

            Object.keys(propTarget[propName]).forEach(key => child.props[key] = propTarget[propName][key]);
        }
    }
}
