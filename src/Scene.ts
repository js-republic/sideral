import { Material, World, ContactMaterial } from "p2";

import { Module } from "./Module";
import { Entity } from "./Entity";

import { Enum } from "./Tool/Enum";
import { Util } from "./Tool/Util";

import { Tilemap } from "./Module/Tilemap";
import { Wall } from "./Module/Wall";


/**
 * Class representing the simplest scene to add Entity
 * @class Scene
 * @extends Module
 */
export class Scene extends Module {

    /* ATTRIBUTES */

    _entities: Array<Entity>    = null;
    wallMaterial: Material      = new Material(Scene.generateId());
    tilemap: Tilemap            = null;
    world                       = new World({ gravity: [0, 0] });
    materials                   = [];

    /**
     * The amplitude of the screen shake
     * @readonly
     * @type {number}
     */
    shakeAmplitude: number      = 0;


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            scale       : 1,
            motionFactor: 1,
            gravity     : 0
        });

        this.context.scene  = this;
        this.materials      = [this.world.defaultMaterial, this.wallMaterial];

        this.world.setGlobalStiffness(1e8);

        this.world.on("beginContact", this._onBeginContact.bind(this), false);
        this.world.on("endContact", this._onEndContact.bind(this), false);
        this.world.on("preSolve", this._onPreSolve.bind(this), false);

        this.signals.update.add(this.updateFollow.bind(this));
        this.signals.propChange.bind("gravity", this.onGravityChange.bind(this));
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.setProps({
            width   : this.context.game.props.width,
            height  : this.context.game.props.height
        });
    }

    /**
     * @update
     * @lifecycle
     * @override
     */
    update (tick) {
        tick *= this.props.motionFactor;

        super.update(tick);

        const fixedStep = (1 / 60) * this.props.motionFactor,
            maxStep     = 3;

        this.world.step(fixedStep, Util.limit(tick, 0, maxStep * fixedStep), maxStep);

        if (this.container && this.shakeAmplitude) {
            this.container.pivot.set(this.shakeAmplitude * (Math.random() - 0.5), this.shakeAmplitude * (Math.random() - 0.5));
        }
    }


    /* METHODS */

    /**
     * Shake the current scene
     * @access public
     * @param {number} amplitude - Amplitude of the shake
     * @param {number=} duration - Duration of the shake
     * @returns {number} The current amplitude of the shake
     */
    shake (amplitude, duration = 10) {
        this.shakeAmplitude = amplitude;

        this.timers.add("shake", duration, () => {
            this.shakeAmplitude = 0;

            if (this.container) {
                this.container.pivot.set(0, 0);
            }
        });
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
            entity.body.shape.material = this.world.defaultMaterial;

        } else {
            const materialOptions = {
                restitution         : bounce
            } as p2.ContactMaterialOptions;

            const material          = entity.body.shape.material = new Material(Scene.generateId());

            this.materials.push(material);

            const contactMaterials    = this.materials.map(materialB => new ContactMaterial(material, materialB, materialOptions));

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
        this.tilemap = <Tilemap> this.add(new Tilemap(), {}, 0);

        this.tilemap.setData(data);

        return this.tilemap;
    }

    /**
     * Get all children instance of Entity
     * @returns {Array<*>} array of all entities
     */
    getEntities (): any[] {
        return this._entities || (this._entities = <Array<Entity>>this.children.filter(child => child instanceof Entity));
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
     * Update the position of the camera related to the following entity
     * @event update
     * @returns {void}
     */
    updateFollow () {
        if (this.props.follow) {
            const follow = this.props.follow;

            if (!follow.killed) {
                this.props.x = -(follow.props.x + (follow.props.width / 2) - (this.props.width / 2));
                this.props.y = -(follow.props.y + (follow.props.height / 2) - (this.props.height / 2));

            } else {
                this.props.follow = null;

            }
        }
    }
    /**
     * When gravity property change
     * @returns {void}
     */
    onGravityChange () {
        this.world.gravity = [0, this.props.gravity];
    }


    /* PRIVATE */

    _onPreSolve ({ contactEquations }) {
        contactEquations.forEach(contactEquation => {
            const ownerA    = contactEquation.bodyA.owner,
                ownerB      = contactEquation.bodyB.owner,
                wallA       = (ownerA instanceof Wall) && ownerA,
                wallB       = (ownerB instanceof Wall) && ownerB,
                entityA     = wallA ? false : ownerA,
                entityB     = wallB ? false : ownerB;

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
        const ownerA    = bodyA.owner,
            ownerB      = bodyB.owner;

        let contactA    = null,
            contactB    = null;

        const isAbove = (xA, yA, widthA, xB, yB, widthB) => yB >= yA && (xA > xB - widthA) && (xA < xB + widthB);

        switch (true) {
            case ownerB instanceof Wall:
                contactA = { bodyId: bodyB.id, isAbove: isAbove(ownerA.props.x, ownerA.props.y, ownerA.props.height, ownerB.props.x, ownerB.props.y, ownerB.props.width) };
                break;

            case ownerA instanceof Wall:
                contactB = { bodyId: bodyA.id, isAbove: isAbove(ownerB.props.x, ownerB.props.y, ownerB.props.height, ownerA.props.x, ownerA.props.y, ownerA.props.width) };
                break;

            default:
                contactA = { bodyId: bodyB.id, entity: ownerB, isAbove: isAbove(ownerA.props.x, ownerA.props.y, ownerA.props.height, ownerB.props.x, ownerB.props.y, ownerB.props.width) };
                contactB = { bodyId: bodyA.id, entity: ownerA, isAbove: isAbove(ownerB.props.x, ownerB.props.y, ownerB.props.height, ownerA.props.x, ownerA.props.y, ownerA.props.width) };
                break;
        }

        return { entityA: (ownerA instanceof Entity) && ownerA, entityB: (ownerB instanceof Entity) && ownerB, contactA: contactA, contactB: contactB };
    }
}
