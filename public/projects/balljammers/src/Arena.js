import Scene from "src/Scene";

import Ball from "./Ball";
import Goal from "./Goal";

import PlayerCat from "./Player/Cat";

import tilemapGrass from "./../tilemaps/grass.json";


export default class Arena extends Scene {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            gravity : 2000,
            spawnX  : 100
        });
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.setTilemap(tilemapGrass);
        this.addEntity(new Ball(), 0, 0, { debug: true });
        this.addEntity(new Goal(), this.props.width - 45, 320, { flip: true });
        this.addEntity(new Goal(), 0, 320);

        window.player = this.player = this.addEntity(new PlayerCat(), this.props.spawnX, 320);
        this.enemy = this.addEntity(new PlayerCat(), this.props.width - this.props.spawnX, 320);

        this.player.setPlayerLeft();
        this.enemy.setPlayerRight();
    }

    /*
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
    */
}
