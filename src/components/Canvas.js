import Component from "./../Component";


export default class Canvas extends Component {

    /* LIFECYCLE */
    /**
     * Canvas constructor
     * @param {number} width: width of the canvas
     * @param {number} height: height of the canvas
     * @param {*=} parentDOM: DOM node to attach the canvas
     */
    constructor (width, height, parentDOM) {
        super();

        /**
         * Name of the canvas
         * @type {string}
         */
        this.name = "canvas";

        /**
         * Size of canvas
         * @type {{width: number, height: number}}
         */
        this.size = {width: width, height: height};

        /**
         * DOM parent of the canvas
         */
        this.parentDOM = parentDOM;

        /**
         * Dom of the canvas
         * @type {*}
         */
        this.dom = null;

        /**
         * Context of the canvas
         * @type {*}
         */
        this.context = null;

        /**
         * Color of canvas when it is cleared
         * @type {string}
         */
        this.clearColor = "whitesmoke";
    }

    initialize () {
        super.initialize();

        this.dom        = document.createElement("canvas");
        this.dom.id     = this.id;
        this.dom.width  = this.size.width;
        this.dom.height = this.size.height;
        this.context    = this.dom.getContext("2d");

        this.setParentDOM();
    }

    /* METHODS */

    /**
     * Attach the canvas to the parent DOM
     * @param {*=} dom: dom to attach the canvas
     * @returns {void|null} null
     */
    setParentDOM (dom) {
        dom = dom || this.parentDOM;

        if (!dom || !this.dom) {
            return null;
        }

        this.parentDOM = dom;
        this.parentDOM.appendChild(this.dom);
    }

    /**
     * Set a new size for the canvas
     * @param {number=} width: width of the canvas
     * @param {number=} height: height of the canvas
     * @returns {void}
     */
    setSize (width, height) {
        if (this.dom) {
            this.setWidth(width);
            this.setHeight(height);
        }
    }

    /**
     * resize width of the canvas
     * @param {number} width: width of the canvas
     * @returns {void}
     */
    setWidth (width) {
        if (width) {
            this.size.width = width;
            this.dom.width  = width;
        }
    }

    /**
     * Resize height of the canvas
     * @param {number} height: height of the canvas
     * @returns {void}
     */
    setHeight (height) {
        if (height) {
            this.size.height    = height;
            this.dom.height     = height;
        }
    }

    /**
     * Clear the canvas
     * @param {string} clearColor: color of the canvas when it will be cleared
     * @returns {void}
     */
    clear (clearColor) {
        const ctx = this.context;

        ctx.fillStyle = clearColor || this.clearColor;
        ctx.clearRect(0, 0, this.size.width, this.size.height);
        ctx.fillRect(0, 0, this.size.width, this.size.height);
    }
}
