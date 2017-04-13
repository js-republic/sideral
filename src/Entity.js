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
            limit           : { vx: 2000, vy: 2000 },
            bouncing        : 0,
            mass            : Entity.MASS.WEAK,
            debug           : false
        });

        this.standing   = false;
        this.moving     = false;
        this.scene      = null;
        this.collide    = {x: false, y: false};

        this._debug     = null;

        this.bind(this.SIGNAL.VALUE_CHANGE("debug"), this.createAction(this._onDebugChange)).
            bind(this.SIGNAL.UPDATE(), this.createAction(this.updateVelocity));
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
     * Set a new velocity for the current entity
     * @param {number=} vx: velocity in x axis
     * @param {number=} vy: velocity in y axis
     * @returns {void}
     */
    velocity (vx, vy) {
        if (typeof vx !== "undefined") {
            this.props.vx = vx;
        }

        if (typeof vy !== "undefined") {
            this.props.vy = vy;
        }
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
        if (this._debug) {
            this._debug.size(this.props.width, this.props.height);
        }
    }

    /**
     * When vx or vy attributes change
     * @returns {void}
     */
    updateVelocity () {
        this.props.vy   = Math.min(this.props.limit.vy, Math.max(-this.props.limit.vy, this.props.vy));
        this.props.vx   = Math.min(this.props.limit.vx, Math.max(-this.props.limit.vx, this.props.vx));

        const nextX     = this.props.x + (this.props.vx * Game.tick),
            nextY       = this.props.y + (this.props.vy * Game.tick),
            moveInX     = this.props.x !== nextX,
            moveInY     = this.props.gravityFactor ? moveInX || this.hasChanged("x") || this.hasChanged("y") || (this.props.y !== nextY) || !this.collide.y : this.props.y !== nextY;

        if (moveInY) {
            const gravity = this.scene.props.gravity * this.props.gravityFactor * Game.tick;

            this.props.vy += gravity;
            this.resolveMovementY(nextY + gravity);
        }

        if (moveInX) {
            this.resolveMovementX(nextX);
        }
    }

    /**
     * Event triggered when the current entity enter in collision with another entity
     * @param {*} entity: target entity (instance of Sideral Entity class)
     * @returns {void}
     */
    onCollisionWith (entity) { }

    /**
     * Resolve logic of physic when entity enter in collision with an other entity
     * @param {Entity} other: target entity
     * @param {number} shift : number of pixel shift
     * @returns {number} number of pixel shift
     */
    resolveMass (other, shift) {
        const isGhost = entity => entity.props.mass === Entity.MASS.NONE;

        if (isGhost(this) || isGhost(other)) {
            return shift;
        }

        if (other.props.mass === Entity.MASS.SOLID) {
            return 0;
        }

        return shift;
    }

    resolveMovement (nextX, nextY) {
        this.resolveMovementY(nextY);
        this.resolveMovementX(nextX);
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
            other           = this.scene.getEntitiesInRange(xmin, xmax, this.props.y, this.props.y + this.props.height, this.id).sort((a, b) => fromLeft ? a.props.x - b.props.x : b.props.x - a.props.x)[0],
            vectorCollision = other && Entity.vectorCollisionBetween(logic.value, this.props.y + this.props.vy, this.props.width, this.props.height, other.props.x, other.props.y, other.props.width, other.props.height);

        if (other) {
            console.log("collision x", vectorCollision.x, vectorCollision.y);

            const otherX    = other.resolveMovementX(other.props.x + this.resolveMass(other, fromLeft ? this.props.width + logic.value - other.props.x : logic.value - other.props.x - other.props.width));

            this.props.x    = (nextX = fromLeft ? otherX - this.props.width : otherX + other.props.width);

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
            other           = this.scene.getEntitiesInRange(this.props.x, this.props.x + this.props.width, ymin, ymax, this.id).sort((a, b) => fromTop ? a.props.y - b.props.y : b.props.y - a.props.y)[0],
            vectorCollision = other && Entity.vectorCollisionBetween(this.props.x + this.props.vx, this.props.y + this.props.vy, this.props.width, this.props.height, other.props.x, other.props.y, other.props.width, other.props.height);

        if (other) {
            console.log("collision y", this.props.name, vectorCollision.x, vectorCollision.y);

            const otherY    = other.resolveMovementY(other.props.y + this.resolveMass(other, fromTop ? this.props.height + logic.value - other.props.y : logic.value - other.props.y - other.props.height));

            this.props.y    = (nextY = fromTop ? otherY - this.props.height : otherY + other.props.height);

        } else {
            this.props.y    = (nextY = logic.value);
        }

        this.standing   = fromTop ? logic.collide || other : false;
        this.props.vy   = this.standing ? 0 : this.props.vy;

        return nextY;
    }


    /* PRIVATE */

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
            }, 0);
        }
    }


    /* STATIC */

    /**
     * Get the vector between two entity
     * @param {number} x : x position of the first entity
     * @param {number} y : y position of the first entity
     * @param {number} width : width of the first entity
     * @param {number} height : height of the first entity
     * @param {number} targetX : x position of the second entity
     * @param {number} targetY : y position of the second entity
     * @param {number} targetWidth : width of the second entity
     * @param {number} targetHeight : height of the second entity
     * @returns {{x: number, y: number}} the vector result
     */
    static vectorCollisionBetween (x, y, width, height, targetX, targetY, targetWidth, targetHeight) {
        const bottom    = y + height,
            right       = x + width,
            targbottom  = targetY + targetHeight,
            targright   = targetX + targetWidth,
            colbottom   = targbottom - y,
            coltop      = bottom - targetY,
            colleft     = right - targetX,
            colright    = targright - x;

        if (coltop < colbottom && coltop < colleft && coltop < colright) {
            return {x: 0, y: 1};

        } else if (colbottom < coltop && colbottom < colleft && colbottom < colright) {
            return {x: 0, y: -1};

        } else if (colleft < colright && colleft < coltop && colleft < colbottom) {
            return {x: 1, y: 0};

        } else if (colright < colleft && colright < coltop && colright < colbottom) {
            return {x: -1, y: 0};
        }

        return {x: 0, y: 0};
    }
}

Entity.MASS = {
    NONE    : 0,
    WEAK    : 1,
    SOLID   : 2
};
