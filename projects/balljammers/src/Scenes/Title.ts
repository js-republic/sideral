import { Scene, Sprite, Text } from "sideral/Module";
import { Button } from "sideral/Graphic";
import { Color, Assets } from "sideral/Tool";

import { SelectCharater } from "./../Scenes";
import { DialogOptions } from "./../Dialogs";


Assets.preload("title-full", "images/titlescreen-full.png")
    .preload("title-ball", "images/titlescreen-ball.png")
    .preload("title-balljammers", "images/titlescreen-balljammers.png")
    .preloadSound("mainTheme", "sounds/mainTheme.mp3")
    .preloadSound("click", "sounds/click.wav");


export class Title extends Scene {

    /* ATTRIBUTES */

    /**
     * Background of the title screen
     */
    background: Sprite;

    /**
     * Button play for 1 player
     */
    buttonPlay1: Button;

    /**
     * Button play for 2 players
     */
    buttonPlay2: Button;

    /**
     * Button for options
     */
    buttonOptions: Button;

    /**
     * Dialog for options
     */
    dialogOptions: DialogOptions;


    /* LIFECYCLE */

    /**
     * @override
     */
    initialize (props) {
        super.initialize(props);

        Assets.getSound().playMusic("mainTheme", true);

        const midWidth  = this.props.width / 2,
            midHeight   = this.props.height / 2;

        this.props.backgroundColor = Color.black;

        this.background = <Sprite> this.add(new Sprite(), {
            width: this.props.width,
            height: this.props.height,
            imageId: "title-full"
        });

        this.buttonPlay1 = (<Button> this.spawn(new Button(), midWidth - 75, this.props.height - 225, {
            width: 200,
            height: 50
        })).text("label", {
            text: "Play - 1 player"
        });

        this.buttonPlay2 = (<Button> this.spawn(new Button(), midWidth - 75, this.props.height - 150, {
            width: 200,
            height: 50
        })).text("label", {
            text: "Play - 2 players"
        });

        this.buttonOptions = (<Button> this.spawn(new Button(), midWidth - 75, this.props.height - 75, {
            width: 200,
            height: 50
        })).text("label", {
            text: "Options"
        });


        this.dialogOptions = <DialogOptions> this.add(new DialogOptions());

        this.buttonPlay1.signals.click.add(() => this.onClickPlay());
        this.buttonPlay2.signals.click.add(() => this.onClickPlay(true));

        this.buttonOptions.signals.click.add(() => {
            Assets.getSound().play("click");
            this.showOptions()
        });
    }


    /* METHODS */

    showOptions (): void {
        [this.buttonOptions, this.buttonPlay1, this.buttonPlay2].forEach(button => button.hide());
        this.dialogOptions.show();
    }

    hideOptions (): void {
        this.dialogOptions.hide();
        [this.buttonOptions, this.buttonPlay1, this.buttonPlay2].forEach(button => button.show());
    }

    /* EVENTS */

    /**
     * On click on button play
     * @params twoPlayers - If true, we set the mode for 2 physicals players
     */
    onClickPlay (twoPlayers: boolean = false): void {
        Assets.getSound().play("click");

        this.context.game.context.twoPlayers = twoPlayers;
        this.context.game.swapScene(this, new SelectCharater());
    }
}