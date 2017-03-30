import Engine from "src/Engine";
import Scene from "src/Scene";

import Player from "./Player";
import Ball from "./Ball";
import { ZoneGoal } from "./Zone";
import tilemapArena from "./../tilemaps/arena";
import tilemapGrass from "./../tilemaps/grass.json";


export default class Arena extends Scene {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    initialize () {
        super.initialize();

        this.gravity    = 10;
        this.spawnX     = 57;
        this.player     = new Player();
        this.enemy      = new Player();
        this.ball       = new Ball();

        // this.setTilemap(tilemapArena);
        this.setTilemap(tilemapGrass);

        this.compose(this.player, { debug: true, name: "player", x: this.spawnX, y: this.height / 2, onLeft: true, ball: this.ball }).
            compose(this.enemy, { name: "enemy", x: this.width - this.spawnX, y: this.height / 2, onLeft: false }).
            compose(this.ball, { x: 200, y: 100, debug: true }, ball => window.ball = ball).
            compose(new ZoneGoal(), { x: 0, y: 32 }).
            compose(new ZoneGoal(), { x: this.width - 32, y: 32 });
    }

    /**
     * @update
     * @override
     */
    update () {
        super.update();

        this.updatePlayerKeyboard(this.player, "Z", "S", "Q", "D", "M");
        this.updatePlayerKeyboard(this.enemy, "ARROW_UP", "ARROW_DOWN", "ARROW_LEFT", "ARROW_RIGHT", "M");
    }

    updatePlayerKeyboard (player, keyUp, keyDown, keyLeft, keyRight, keyFire) {
        if (!player) {
            return null;
        }

        const left  = Engine.keyboard.isHeld(Engine.keyboard.KEY[keyLeft]) ? -1 : 0,
            right   = Engine.keyboard.isHeld(Engine.keyboard.KEY[keyRight]) ? 1 : 0,
            top     = Engine.keyboard.isHeld(Engine.keyboard.KEY[keyUp]) ? -1 : 0,
            down    = Engine.keyboard.isHeld(Engine.keyboard.KEY[keyDown]) ? 1 : 0,
            x       = left + right,
            y       = top + down;

        if (player.currentMove.x !== x || player.currentMove.y !== y) {
            player.move(x, y);
        }

        if (Engine.keyboard.isPressed(Engine.keyboard.KEY[keyFire])) {
            player.attack();
        }
    }
}
