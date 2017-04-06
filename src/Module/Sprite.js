import AbstractModule from "./../Abstract/AbstractModule";


export default class Sprite extends AbstractModule {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            imagePath   : null
        });

        this.image      = null;
        this.container  = new PIXI.Sprite();

        this.bind(this.SIGNAL.VALUE_CHANGE("imagePath"), this.onImagePathChange.bind(this));
    }


    /* METHODS */

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
}
