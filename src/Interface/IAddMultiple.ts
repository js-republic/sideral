import { SideralObject } from "../SideralObject";


export interface IAddMultiple {

    /**
     * The item to add
     */
    item: SideralObject;

    /**
     * Z-index of the object
     */
    z?: number;

    /**
     * Props to merge to the item
     */
    props?: any;

    /**
     * Name of the variable of the instance to assign the item
     */
    assign?: string;

    /**
     * Called after the item has been added
     */
    callback?: Function;
}

export interface ISpawnMultiple extends IAddMultiple {

    /**
     * The position in x axis
     */
    x: number;

    /**
     * The position in y axis
     */
    y: number;

    /**
     * The z index of the item
     */
    z?: number;
}
