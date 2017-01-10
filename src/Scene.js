import PIXI from "pixi";

import ComponentViewable from "./Component/Viewable";


export default class Scene extends ComponentViewable {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {number} gravity: Gravity established by the scene
     * @param {number} scale: Scale of the scene
     * @param {number} width: Width of the scene
     * @param {number} height: Height of the scene
     * @param {*} props: other properties
     */
    constructor ({ gravity = 0, scale = 0, width = 0, height = 0, ...props}) {
        super(props);

        this.gravity    = gravity;

        this.scale      = scale;

        this.width      = width;

        this.height     = height;

        /**
         * Stage of PIXI
         * @type {*}
         */
        this.stage      = null;
    }

    /**
     * @initialize
     * @override
     */
    initialize (parent) {
        super.initialize(parent);

        this.stage = new PIXI.Container();
    }
}
