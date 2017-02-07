import Engine from "src/Engine";
import Scene from "src/Scene";

import Player from "./Player";
import Ball from "./Ball";
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

        this.compose(this.player, { debug: true, z: 0 }).
            compose(new Ball(), { debug: true, x: 200, y: 100 });
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

        let vx = 0,
            vy = 0;

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_RIGHT)) {
            vx += 100;
        }

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_LEFT)) {
            vx -= 100;
        }

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_UP)) {
            vy = -100;
        }

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_DOWN)) {
            vy += 100;
        }

        if (this.player.vx !== vx) {
            this.player.vx = vx;
        }

        if (this.player.vy !== vy) {
            this.player.vy = vy;
        }
    }
}
