import Component from "./Component";
import Scene from "./Scene";
import Engine from "./Engine";


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
         * Factor of gravity provided by the scene
         * @type {number}
         */
        this.gravityFactor  = 0;

        /**
         * Velocity X
         * @type {number}
         */
        this.vx             = 0;

        /**
         * Velocity y
         * @type {number}
         */
        this.vy             = 0;

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
    }

    /**
     * @override
     */
    setReactivity () {
        super.setReactivity();
    }

    /**
     * @update
     * @override
     */
    update () {
        super.update();

        if (this.vx || this.vy) {
            this.updateVelocity();
        }
    }

    /* METHODS */

    /**
     * Update the position with velocity and check if there is not a collision wall
     * @returns {void}
     */
    updateVelocity () {
        this.getScene(scene => {
            if (this.vx) {
                this.x = scene.getLogicXAt(this.x, this.x + (this.vx * Engine.tick), this.y, this.y + this.height, this.width);
            }

            if (this.vy) {
                this.y = scene.getLogicYAt(this.y, this.y + (this.vy * Engine.tick), this.x, this.x + this.width, this.height);
            }
        });
    }

    /**
     * Find the first Scene into parent hierarchy
     * @param {function=} callback: callback when the scene has been finded
     * @param {*=} recursive: recursive object to get scene
     * @returns {void}
     */
    getScene (callback, recursive) {
        recursive = recursive || this;

        if (recursive.parent) {

            if (recursive.parent instanceof Scene) {
                callback(recursive.parent);

            } else {
                this.getScene(callback, recursive);

            }
        }
    }

    /**
     * Check if it intersect with the entity passed in parameter
     * @param {Entity} entity: other entity to check collision
     * @returns {boolean} if true, the two entities is in collision
     */
    intersect (entity) {
        return !( entity.x > (this.x + this.width) ||
            (entity.x + entity.width) < this.x ||
            entity.y > (this.y + this.height) ||
            (entity.y + entity.height) < this.y);
    }

}
