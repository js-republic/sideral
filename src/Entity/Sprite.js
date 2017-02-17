import Entity from "./../Entity";
import Shape from "./Shape";
import Collision from "./../Mixin/Collision";


export default class Sprite extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name       = "sprite";

        this._container = new PIXI.Sprite();

        /**
         * SpriteSheet of the Sprite
         * @type {string}
         */
        this.spritesheet = { texture: null, width: 0, height: 0, animations: [] };

        /**
         * Display the debug mode
         * @type {boolean}
         */
        this.debug = false;

        // mix

        this.mix(new Collision());

        // auto-binding

        this._onDebugChange     = this._onDebugChange.bind(this);
    }

    /**
     * @override
     */
    setReactivity () {
        super.setReactivity();

        this.reactivity.
            when("debug").change(this._onDebugChange);
    }

    /**
     * Set a new Spritesheet
     * @param {string} image: url of the image
     * @param {number=} tilewidth: tilewidth of the spritesheet
     * @param {number=} tileheight: tileheight of the spritesheet
     * @returns {void}
     */
    setSpritesheet (image, tilewidth, tileheight) {
        if (!image) {
            throw new Error("Sprite.setSpritesheet", "image is not defined.");
        }

        const loader = new PIXI.loaders.Loader();

        loader.add(image).load(() => {
            const texture           = loader.resources[image].texture;

            this.spritesheet        = { image: image, tilewidth: tilewidth, tileheight: tileheight };

            if (typeof tilewidth !== "undefined" && typeof tileheight !== "undefined") {
                texture.frame = new PIXI.Rectangle(0, 0, tilewidth, tileheight);
            }

            this._container.texture = texture;
        });
    }

    /* REACTIVITY */

    /**
     * Show or hide the debug mode
     * @private
     * @returns {void}
     */
    _onDebugChange () {
        if (this.debug) {
            this.compose(new Shape(), {
                name    : "_debug",
                type    : Shape.TYPE.RECTANGLE,
                width   : this.width,
                height  : this.height,
                stroke  : "#FF0000",
                fill    : "transparent"
            });

        } else if (this.last.debug) {
            this.decompose(this._debug);

        }
    }

    /**
     * @override
     * @private
     */
    _onSizeChange () {
        super._onSizeChange();

        if (this.debug) {
            this._debug.size(this.width, this.height);
        }
    }
}
