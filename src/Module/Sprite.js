import AbstractModule from "./../Abstract/AbstractModule";


export default class Sprite extends AbstractModule {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            imagePath   : null,
            flip        : false
        });

        this.image      = null;
        this.container  = new PIXI.Sprite();

        this.container.anchor.set(0.5, 0.5);

        this.signals.propChange.bind("imagePath", this.onImagePathChange.bind(this));
        this.signals.propChange.bind("flip", this.onFlipChange.bind(this));
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props = {}) {
        const width = props.width || this.props.width,
            height  = props.height || this.props.height;

        props.x     = (props.x || 0) + (width / 2);
        props.y     = (props.y || 0) + (height / 2);

        super.initialize(props);
    }

    /* EVENTS */

    /**
     * When imagePath attributes change
     * @returns {void}
     */
    onImagePathChange () {
        const loader = new PIXI.loaders.Loader();

        loader.add(this.props.imagePath).load(() => {
            const texture = loader.resources[this.props.imagePath].texture;

            texture.frame = new PIXI.Rectangle(0, 0, this.props.width, this.props.height);
            this.container.texture = texture;
        });
    }

    /**
     * when flip attributes change
     * @returns {void}
     */
    onFlipChange () {
        this.container.scale.x      = Math.abs(this.container.scale.x) * (this.props.flip ? -1 : 1);
        this.container.anchor.x     = this.props.flip ? -0.5 : 0.5;
    }
}
