import { Body, CircularBody, RectangularBody } from "./Body";
import { Enum } from "./Enum";
import { Scene } from '../Scene';
import { Entity } from '../Entity';


/**
 * resolve the direction by constraint
 * @param {string} directionConstraint: constraint of direction
 * @param {number} x: position x of the first shape
 * @param {number} y: position y of the first shape
 * @param {number} width: width of the first shape
 * @param {number} height: height of the first shape
 * @param {Entity} entity: entity to check
 * @returns {boolean} if true, the target is constrained by constraint direction of the wall
 */
const resolveDirectionConstraint = (
    directionConstraint: string,
    x: number, y: number,
    width: number, height: number,
    entity: Entity): boolean => {
    switch (directionConstraint) {
        case "upper": return entity.lastPos.y < entity.props.y && entity.props.y < y;
        case "lower": return entity.lastPos.y > entity.props.y && entity.props.y + entity.props.height > y;
        default: return true;
    }
};


/**
 * Create a wall with the body box corresponding
 * @param {Scene} scene: the scene of the body
 * @param {*} box: box enumeration
 * @param {number} x: position x
 * @param {number} y: position y
 * @param {number} width: width of the wall
 * @param {number} height: height of the wall
 * @param {string=} directionConstraint: constraint of direction
 * @returns {*} Body corresponding to the wall
 */
export const createWall = (
        scene: Scene,
        box: any,
        x: number, y: number,
        width: number, height: number,
        directionConstraint?: string
    ) => {
    const settings = {
        mass: 0,
        gravityScale: 0,
        fixedX: true,
        fixedY: true,
        group: Enum.GROUP.GROUND,
        material: scene.WallMaterial
    };
    let body = null;

    switch (box) {
        case Enum.BOX.CIRCLE: body = new CircularBody(scene, x, y, width, settings);
            break;
        default: body = new RectangularBody(scene, x, y, width, height, settings);
            break;
    }

    scene.world.addBody(body.data);

    body.directionConstraint        = directionConstraint;
    body.isConstrainedByDirection   = entity => !resolveDirectionConstraint(body.directionConstraint, body.x, body.y, body.width, body.height, entity);

    return body;
};
