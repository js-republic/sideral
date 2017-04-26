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
            gravity : 100,
            spawnX  : 100
        });

        Game.signals.keyPress.bind(Game.KEY.Q, pressed => this.onPressLeft(this.playerLeft, pressed));
        Game.signals.keyPress.bind(Game.KEY.D, pressed => this.onPressRight(this.playerLeft, pressed));
        Game.signals.keyPress.bind(Game.KEY.Z, pressed => this.onPressJump(this.playerLeft, pressed));
        Game.signals.keyPress.bind(Game.KEY.ARROW_LEFT, pressed => this.onPressLeft(this.playerRight, pressed));
        Game.signals.keyPress.bind(Game.KEY.ARROW_RIGHT, pressed => this.onPressRight(this.playerRight, pressed));
        Game.signals.keyPress.bind(Game.KEY.ARROW_UP, pressed => this.onPressJump(this.playerRight, pressed));
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

        /*
        this.addEntity(new Goal(), this.props.width - 45, 448 - 130, { flip: true });
        this.addEntity(new Goal(), 0, 448 - 130);

        this.playerLeft     = this.addEntity(new PlayerCat(), this.props.spawnX, 150, { playerLeft: true, debug: true, speed: 300 });
        this.playerRight    = this.addEntity(new PlayerCat(), this.props.width - this.props.spawnX - 150, 320, { playerRight: true });
        */

        window.scene = this;
    }


    /* METHODS */

    /**
     * @event key left
     * @param {*} player: Current player impacted by the key
     * @param {boolean} pressed: if it is pressed
     * @returns {void}
     */
    onPressLeft (player, pressed) {
        if (player) {
            player.moveLeft(pressed);
        }
    }

    /**
     * @event key right
     * @param {*} player: Current player impacted by the key
     * @param {boolean} pressed: if it is pressed
     * @returns {void}
     */
    onPressRight (player, pressed) {
        if (player) {
            player.moveRight(pressed);
        }
    }

    /**
     * @event key jump
     * @param {*} player: Current player impacted by the key
     * @param {boolean} pressed: if it is pressed
     * @returns {void}
     */
    onPressJump (player, pressed) {
        if (player) {
            player.jump(pressed);
        }
    }
}
