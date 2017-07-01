/**
 * Options of a transition
 */
export interface ITransition {

    /**
     * The start value of the transition
     */
    from?: any;

    /**
     * The end value of the transition
     */
    to?: any;

    /**
     * Function to be called after the transition
     */
    complete?: Function;

    /**
     * Function to be called each update of the transition
     */
    update?: Function;

    /**
     * Function to be called when the transition is starting
     */
    start?: Function;    
}