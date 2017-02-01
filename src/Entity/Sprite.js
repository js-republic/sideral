import Entity from "./../Entity";
import Shape from "./Shape";


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
        this.spritesheet = { texture: null, width: 0, height: 0 };

        /**
         * Display the debug mode
         * @type {boolean}
         */
        this.debug = false;

        // auto-binding

        this._onDebugChange  = this._onDebugChange.bind(this);
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
     * @return {void}
     */
    setSpritesheet (image, tilewidth, tileheight) {
        if (!image) {
            throw new Error("Sprite.setSpritesheet", "image is not defined.");
        }

        PIXI.loader.add(image).load(() => {
            const texture           = PIXI.loader.resources[image].texture;

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
     * @param {Boolean} previousValue : the previous value of the attribute
     * @returns {void}
     */
    _onDebugChange (previousValue) {
        if (this.debug) {
            this.compose(new Shape(), {
                name    : "_debug",
                type    : Shape.TYPE.RECTANGLE,
                width   : this.width,
                height  : this.height,
                stroke  : "#FF0000",
                fill    : "transparent"
            });

        } else if (previousValue) {
            this.decompose(this._debug);

        }
    }

    /**
     * @override
     * @private
     */
    _onSizeChange () {
        super._onSizeChange();

        console.log(this.debug);
        if (this.debug) {
            this._debug.size(this.width, this.height);
        }
    }
}
