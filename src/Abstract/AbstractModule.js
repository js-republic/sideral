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
            width   : 10,
            height  : 10
        });

        this.bind(this.SIGNAL.VALUE_CHANGE(["x", "y"]), this.createAction(this.onPositionChange)).
            bind(this.SIGNAL.VALUE_CHANGE(["width", "height"]), this.createAction(this.onSizeChange));
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


    /* EVENTS */

    /**
     * When x or y attributes change
     * @returns {void}
     */
    onPositionChange () {
        if (this.container) {
            this.container.x = this.props.x;
            this.container.y = this.props.y;
        }
    }

    /**
     * When width or height attribtues change
     * @returns {void}
     */
    onSizeChange () {
        if (this.container) {
            this.container.width    = this.props.width;
            this.container.height   = this.props.height;
        }
    }
}
