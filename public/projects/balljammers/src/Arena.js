import Engine from "src/Engine";
import Scene from "src/Scene";

import Player from "./Player";
import tilemapArena from "./../tilemaps/arena";


export default class Arena extends Scene {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    initialize () {
        super.initialize();

        this.tilemap    = tilemapArena;
        this.player     = new Player();
        window.player   = this.player;

        this.compose(this.player, { debug: true, z: 0 });
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
