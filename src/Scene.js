import p2 from "p2";

import AbstractClass from "./Abstract/AbstractClass";
import Tilemap from "./Module/Tilemap";
import Game from "./Game";
import Entity from "./Entity";


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

        this._entities  = null;
        this.tilemap    = null;
        this.world      = new p2.World({ gravity: [0, 0] });

        this.bind(this.SIGNAL.VALUE_CHANGE("gravity"), this.createAction(this.onGravityChange));
    }

    initialize (props) {
        super.initialize(props);

        this.onGravityChange();
    }

    /**
     * @update
     * @lifecycle
     * @override
     */
    update () {
        super.update();

        this.world.step(Game.tick);
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
        this._entities  = null;

        const entityCreated = this.add(entity, settings, index);

        if (entityCreated.body) {
            this.world.addBody(entityCreated.body);
        }

        return entityCreated;
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

    /**
     * Get all children instance of Entity
     * @returns {Array<*>} array of all entities
     */
    getEntities () {
        return this._entities || (this._entities = this.children.filter(child => child instanceof Entity));
    }

    /**
     * Get entities from the scene in range
     * @param {number} xmin: position x min
     * @param {number} xmax: position x max
     * @param {number} ymin: position y min
     * @param {number} ymax: position y max
     * @param {string=} id: string of the id of an entity to filter
     * @returns {Array<Entity>} list of all entities in range
     */
    getEntitiesInRange (xmin, xmax, ymin, ymax, id) {
        const entities = this.getEntities().
            filter(entity => entity.props.x > (xmin - entity.props.width) && entity.props.x < xmax).
            filter(entity => entity.props.y > (ymin - entity.props.height) && entity.props.y < ymax);

        return id ? entities.filter(entity => id !== entity.id) : entities;
    }


    /* EVENTS */

    /**
     * When gravity property change
     * @returns {void}
     */
    onGravityChange () {
        this.world.gravity = [0, this.props.gravity];
    }
}
