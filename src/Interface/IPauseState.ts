export interface IPauseState {

    /**
     * The position in x axis
     */
    x: number;

    /**
     * The position in y axis
     */
    y: number;

    /**
     * The velocity in x axis
     */
    vx: number;

    /**
     * The velocity in y axis
     */
    vy: number;

    /**
     * The gravity factor
     */
    gf: number;

    /**
     * The velocity in x axis of the p2.Body
     */
    bodyVx?: number;

    /**
     * The velocity in y axis of the p2.Body
     */
    bodyVy?: number;
}