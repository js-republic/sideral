import Component from "./Component";


export default class Entity extends Component {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name = "entity";

        this._container = new PIXI.DisplayObject();

        /**
         * Mass of the entity (collision)
         * @type {number}
         */
        this.mass           = null;

        /**
         * z index for the entity
         * @type {number}
         */
        this.z              = -1;

        /**
         * Factor of gravity provided by the scene
         * @type {number}
         */
        this.gravityFactor  = 0;

        // read-only

        /**
         * Know if the entity is currently falling
         * @readonly
         * @type {boolean}
         */
        this.falling        = false;

        /**
         * Know if the entity is standing on the ground (or over an other entity)
         * @readonly
         * @type {boolean}
         */
        this.standing       = false;

        // auto-binding

        this._onZChange = this._onZChange.bind(this);
    }

    /**
     * @override
     */
    setReactivity () {
        super.setReactivity();

        this.reactivity.
            when("z").change(this._onZChange);
    }

    /* PRIVATE */

    /**
     * When z change
     * @private
     * @returns {void}
     */
    _onZChange () {
        if (this.z >= 0) {
            // TODO: sort z index from parent
        }
    }
}
