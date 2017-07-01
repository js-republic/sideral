"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var p2_1 = require("p2");
var Tool_1 = require("./../Tool");
var Entity_1 = require("./../Entity");
var index_1 = require("./index");
/**
 * A scene is a container of modules
 */
var Scene = (function (_super) {
    __extends(Scene, _super);
    /* LIFECYCLE */
    /**
     * @constructor
     */
    function Scene() {
        var _this = _super.call(this) || this;
        /**
         * List of all children which is an instance of Entity
         * @private
         */
        _this._entities = null;
        /**
         * The tilemap of the scene
         */
        _this.tilemap = null;
        /**
         * The p2 World physics
         * @readonly
         */
        _this.world = null;
        /**
         * List of all materials of the world
         * @readonly
         */
        _this.materials = [];
        /**
         * List of all physics in this scenes
         * @readonly
         */
        _this.physics = [];
        /**
         * The amplitude of the screen shake
         * @readonly
         */
        _this.shakeAmplitude = 0;
        /**
         * All physic in queue
         */
        _this._physicQueue = [];
        _this.setProps({
            scale: 1,
            motionFactor: 1,
            gravity: 0
        });
        _this.context.scene = _this;
        _this.signals.propChange.bind("gravity", _this.onGravityChange.bind(_this));
        return _this;
    }
    /**
     * @initialize
     * @lifecycle
     * @override
     */
    Scene.prototype.initialize = function (props) {
        _super.prototype.initialize.call(this, props);
        this.setProps({
            width: this.context.game.props.width,
            height: this.context.game.props.height
        });
    };
    /**
     * @update
     * @lifecycle
     * @override
     */
    Scene.prototype.update = function (tick) {
        var _this = this;
        tick *= this.props.motionFactor;
        _super.prototype.update.call(this, tick);
        if (this.world) {
            var fixedStep = (1 / 60) * this.props.motionFactor, maxStep = 3;
            this.world.step(fixedStep, Tool_1.Util.limit(tick, 0, maxStep * fixedStep), maxStep);
            this._physicQueue.forEach(function (physic) { return _this.physics.find(function (x) { return x.id === physic.id; }) && _this.addPhysic(physic); });
        }
        if (this.container && this.shakeAmplitude) {
            this.container.pivot.set(this.shakeAmplitude * (Math.random() - 0.5), this.shakeAmplitude * (Math.random() - 0.5));
        }
    };
    /* METHODS */
    /**
     * Enable world physics
     * @param gravity - The power of gravity
     */
    Scene.prototype.enablePhysics = function (gravity) {
        var _this = this;
        this.disablePhysics();
        gravity = typeof gravity === "undefined" ? this.props.gravity : gravity;
        this.world = new p2_1.World({ gravity: [0, gravity] });
        this.materials = [this.getDefaultMaterial()];
        this.getAllEntities().filter(function (entity) { return entity.physic; }).forEach(function (entity) {
            if (!entity.physic.shape.material) {
                entity.physic.shape.material = _this.getDefaultMaterial();
            }
            var materialId = entity.physic.shape.material.id;
            if (!_this.materials.find(function (material) { return material.id === materialId; })) {
                _this.materials.push(entity.physic.shape.material);
            }
            _this.addPhysic(entity.physic);
        });
        this.setProps({ gravityFactor: gravity });
        this.world.setGlobalStiffness(Number.MAX_VALUE);
        this.world.on("beginContact", this._onBeginContact.bind(this), false);
        this.world.on("endContact", this._onEndContact.bind(this), false);
        this.world.on("preSolve", this._onPreSolve.bind(this), false);
    };
    /**
     * Disable and remove the world physics
     */
    Scene.prototype.disablePhysics = function () {
        var _this = this;
        if (this.world) {
            this.physics.forEach(function (physic) { return _this.removePhysic(physic); });
            this.materials = [];
            this.physics = [];
            this.world = null;
        }
    };
    /**
     * Get the default p2.Material
     * @returns The default p2.Material
     */
    Scene.prototype.getDefaultMaterial = function () {
        return this.world && this.world.defaultMaterial;
    };
    /**
     * Add a new Physic object to the current scene
     * @param physic - Physic object to add
     */
    Scene.prototype.addPhysic = function (physic) {
        if (this.world) {
            this.world.addBody(physic.body);
            this.physics.push(physic);
        }
    };
    /**
     * Remove a Physic object to the current scene
     * @param physic - Physic object to remove
     */
    Scene.prototype.removePhysic = function (physic) {
        if (this.world) {
            this.world.removeBody(physic.body);
        }
    };
    /**
     * Shake the current scene
     * @access public
     * @param amplitude - Amplitude of the shake
     * @param duration - Duration of the shake
     */
    Scene.prototype.shake = function (amplitude, duration) {
        var _this = this;
        if (duration === void 0) { duration = 10; }
        this.shakeAmplitude = amplitude;
        this.timers.addTimer("shake", duration, function () {
            _this.shakeAmplitude = 0;
            if (_this.container) {
                _this.container.pivot.set(0, 0);
            }
        });
    };
    /**
     * Get the entity owner of the physic by its body id
     * @param body - The body to check
     * @returns The entity found
     */
    Scene.prototype.getPhysicOwnerByBody = function (body) {
        var physic = this.physics.find(function (x) { return x.body.id === body.id; });
        return physic && physic.owner;
    };
    /**
     * Set a new bouncing factor for the entity
     * @param physic - The physic to change the bounce factor
     * @param bounce - Next value of bouncing
     * @returns Bouncing factor
     */
    Scene.prototype.setPhysicBouncing = function (physic, bounce) {
        var _this = this;
        if (physic.shape.material.id !== this.getDefaultMaterial().id) {
            var materialId_1 = physic.shape.material.id;
            this.world.contactMaterials.filter(function (x) { return x.materialA.id === materialId_1 || x.materialB.id === materialId_1; })
                .forEach(function (contactMaterial) { return _this.world.removeContactMaterial(contactMaterial); });
        }
        if (!bounce) {
            physic.shape.material = this.getDefaultMaterial();
        }
        else {
            var materialOptions_1 = {
                restitution: bounce,
                stiffness: Number.MAX_VALUE,
                friction: this.world.defaultContactMaterial.friction
            }, material_1 = physic.shape.material = new p2_1.Material(Scene.generateId());
            this.materials.push(material_1);
            var contactMaterials = this.materials.map(function (materialB) { return new p2_1.ContactMaterial(material_1, materialB, materialOptions_1); });
            contactMaterials.forEach(function (contactMaterial) { return _this.world.addContactMaterial(contactMaterial); });
        }
        return bounce;
    };
    /**
     * Set a tilemap for the current scene
     * @param data: data of the tilemap (generaly provided by a json file)
     * @returns Tilemap instance
     */
    Scene.prototype.setTilemap = function (data) {
        this.tilemap = this.add(new index_1.Tilemap(), {}, 0);
        this.tilemap.setData(data);
        return this.tilemap;
    };
    /**
     * Get all children instance of Entity
     * @returns Array of all entities
     */
    Scene.prototype.getEntities = function () {
        return this._entities || (this._entities = this.children.filter(function (child) { return child instanceof Entity_1.Entity; }));
    };
    /**
     * Get all children instance of Entity and their children
     * @returns Array of all entities (even their children)
     */
    Scene.prototype.getAllEntities = function () {
        var findChildrenEntities = function (child) {
            var childrenEntities = child instanceof Entity_1.Entity ? [child] : [];
            child.children.forEach(function (subchild) { return childrenEntities = childrenEntities.concat(findChildrenEntities(subchild)); });
            return childrenEntities;
        };
        return this.children.reduce(function (acc, entity) { return acc.concat(findChildrenEntities(entity)); }, []);
    };
    /**
     * Get entities from the scene in range
     * @param xmin: position x min
     * @param xmax: position x max
     * @param ymin: position y min
     * @param ymax: position y max
     * @param id: string of the id of an entity to filter
     * @returns list of all entities in range
     */
    Scene.prototype.getEntitiesInRange = function (xmin, xmax, ymin, ymax, id) {
        var entities = this.getEntities().
            filter(function (entity) { return entity.props.x > (xmin - entity.props.width) && entity.props.x < xmax; }).
            filter(function (entity) { return entity.props.y > (ymin - entity.props.height) && entity.props.y < ymax; });
        return id ? entities.filter(function (entity) { return id !== entity.id; }) : entities;
    };
    /* EVENTS */
    /**
     * Update the position of the camera related to the following entity
     */
    Scene.prototype.updateFollow = function () {
        if (this.props.follow) {
            var follow = this.props.follow, target = follow.target;
            if (!target.killed) {
                this.props.x = target.props.x + (follow.centered ? (target.props.width / 2) - (this.props.width / 2) : 0) - follow.offsetX;
                this.props.y = target.props.y + (follow.centered ? (target.props.height / 2) - (this.props.height / 2) : 0) - follow.offsetY;
            }
            else {
                this.props.follow = null;
            }
        }
    };
    /**
     * When "gravity" property change
     */
    Scene.prototype.onGravityChange = function () {
        if (this.world) {
            this.world.gravity = [0, Tool_1.Util.pixelToMeter(this.props.gravity)];
        }
    };
    /* PRIVATE */
    /**
     * p2 World presolving
     * @param contactEquations - The contactEquations of p2 (see p2.js)
     * @private
     */
    Scene.prototype._onPreSolve = function (_a) {
        var _this = this;
        var contactEquations = _a.contactEquations;
        contactEquations.forEach(function (contactEquation) {
            var ownerA = _this.getPhysicOwnerByBody(contactEquation.bodyA), ownerB = _this.getPhysicOwnerByBody(contactEquation.bodyB), wallA = (ownerA instanceof Entity_1.Wall) && ownerA, wallB = (ownerB instanceof Entity_1.Wall) && ownerB, entityA = ownerA && (wallA ? false : ownerA), entityB = ownerB && (wallB ? false : ownerB);
            if ((entityA && entityA.props.type === Tool_1.Enum.TYPE.GHOST) || (entityB && entityB.props.type === Tool_1.Enum.TYPE.GHOST)) {
                contactEquation.enabled = false;
            }
            else if ((!wallA && wallB) || (wallA && !wallB)) {
                var wall = wallA || wallB, entity = wallA ? entityB : entityA;
                if (entity) {
                    contactEquation.enabled = !wall.isConstrainedByDirection(entity);
                }
            }
        });
    };
    /**
     * p2 JS event when two shapes starts to overlap
     * @param bodyA: Body A entered in collision
     * @param bodyB: Body B entered in collision
     * @private
     */
    Scene.prototype._onBeginContact = function (_a) {
        var bodyA = _a.bodyA, bodyB = _a.bodyB;
        var contact = this._resolveContact(bodyA, bodyB);
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
    };
    /**
     * p2 JS event when two shapes ends to overlap
     * @param bodyA - Body A entered in collision
     * @param bodyB - Body B entered in collision
     * @private
     */
    Scene.prototype._onEndContact = function (_a) {
        var bodyA = _a.bodyA, bodyB = _a.bodyB;
        var contact = this._resolveContact(bodyA, bodyB);
        if (!contact) {
            return null;
        }
        var entityA = contact.entityA, entityB = contact.entityB;
        if (entityA) {
            entityA.collides = entityA.collides.filter(function (collide) { return collide.bodyId !== contact.contactA.bodyId; });
        }
        if (entityB) {
            entityB.collides = entityB.collides.filter(function (collide) { return collide.bodyId !== contact.contactB.bodyId; });
        }
        if (entityA && entityB) {
            entityA.signals.endCollision.dispatch(entityB.name, entityB);
            entityB.signals.endCollision.dispatch(entityA.name, entityA);
            this.physics = this.physics.filter(function (physic) { return physic.enabled; });
        }
    };
    /**
     * p2 JS event when two shapes is overlaping
     * @private
     * @param bodyA - Body A entered in collision
     * @param bodyB - Body B entered in collision
     * @returns Contact resolver
     */
    Scene.prototype._resolveContact = function (bodyA, bodyB) {
        var ownerA = this.getPhysicOwnerByBody(bodyA), ownerB = this.getPhysicOwnerByBody(bodyB);
        var contactA = null, contactB = null;
        var isAbove = function (xA, yA, widthA, xB, yB, widthB) { return yB >= yA && (xA > xB - widthA) && (xA < xB + widthB); };
        switch (true) {
            case ownerB instanceof Entity_1.Wall:
                contactA = { bodyId: bodyB.id, isAbove: isAbove(ownerA.props.x, ownerA.props.y, ownerA.props.height, ownerB.props.x, ownerB.props.y, ownerB.props.width) };
                break;
            case ownerA instanceof Entity_1.Wall:
                contactB = { bodyId: bodyA.id, isAbove: isAbove(ownerB.props.x, ownerB.props.y, ownerB.props.height, ownerA.props.x, ownerA.props.y, ownerA.props.width) };
                break;
            case Boolean(ownerA) && Boolean(ownerB):
                contactA = { bodyId: bodyB.id, entity: ownerB, isAbove: isAbove(ownerA.props.x, ownerA.props.y, ownerA.props.height, ownerB.props.x, ownerB.props.y, ownerB.props.width) };
                contactB = { bodyId: bodyA.id, entity: ownerA, isAbove: isAbove(ownerB.props.x, ownerB.props.y, ownerB.props.height, ownerA.props.x, ownerA.props.y, ownerA.props.width) };
                break;
        }
        return (contactA || contactB) && { entityA: (ownerA instanceof Entity_1.Entity) && ownerA, entityB: (ownerB instanceof Entity_1.Entity) && ownerB, contactA: contactA, contactB: contactB };
    };
    return Scene;
}(index_1.Module));
exports.Scene = Scene;
