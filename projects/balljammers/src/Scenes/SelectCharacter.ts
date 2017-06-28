import { Scene, Sprite, Shape, Text } from "sideral/Module";
import { Assets, Color } from "sideral/Tool";

import { Arena } from "./../Scenes";
import { Portrait } from "./../Portrait";


Assets.preload("title", "images/titlescreen.png")
    .preload("selectCharacter", "images/selectCharacter.png")
    .preload("cat-portrait", "images/characters/cat-portrait.png")
    .preload("dog-portrait", "images/characters/dog-portrait.png")
    .preload("rogue-portrait", "images/characters/rogue-portrait.png")
    .preload("girl-portrait", "images/characters/girl-portrait.png")
    .preload("robot-portrait", "images/characters/robot-portrait.png")
    .preload("vs", "images/vs.png")
    .preloadSound("selectCharacter", "sounds/selectCharacter.mp3");


export class SelectCharater extends Scene {

    /* ATTRIBUTES */

    portraits: Array<Portrait> = [];

    textChoose: Text;

    currentPlayer: string = "player1";


    /* LIFECYCLE */

    initialize (props) {
        super.initialize(props);

        this.add(new Sprite(), {
            width: this.props.width,
            height: this.props.height,
            imageId: "title"
        });

        this.spawn(new Sprite(), this.props.width / 2, 50, {
            spritesheet: false,
            imageId: "selectCharacter"
        });

        this.spawn(new Sprite(), this.props.width / 2, (this.props.height / 2) - 50, {
            spritesheet: false,
            imageId: "vs"
        });

        this.spawn(new Text(), 100, (this.props.height / 2) + 50, {
            text: "PLAYER 1",
            centered: true,
            dropShadow: true,
            dropShadowColor: Color.black,
            fill: Color.green400
        });

        this.spawn(new Text(), this.props.width - 100, (this.props.height / 2) + 50, {
            text: "PLAYER 2",
            centered: true,
            dropShadow: true,
            dropShadowColor: Color.black,
            fill: Color.red400
        });

        this.spawn(new Shape(), 0, this.props.height - 50, {
            width: this.props.width,
            height: 40,
            fill: Color.black,
            fillAlpha: 0.7
        });

        this.textChoose = <Text> this.spawn(new Text(), this.props.width / 2, this.props.height - 45, {
            text: "PLAYER 1: CHOOSE YOUR CHARACTER",
            fill: Color.green400,
            centered: true
        });

        const x = 50,
            y   = this.props.height - 200;

        this.portraits.push(<Portrait> this.spawn(new Portrait(), x, y, {
            imageId: "cat-portrait"
        }));

        this.portraits.push(<Portrait> this.spawn(new Portrait(), x + 150, y, {
            imageId: "dog-portrait"
        }));

        this.portraits.push(<Portrait> this.spawn(new Portrait(), x + 300, y, {
            imageId: "rogue-portrait"
        }));

        this.portraits.push(<Portrait> this.spawn(new Portrait(), x + 450, y, {
            imageId: "girl-portrait"
        }));

        this.portraits.push(<Portrait> this.spawn(new Portrait(), x + 600, y, {
            imageId: "robot-portrait"
        }));

        Assets.getSound().playMusic("selectCharacter", true);
    }
}