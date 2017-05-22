import { Scene } from "../../../src/Scene";
import { Enum } from "src/Tool/Enum";
import { Particles } from "src/Entity/Particles";

import { Ball } from "./Ball";
import { Goal } from "./Goal";

import { PlayerCat } from "./Player/Cat/Cat";

import * as tilemapGrass from "../tilemaps/grass.json";
import * as fireConfig from "./Particles/flame.json";


export class Arena extends Scene {

    /* ATTRIBUTES */

    ball: Ball;
    goalLeft: Goal;
    goalRight: Goal;
    playerLeft: PlayerCat;
    playerRight: PlayerCat;
    flameParticles: Particles;


    /* LIFECYCLE */

    /**
     * @initialize
     * @lifecycle
     * @override
     */
    initialize (props: any) {
        super.initialize(props);
        this.setTilemap(tilemapGrass);

        this.props.gravity  = 2000;
        this.props.spawnX   = 100;

        const cg = this.context.game;

        // signals
        cg.signals.keyPress.bind(Enum.KEY.Q, pressed => this.playerLeft && this.playerLeft.moveLeft(pressed));
        cg.signals.keyPress.bind(Enum.KEY.D, pressed => this.playerLeft && this.playerLeft.moveRight(pressed));
        cg.signals.keyPress.bind(Enum.KEY.Z, pressed => this.playerLeft && this.playerLeft.jump(pressed));
        cg.signals.keyPress.bind(Enum.KEY.S, pressed => this.playerLeft && this.playerLeft.fall(pressed));
        cg.signals.keyPress.bind(Enum.KEY.SPACE, pressed => pressed && this.playerLeft && this.playerLeft.attack());

        cg.signals.keyPress.bind(Enum.KEY.ARROW_LEFT, pressed => this.playerRight && this.playerRight.moveLeft(pressed));
        cg.signals.keyPress.bind(Enum.KEY.ARROW_RIGHT, pressed => this.playerRight && this.playerRight.moveRight(pressed));
        cg.signals.keyPress.bind(Enum.KEY.ARROW_UP, pressed => this.playerRight && this.playerRight.jump(pressed));
        cg.signals.keyPress.bind(Enum.KEY.ARROW_DOWN, pressed => this.playerRight && this.playerRight.fall(pressed));
        cg.signals.keyPress.bind(Enum.KEY.ENTER, pressed => pressed && this.playerRight && this.playerRight.attack());

        this.ball           = <Ball>this.addEntity(new Ball(), 100, 100);
        this.goalLeft       = <Ball>this.addEntity(new Goal(), 0, 448 - 130);
        this.goalRight      = <Goal>this.addEntity(new Goal(), this.props.width - 45, 448 - 130, { debug: true, flip: true });
        this.playerLeft     = <PlayerCat> this.addEntity(new PlayerCat(), this.props.spawnX, 150, { playerLeft: true });
        this.playerRight    = <PlayerCat> this.addEntity(new PlayerCat(true), this.props.width - this.props.spawnX - 150, 320, { playerRight: true });

        this.flameParticles = this.add(new Particles(), {
            images  : ["images/particles/bolt.png", "images/particles/fire.png"],
            config  : fireConfig,
            autoRun : false
        });

        (<any>window).scene = this;
    }


    /* METHODS */

    /**
     * When there is a new goal
     * @param goalSide
     */
    goal (goalSide) {
        this.shake(50);

        const width = 20;

        // TODO: TimeSlower - https://github.com/myvertigo/rts/blob/dev/public/snaga/lib/plugins/timeslower.js

        this.flameParticles.position(this.ball.props.x + (goalSide.props.flip ? this.ball.props.width + 20 : -20), this.ball.props.y + (this.ball.props.height / 2));
        this.flameParticles.run();

        this.timers.add("goal", 3000, () => {
            this.ball.respawn();
            this.flameParticles.stop();
        });
    }
}
