import { Scene, Sprite } from "sideral/Module";
import { Color, Assets } from "sideral/Tool";
import { Dialog } from "sideral/Graphic";

import { Arena } from "./../Scenes";
import { ButtonExtended } from "./../ButtonExtended";


Assets.preload("title", "images/titlescreen.png");


export class Title extends Scene {

    /* ATTRIBUTES */

    /**
     * Background of the title screen
     */
    background: Sprite;

    /**
     * Button play
     */
    buttonPlay: ButtonExtended;

    /**
     * Button for options
     */
    buttonOptions: ButtonExtended;

    /**
     * Dialog for options
     */
    dialogOptions: Dialog;


    /* LIFECYCLE */

    /**
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.props.backgroundColor = Color.black;

        this.background = <Sprite> this.add(new Sprite(), {
            width: this.props.width,
            height: this.props.height,
            imageId: "title"
        });

        this.buttonPlay = <ButtonExtended> this.spawn(new ButtonExtended(), (this.props.width / 2) - 50 - 52, this.props.height - 100, {
            label: {
                text: "Play"
            }
        });

        this.buttonOptions = <ButtonExtended> this.spawn(new ButtonExtended(), (this.props.width / 2) + 50, this.props.height - 100, {
            label: {
                text: "Options"
            }
        });

        this.buttonPlay.signals.click.add(this.onClickPlay.bind(this));
        this.buttonOptions.signals.click.add(this.onClickOptions.bind(this));
    }


    /* EVENTS */

    onClickPlay (): void {
        const game = this.context.game;

        this.fade("out", Color.black, 1000, () => {
            this.kill();
            game.add(new Arena());
        });
    }

    onClickOptions (): void {
        if (this.dialogOptions) {
            this.dialogOptions.kill();
            this.dialogOptions = null;

            return null;
        }

        this.dialogOptions = <Dialog> this.spawn(new Dialog(), 150, 150, {
            paddingHorizontal: 10,
            paddingVertical: 10,
            width: 200,
            height: 300,

            label: {
                text: "Options",
                fill: Color.white
            },

            shape: {
                stroke: Color.amber500,
                strokeThickness: 2,
                fill: Color.black,
                fillAlpha: 0.5
            }
        });
    }
}