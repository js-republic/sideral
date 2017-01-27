import Tilemap from "src/Scene/Tilemap";

import Player from "./Player";
import arena from "./../tilemaps/arena";


export default class Arena extends Tilemap {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.tiledata = arena;

        this.player = new Player();

        window.player = this.player;
        this.compose(this.player, { debug: true });
    }

    /**
     * @update
     * @override
     */
    update () {
        super.update();

        if (!this.player) {
            return null;
        }

        if (Engine.keyboard.isPressed(Engine.keyboard.KEY.ARROW_RIGHT)) {
            this.player.x += 10;
        }

        if (Engine.keyboard.isPressed(Engine.keyboard.KEY.ARROW_LEFT)) {
            this.player.x -= 10;
        }

        if (Engine.keyboard.isPressed(Engine.keyboard.KEY.ARROW_UP)) {
            this.player.y -= 10;
        }

        if (Engine.keyboard.isPressed(Engine.keyboard.KEY.ARROW_DOWN)) {
            this.player.y += 10;
        }
    }
}