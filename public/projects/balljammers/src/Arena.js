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

        /*
        Game.signals.keyPress.bind(Game.KEY.Q, pressed => this.playerLeft && this.playerLeft.moveLeft(pressed));
        Game.signals.keyPress.bind(Game.KEY.D, pressed => this.playerLeft && this.playerLeft.moveRight(pressed));
        Game.signals.keyPress.bind(Game.KEY.Z, pressed => this.playerLeft && this.playerLeft.jump(pressed));
        Game.signals.keyPress.bind(Game.KEY.ARROW_LEFT, pressed => this.playerRight && this.playerRight.moveLeft(pressed));
        Game.signals.keyPress.bind(Game.KEY.ARROW_RIGHT, pressed => this.playerRight && this.playerRight.moveRight(pressed));
        Game.signals.keyPress.bind(Game.KEY.ARROW_UP, pressed => this.playerRight && this.playerRight.jump(pressed));
        */
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.setTilemap(tilemapGrass);
        this.addEntity(new Ball(), 0, 0);

        this.addEntity(new Goal(), 0, 448 - 130);
        this.addEntity(new Goal(), this.props.width - 45, 448 - 130, { debug: true, flip: true });

        this.playerLeft     = this.addEntity(new PlayerCat(), this.props.spawnX, 150, { playerLeft: true, speed: 300 });
        this.playerRight    = this.addEntity(new PlayerCat(), this.props.width - this.props.spawnX - 150, 320, { playerRight: true });

        window.scene = this;
    }


    /* METHODS */
}
