import { Scene } from "./../Module";
import { Game } from "./../SideralObject";


/**
 * Interface for context
 */
export interface IContext {

    /**
     * The game linked to the current SideralObject
     */
    game?: Game;

    /**
     * The scene linked to the current SideralObject
     */
    scene?: Scene;

    /**
     * Add your own context (useful for global data)
     */
    [key: string]: any;
}