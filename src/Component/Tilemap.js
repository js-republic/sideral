import Component from "./index";
import Canvas from "./Canvas";
import Bitmap from "./../Util/Bitmap";
import Engine from "./../Engine";


export default class Tilemap extends Component {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {{}} props: properties
     */
    constructor (props = {}) {
        super(props);

        /**
         * Size of a tile in width and height
         * @type {{}}
         */
        this.tilesize = this.tilesize || { width: 0, height: 0 };

        /**
         * Debug mode
         * @type {boolean}
         */
        this.debug = this.debug || false;

        /**
         * Path of the bitmap
         * @type {*}
         */
        this.path = this.path || null;

        /**
         * Grid of the tilemap
         * @type {{}}
         */
        this.grid = this.grid || {};

        /**
         * Check if bitmap is loaded
         * @readonly
         * @type {boolean}
         */
        this.loaded = false;

        /**
         * Camera propagation from the parent scene
         * @readonly
         * @type {{x: number, y: number}}
         */
        this.camera = {x: 0, y: 0};

        /**
         * Total width of the level
         * @type {number}
         */
        this.width = 0;

        /**
         * Total height of the level
         * @type {number}
         */
        this.height = 0;

        this.bitmap = new Bitmap(this.path, () => {
            this.loaded = true;
            this.render();
        });

        this.bitmap.tilesize = this.tilesize;
    }

    /**
     * @initialize
     * @override
     * @param {Component} parent: parent
     */
    initialize (parent) {
        super.initialize(parent);

        this.updateSize();

        this.compose(new Canvas({ width: this.width, height: this.height, clearColor: "red" }));
        this.canvas.clear();

        Engine.createLayer(this.canvas, -1);

        this.observeProp("camera", (previousValue, nextValue) => {
            if (this.has("canvas")) {
                this.canvas.dom.style.marginLeft  = `${-nextValue.x}px`;
                this.canvas.dom.style.marginTop = `${-nextValue.y}px`;
            }
        });
    }

    /**
     * @update
     * @override
     * @returns {null} null
     */
    update () {
        super.update();

        if (!this.has("canvas") || !this.parent) {
            return null;
        }

        if (this.camera.x !== this.parent.camera.x || this.camera.y !== this.parent.camera.y) {
            this.camera = {x: this.parent.camera.x, y: this.parent.camera.y};

        }
    }

    /**
     * @render
     * @override
     * @returns {*} Canvas context
     */
    render () {
        if (!this.loaded) {
            return null;
        }

        this.grid.visual.forEach((layer) => {
            layer.forEach((line, y) => line.forEach((tile, x) => {
                this.bitmap.render(this.canvas.context, x * this.tilesize.width, y  * this.tilesize.height, tile);
            }));
        });
    }

    /* METHODS */

    /**
     * Determine total size of the level
     * @returns {void}
     */
    updateSize () {
        let width = 0;

        this.grid.visual.forEach((layer) => {
            layer.forEach((line) => {
                width = line.length > width ? line.length : width;
            });
        });

        this.width  = width * this.tilesize.width;
        this.height = this.grid.visual[0].length * this.tilesize.height;
    }
}
