import AbstractClass from "./AbstractClass";


export default class AbstractModule extends AbstractClass {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            x       : 0,
            y       : 0,
            width   : 0,
            height  : 0
        });

        this.signals.propChange.bind(["x", "y"], this.onPositionChange.bind(this));
        this.signals.propChange.bind(["width", "height"], this.onSizeChange.bind(this));
    }


    /* METHODS */

    /**
     * Change the position of the current module
     * @param {number} x: new position in x axis
     * @param {number} y: new position in y axis
     * @returns {void}
     */
    position (x, y) {
        if (typeof x !== "undefined") {
            this.props.x = x;
        }

        if (typeof y !== "undefined") {
            this.props.y = y;
        }
    }

    /**
     * Change the size of the current module
     * @param {number} width: new width of the current module
     * @param {number} height: new height of the current module
     * @returns {void}
     */
    size (width, height) {
        if (typeof width !== "undefined") {
            this.props.width = width;
        }

        if (typeof height !== "undefined") {
            this.props.height = height;
        }
    }

    /**
     * Update the position of the pixi container
     * @returns {void}
     */
    updateContainerPosition () {
        if (this.container) {
            this.container.pivot.set(this.props.width / 2, this.props.height / 2);
            this.container.position.set(this.props.x + this.container.pivot.x, this.props.y + this.container.pivot.y);
        }
    }


    /* EVENTS */

    /**
     * When x or y attributes change
     * @returns {void}
     */
    onPositionChange () {
        this.updateContainerPosition();
    }

    /**
     * When width or height attribtues change
     * @returns {void}
     */
    onSizeChange () {
        this.updateContainerPosition();
    }
}
