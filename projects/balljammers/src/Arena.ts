import { Scene } from "../../../src/Scene";
import { currentGame } from "../../../src/Game";

import { Ball } from "./Ball";
import { Goal } from "./Goal";

import { PlayerCat } from "./Player/Cat/Cat";

import * as tilemapGrass from "../tilemaps/grass.json";


export class Arena extends Scene {
    playerLeft: PlayerCat;
    playerRight: PlayerCat;

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        let cg = currentGame;

        // props
        this.setProps({
            gravity : 150,
            spawnX  : 100
        });

        // read-only
        this.playerLeft     = null;
        this.playerRight    = null;

        // signals
        cg.signals.keyPress.bind(cg.KEY.Q, pressed => this.playerLeft && this.playerLeft.moveLeft(pressed));
        cg.signals.keyPress.bind(cg.KEY.D, pressed => this.playerLeft && this.playerLeft.moveRight(pressed));
        cg.signals.keyPress.bind(cg.KEY.Z, pressed => this.playerLeft && this.playerLeft.jump(pressed));
        cg.signals.keyPress.bind(cg.KEY.S, pressed => this.playerLeft && this.playerLeft.fall(pressed));
        cg.signals.keyPress.bind(cg.KEY.SPACE, pressed => pressed && this.playerLeft && this.playerLeft.attack());

        cg.signals.keyPress.bind(cg.KEY.ARROW_LEFT, pressed => this.playerRight && this.playerRight.moveLeft(pressed));
        cg.signals.keyPress.bind(cg.KEY.ARROW_RIGHT, pressed => this.playerRight && this.playerRight.moveRight(pressed));
        cg.signals.keyPress.bind(cg.KEY.ARROW_UP, pressed => this.playerRight && this.playerRight.jump(pressed));
        cg.signals.keyPress.bind(cg.KEY.ARROW_DOWN, pressed => this.playerRight && this.playerRight.fall(pressed));
        cg.signals.keyPress.bind(cg.KEY.ENTER, pressed => pressed && this.playerRight && this.playerRight.attack());
    }

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props: any) {
        super.initialize(props);

        console.log(tilemapGrass);
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
