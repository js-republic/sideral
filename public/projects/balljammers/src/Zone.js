import Sprite from "src/Entity/Sprite";
import Engine from "src/Engine";


export default class Zone extends Sprite {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.size(32, 32);

        this.collision.mass = this.collision.MASS.SOLID;

        /**
         * Title of the zone
         * @type {string}
         */
        this.title = "";

        /**
         * Extend the zone on y axis
         * @type {boolean}
         */
        this.extended = false;

        // Auto-binding

        this._onExtendedChange = this._onExtendedChange.bind(this);
    }

    /**
     * @setReactivity
     * @override
     */
    setReactivity () {
        super.setReactivity();

        this.reactivity.
            when("extended").change(this._onExtendedChange);
    }

    /* PRIVATES */

    /**
     * When "extended" attribute change
     * @private
     * @returns {void}
     */
    _onExtendedChange () {
        if (this.extended) {
            this.height = Engine.height - (this.y * 2);
        }
    }

    /**
     * @override
     * @private
     */
    _onPositionChange () {
        super._onPositionChange();
        this._onExtendedChange();
    }
}
