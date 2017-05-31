import { Material, World, ContactMaterial, Body } from "p2";

import { Enum, Util } from "./../Tool";
import { Entity, Wall, Physic } from "./../Entity";
import { Module, Tilemap } from "./index";
import { ISceneProps, IContact } from "./../Interface";


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
     * @readonly
     */
    world: World = null;

    /**
     * List of all materials of the world
     * @readonly
     */
    materials: Array<Material> = [];

    /**
     * List of all physics in this scenes
     * @readonly
     */
    physics: Array<Physic> = [];

    /**
     * The amplitude of the screen shake
     * @readonly
     */
    shakeAmplitude: number      = 0;

    /**
     * Know if the Scene is launching the p2.World step
     */
    worldInStep: boolean = false;

    /**
     * All physic in queue
     */
    _physicQueue: Array<Physic> = [];


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

            this.worldInStep = true;
            this.world.step(fixedStep, Util.limit(tick, 0, maxStep * fixedStep), maxStep);
            this.worldInStep = false;

            this._physicQueue.forEach(physic => this.physics.find(x => x.id === physic.id) ? this.removePhysic(physic) :this.addPhysic(physic));
            this._physicQueue = [];
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

        this.getAllEntities().filter(entity => entity.physic).forEach(entity => {
            const materialId = entity.physic.shape.material.id;

            if (!this.materials.find(material => material.id === materialId)) {
                this.materials.push(entity.physic.shape.material);
            }

            this.addPhysic(entity.physic);
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
            this.physics.forEach(physic => this.removePhysic(physic));

            this.materials  = [];
            this.physics    = [];
            this.world      = null;
        }
    }

    /**
     * Get the default p2.Material
     * @returns The default p2.Material
     */
    getDefaultMaterial (): Material {
        return this.world && this.world.defaultMaterial;
    }

    /**
     * Add a new Physic object to the current scene
     * @param physic - Physic object to add
     */
    addPhysic (physic: Physic): void {
        if (this.worldInStep) {
            this._physicQueue.push(physic);

            return null;
        }

        if (this.world) {
            this.world.addBody(physic.body);
            this.physics.push(physic);
        }
    }

    /**
     * Remove a Physic object to the current scene
     * @param physic - Physic object to remove
     */
    removePhysic (physic: Physic): void {
        if (this.worldInStep) {
            this._physicQueue.push(physic);

            return null;
        }

        if (this.world) {
            this.world.removeBody(physic.body);
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
     * Get the entity owner of the physic by its body id
     * @param body - The body to check
     * @returns The entity found
     */
    getPhysicOwnerByBody (body: Body): Entity {
        const physic = this.physics.find(x => x.body.id === body.id);

        return physic && physic.owner;
    }

    /**
     * Set a new bouncing factor for the entity
     * @param physic - The physic to change the bounce factor
     * @param bounce - Next value of bouncing
     * @param lastBounce - Last value of bouncing
     * @returns Bouncing factor
     */
    setPhysicBouncing (physic: Physic, bounce: number, lastBounce: number): number {
        if (lastBounce) {
            const id = physic.shape.material.id;

            this.world.contactMaterials.filter(x => x.materialA.id === id || x.materialB.id === id)
                .forEach(contactMaterial => this.world.removeContactMaterial(contactMaterial));
        }

        if (!bounce) {
            physic.shape.material = this.getDefaultMaterial();

        } else {
            const materialOptions   = { restitution : bounce } as p2.ContactMaterialOptions,
                material            = physic.shape.material = new Material(Scene.generateId());

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
     * @param xmin: position x min
     * @param xmax: position x max
     * @param ymin: position y min
     * @param ymax: position y max
     * @param id: string of the id of an entity to filter
     * @returns list of all entities in range
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
        if (this.world) {
            this.world.gravity = [0, Util.pixelToMeter(this.props.gravity)];
        }
    }


    /* PRIVATE */

    /**
     * p2 World presolving
     * @param contactEquations - The contactEquations of p2 (see p2.js)
     * @private
     */
    _onPreSolve ({ contactEquations }): void {
        contactEquations.forEach(contactEquation => {
            const ownerA    = this.getPhysicOwnerByBody(contactEquation.bodyA),
                ownerB      = this.getPhysicOwnerByBody(contactEquation.bodyB),
                wallA       = (ownerA instanceof Wall) && ownerA,
                wallB       = (ownerB instanceof Wall) && ownerB,
                entityA     = ownerA && (wallA ? false : ownerA),
                entityB     = ownerB && (wallB ? false : ownerB);

            if ((entityA && entityA.props.type === Enum.TYPE.GHOST) || (entityB && entityB.props.type === Enum.TYPE.GHOST)) {
                contactEquation.enabled = false;

            } else if ((!wallA && wallB) || (wallA && !wallB)) {
                const wall = <Wall> wallA || wallB,
                    entity  = <Entity> wallA ? entityB : entityA;

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
     * @param bodyA - Body A entered in collision
     * @param bodyB - Body B entered in collision
     * @private
     */
    _onEndContact ({ bodyA, bodyB }): void {
        const contact = this._resolveContact(bodyA, bodyB),
            { entityA, entityB } = contact;

        if (entityA) {
            entityA.collides = entityA.collides.filter(collide => collide.bodyId !== contact.contactA.bodyId);
        }

        if (entityB) {
            entityB.collides = entityB.collides.filter(collide => collide.bodyId !== contact.contactB.bodyId);
        }

        if (entityA && entityB) {
            entityA.signals.endCollision.dispatch(entityB.name, entityB);
            entityB.signals.endCollision.dispatch(entityA.name, entityA);

            this.physics = this.physics.filter(physic => physic.enabled);
        }
    }

    /**
     * p2 JS event when two shapes is overlaping
     * @private
     * @param bodyA - Body A entered in collision
     * @param bodyB - Body B entered in collision
     * @returns Contact resolver
     */
    _resolveContact (bodyA: Body, bodyB: Body): IContact {
        const ownerA    = this.getPhysicOwnerByBody(bodyA),
            ownerB      = this.getPhysicOwnerByBody(bodyB);

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

            case Boolean(ownerA) && Boolean(ownerB):
                contactA = { bodyId: bodyB.id, entity: ownerB, isAbove: isAbove(ownerA.props.x, ownerA.props.y, ownerA.props.height, ownerB.props.x, ownerB.props.y, ownerB.props.width) };
                contactB = { bodyId: bodyA.id, entity: ownerA, isAbove: isAbove(ownerB.props.x, ownerB.props.y, ownerB.props.height, ownerA.props.x, ownerA.props.y, ownerA.props.width) };
                break;
        }

        return (contactA || contactB) && { entityA: (ownerA instanceof Entity) && ownerA, entityB: (ownerB instanceof Entity) && ownerB, contactA: contactA, contactB: contactB };
    }
}
