import Component from "./index";


export default class Canvas extends Component {

    /* LIFECYCLE */
    /**
     * @constructor
     * @param {*} props: properties
     */
    constructor (props) {
        super(props);

        /**
         * Width of the canvas
         * @type {number}
         */
        this.width = this.width || 10;

        /**
         * Height of the canvas
         * @type {number}
         */
        this.height = this.height || 10;

        /**
         * DOM parent of the canvas
         */
        this.parentDOM = this.parentDOM || null;

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

    }

    /**
     * @override
     */
    initialize (parent) {
        super.initialize(parent);

        this.dom        = document.createElement("canvas");
        this.dom.id     = this.id;
        this.dom.width  = this.width;
        this.dom.height = this.height;
        this.context    = this.dom.getContext("2d");

        this.setParentDOM();

        // Observe prop width
        this.observeProp("width", (previousValue, nextValue) => {
            if (this.dom) {
                this.dom.width = nextValue;
            }
        });

        // Observe prop height
        this.observeProp("height", (previousValue, nextValue) => {
            if (this.dom) {
                this.dom.height = nextValue;
            }
        });
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

    /* GETTERS & SETTERS */

    get name () {
        return "canvas";
    }
}
