import { Body, CircularBody, RectangularBody } from "./../Tool/Body";
import { Enum } from "./../Tool/Enum";
import { Module } from "./../Module";


export class Wall extends Module {

    /* ATTRIBUTES */

    body: Body;


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            box: null
        });
    }

    /**
     * @initialize
     * @override
     */
    initialize (props) {
        super.initialize(props);

        const settings = {
            mass: 0, gravityScale: 0, fixedX: true, fixedY: true, group: Enum.GROUP.GROUND, material: this.context.scene.WallMaterial
        };

        switch (this.props.box) {
            case Enum.BOX.CIRCLE: this.body = new CircularBody(this, this.props.x, this.props.y, this.props.width, settings);
                break;

            default: this.body = new RectangularBody(this, this.props.x, this.props.y, this.props.width, this.props.height, settings);
                break;
        }
    }

    isConstrainedByDirection (entity) {
        return !this.resolveDirectionConstraint(this.props.directionConstraint, this.body.x, this.body.y, this.body.width, this.body.height, entity);
    }

    /**
     * resolve the direction by constraint
     * @param {string} directionConstraint: constraint of direction
     * @param {number} x: position x of the first shape
     * @param {number} y: position y of the first shape
     * @param {number} width: width of the first shape
     * @param {number} height: height of the first shape
     * @param {number} entity: entity to check
     * @returns {boolean} if true, the target is constrained by constraint direction of the wall
     */
    resolveDirectionConstraint (directionConstraint, x, y, width, height, entity) {
        switch (directionConstraint) {
            case "upper":
                return entity.lastPos.y < entity.props.y && entity.props.y < y && (entity.props.y + (entity.props.height / 2)) <= y;
            case "lower":
                return entity.lastPos.y > entity.props.y && entity.props.y + entity.props.height > y && (entity.props.y + (entity.props.height / 2)) >= (y + height);
            default:
                return true;
        }
    }
}
