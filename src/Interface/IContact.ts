import { Entity } from "./../Entity";


/**
 * The contact information between two bodies
 */
export interface IBodyContact {

    /**
     * The id of the body
     */
    bodyId: number;

    /**
     * Know if the body is above the target
     */
    isAbove: boolean;
}


/**
 * Contact of two bodies
 */
export interface IContact {

    /**
     * The entity corresponding of the body A (if it is null, the body A corresponds to a Wall Module)
     */
    entityA?: Entity;

    /**
     * The entity corresponding of the body B (if it is null, the body B corresponds to a Wall Module)
     */
    entityB?: Entity;

    /**
     * The contact informations between A and B relative to the body A
     */
    contactA: IBodyContact;

    /**
     * The contact informations between A and B relative to the body B
     */
    contactB: IBodyContact;
}
