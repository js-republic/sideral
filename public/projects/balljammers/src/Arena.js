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

        this.setTilemap(tilemapArena);

        this.compose(this.player, { name: "player", x: this.spawnX, y: this.height / 2, onLeft: true }).
            compose(this.enemy, { name: "enemy", x: this.width - this.spawnX, y: this.height / 2, onLeft: false }).
            compose(new Ball(), { x: 200, y: 100 }, ball => window.ball = ball).
            compose(new ZoneGoal(), { x: 0, y: 32 }).
            compose(new ZoneGoal(), { x: this.width - 32, y: 32 }).
            compose(new ZoneFilet(), { x: (this.width / 2) - 16, y: 32 });
    }

    /**
     * @update
     * @override
     */
    update () {
        super.update();

        this.updatePlayerKeyboard();
        this.updateEnemyKeyboard();
    }

    updatePlayerKeyboard () {
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

        if (Engine.keyboard.isPressed(Engine.keyboard.KEY.M)) {
            this.player.attack();
        }
    }

    updateEnemyKeyboard () {
        if (!this.enemy) {
            return null;
        }

        let vx = 0,
            vy = 0;

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.D)) {
            vx += this.enemy.speed;
        }

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.Q)) {
            vx -= this.enemy.speed;
        }

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.Z)) {
            vy -= this.enemy.speed;
        }

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.S)) {
            vy += this.enemy.speed;
        }

        if (this.enemy.vx !== vx) {
            this.enemy.vx = vx;
        }

        if (this.enemy.vy !== vy) {
            this.enemy.vy = vy;
        }

        if (Engine.keyboard.isPressed(Engine.keyboard.KEY.C)) {
            this.enemy.attack();
        }
    }
}
