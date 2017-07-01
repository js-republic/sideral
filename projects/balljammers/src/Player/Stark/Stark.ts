import { Player } from "../Player";
import { Assets } from "sideral/Tool";


Assets.preload("stark", "images/characters/stark.png")
    .preload("stark-portrait", "images/characters/stark-portrait.png")
    .preload("stark-idle", "images/characters/stark-idle.png");


export class Stark extends Player {

    /* ATTRIBUTES */

    static CHARACTER_ID: string = "stark";

    static SPEED: number = 200;

    static POWER: number = 375;

    static SPELL: string = "Shoots and stun";

    static IMAGE_IDLE: string = "stark-idle";

    static IMAGE_PORTRAIT: string = "stark-portrait";


    /* LIFECYCLE */

    /**
     * @constructor
     * @param {boolean=} red - Set to true if you want the cat in red color
     */
    constructor (red?: boolean) {
        super();

        this.setProps({
            width: 25,
            height: 45
        });

        this.addSprite(red ? "redcat" : "cat", 65, 65, { x: -20, y: -14 })
            .addAnimation("idle", 50, [18, 19, 20, 21, 22, 23, 24, 25, 26, 27])
            .addAnimation("run", 45, [36, 37, 38, 39, 40, 41, 42, 43])
            .addAnimation("jump", 55, [0, 1, 2, 3, 4, 5, 6, 7], 0)
            .addAnimation("attack", 45, [28, 29, 30, 31, 32]);
    }
}
