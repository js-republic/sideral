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

        this.spawnX     = 57;
        this.player     = new Player();
        this.enemy      = new Player();
        this.ball       = new Ball();

        this.setTilemap(tilemapArena);

        this.compose(this.player, { name: "player", x: this.spawnX, y: this.height / 2, onLeft: true, ball: this.ball }).
            compose(this.enemy, { name: "enemy", x: this.width - this.spawnX, y: this.height / 2, onLeft: false }).
            compose(this.ball, { x: 200, y: 100 }, ball => window.ball = ball).
            compose(new ZoneGoal(), { x: 0, y: 32 }).
            compose(new ZoneGoal(), { x: this.width - 32, y: 32 }); //.
            // compose(new ZoneFilet(), { x: (this.width / 2) - 16, y: 32 });
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

        const pressLeft = Engine.keyboard.isPressed(Engine.keyboard.KEY[keyLeft]),
            pressRight  = Engine.keyboard.isPressed(Engine.keyboard.KEY[keyRight]),
            pressTop    = Engine.keyboard.isPressed(Engine.keyboard.KEY[keyUp]),
            pressDown   = Engine.keyboard.isPressed(Engine.keyboard.KEY[keyDown]),
            releaseLeft = Engine.keyboard.isReleased(Engine.keyboard.KEY[keyLeft]),
            releaseRight= Engine.keyboard.isReleased(Engine.keyboard.KEY[keyRight]),
            releaseTop  = Engine.keyboard.isReleased(Engine.keyboard.KEY[keyUp]),
            releaseDown = Engine.keyboard.isReleased(Engine.keyboard.KEY[keyDown]);

        if (pressLeft || pressRight || pressTop || pressDown || releaseLeft || releaseRight || releaseDown || releaseTop) {
            let xfactor = 0,
                yfactor = 0;

            if (pressLeft) {
                xfactor--;
            }

            if (pressRight) {
                xfactor++;
            }

            if (pressTop) {
                yfactor--;
            }

            if (pressDown) {
                yfactor++;
            }

            player.move(xfactor, yfactor);
        }

        if (Engine.keyboard.isPressed(Engine.keyboard.KEY[keyFire])) {
            player.attack();
        }
    }
}
