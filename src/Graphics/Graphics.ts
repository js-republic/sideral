import { Module } from "./../Module";
import { IGraphicsProps } from "./../Interface";


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
}
