import { Material } from "p2";

import { Body, CircularBody, RectangularBody } from "./../Tool/Body";
import { Enum } from "./../Tool/Enum";
import { Module } from "./../Module";
import { Entity } from "./../Entity";
import { IWallProps } from "./../Interface";


/**
 * Module for wall tilemap
 * TODO: Finish refactoring
 */
export class Wall extends Module {

    /* ATTRIBUTES */

    /**
     * Properties of a Wall
     */
    props: IWallProps;

    /**
     * Body of the wall
     * @readonly
     */
    body: Body;


    /* LIFECYCLE */

    /**
     * @initialize
     * @override
     */
    initialize (props) {
        super.initialize(props);

        const settings = {
            mass: 0, gravityScale: 0, fixedX: true, fixedY: true, group: Enum.GROUP.GROUND, material: Wall.wallMaterial
        };

        switch (this.props.box) {
            case Enum.BOX.CIRCLE: this.body = new CircularBody(this, this.props.x, this.props.y, this.props.width, settings);
                break;

            default: this.body = new RectangularBody(this, this.props.x, this.props.y, this.props.width, this.props.height, settings);
                break;
        }
    }


    /* METHODS */

    /**
     * Know if the entity is constrained by the DirectionConstraint
     * @param entity - The entity to check
     * @returns If the entity is constrained by the DirectionConstraint
     */
    isConstrainedByDirection (entity: Entity) {
        return !this.resolveDirectionConstraint(this.props.directionConstraint, this.body.x, this.body.y, this.body.width, this.body.height, entity);
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
            case "lower": return entity.lastPos.y > entity.props.y && entity.props.y + entity.props.height > y && (entity.props.y + (entity.props.height / 2)) >= (y + height);
            default: return true;
        }
    }


    /* STATICS */

    /**
     * Default material for Wall
     */
    static wallMaterial = new Material(Wall.generateId());
}
