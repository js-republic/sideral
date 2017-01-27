import Engine from "./Engine";
import Component from "./Component";


export default class Scene extends Component {

    /* LIFECYCLE */

    constructor () {
        super();

        this.name = "scene";

        /**
         * Stage of PIXI
         * @type {*}
         */
        this._container  = new PIXI.Container();

        /**
         * Gravity of the scene
         * @type {number}
         */
        this.gravity    = 0;

        /**
         * Scale of the scene
         * @type {number}
         */
        this.scale      = 1;

        /**
         * Width of the scene
         * @type {number}
         */
        this.width      = Engine.width;

        /**
         * Height of the scene
         * @type {number}
         */
        this.height     = Engine.height;
    }

    /* METHODS */

}
