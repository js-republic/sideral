import { Scene, Sprite, Shape, Text } from "sideral/Module";
import { Graphic, Button } from "sideral/Graphic";
import { Assets, Color, Enum } from "sideral/Tool";

import { Arena, Title } from "./../Scenes";
import { Helper, CharacterInfo } from "./../Graphics";
import { Portrait } from "./../Player/Portrait";


Assets.preload("title", "images/titlescreen.png")
    .preload("selectCharacter", "images/selectCharacter.png")
    .preload("cat-portrait", "images/characters/cat-portrait.png")
    .preload("dog-portrait", "images/characters/dog-portrait.png")
    .preload("rogue-portrait", "images/characters/rogue-portrait.png")
    .preload("girl-portrait", "images/characters/girl-portrait.png")
    .preload("robot-portrait", "images/characters/robot-portrait.png")
    .preload("cat-idle", "images/characters/cat-idle.png")
    .preload("dog-idle", "images/characters/dog-idle.png")
    .preload("rogue-idle", "images/characters/rogue-idle.png")
    .preload("girl-idle", "images/characters/girl-idle.png")
    .preload("robot-idle", "images/characters/robot-idle.png")
    .preload("vs", "images/vs.png")
    .preloadSound("move", "sounds/move.wav")
    .preloadSound("selectCharacter", "sounds/selectCharacter.mp3");


export class SelectCharater extends Scene {

    /* ATTRIBUTES */

    portraits: Array<Portrait> = [];

    textChoose: Text;

    /**
     * The portrait selected by the player 1
     */
    player1: number = 0;

    /**
     * The portrait selected by the player 2
     */
    player2: number = 0;

    /**
     * The characterInfo of the player 1
     */
    characterInfo1: CharacterInfo;

    /**
     * The CharacterInfo of the player 2
     */
    characterInfo2: CharacterInfo;

    /**
     * Button to return to the title screen
     */
    buttonBack: Button;

    /**
     * Button to go the battle arena
     */
    buttonPlay: Button;

    /**
     * Player enumeration
     */
    PLAYER: any = {
        PLAYER_1: "player1",
        PLAYER_2: "player2"
    };


    /* LIFECYCLE */

    initialize (props) {
        super.initialize(props);

        const x = (this.props.width / 2) - 170,
            y   = this.props.height - 132;

        this.spawnMultiple([
            { item: new Sprite(), props: { width: this.props.width, height: this.props.height, imageId: "title" } },
            { item: new Sprite(), x: this.props.width / 2, y: 50, props: { spritesheet: false, imageId: "selectCharacter" } },
            { item: new Sprite(), x: this.props.width / 2, y: (this.props.height / 2) - 50, props: { spritesheet: false, imageId: "vs" } }

        ]);
        
        this.addGraphic(10, 125, 250, 250, "Player 1")
            .text("text", {
                fill: Color.green400
            });


        this.addGraphic(this.props.width - 260, 125, 250, 250, "Player 2")
            .text("text", {
                fill: Color.red400
            });

        this.spawnMultiple([
            { item: new CharacterInfo(), x: 10, y: 170, assign: "characterInfo1" },
            { item: new CharacterInfo(), x: this.props.width - 260, y: 170, props: { spriteFlip: true }, assign: "characterInfo2" },
            { item: new Helper(), x: 0, y: this.props.height - 30, props: {
                title: "help",
                text: this.context.twoPlayers
                    ? "Use 'q' or 'd' (P1) or arrow keys (P2) to select a character. Press 'space' (P1) or 'enter' (P2) to validate your character."
                    : "Use 'q' or 'd' to select a character. Press 'space' to validate your character."
            } }
        ]);

        this.addGraphic((this.props.width / 2) - 190, this.props.height - 152, 380, 92);

        this.buttonBack = (<Button> this.spawn(new Button(), 10, y + 1, {
            width: 115,
            height: 50
        })).text("label", {
            text: "Back"
        });

        this.buttonPlay = (<Button> this.spawn(new Button(), this.props.width - 125, y + 1, {
            width: 115,
            height: 50,
            isDisabled: true

        })).text("label", {
            text: "FIGHT !"
        });

        this.portraits.push(<Portrait> this.spawn(new Portrait(), x, y, {
            imageId: "cat-portrait",
            imageIdleId: "cat-idle",
            player1: true,
            player2: this.context.twoPlayers,
            name: "Chat"
        }));

        this.portraits.push(<Portrait> this.spawn(new Portrait(), x + 72, y, {
            imageId: "dog-portrait",
            imageIdleId: "dog-idle"
        }));

        this.portraits.push(<Portrait> this.spawn(new Portrait(), x + 144, y, {
            imageId: "rogue-portrait",
            imageIdleId: "rogue-idle"
        }));

        this.portraits.push(<Portrait> this.spawn(new Portrait(), x + 216, y, {
            imageId: "girl-portrait",
            imageIdleId: "girl-idle"
        }));

        this.portraits.push(<Portrait> this.spawn(new Portrait(), x + 288, y, {
            imageId: "robot-portrait",
            imageIdleId: "robot-idle"
        }));

        Assets.getSound().playMusic("selectCharacter", true);

        const keyboard = this.context.game.keyboard;

        this.buttonBack.signals.click.add(this.onButtonBackClick.bind(this));
        this.buttonPlay.signals.click.add(this.onButtonPlayClick.bind(this));
        keyboard.signals.keyPress.bind(Enum.KEY.Q, () => this.movePlayerPortrait(this.PLAYER.PLAYER_1, true));
        keyboard.signals.keyPress.bind(Enum.KEY.D, () => this.movePlayerPortrait(this.PLAYER.PLAYER_1, false));

        if (this.context.twoPlayers) {
            keyboard.signals.keyPress.bind(Enum.KEY.ARROW_LEFT, () => this.movePlayerPortrait(this.PLAYER.PLAYER_2, true));
            keyboard.signals.keyPress.bind(Enum.KEY.ARROW_RIGHT, () => this.movePlayerPortrait(this.PLAYER.PLAYER_2, false));

            this.showCharacterInfo(this.PLAYER.PLAYER_2, this.portraits[0]);

        } else {
            this.showCharacterInfo(this.PLAYER.PLAYER_2, this.portraits[Math.floor(Math.random() * (this.portraits.length - 1))]);

        }

        this.showCharacterInfo(this.PLAYER.PLAYER_1, this.portraits[0]);
    }


