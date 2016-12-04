import Entity from "src/Entity";


export default class EntityPlayer extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        // Set properties
        this.props({
            size : { width: 20, height: 20 },
            debug: true
        });
    }

    /* METHODS */

    right () {
        this.direction = {x: 1, y: 0};
    }

    idle () {
        this.direction = {x: 0, y: 0};
    }

    left () {
        this.direction = {x: -1, y: 0};
    }

    top () {
        this.direction = {x: 0, y: -1};
    }

    bottom () {
        this.direction = {x: 0, y: 1};
    }
}