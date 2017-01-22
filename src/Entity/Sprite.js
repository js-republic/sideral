import Entity from "./../Entity";
import Shape from "./../Entity/Shape";


export default class Sprite extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name = "sprite";

        this._container = new PIXI.Sprite();

        /**
         * Display the debug mode
         * @type {boolean}
         */
        this.debug = false;

        // auto-binding

        this._displayDebugMode  = this._displayDebugMode.bind(this);
    }

    /**
     * @override
     */
    setReactivity () {
        this.reactivity.
            when("debug").change(this._displayDebugMode).
            start();
    }

    /* REACTIVITY */

    /**
     * Show or hide the debug mode
     * @private
     */
    _displayDebugMode (previousValue) {
        if (this.debug) {
            this.compose(new Shape(), {
                name    : "_debug",
                width   : this.width,
                height  : this.height,
                stroke  : "#FF0000",
                fill    : "transparent"
            });

        } else if (Boolean(previousValue)) {
            this.decompose(this._debug);

        }
    }

    _containerSize () {
        console.log("size");

        if (this.debug) {
            this._debug.size(this.width, this.height);
        }
    }
}
