import Scene from "src/Scene";
import Tilemap from "src/Component/Tilemap";
import Engine from "src/Engine";

import LevelArena from "./../../maps/arena.json";
import { PlayerChris } from "./../Player";


export default class Arena extends Scene {

    /* LIFECYCLE */

    /**
     * @initialize
     * @override
     */
    initialize (parent) {
        super.initialize(parent);

        this.player = new PlayerChris({ x: 60, y: Math.floor(this.height / 2) });
        this.compose(new Tilemap(LevelArena)).compose(this.player);
    }

    /**
     * @update
     * @override
     */
    update () {
        super.update();

        this.player.direction.x = 0;
        this.player.direction.y = 0;

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_LEFT)) {
            this.player.direction.x--;
        }

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_RIGHT)) {
            this.player.direction.x++;
        }

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_UP)) {
            this.player.direction.y--;
        }

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_DOWN)) {
            this.player.direction.y++;
        }
    }
}
