import { Player } from "../Player";
import { Assets } from "sideral/Tool";


Assets.preload("redcat", "images/characters/redcat.png")
    .preload("cat", "images/characters/cat.png")
    .preload("cat-portrait", "images/characters/cat-portrait.png")
    .preload("cat-idle", "images/characters/cat-idle.png");


export class Cat extends Player {

    /* ATTRIBUTES */

    static CHARACTER_ID: string = "cat";

    static SPEED: number = 250;

    static POWER: number = 300;

    static SPELL: string = "Teleports behind the ball";

    static IMAGE_IDLE: string = "cat-idle";

    static IMAGE_PORTRAIT: string = "cat-portrait";


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
