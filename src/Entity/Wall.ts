import { Material } from "p2";

import { Entity, Physic } from "./../Entity";

import { Enum } from "./../Tool/";
import { IWallProps } from "./../Interface/";


/**
 * Module for wall tilemap
 */
export class Wall extends Entity {

    /* ATTRIBUTES */

    /**
     * Properties of a Wall
     */
    props: IWallProps;


    /* LIFECYCLE */

    /**
     * @initialize
     * @override
     */
    initialize (props) {
        this.setProps({
            gravityFactor   : 0,
            box             : Enum.BOX.RECTANGLE,
            type            : Enum.TYPE.STATIC,
            group           : Enum.GROUP.GROUND
        });

        super.initialize(props);
    }


    /* METHODS */

    /**
     * Know if the entity is constrained by the DirectionConstraint
     * @param entity - The entity to check
     * @returns If the entity is constrained by the DirectionConstraint
     */
    isConstrainedByDirection (entity: Entity) {
        return !this.resolveDirectionConstraint(this.props.directionConstraint, this.props.x, this.props.y, this.props.width, this.props.height, entity);
    }

    /**
     * resolve the direction by constraint
     * @param directionConstraint - constraint of direction
     * @param x - position x of the first shape
     * @param y - position y of the first shape
     * @param width - width of the first shape
     * @param height - height of the first shape
     * @param entity - entity to check
     * @returns If true, the target is constrained by constraint direction of the wall
     */
    resolveDirectionConstraint (directionConstraint: string, x: number, y: number, width: number, height: number, entity: Entity) {
        switch (directionConstraint) {
            case "upper": return entity.props.y < y;
            case "lower": return entity.last.y > entity.props.y && entity.props.y + entity.props.height > y && (entity.props.y + (entity.props.height / 2)) >= (y + height);
            default: return true;
        }
    }


    /* STATICS */

    /**
     * Default material for Wall
     */
    static wallMaterial = new Material(Wall.generateId());
}
