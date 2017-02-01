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
        this.spritesheet = { texture: null, width: 0, height: 0, animations: [] };

        /**
         * Display the debug mode
         * @type {boolean}
         */
        this.debug = false;

        // auto-binding

        this._displayDebugMode  = this._displayDebugMode.bind(this);
    }

    /**
     * @override
     */
    setReactivity () {
        super.setReactivity();

        this.reactivity.
            when("debug").change(this._displayDebugMode).
            start();
    }

    /**
     * Set a new Spritesheet
     * @param {string} image: url of the image
     * @param {number=} tilewidth: tilewidth of the spritesheet
     * @param {number=} tileheight: tileheight of the spritesheet
     */
    setSpritesheet (image, tilewidth, tileheight) {
        if (!image) {
            throw new Error("Sprite.setSpritesheet", "image is not defined.");
        }

        PIXI.loader.add(image).load(() => {
            const texture           = PIXI.loader.resources[image].texture;
            this.spritesheet        = { image: image, tilewidth: tilewidth, tileheight: tileheight };

            this._container.texture = texture;
        });
    }

    addAnimation (name, delay, tiles, lineOfTexture) {
        if (!image) {
            throw new Error("Sprite.addAnimation", "no texture provided.");
        }

        this.animation = { name: name, delay: delay, tiles: tiles, lineOfTexture: lineOfTexture, frameCounter: 0 };

        if (this.spritesheet && this.spritesheet.image) {
            this.spritesheet.animations.push(this.animation);
        }

    }

    updateAnimation(animation) {   
        if (!animation) {
            throw new Error("Sprite.updateAnimation", "no animation provided.");
        } 

        if (this.spritesheet && this.spritesheet.width && this.spritesheet.height) {

            let x, y, tileheight, tilewidth;    

            if(animation.frameCounter === animation.tiles.length){                                                        
                animation.frameCounter = 0;                                                    
            };     

            x = animation.tiles[animation.frameCounter];
            y = animation.lineOfTexture;

            tilewidth = this.spritesheet.width;
            tileheight = this.spritesheet.height;

            this._container.texture.frame = new PIXI.Rectangle(x, y, tilewidth, tileheight);

            animation.frameCounter++;                 
        }
    }

    /* REACTIVITY */

    /**
     * Show or hide the debug mode
     * @private
     */
    _displayDebugMode (previousValue) {
        if (this.debug) {
            this.compose(new Shape(), {
                name    : "_debug",
                width   : this.width,
                height  : this.height,
                stroke  : "#FF0000",
                fill    : "transparent"
            });

        } else if (Boolean(previousValue)) {
            this.decompose(this._debug);

        }
    }

    /**
     * @override
     * @private
     */
    _containerSize () {
        if (this.debug) {
            this._debug.size(this.width, this.height);
        }
    }

    _onAnimationChange (newValue) {
        this.updateAnimation(newValue);
    }
}
