import AbstractClass from "./Abstract/AbstractClass";
import Tilemap from "./Module/Tilemap";
import Game from "./Game";


export default class Scene extends AbstractClass {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            gravity : 0,
            scale   : 1,
            width   : Game.props.width,
            height  : Game.props.height
        });

        this.tilemap = null;
    }


    /* METHODS */

    /**
     * Add a new entity into the scene
     * @param {Object} entity: entity instance
     * @param {number} x: position of the entity in x axis
     * @param {number} y: position of the entity in y axis
     * @param {{}=} settings: settings to add to the entity (will merge into props of entity)
     * @param {number=} index: z index position of the entity
     * @returns {Object} entity added
     */
    addEntity (entity, x, y, settings = {}, index) {
        settings.x      = x;
        settings.y      = y;
        entity.scene    = this;

        return this.add(entity, settings, index);
    }

    /**
     * Set a tilemap for the current scene
     * @param {{}} data: data of the tilemap (generaly provided by a json file)
     * @returns {Object} Tilemap instance
     */
    setTilemap (data) {
        this.tilemap        = this.add(new Tilemap(), {}, 0);
        this.tilemap.scene  = this;

        this.tilemap.setData(data);

        return this.tilemap;
    }
}
