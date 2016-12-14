import Component from "./Component";


export default class ComponentViewable extends Component {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {{}} props: properties
     */
    constructor (props) {
        super(props);

        /**
         * Position x
         * @type {number}
         */
        this.x = this.x || 0;

        /**
         * Position y
         * @type {number}
         */
        this.y = this.y || 0;

        /**
         * Width of the component
         * @type {number}
         */
        this.width = this.width || 10;

        /**
         * Height of the component
         * @type {number}
         */
        this.height = this.height || 10;

        /**
         * If debug mode, it will show the box on canvas
         * @type {boolean}
         */
        this.debug = this.debug || false;

        /**
         * Set at true when component need to be render
         * @type {boolean}
         */
        this.requestRender = true;

        // Observe default props for rendering
        this.observeRenderingProps(["x", "y", "width", "height"]);
    }

    /**
     * Render a component
     * @render
     * @param {context} context : context canvas 2d
     * @returns {void|null} null
     */
    render (context) {
        if (!this.requestRender) {
            return null;
        }

        this.components.forEach((component) => {
            if (component.render) {
                component.render(context);
            }
        });

        if (this.debug) {
            context.strokeStyle = "red";
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    /**
     * @override
     */
    nextCycle () {
        super.nextCycle();

        this.requestRender = false;
    }

    /* METHODS */

    /**
     * Observe properties that will request render if they change
     * @param {Array<string>|string} props: property or list of properties name
     * @returns {void}
     */
    observeRenderingProps (props) {
        if (typeof props === "string") {
            props = [props];
        }

        props.forEach((prop) => {
            this.observeProp(prop, (previousValue) => {
                this.previousProps[prop] = previousValue;
                this.requestRender = true;
            });
        });
    }
}
