import AbstractModule from "./../Abstract/AbstractModule";


export default class Tilemap extends AbstractModule {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            tilewidth   : 0,
            tileheight  : 0
        });

        this.grid       = null;
        this.spritegrid = null;
    }


    /* METHODS */

    /**
     * Set a data to construct the tilemap
     * @param {*} data: data generaly provided by a json file
     * @returns {void}
     */
    setData (data) {
        const canvas    = document.createElement("canvas"),
            ctx         = canvas.getContext("2d"),
            image       = new Image();

        if (this.spritegrid) {
            this.container.removeChild(this.spritegrid);
        }

        this.grid           = data.grid;
        this.props.width    = 0;
        this.props.height   = 0;

        this.setProps({
            tilewidth   : data.tilewidth,
            tileheight  : data.tileheight
        });

        // Determine the size of the tilemap
        data.grid.visual.forEach(layer => layer.forEach(line => {
            this.props.width = line.length > this.props.width ? line.length : this.props.width;
        }));

        this.props.width    *= this.props.tilewidth;
        this.props.height   = this.grid.visual[0].length * this.props.tileheight;
        canvas.width        = this.props.width;
        canvas.height       = this.props.height;

        // Load the tileset
        image.onload = () => {

            // Render the tilemap into the canvas
            this.grid.visual.forEach(layer => layer.forEach((line, y) => line.forEach((tile, x) => {
                ctx.drawImage(image,
                    Math.floor(tile * this.props.tilewidth) % image.width,
                    Math.floor(tile * this.props.tilewidth / image.width) * this.props.tileheight,
                    this.props.tilewidth, this.props.tileheight,
                    x * this.props.tilewidth, y * this.props.tileheight,
                    this.props.tilewidth, this.props.tileheight
                );
            })));

            this.spritegrid = PIXI.Sprite.from(canvas);

            this._container.addChild(this.spritegrid);
        };

        image.src = data.path;
    }
}
