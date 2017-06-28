import { Scene, Text, Sprite } from "sideral/Module";
import { Assets, Color } from "sideral/Tool";

import { Title } from "./../Scenes";


Assets.preloadSound("jsrbass", "sounds/jsrbass.wav")
    .preloadSound("bass", "sounds/bass.wav");


export class Intro extends Scene {

    /* ATTRIBUTES */

    /**
     * Sprite to show images
     */
    sprite: Sprite;

    /**
     * Text for "presents"
     */
    textPresents: Text;


    /* LIFECYCLE */

    initialize (props): void {
        super.initialize(props);

        this.sprite = <Sprite> this.spawn(new Sprite(), this.props.width / 2, this.props.height / 2, {
            spritesheet: false,
            opacity: 0,
            centered: true
        });

        this.textPresents = <Text> this.spawn(new Text(), this.props.width / 2, this.props.height / 2, {
            text: "Presents",
            centered: true,
            fill: Color.white,
            opacity: 0
        });

        this.timers.addTimer("wait", 250, () => {
            this.showImage("jsRepublic", "jsrbass", () => {
                this.showImage("sideral", "bass", () => {
                    this.showPresents();
                });
            }, 1300);
        });
    }


    /* METHODS */

    /**
     * Show an image
     * @param imageId - Id of the image
     * @param soundId - Sound to play
     * @param after - After callback
     * @param wait - Time to wait before fadeIn the image
     */
    showImage (imageId: string, soundId: string, after: Function, wait: number = 500): void {
        this.sprite.props.imageId = imageId;

        Assets.getSound().play(soundId);

        this.sprite.addTransition("opacity", 500, {
            from: 0,
            to: 1,
            complete: () => {
                this.timers.addTimer("wait", wait, () => {
                    this.sprite.addTransition("opacity", 300, {
                        to: 0,
                        complete: after.bind(this)
                    });
                });
            }
        });
    }

    /**
     * Show the text "presents"
     */
    showPresents (): void {
        Assets.getSound().play("bass");

        this.textPresents.addTransition("opacity", 500, {
            to: 1,
            complete: () => {
                this.timers.addTimer("wait", 500, () => {
                    this.sprite.addTransition("opacity", 300, {
                        to: 0,
                        complete: () => {
                            this.context.game.swapScene(this, new Title(), Color.black, 500);
                        }
                    });
                });
            }
        })
    }
}
