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
        this.components.forEach((component) => {
            if (component.render) {
                component.render(context);
            }
        });
    }

    /**
     * Get the parent scene
     * @returns {Scene} scene of the component
     */
    getScene () {
        const recursive = (component) => {
            if (!component.parent) {
                return null;
            }

            if (component.has("canvas") && component.camera) {
                return component.parent;
            }

            return recursive(component.parent);
        };

        return recursive(this);
    }

    /**
     * Call the parent scene to request a new render
     * @returns {void}
     */
    requestRender () {
        const scene = this.getScene();

        if (scene) {
            scene.renderRequested[this.id] = true;
        }
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
                this.requestRender();
            });
        });
    }
}
