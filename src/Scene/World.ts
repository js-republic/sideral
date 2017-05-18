import * as p2 from "p2";

import { Scene } from "../Scene";

import { Enum } from "../Tool/Enum";

import { currentGame } from "../Game";
import { Entity } from "../Entity";

import { Tilemap } from "../Module/Tilemap";


export class World extends Scene {
    DefaultMaterial = new p2.Material(Scene.generateIdNumber());
    WallMaterial= new p2.Material(Scene.generateIdNumber());
    _entities = null;
    tilemap: Tilemap = null;
    world = new p2.World({ gravity: [0, 0] });
    materials = [this.DefaultMaterial, this.WallMaterial];

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            gravity : 0
        });

        this.world.setGlobalStiffness(1e5);

        this.world.on("beginContact", this._onBeginContact.bind(this), false);
        this.world.on("endContact", this._onEndContact.bind(this), false);
        this.world.on("preSolve", this._onPreSolve.bind(this), false);
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
        this.world.step(1 / 60, currentGame.latency, 3);
    }


    /* METHODS */

    /**
     * Add a new entity into the scene
     * @param {Entity} entity: entity instance
     * @param {number} x: position of the entity in x axis
     * @param {number} y: position of the entity in y axis
     * @param {{}=} settings: settings to add to the entity (will merge into props of entity)
     * @param {number=} index: z index position of the entity
     * @returns {Object} entity added
     */
    addEntity (entity: Entity, x: number, y: number, settings: any = {}, index?): Entity {
        settings.x      = x;
        settings.y      = y;
        entity.scene    = this;
        this._entities  = null;

        const entityCreated = this.add(entity, settings, index) as Entity;

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
    setEntityBouncing (entity: Entity, bounce: number, lastBounce: number): number {
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
            const materialOptions = {
                restitution: bounce,
                stiffness: Number.MAX_VALUE
            } as p2.ContactMaterialOptions;
            const material = entity.body.shape.material = new p2.Material(World.generateIdNumber());
            const contactMaterials = this.materials.map(materialB => {
                return new p2.ContactMaterial(material, materialB, materialOptions);
            });

            contactMaterials.forEach(contactMaterial => this.world.addContactMaterial(contactMaterial));
        }

        return bounce;
    }

    /**
     * Set a tilemap for the current scene
     * @param {{}} data: data of the tilemap (generaly provided by a json file)
     * @returns {Object} Tilemap instance
     */
    setTilemap (data: any): Tilemap {
        this.tilemap        = <Tilemap> this.add(new Tilemap(), {}, 0);
        this.tilemap.scene  = this;

        this.tilemap.setData(data);

        return this.tilemap;
    }

    /**
     * Get all children instance of Entity
     * @returns {Array<*>} array of all entities
     */
    getEntities (): any[] {
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
    getEntitiesInRange (xmin: number, xmax: number, ymin: number, ymax: number, id: number): Entity[] {
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


    /* PRIVATE */

    _onPreSolve ({ contactEquations }) {
        const walls = (this.tilemap && this.tilemap.bodies) || [];

        contactEquations.forEach(contactEquation => {
            const wallA     = walls.find(wall => wall.id === contactEquation.bodyA.id),
                wallB       = walls.find(wall => wall.id === contactEquation.bodyB.id),
                entities    = this.getEntities().filter(entity => entity.body),
                findEntity  = bodyId => entities.find(entity => entity.body.id === bodyId),
                entityA     = wallA ? null : findEntity(contactEquation.bodyA.id),
                entityB     = wallB ? null : findEntity(contactEquation.bodyB.id);

            if ((entityA && entityA.type === Enum.TYPE.GHOST) || (entityB && entityB.type === Enum.TYPE.GHOST)) {
                contactEquation.enabled = false;

            } else if ((!wallA && wallB) || (wallA && !wallB)) {
                const wall = wallA || wallB,
                    entity  = wallA ? entityB : entityA;

                if (entity) {
                    contactEquation.enabled = !wall.isConstrainedByDirection(entity);
                }
            }
        });
    }

    /**
     * p2 JS event when two shapes starts to overlap
     * @param {p2.Body} bodyA: body entered in collision
     * @param {p2.Body} bodyB: body entered in collision
     * @returns {void}
     */
    _onBeginContact ({ bodyA, bodyB }) {
        const contact = this._resolveContact(bodyA, bodyB);

        if (contact.entityA && contact.contactA) {
            contact.entityA.collides.push(contact.contactA);
        }

        if (contact.entityB && contact.contactB) {
            contact.entityB.collides.push(contact.contactB);
        }

        if (contact.entityA && contact.entityB) {
            contact.entityA.signals.beginCollision.dispatch(contact.entityB.name, contact.entityB);
            contact.entityB.signals.beginCollision.dispatch(contact.entityA.name, contact.entityA);
        }
    }

    /**
     * p2 JS event when two shapes ends to overlap
     * @param {p2.Body} bodyA: body entered in collision
     * @param {p2.Body} bodyB: body entered in collision
     * @returns {void}
     */
    _onEndContact ({ bodyA, bodyB }) {
        const contact = this._resolveContact(bodyA, bodyB);

        if (contact.entityA) {
            contact.entityA.collides = contact.entityA.collides.filter(collide => collide.bodyId !== contact.contactA.bodyId);
        }

        if (contact.entityB) {
            contact.entityB.collides = contact.entityB.collides.filter(collide => collide.bodyId !== contact.contactB.bodyId);
        }

        if (contact.entityA && contact.entityB) {
            contact.entityA.signals.endCollision.dispatch(contact.entityB.name, contact.entityB);
            contact.entityB.signals.endCollision.dispatch(contact.entityA.name, contact.entityA);
        }
    }

    /**
     * p2 JS event when two shapes is overlaping
     * @param {p2.Body} bodyA: body entered in collision
     * @param {p2.Body} bodyB: body entered in collision
     * @returns {{ entityA: Entity, entityB: Entity, contactA: *, contactB: *}} resolve object
     */
    _resolveContact (bodyA, bodyB) {
        const entities  = this.getEntities().filter(entity => entity.body && entity.body.data),
            walls       = (this.tilemap && this.tilemap.bodies) || [],
            findEntityByBody    = body => entities.find(entity => entity.body.data.id === body.id),
            findWallByBody      = body => walls.find(wall => wall.id === body.id),
            entityA     = findEntityByBody(bodyA),
            entityB     = findEntityByBody(bodyB);

        let contactA    = null,
            contactB    = null,
            wall        = null;

        const isAbove = (xA, yA, widthA, xB, yB, widthB) => yB >= yA && (xA > xB - widthA) && (xA < xB + widthB);

        switch (true) {
            case Boolean(entityA) && Boolean(entityB):
                contactA = { bodyId: bodyB.id, entity: entityB, isAbove: isAbove(entityA.props.x, entityA.props.y, entityA.props.height, entityB.props.x, entityB.props.y, entityB.props.width) };
                contactB = { bodyId: bodyA.id, entity: entityA, isAbove: isAbove(entityB.props.x, entityB.props.y, entityB.props.height, entityA.props.x, entityA.props.y, entityA.props.width) };
                break;

            case entityA && !entityB: wall = findWallByBody(bodyB);
                if (wall) {
                    contactA = { bodyId: bodyB.id, isAbove: isAbove(entityA.props.x, entityA.props.y, entityA.props.height, wall.x, wall.y, wall.width) };
                }
                break;

            case entityB && !entityA: wall = findWallByBody(bodyA);
                if (wall) {
                    contactB = { bodyId: bodyA.id, isAbove: isAbove(entityB.props.x, entityB.props.y, entityB.props.height, wall.x, wall.y, wall.width) };
                }
                break;
        }

        return { entityA: entityA, entityB: entityB, contactA: contactA, contactB: contactB };
    }
}
