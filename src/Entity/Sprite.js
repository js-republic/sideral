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
         * Flip the spritesheet
         * @type {boolean}
         */
        this.flip = false;

        /**
         * Define the rotation of the sprite
         * @type {number}
         */
        this.rotation   = 0;

        /**
         * Offset of the hitbox related to the spritesheet
         * @type {{x: number, y: number}}
         */
        this.offset     = {x: 0, y: 0};

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
        this._onRotationChange  = this._onRotationChange.bind(this);
        this._onFlipChange      = this._onFlipChange.bind(this);
    }

    /**
     * @override
     */
    setReactivity () {
        super.setReactivity();

        this.reactivity.
            when("debug").change(this._onDebugChange).
            when("rotation").change(this._onRotationChange).
            when("flip").change(this._onFlipChange);
    }

    /**
     * Set a new Spritesheet
     * @param {string} image: url of the image
     * @param {number=} tilewidth: tilewidth of the spritesheet
     * @param {number=} tileheight: tileheight of the spritesheet
     * @param {{x: number, y: number}=} offset: offset of the spritesheet related to the sprite
     * @returns {void}
     */
    setSpritesheet (image, tilewidth, tileheight, offset = {}) {
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

            this._container.texture     = texture;

            if (offset.x) {
                this._container.anchor.x = offset.x / this.width;
            }

            if (offset.y) {
                this._container.anchor.y = offset.y / this.height;
            }
        });
    }

    setFrame (frame) {
        if (!this.spritesheet) {
            return null;
        }

        const { tilewidth, tileheight } = this.spritesheet;

        this._container.texture.frame = new PIXI.Rectangle(
            Math.floor(frame * tilewidth) % this.spritesheet.image.width,
            Math.floor(frame * tilewidth / this.spritesheet.image.width) * tileheight,
            tilewidth, tileheight);
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
                x       : this.offset.x,
                y       : this.offset.y,
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
     * Set the new angle of rotation
     * @private
     * @returns {void}
     */
    _onRotationChange () {
        this._container.rotation = this.rotation;
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

    /**
     * When "flip" attribute change
     * @returns {void}
     * @private
     */
    _onFlipChange () {
        this._container.scale.x     = Math.abs(this._container.scale.x) * (this.flip ? -1 : 1);
        this._container.anchor.x    = this.flip ? 1 : 0.5;
    }
}
