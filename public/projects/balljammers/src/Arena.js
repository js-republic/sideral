import Engine from "src/Engine";
import Scene from "src/Scene";

import Player from "./Player";
import Ball from "./Ball";
import { ZoneGoal, ZoneFilet } from "./Zone";
import tilemapArena from "./../tilemaps/arena";


export default class Arena extends Scene {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    initialize () {
        super.initialize();

        this.player     = new Player();
        window.player   = this.player;

        this.setTilemap(tilemapArena);

        this.compose(this.player, { debug: true, x: 100, y: 100, z: 0 }).
            compose(new Ball(), { debug: true, x: 200, y: 100 }).
            compose(new Ball(), { debug: true, x: 350, y: 200 }).
            compose(new ZoneGoal(), { debug: true, x: 0, y: 32 }).
            compose(new ZoneGoal(), { debug: true, x: this.width - 32, y: 32 }).
            compose(new ZoneFilet(), { debug: false, x: (this.width / 2) - 16, y: 32 });
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
            vx += this.player.speed;
        }

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_LEFT)) {
            vx -= this.player.speed;
        }

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_UP)) {
            vy -= this.player.speed;
        }

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_DOWN)) {
            vy += this.player.speed;
        }

        if (this.player.vx !== vx) {
            this.player.vx = vx;
        }

        if (this.player.vy !== vy) {
            this.player.vy = vy;
        }
    }
}
