import Scene from "src/Scene";
import Game from "src/Game";

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
            gravity : 200,
            spawnX  : 100
        });

        Game.bind(Game.SIGNAL.KEY_PRESS(Game.KEY.Q), this.createAction(pressed => this.onPressLeft("left", pressed))).
            bind(Game.SIGNAL.KEY_PRESS(Game.KEY.D), this.createAction(pressed => this.onPressRight("left", pressed))).
            bind(Game.SIGNAL.KEY_PRESS(Game.KEY.Z), this.createAction(pressed => this.onPressJump("left", pressed))).
            bind(Game.SIGNAL.KEY_PRESS(Game.KEY.ARROW_LEFT), this.createAction(pressed => this.onPressLeft("right", pressed))).
            bind(Game.SIGNAL.KEY_PRESS(Game.KEY.ARROW_RIGHT), this.createAction(pressed => this.onPressRight("right", pressed))).
            bind(Game.SIGNAL.KEY_PRESS(Game.KEY.ARROW_UP), this.createAction(pressed => this.onPressJump("right", pressed)));
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

        this.playerLeft     = this.addEntity(new PlayerCat(), this.props.spawnX, 320);
        this.playerRight    = this.addEntity(new PlayerCat(), this.props.width - this.props.spawnX, 320);
    }


    /* METHODS */

    /**
     * @event key left
     * @param {string} playerSide: player left or right
     * @param {boolean} pressed: if it is pressed
     * @returns {void}
     */
    onPressLeft (playerSide, pressed) {
        const player = playerSide === "left" ? this.playerLeft : this.playerRight;

        if (player) {
            player.moveLeft(pressed);
        }
    }

    /**
     * @event key right
     * @param {string} playerSide: player left or right
     * @param {boolean} pressed: if it is pressed
     * @returns {void}
     */
    onPressRight (playerSide, pressed) {
        const player = playerSide === "left" ? this.playerLeft : this.playerRight;

        if (player) {
            player.moveRight(pressed);
        }
    }

    /**
     * @event key jump
     * @param {string} playerSide: player left or right
     * @param {boolean} pressed: if it is pressed
     * @returns {void}
     */
    onPressJump (playerSide, pressed) {
        const player = playerSide === "left" ? this.playerLeft : this.playerRight;

        if (player) {
            player.jump(pressed);
        }
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
