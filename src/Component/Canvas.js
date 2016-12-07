import Component from "./index";


export default class Canvas extends Component {

    /* LIFECYCLE */
    /**
     * Canvas constructor
     * @constructor
     * @param {*} options: options
     */
    constructor (options = {}) {
        super(options);

        /**
         * Name of the element
         * @readonly
         * @type {string}
         */
        this.name = "canvas";

        /**
         * DOM parent of the canvas
         */
        this.parentDOM = options.parentDOM;

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
        this.clearColor = null;

        /**
         * Width of the canvas
         * @type {number}
         */
        this.width = options.width;

        /**
         * Height of the canvas
         * @type {number}
         */
        this.height = options.height;
    }

    /**
     * @initialize
     * @returns {void}
     */
    initialize () {
        super.initialize();

        this.dom        = document.createElement("canvas");
        this.dom.id     = this.id;
        this.dom.width  = this.width;
        this.dom.height = this.height;
        this.context    = this.dom.getContext("2d");

        this.setParentDOM();
    }

    /**
     * @onPropsChanged
     * @param {*} changedProps: changed properties
     * @returns {void}
     */
    onPropsChanged (changedProps) {
        super.onPropsChanged(changedProps);

        if (this.dom) {
            if (changedProps.width) {
                this.dom.width = changedProps.width;
            }

            if (changedProps.height) {
                this.dom.height = changedProps.height;
            }
        }
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
     * Clear the canvas
     * @param {string=} clearColor: color of the canvas when it will be cleared
     * @returns {void}
     */
    clear (clearColor) {
        const ctx = this.context;

        ctx.clearRect(0, 0, this.width, this.height);

        if (clearColor || this.clearColor) {
            ctx.fillStyle = clearColor || this.clearColor;
            ctx.fillRect(0, 0, this.width, this.height);
        }
    }
}
