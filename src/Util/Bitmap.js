export default class Bitmap {

    /**
     * Constructor
     * @param {string=} path: path of the image
     * @param {function=} onImageLoaded: function when image is fully loaded
     * @constructor
     */
    constructor (path, onImageLoaded) {

        /**
         * Path of the image
         * @type {string}
         */
        this.path = null;

        /**
         * Opacity of the picture
         * @type {number}
         */
        this.opacity = 1;

        /**
         * Rotation of the picture
         * @type {number}
         */
        this.rotation = 0;

        /**
         * Image
         * @type {Image|null}
         */
        this.data = null;

        /**
         * Size of tile (used for splitted image into spritesheet
         * @type {{}|null}
         */
        this.tilesize = null;

        /**
         * Flip the picture
         * @type {{x: boolean, y: boolean}}
         */
        this.flip = {x: false, y: false};

        /**
         * Callback event when image is fully loaded
         */
        this.onImageLoaded = null;

        /**
         * Know if image is fully loaded
         * @type {boolean}
         * @readonly
         */
        this.loaded = false;

        if (path) {
            this.load(path, onImageLoaded);
        }
    }

    /**
     * Load the picture
     * @param {string=} path: path of the image
     * @param {function=} onImageLoaded: callback when picture is loaded
     * @returns {void}
     */
    load (path, onImageLoaded) {
        if (path) {
            this.path = path;
        }

        if (onImageLoaded) {
            this.onImageLoaded = onImageLoaded;
        }

        if (!this.path) {
            throw new Error("Picture.load : a path must be provided.");
        }

        this.data           = new Image();
        this.data.onerror   = () => {
            throw new Error(`Picture.load : Image path not found (${this.path})`);
        };

        this.data.onload    = () => {
            this.loaded = true;

            if (this.onImageLoaded) {
                this.onImageLoaded();
            }
        };

        this.data.src       = this.path;
    }

    /**
     * Render a picture
     * @param {*} context: canvas context
     * @param {number} x: x coordinate to render picture
     * @param {number} y: y coordinate to render picture
     * @param {number=} tile: tile position (if using picture to spritesheet mode)
     * @returns {void|null} null
     */
    render (context, x, y, tile) {
        const flip  = this.flip.x || this.flip.y,
            flipX   = this.flip.x ? -1 : 1,
            flipY   = this.flip.y ? -1 : 1;

        if (!this.loaded) {
            return null;
        }

        context.save();

        if (this.opacity !== 1) {
            context.globalAlpha = this.opacity;
        }

        if (this.rotation) {
            const midX  = this.tilesize ? this.tilesize.width / 2 : this.data.width / 2,
                midY    = this.tilesize ? this.tilesize.height / 2 : this.data.height / 2;

            context.translate(x + midX, y + midY);
            context.rotate(this.rotation * Math.PI / 180);

            x = -midX;
            y = -midY;
        }

        if (flip) {
            context.scale(flipX, flipY);
        }

        if (typeof tile === "undefined") {
            context.drawImage(this.data, x, y, this.data.width, this.data.height);

        } else {
            context.drawImage(this.data,
                Math.floor(tile * this.tilesize.width) % this.data.width,
                Math.floor(tile * this.tilesize.width / this.data.width) * this.tilesize.height,
                this.tilesize.width, this.tilesize.height,
                (x * flipX) - (this.flip.x ? this.tilesize.width : 0), (y * flipY) - (this.flip.y ? this.tilesize.height : 0),
                this.tilesize.width, this.tilesize.height
            );
        }

        context.restore();
    }

    /**
     * Set data with base64 string
     * @param {string} base64: base64 of the image
     * @returns {void}
     */
    setData (base64) {
        if  (base64 && typeof base64 === "string") {
            this.data       = new Image();
            this.data.src   = base64;
            this.loaded     = true;
        }
    }
}
