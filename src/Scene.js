import Element from "./Element";


export default class Scene extends Element {

    /* LIFECYCLE */

    /* GETTERS & SETTERS */

    /**
     * The name of the scene
     * @returns {string} the name
     */
    get name () {
        return "scene";
    }

    /**
     * get only width from size
     * @returns {number} width of engine
     */
    get width () {
        return this.size.width;
    }

    /**
     * Get only height from size
     * @returns {number} height of engine
     */
    get height () {
        return this.size.height;
    }

    /**
     * set only width from size
     * @param {number} width: the new width of the engine
     */
    set width (width) {
        super.width     = width;

        if (this.isComposedOf("canvas")) {
            this.canvas.width = width;
        }
    }

    /**
     * Set only height from size
     * @param {number} height: the new height of the engine
     */
    set height (height) {
        super.height     = height;

        if (this.isComposedOf("canvas")) {
            this.canvas.height = height;
        }
    }
}
