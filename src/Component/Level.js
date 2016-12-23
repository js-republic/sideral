import Component from "./index";
import Canvas from "./Canvas";
import Bitmap from "./../Util/Bitmap";


export default class Level extends Component {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {{}} props: properties
     */
    constructor  (props) {
        super(props);

        if (!this.level) {
            throw new Error("Level.constructor : You must provide a 'level' attribute corresponding to a level.json");
        }

        /**
         * Width of the level
         * @type {number}
         */
        this.width = 0;

        /**
         * Height of the level
         * @type {number}
         */
        this.height = 0;

        /**
         * Width of a tile
         * @type {number}
         */
        this.tilewidth  = this.level.tilesize.width;

        /**
         * Height of a tile
         * @type {number}
         */
        this.tileheight = this.level.tilesize.height;

        /**
         * Grid array for displaying map
         * @type {Array<number>}
         */
        this.grid       = this.level.grid.visual;

        /**
         * Grid array for logic
         * @type {Array<number>}
         */
        this.logic      = this.level.grid.logic;

        /**
         * Know if a level is fully loaded
         * @readonly
         * @type {boolean}
         */
        this.loaded     = false;

        /**
         * Set to true if you want to see more informations about the current level
         * @type {boolean}
         */
        this.debug      = false;

        this.updateSize();

        this.bitmap = new Bitmap(this.level.path, () => {
            this.loaded = true;
        });

        delete this.level;
    }

    /**
     * @override
     */
    initialize (parent) {
        super.initialize(parent);

        this.compose(new Canvas({ width: this.parent.width, height: this.parent.height }));
    }

    /* METHODS */

    /**
     * Update width and height with the grid and tilesize
     * @returns {void}
     */
    updateSize () {
        let width = 0;

        this.grid.forEach(layer => layer.forEach(line => width = line.length > width ? line.length : width));

        this.width  = width * this.tilewidth;
        this.height = this.grid[0].length * this.tileheight;
    }
}
