import { Scene } from "./../Scene";
import { Game } from "./../Game";


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
}