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

        this.DefaultMaterial    = new p2.Material();
        this.WallMaterial       = new p2.Material();

        this._entities          = null;
        this.tilemap            = null;
        this.world              = new p2.World({ gravity: [0, 0] });
        this.materials          = [this.DefaultMaterial, this.WallMaterial];

        this.world.setGlobalStiffness(1e5);

        this.world.on("beginContact", this.onBeginContact.bind(this));
        this.world.on("endContact", this.onEndContact.bind(this));
        this.signals.propChange.bind("gravity", this.onGravityChange.bind(this));
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
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

        this.world.step(1 / 60, Game.latency, 3);
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
            this.world.addBody(entityCreated.body.data);
        }

        return entityCreated;
    }

    /**
     * Set a new bouncing factor for the entity
     * @param {Entity} entity: entity with a new bounce factor
     * @param {Number} bounce: next bouncing factor
     * @param {Number=} lastBounce: last bouncing factor
     * @returns {Number} Bouncing factor
     */
    setEntityBouncing (entity, bounce, lastBounce) {
        if (!entity || (entity && !entity.body)) {
            return bounce;
        }

        if (lastBounce) {
            const id = entity.body.shape.material.id;

            this.world.contactMaterials.filter(x => x.materialA.id === id || x.materialB.id === id)
                .forEach(contactMaterial => this.world.removeContactMaterial(contactMaterial));
        }

        if (!bounce) {
            entity.body.shape.material = this.DefaultMaterial;

        } else {
            const material          = entity.body.shape.material = new p2.Material(),
                contactMaterials    = this.materials.map(materialB => new p2.ContactMaterial(material, materialB, {
                    restitution : bounce,
                    stiffness   : Number.MAX_VALUE
                }));

            contactMaterials.forEach(contactMaterial => this.world.addContactMaterial(contactMaterial));
        }

        return bounce;
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

    /**
     * p2 JS event when two shapes starts to overlap
     * @param {p2.Body} bodyA: body entered in collision
     * @param {p2.Body} bodyB: body entered in collision
     * @returns {void}
     */
    onBeginContact ({ bodyA, bodyB }) {
        const contact = this.resolveContact(bodyA, bodyB);

        // console.log(contact, contact.entityA && contact.entityA._standing, contact.entityB && contact.entityB._standing);

        if (contact.entityB && contact.entityB.props.playerLeft) {
            console.log("begin contact", contact.entityB._standing);
        }

        if (contact.entityA && contact.entityB) {
            contact.entityA.signals.collision.dispatch(contact.entityB.name, contact.entityB);
            contact.entityB.signals.collision.dispatch(contact.entityA.name, contact.entityA);
        }
    }

    onEndContact ({ bodyA, bodyB }) {
        const contact = this.resolveContact(bodyA, bodyB);

        if (contact.entityB && contact.entityB.props.playerLeft) {
            console.log("end contact", contact.entityB._standing);
        }

        if (contact.entityA && contact.entityB) {
            contact.entityA.signals.endCollision.dispatch(contact.entityB.name, contact.entityB);
            contact.entityB.signals.endCollision.dispatch(contact.entityA.name, contact.entityA);
        }
    }

    resolveContact (bodyA, bodyB) {
        const entities  = this.getEntities().filter(entity => entity.body && entity.body.data),
            walls       = (this.tilemap && this.tilemap.bodies) || [],
            findEntityByBody    = body => entities.find(entity => entity.body.data.id === body.id),
            findWallByBody      = body => walls.find(wall => wall.data.id === body.id),
            entityA     = findEntityByBody(bodyA),
            entityB     = findEntityByBody(bodyB);

        let wall        = null;

        const isAbove = (xA, yA, widthA, xB, yB, widthB) => yB >= yA && (xA > xB - widthA) && (xA < xB + widthB);

        switch (true) {
        case entityA && entityB:
            entityA.standing = entityA.standing || isAbove(entityA.props.x, entityA.props.y, entityA.props.height, entityB.props.x, entityB.props.y, entityB.props.width);
            entityB.standing = entityB.standing || isAbove(entityB.props.x, entityB.props.y, entityB.props.height, entityA.props.x, entityA.props.y, entityA.props.width);
            break;

        case entityA && !entityB: wall = findWallByBody(bodyB);
            entityA.standing = entityA.standing || (wall && isAbove(entityA.props.x, entityA.props.y, entityA.props.height, wall.x, wall.y, wall.width));
            break;

        case entityB && !entityA: wall = findWallByBody(bodyA);
            entityB.standing = entityB.standing || (wall && isAbove(entityB.props.x, entityB.props.y, entityB.props.height, wall.x, wall.y, wall.width));
            break;
        }

        return { entityA: entityA, entityB: entityB };
    }
}
