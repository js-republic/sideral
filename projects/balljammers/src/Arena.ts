import { World } from "../../../src/Scene/World";
import { currentGame } from "../../../src/Game";

import { Ball } from "./Ball";
import { Goal } from "./Goal";

import PlayerCat from "./Player/Cat/Cat";

import tilemapGrass from "../tilemaps/grass.json";


export default class Arena extends World {
    playerLeft: PlayerCat;
    playerRight: PlayerCat;

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        // props
        this.setProps({
            gravity : 150,
            spawnX  : 100
        });

        // read-only
        this.playerLeft     = null;
        this.playerRight    = null;

        // signals
        currentGame.signals.keyPress.bind(currentGame.KEY.Q, pressed => this.playerLeft && this.playerLeft.moveLeft(pressed));
        currentGame.signals.keyPress.bind(currentGame.KEY.D, pressed => this.playerLeft && this.playerLeft.moveRight(pressed));
        currentGame.signals.keyPress.bind(currentGame.KEY.Z, pressed => this.playerLeft && this.playerLeft.jump(pressed));
        currentGame.signals.keyPress.bind(currentGame.KEY.S, pressed => this.playerLeft && this.playerLeft.fall(pressed));
        currentGame.signals.keyPress.bind(currentGame.KEY.SPACE, pressed => pressed && this.playerLeft && this.playerLeft.attack());

        currentGame.signals.keyPress.bind(currentGame.KEY.ARROW_LEFT, pressed => this.playerRight && this.playerRight.moveLeft(pressed));
        currentGame.signals.keyPress.bind(currentGame.KEY.ARROW_RIGHT, pressed => this.playerRight && this.playerRight.moveRight(pressed));
        currentGame.signals.keyPress.bind(currentGame.KEY.ARROW_UP, pressed => this.playerRight && this.playerRight.jump(pressed));
        currentGame.signals.keyPress.bind(currentGame.KEY.ARROW_DOWN, pressed => this.playerRight && this.playerRight.fall(pressed));
        currentGame.signals.keyPress.bind(currentGame.KEY.ENTER, pressed => pressed && this.playerRight && this.playerRight.attack());
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.setTilemap(tilemapGrass);
        this.addEntity(new Ball(), 100, 100);

        this.addEntity(new Goal(), 0, 448 - 130);
        this.addEntity(new Goal(), this.props.width - 45, 448 - 130, { debug: true, flip: true });

        const leftPlayer = new PlayerCat();
        const rightPlayer = new PlayerCat();

        this.playerLeft = <PlayerCat> this.addEntity(leftPlayer, this.props.spawnX, 150, { playerLeft: true });
        this.playerRight = <PlayerCat> this.addEntity(rightPlayer, this.props.width - this.props.spawnX - 150, 320, { playerRight: true });

        (<any>window).scene = this;
    }
}
