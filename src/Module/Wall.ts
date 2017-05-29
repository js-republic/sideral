import { Material } from "p2";

import { Physic } from "./../Module/Physic";
import { Shape } from "./Shape";
import { Enum } from "./../Tool/";
import { Module } from "./../Module";
import { Entity } from "./../Entity";
import { IWallProps } from "./../Interface";


/**
 * Module for wall tilemap
 */
export class Wall extends Module {

    /* ATTRIBUTES */

    /**
     * Properties of a Wall
     */
    props: IWallProps;

    /**
     * Group of wall
     */
    group: number = Enum.GROUP.GROUND;

    /**
     * Physic body of the wall
     * @readonly
     */
    physic: Physic;

    /**
     * Debug mode
     * @private
     */
    _debug: Shape;


    /* LIFECYCLE */

    /**
     * @initialize
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.physic = <Physic> this.spawn(new Physic(), this.props.x, this.props.y, {
            width   : this.props.width,
            height  : this.props.height,
            material: Wall.wallMaterial,
            owner   : this
        });
    }


    /* METHODS */

    /**
     * Set or unset the debug mode for a wall
     */
    toggleDebug (): void {
        if (this._debug) {
            this._debug.kill();
            this._debug = null;

        } else {
            this._debug = <Shape> this.add(new Shape(), {
                box     : this.props.box,
                width   : this.props.width,
                height  : this.props.height,
                stroke  : "#FF0000",
                fill    : "transparent"
            });
        }
    }

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
