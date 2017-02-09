import Mixin from "./../Mixin";


export default class Collision extends Mixin {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.name = "collision";
    }

    /* METHODS */

    /**
     * Resolve all collision (wall and between entities)
     * @returns {void}
     */
    resolveAll () {
        // 1st step - resolve collisions with wall
        this.parent.children.filter(child => child.moving).forEach(this.resolveWall);

        // 2nd step - get collisions with all entities moving (intersections of two lines)
        // 3rd step - get all chains of collisions to resolve shifting
        // 4rd step - resolve shifting of impact by entities moving
    }

    /**
     * Resolve wall for entity passed in parameters
     * @param {Entity} entity: entity to check
     * @returns {void}
     */
    resolveWall (entity) {
        if (entity.vx !== entity.last.vx) {
            // const nextX = this.getLogicXAt(entity.x)
        }
    }

    /**
     * Determine if there is a collision on X axis
     * @param {number} posX: position X
     * @param {number} nextX: position X needed
     * @param {number} ymin: position Y Min
     * @param {number} ymax: position Y Max
     * @param {number} width: width of the object
     * @returns {number} get the position x
     */
    getLogicXAt (posX, nextX, ymin, ymax, width) {
        if (!this.parent.tilemap || (this.parent.tilemap && !this.parent.tilemap.sprite)) {
            return nextX;
        }

        const orientation   = nextX > posX ? 1 : -1,
            cellXMin        = orientation > 0 ? Math.floor((posX + width) / this.parent.tilemap.tilewidth) : Math.floor(posX / this.parent.tilemap.tilewidth) - 1,
            cellXMax        = orientation > 0 ? Math.floor((nextX + width) / this.parent.tilemap.tilewidth) : Math.floor(nextX / this.parent.tilemap.tileheight),
            cellYMin        = Math.floor(Math.abs(ymin) / this.parent.tilemap.tileheight),
            cellYMax        = Math.floor(Math.abs(ymax - 1) / this.parent.tilemap.tileheight),
            grid            = this.parent.tilemap.grid.logic;

        let cellY           = null;

        const loopParameter = {
            start: orientation > 0 ? cellXMax : cellXMin,
            end: orientation > 0 ? cellXMin : cellXMax
        };

        for (let y = cellYMin; y <= cellYMax; y++) {
            cellY = grid[y];

            if (!cellY) {
                continue;
            }

            for (let x = loopParameter.start; x !== (loopParameter.end + orientation); x += orientation) {
                if (cellY[x]) {
                    return orientation > 0 ? (x * this.parent.tilemap.tilewidth) - width : (x + 1) * this.parent.tilemap.tilewidth;
                }
            }
        }

        return nextX;
    }

    /**
     * Determine if there is a collision on y axis
     * @param {number} posY : Y axis
     * @param {number} nextY : Y axis position needed
     * @param {number} xmin : X Min
     * @param {number} xmax : X Max
     * @param {number} height : height of the object
     * @returns {number} get the position y
     */
    getLogicYAt (posY, nextY, xmin, xmax, height) {
        if (!this.parent.tilemap || (this.parent.tilemap && !this.parent.tilemap.sprite)) {
            return nextY;
        }

        const orientation   = nextY > posY ? 1 : -1,
            cellYMin        = orientation > 0 ? Math.floor((posY + height) / this.parent.tilemap.tileheight) : Math.floor(nextY / this.parent.tilemap.tileheight),
            cellYMax        = orientation > 0 ? Math.floor((nextY + height) / this.parent.tilemap.tileheight) : Math.floor(posY / this.parent.tilemap.tileheight),
            cellXMin        = Math.floor(Math.abs(xmin) / this.parent.tilemap.tilewidth),
            cellXMax        = Math.floor(Math.abs(xmax - 1) / this.parent.tilemap.tilewidth);

        let grid            = null;

        const loopParameter = {
            start: orientation > 0 ? cellYMin : cellYMax,
            end: orientation > 0 ? cellYMax : cellYMin
        };

        for (let y = loopParameter.start; y !== (loopParameter.end + orientation); y += orientation) {
            grid = this.parent.tilemap.grid.logic[y];

            if (!grid) {
                continue;
            }

            for (let x = cellXMin; x <= cellXMax; x++) {
                if (grid[x]) {
                    return orientation > 0
                        ? (y * this.parent.tilemap.tileheight) - height
                        : (y + 1) * this.parent.tilemap.tileheight;
                }
            }
        }

        return nextY;
    }
}
