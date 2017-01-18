import Engine from "./Engine";
import Component from "./Component";


export default class Scene extends Component {

    /* LIFECYCLE */

    constructor () {
        super();

        /**
         * Stage of PIXI
         * @type {*}
         */
        this.stage      = new PIXI.Container();

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

        /**
         * Background of the scene
         * @type {string|number}
         */
        this.background = 0xFF00FF;
    }

    /**
     * @override
     */
    setReactiveProps () {
        this.reactiveProp("background", () => {
            console.log(this.stage.backgroundColor);
        });
    }
}