    /* METHODS */

    /**
     * Switch a character of a player
     * @param player - Player enumeration
     * @param moveLeft - If true, move the portrait to the left. Right if false
     */
    movePlayerPortrait (player: string, moveLeft: boolean): void {
        const maxIndex      = this.portraits.length - 1,
            currentIndex    = this[player];
        let nextIndex       = moveLeft ? this[player] - 1 : this[player] + 1;

        if (nextIndex < 0) {
            nextIndex = maxIndex;

        } else if (nextIndex > maxIndex) {
            nextIndex = 0;
        }

        Assets.getSound().play("move");

        this.portraits[currentIndex].props[player]  = false;
        this.portraits[nextIndex].props[player]     = true;
        this[player]                                = nextIndex;

        this.showCharacterInfo(player, this.portraits[nextIndex]);
    }

    /**
     * Show the info a character by its portrait
     * @param player - Player side to show the info
     * @param portrait - Portrait corresponding to the character
     */
    showCharacterInfo (player: string, portrait: Portrait): void {
        const characterInfo = player.indexOf("1") != -1 ? this.characterInfo1 : this.characterInfo2;

        characterInfo.props.imageId = portrait.props.imageIdleId;
    }

    /**
     * Add a new graphic shape
     * @param x - Position in x axis
     * @param y - Position in y axis
     * @param width - Width of the shape
     * @param height - Height of the shape
     * @param text - Text to display on the shape
     * @return The graphic created
     */
    addGraphic (x: number, y: number, width: number, height: number, text?: string): Graphic {
        const graphic = (<Graphic> this.spawn(new Graphic(), x, y, {
            activable: false

            })).shape("shape", {
                width: width,
                height: height,
                fill: Color.black,
                fillAlpha: 0.8,
                stroke: Color.cyan400,
                strokeThickness: 2

            });

        if (text) {
            graphic.text("text", {
                x: width / 2,
                y: 20,
                centered: true,
                text: text,
                fill: Color.white

            });
        }

        return graphic;
    }


    /* EVENTS */

    /**
     * On click on button back
     */
    onButtonBackClick (): void {
        Assets.getSound().play("click");
        this.context.game.swapScene(this, new Title());
    }

    /**
     * On click on button play
     */
    onButtonPlayClick (): void {
        if (!this.buttonPlay.props.isDisabled) {
            console.log("kecli");
            Assets.getSound().play("click");
            // this.context.game.swapScene(this, new Arena());
        }
    }
}