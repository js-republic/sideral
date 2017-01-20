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

    setReactivity () {
        this.reactivity.
            when("background").change(this.onBackgroundChange.bind(this)).
            start();
    }

    /* METHODS */

    /**
     * Event when background value is changed
     * @private
     * @returns {void|null} -
     */
    onBackgroundChange () {
        if (!this._container) {
            return null;
        }

    }
}
