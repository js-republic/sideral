import p2 from "p2";

import AbstractModule from "./Abstract/AbstractModule";

import Shape from "./Module/Shape";
import Sprite from "./Module/Sprite";

import Game from "./Game";


export default class Entity extends AbstractModule {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            gravityFactor   : 1,
            vx              : 0,
            vy              : 0,
            fricX           : 0,
            fricY           : 0,
            accelX          : 0,
            accelY          : 0,
            limit           : { vx: 2000, vy: 2000 },
            bouncing        : 0,
            angle           : 0,
            mass            : Entity.MASS.WEAK,
            debug           : false
        });

        this.standing   = false;
        this.moving     = false;
        this.scene      = null;
        this.collide    = {x: false, y: false};

        this._debug     = null;

        this.bind(this.SIGNAL.VALUE_CHANGE("debug"), this.createAction(this._onDebugChange))
            .bind(this.SIGNAL.VALUE_CHANGE("angle"), this.createAction(this.onAngleChange))
            .bind(this.SIGNAL.VALUE_CHANGE("mass"), this.createAction(this.onMassChange))
            .bind(this.SIGNAL.UPDATE(), this.createAction(this.updateVelocity));
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.bodyShape  = new p2.Box({ width: this.props.width, height: this.props.height });
        this.body       = new p2.Body({ mass: this.props.mass, position: [this.props.x, this.props.y] });

        this.body.addShape(this.bodyShape);
    }

    /**
     * @kill
     * @lifecycle
     * @override
     */
    kill () {
        super.kill();

        if (this.body) {
            this.scene.world.removeBody(this.body);
        }
    }


    /* METHODS */

    /**
     * Add a new spritesheet to the current entity
     * @param {string} imagePath: path to the media
     * @param {number} tilewidth: width of a tile
     * @param {number} tileheight: height of a tile
     * @param {Object=} settings: settings to pass to the spritesheet module
     * @param {number=} index: z index position of the entity
     * @returns {Object} the current spritesheet
     */
    addSprite (imagePath, tilewidth, tileheight, settings = {}, index) {
        settings.imagePath  = imagePath;
        settings.width      = tilewidth;
        settings.height     = tileheight;

        return this.add(new Sprite(), settings, index);
    }

    /**
     * Get vector to entity to target
     * @param {Entity} entity: the target
     * @returns {{x: number, y: number}} the vector
     */
    vectorPositionTo (entity) {
        return {
            x: entity.props.x <= (this.props.x + (this.props.width / 2)) ? -1 : 1,
            y: entity.props.y <= (this.props.y + (this.props.height / 2)) ? -1 : 1
        };
    }


    /* EVENTS */

    /**
     * When "width" or "height" attributes change
     * @override
     * @returns {void}
     */
    onSizeChange () {
        this.container.pivot.x = this.width / 2;
        this.container.pivot.y = this.height / 2;

        if (this._debug) {
            this._debug.size(this.props.width, this.props.height);
        }

        if (this.bodyShape) {
            this.bodyShape.width    = this.props.width;
            this.bodyShape.height   = this.props.height;
        }
    }

    /**
     * Event triggered when the current entity enter in collision with another entity
     * @param {*} entity: target entity (instance of Sideral Entity class)
     * @returns {void}
     */
    onCollisionWith (entity) {

    }

    /**
     * @override
     */
    onPositionChange () {
        super.onPositionChange();
    }

    /**
     * When angle attribute change
     * @returns {void}
     */
    onAngleChange () {
        this.container.rotation = this.props.angle * Math.PI / 180;
    }

    /**
     * When mass attribute change
     * @returns {void}
     */
    onMassChange () {
        this.body.mass = this.props.mass;
        this.body.updateMassProperties();
    }

    /**
     * When "debug" attribute change
     * @private
     * @returns {void}
     */
    _onDebugChange () {
        if (this._debug) {
            this._debug.kill();
            this._debug = null;
        }

        if (this.props.debug) {
            this._debug = this.add(new Shape(), {
                type    : Shape.TYPE.RECTANGLE,
                width   : this.props.width,
                height  : this.props.height,
                stroke  : "#FF0000",
                fill    : "transparent"
            });
        }
    }

    /**
     * When vx or vy attributes change
     * @returns {void}
     */
    updateVelocity () {
        // this.props.x += this.props.vx * Game.tick;
        // this.props.y += this.props.vy * Game.tick;

        this.props.x        = this.body.interpolatedPosition[0];
        this.props.y        = this.body.interpolatedPosition[1];
        this.props.angle    = this.body.interpolatedAngle * 180 / Math.PI;

        /*
        const { x, y, vx, vy, fricX, fricY, limit } = this.props,
            resolveFriction = (vel, friction) => {
                if (friction && vel) {
                    const tendance  = Math.sign(vel),
                        delta       = Math.abs(friction) * Game.tick * tendance;

                    return Math[tendance > 0 ? "max" : "min"](0, vel - delta);
                }

                return vel;
            };

        this.props.vx   = resolveFriction(Math.min(limit.vx, Math.max(-limit.vx, vx)), fricX);
        this.props.vy   = resolveFriction(Math.min(limit.vy, Math.max(-limit.vy, vy)), fricY);

        const nextX     = x + (vx * Game.tick),
            nextY       = y + (vy * Game.tick),
            moveInX     = x !== nextX,
            moveInY     = this.props.gravityFactor ? moveInX || this.hasChanged("x") || this.hasChanged("y") || (y !== nextY) || !this.collide.y : y !== nextY,
            gravity     = this.scene.props.gravity * this.props.gravityFactor * Game.tick;

        if (moveInY) {
            this.props.vy += gravity;

            if (!moveInX) {
                this.resolveMovementY(nextY + gravity);
            }
        }

        if (moveInX && !moveInY) {
            this.resolveMovementX(nextX);

        } else if (moveInX && moveInY) {
            this.resolveMovement(nextX, nextY + gravity);

        }*/
    }

    /**
     * Resolve logic of physic when entity enter in collision with an other entity
     * @param {Entity} other: target entity
     * @param {number} shift : number of pixel shift
     * @returns {number} number of pixel shift
     */
    resolveMass (other, shift) {
        const isGhost   = entity => entity.props.mass === Entity.MASS.NONE;

        if (isGhost(this) || isGhost(other)) {
            return shift;
        }

        if (other.props.mass === Entity.MASS.SOLID) {
            shift = 0;
        }

        return shift;
    }

    /**
     * Return the position of collision of entity when entered in collision with an other entity
     * @param {Entity} target: target in collision
     * @param {string} axis: axis of the collision (x or y)
     * @returns {number} the next position of the entity
     */
    resolveCollision (target, axis) {
        const pEntity   = this.props[axis],
            pTarget     = target.props[axis],
            vEntity     = this.props["v" + axis] * Game.tick,
            vTarget     = target.props["v" + axis] * Game.tick;

        if (!vEntity || !vTarget || (Math.sign(vEntity) + Math.sign(vTarget)) !== 0) {
            return NaN;
        }

        return pEntity + (Math.abs(pTarget - pEntity) / (1 + (Math.abs(vTarget) / Math.abs(vEntity))));
    }

    resolveBouncing (target, axis) {
        const bEntity   = this.props.bouncing,
            bTarget     = target.props.bouncing,
            vEntity     = this.props["v" + axis],
            vTarget     = target.props["v" + axis],
            vSign       = Math.sign(target.props[axis] - this.props[axis]);

        if (bEntity && vTarget && Math.sign(vTarget) === vSign) {
            this.props["v" + axis] = vTarget * bEntity;
        }

        if (bTarget && target.props.mass !== Entity.MASS.SOLID && Math.sign(vEntity) === vSign) {
            target.props["v" + axis] = vEntity * bTarget;
        }

        return vEntity;
    }

    resolveMovement (nextX, nextY) {
        if (nextY > this.props.y) {
            this.resolveMovementX(nextX);
            this.resolveMovementY(nextY);

        } else {
            this.resolveMovementY(nextY);
            this.resolveMovementX(nextX);

        }
    }

    resolveMovementX (nextX) {
        if (nextX === this.props.x) {
            return nextX;
        }

        const tilemap       = this.scene.tilemap,
            fromLeft        = nextX > this.props.x,
            logic           = tilemap ? tilemap.getLogicXAt(this.props.x, nextX, this.props.y, this.props.y + this.props.height, this.props.width) : { collide: false, value: nextX },
            xmin            = Math.min(this.props.x, logic.value),
            xmax            = Math.max(this.props.x, logic.value) + this.props.width,
            other           = this.scene.getEntitiesInRange(xmin, xmax, this.props.y, this.props.y + this.props.height, this.id).sort((a, b) => fromLeft ? a.props.x - b.props.x : b.props.x - a.props.x)[0];

        if (other && other.props.mass !== Entity.MASS.NONE && this.props.mass !== Entity.MASS.NONE) {
            const otherX    = other.resolveMovementX(other.props.x + this.resolveMass(other, fromLeft ? this.props.width + logic.value - other.props.x : logic.value - other.props.x - other.props.width));

            this.props.x    = (nextX = fromLeft ? otherX - this.props.width : otherX + other.props.width);
            this.resolveBouncing(other, "x");

        } else {
            this.props.x    = (nextX = logic.value);
        }

        return nextX;
    }

    resolveMovementY (nextY) {
        if (nextY === this.props.y) {
            return nextY;
        }

        const tilemap       = this.scene.tilemap,
            fromTop         = nextY > this.props.y,
            logic           = tilemap ? tilemap.getLogicYAt(this.props.y, nextY, this.props.x, this.props.x + this.props.width, this.props.height) : { collide: false, value: nextY },
            ymin            = Math.min(this.props.y, logic.value),
            ymax            = Math.max(this.props.y, logic.value) + this.props.height,
            other           = this.scene.getEntitiesInRange(this.props.x, this.props.x + this.props.width, ymin, ymax, this.id).sort((a, b) => fromTop ? a.props.y - b.props.y : b.props.y - a.props.y)[0];

        if (other  && other.props.mass !== Entity.MASS.NONE && this.props.mass !== Entity.MASS.NONE) {
            const otherY    = other.resolveMovementY(other.props.y + this.resolveMass(other, fromTop ? this.props.height + logic.value - other.props.y : logic.value - other.props.y - other.props.height));

            this.props.y    = (nextY = fromTop ? otherY - this.props.height : otherY + other.props.height);
            this.resolveBouncing(other, "y");

            if (other.props.y < this.props.y) {
                other.standing  = true;

            } else {
                this.standing   = true;

            }

        } else {
            this.props.y    = (nextY = logic.value);
        }

        this.standing   = fromTop ? logic.collide || Boolean(other) : false;
        this.props.vy   = this.standing ? Math.max(0, this.props.vy) : this.props.vy;

        return nextY;
    }

    /**
     * Get the speed of the velocity
     * @returns {number} speed velocity
     */
    getKineticEnergy () {
        const x = (this.props.x + (this.props.width / 2)) - (this.props.x + (this.props.vx * Game.tick)),
            y   = (this.props.y + (this.props.height / 2)) - (this.props.y + (this.props.vy * Game.tick));

        return this.props.mass * Math.sqrt((x * x) + (y * y));
    }


    /* STATIC */

}

Entity.MASS = {
    NONE    : 0,
    WEAK    : 1,
    SOLID   : 2
};
