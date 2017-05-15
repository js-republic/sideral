import SideralObject from "./SideralObject";

import Game from "./Game";


/**
 * Class representing the simplest scene to add Entity
 * @extends SideralObject
 */
export default class Scene extends SideralObject {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            scale   : 1,
            width   : Game.props.width,
            height  : Game.props.height
        });

        this.camera = {x: 0, y: 0};
    }


    /* METHODS */

    /**
     * Get the real position relative to the camera position
     * @param {number} x: position in x axis
     * @param {number} y: position in y axis
     * @returns {{x: number, y: number}} the real position relative to the camera
     */
    getScreenPosition (x, y) {
        return {x: x - this.camera.x, y: y - this.camera.y};
    }
}
