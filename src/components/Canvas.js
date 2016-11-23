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

        /**
         * Size of the canvas
         * @type {{width: number, height: number}}
         */
        this.size = { width: width || 0, height: height || 0 };
    }

    initialize () {
        super.initialize();

        this.dom        = document.createElement("canvas");
        this.dom.id     = this.id;
        this.dom.width  = this.width;
        this.dom.height = this.height;
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

    /* GETTERS & SETTERS */

    /**
     * The name of the component
     * @returns {string} name
     */
    get name () {
        return "canvas";
    }

    /**
     * Get size width
     * @returns {number} width
     */
    get width () {
        return this.size.width;
    }

    /**
     * Get size height
     * @returns {number} height
     */
    get height () {
        return this.size.height;
    }

    /**
     * resize width of the canvas
     * @param {number} width: width of the canvas
     * @returns {void}
     */
    set width (width) {
        this.size.width = width;

        if (this.dom) {
            this.dom.width = width;
        }
    }

    /**
     * Resize height of the canvas
     * @param {number} height: height of the canvas
     * @returns {void}
     */
    set height (height) {
        this.size.height = height;

        if (this.dom) {
            this.dom.height = height;
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
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.fillRect(0, 0, this.width, this.height);
    }
}
