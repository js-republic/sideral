import { Material, World, ContactMaterial } from "p2";

import { Module } from "./Module";
import { Entity } from "./Entity";

import { ISceneProps, IContact } from "./Interface";

import { Enum } from "./Tool/Enum";
import { Util } from "./Tool/Util";

import { Tilemap } from "./Module/Tilemap";
import { Wall } from "./Module/Wall";


/**
 * A scene is a container of modules
 */
export class Scene extends Module {

    /* ATTRIBUTES */

    /**
     * Properties of the scene
     */
    props: ISceneProps;

    /**
     * List of all children which is an instance of Entity
     * @private
     */
    _entities: Array<Entity> = null;

    /**
     * The tilemap of the scene
     */
    tilemap: Tilemap = null;

    /**
     * The p2 World physics
     * @type {p2.World}
     */
    world: World = null;

    /**
     * List of all materials of the world
     * @type {Array}
     */
    materials: Array<Material> = [];

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

        if (this.world) {
            const fixedStep = (1 / 60) * this.props.motionFactor,
                maxStep     = 3;

            this.world.step(fixedStep, Util.limit(tick, 0, maxStep * fixedStep), maxStep);
        }

        if (this.container && this.shakeAmplitude) {
            this.container.pivot.set(this.shakeAmplitude * (Math.random() - 0.5), this.shakeAmplitude * (Math.random() - 0.5));
        }
    }


    /* METHODS */

    /**
     * Enable world physics
     * @param gravity - The power of gravity
     */
    enablePhysics (gravity?: number) {
        this.disablePhysics();

        gravity         = typeof gravity === "undefined" ? this.props.gravity : gravity;
        this.world      = new World({ gravity: [0, gravity] });
        this.materials  = [this.world.defaultMaterial];

        this.getAllEntities().filter(entity => entity.body).forEach(entity => {
            const materialId = entity.body.shape.material.id;

            if (!this.materials.find(material => material.id === materialId)) {
                this.materials.push(entity.body.shape.material);
            }

            this.world.addBody(entity.body.data);
        });

        this.setProps({ gravityFactor: gravity });

        this.world.setGlobalStiffness(1e8);
        this.world.on("beginContact", this._onBeginContact.bind(this), false);
        this.world.on("endContact", this._onEndContact.bind(this), false);
        this.world.on("preSolve", this._onPreSolve.bind(this), false);
    }

    /**
     * Disable and remove the world physics
     */
    disablePhysics () {
        if (this.world) {
            this.world.bodies.forEach(body => this.world.removeBody(body));

            this.materials  = [];
            this.world      = null;
        }
    }

    /**
     * Shake the current scene
     * @access public
     * @param amplitude - Amplitude of the shake
     * @param duration - Duration of the shake
     */
    shake (amplitude: number, duration: number = 10): void {
        this.shakeAmplitude = amplitude;

        this.timers.addTimer("shake", duration, () => {
            this.shakeAmplitude = 0;

            if (this.container) {
                this.container.pivot.set(0, 0);
            }
        });
    }

    /**
     * Set a new bouncing factor for the entity
     * @param entity: entity with a new bounce factor
     * @param bounce: next bouncing factor
     * @param lastBounce: last bouncing factor
     * @returns Bouncing factor
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

            const material = entity.body.shape.material = new Material(Scene.generateId());

            this.materials.push(material);

            const contactMaterials = this.materials.map(materialB => new ContactMaterial(material, materialB, materialOptions));

            contactMaterials.forEach(contactMaterial => this.world.addContactMaterial(contactMaterial));
        }

        return bounce;
    }

    /**
     * Set a tilemap for the current scene
     * @param data: data of the tilemap (generaly provided by a json file)
     * @returns Tilemap instance
     */
    setTilemap (data: any): Tilemap {
        this.tilemap = <Tilemap> this.add(new Tilemap(), {}, 0);

        this.tilemap.setData(data);

        return this.tilemap;
    }

    /**
     * Get all children instance of Entity
     * @returns Array of all entities
     */
    getEntities (): Array<Entity> {
        return this._entities || (this._entities = <Array<Entity>>this.children.filter(child => child instanceof Entity));
    }

    /**
     * Get all children instance of Entity and their children
     * @returns Array of all entities (even their children)
     */
    getAllEntities (): Array<Entity> {
        const findChildrenEntities = entity => {
            let childrenEntities = [entity];

            entity.children.forEach(child => {
                if (child instanceof Entity) {
                    childrenEntities = childrenEntities.concat(findChildrenEntities(child));
                }
            });

            return childrenEntities;
        };

        return this.getEntities().reduce((acc, entity) => acc.concat(findChildrenEntities(entity)), []);
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
     */
    updateFollow (): void {
        if (this.props.follow) {
            const follow    = this.props.follow,
                target      = follow.target;

            if (!target.killed) {
                this.props.x = target.props.x + (follow.centered ? (target.props.width / 2) - (this.props.width / 2) : 0) - follow.offsetX;
                this.props.y = target.props.y + (follow.centered ? (target.props.height / 2) - (this.props.height / 2) : 0) - follow.offsetY;

            } else {
                this.props.follow = null;

            }
        }
    }
    /**
     * When "gravity" property change
     */
    onGravityChange (): void {
        this.world.gravity = [0, this.props.gravity];
    }


    /* PRIVATE */

    /**
     * p2 World presolving
     * @param contactEquations - The contactEquations of p2 (see p2.js)
     * @private
     */
    _onPreSolve ({ contactEquations }): void {
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
     * @param bodyA: Body A entered in collision
     * @param bodyB: Body B entered in collision
     * @private
     */
    _onBeginContact ({ bodyA, bodyB }): void {
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
     * @param bodyA: Body A entered in collision
     * @param bodyB: Body B entered in collision
     * @private
     */
    _onEndContact ({ bodyA, bodyB }): void {
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
     * @private
     * @param bodyA: Body A entered in collision
     * @param bodyB: Body B entered in collision
     * @returns Contact resolver
     */
    _resolveContact (bodyA, bodyB): IContact {
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
