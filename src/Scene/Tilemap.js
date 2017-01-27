import Scene from "./../Scene";


export default class Tilemap extends Scene {

    /* LIFECYCLE */

    constructor () {
        super();

        /**
         * Tiledata to create a complete tilemap
         * @type {*}
         */
        this.tiledata = null;

        // private

        /**
         * All pixi sprite to render the tilemap
         * @private
         * @type {Array}
         */
        this._tiles = [];

        // Auto-binding

        this._updateTilemap = this._updateTilemap.bind(this);
    }

    setReactivity () {
        super.setReactivity();

        this.reactivity.
            when("tiledata").change(this._updateTilemap);
    }

    /* PRIVATE */

    /**
     * Update the tilemap with the new tiledata
     * @private
     * @returns {void}
     */
    _updateTilemap () {
        if (!this.tiledata.path) {
            throw new Error("Tilemap.tiledata", "tiledata must have a 'path' attribute.");
        }

        PIXI.loader.add(this.tiledata.path).load(() => {
            const texture   = PIXI.loader.resources[this.tiledata.path].texture;

            this._tiles     = [];

            this._tiles = this._tiles.concat(this.tiledata.grid.visual.map((layer) => {
                return layer.map((line, y) => line.map((tile, x) => {
                    return new PIXI.Sprite
                }));
            }));
        });
    }
}
