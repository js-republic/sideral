import { Graphic } from "sideral/Graphic";
import { Sprite, Shape, Text } from "sideral/Module";
import { Assets, Enum, Color } from "sideral/Tool";
import { IGraphicProps } from "sideral/Interface";


Assets.preload("icon-speed", "images/icon-speed.png")
    .preload("icon-power", "images/icon-power.png")
    .preload("icon-spell", "images/icon-spell.png");


export interface ICharacterInfoProps extends IGraphicProps {

    /**
     * Name of the character
     */
    name?: string;

    /**
     * Image id of the sprite
     */
    imageId?: string;

    /**
     * Speed of the character
     */
    speed?: number;

    /**
     * PowerX of the character
     */
    power?: number;

    /**
     * The type of spell of the character
     */
    spell?: string;

    /**
     * If true, the sprite will be flipped
     */
    spriteFlip?: boolean;
}

export class CharacterInfo extends Graphic {

    /* ATTRIBUTES */

    /**
     * Properties of a CharacterInfo
     */
    props: ICharacterInfoProps;

    /**
     * The sprite to display
     */
    sprite: Sprite;

    /**
     * The max speed
     * @readonly
     */
    MAX_SPEED: number = 500;

    /**
     * The max power
     * @readonly
     */
    MAX_POWER: number = 500;

    SPEED_COLOR: string = Color.lightGreen700;

    POWER_COLOR: string = Color.amber700;

    SPELL_COLOR: string = Color.purple700;


    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            power: 0,
            speed: 0,
            spell: "",
            width: 250,
            height: 250
        });

        this.signals.propChange.bind("imageId", () => this.sprite.props.imageId = this.props.imageId);
        this.signals.propChange.bind(["power", "speed", "spell"], this.onInfoChange.bind(this));
    }

    initialize (props) {
        super.initialize(props);

        this.sprite = <Sprite> this.spawn(new Sprite(), this.props.width / 2, (this.props.height - 48) / 2, {
            spritesheet: false,
            flip: this.props.spriteFlip
        });

        this.addBar(10, this.props.height - 120, "icon-speed", this.SPEED_COLOR, "SPEED");
        this.addBar(10, this.props.height - 80, "icon-power", this.POWER_COLOR, "POWER");
        this.addBar(10, this.props.height - 40, "icon-spell", this.SPELL_COLOR, "SPELL", true);
    }


    /* METHODS */

    addIcon (x: number, y: number, imageId: string, strokeColor: string): void {
        this.shape(imageId, {
            x: x,
            y: y,
            width: 28,
            height: 28,
            fill: Color.white,
            stroke: strokeColor,
            strokeThickness: 2,
            box: Enum.BOX.CIRCLE
        });

        this.spawn(new Sprite(), x + 14, y + 14, {
            spritesheet: false,
            imageId: imageId
        });
    }

    addBar (x: number, y: number, imageId: string, color: string, title: string, withText: boolean = false): void {
        this.addIcon(x, y, imageId, color);

        this.shape(imageId + "-bar", {
            x: x + 40, 
            y: y + 10,
            width: this.props.width - 70,
            box: null,
            height: 15

        }).shape(imageId + "-title-shape", {
            x: x + 40,
            y: y,
            width: 70,
            box: null,
            fill: color,
            height: 10

        }).text(imageId + "-title-text", {
            x: x + 55,
            y: y - 3,
            text: title,
            fill: Color.white,
            fontSize: 11

        });

        if (withText) {
            this.text(imageId + "-text", {
                x: x + 50,
                y: y + 10,
                fill: Color.white,
                fontSize: 11
            });

        } else {
            this.shape(imageId + "-fill", {
                x: x + 40,
                y: y + 10,
                width: 0,
                box: null,
                height: 15
            });

            const fillBar = <Shape> this.getGraphicItem(imageId + "-fill");

            this.drawBar(fillBar.beginFill(color));
        }

        const bar       = <Shape> this.getGraphicItem(imageId + "-bar"),
            titleShape  = <Shape> this.getGraphicItem(imageId + "-title-shape");

        this.drawBar(bar.beginFill(Color.black, 0.8).lineStyle(2, color));
        this.drawBar(titleShape.beginFill(color));
    }

    drawBar (bar: Shape): void {
        bar.moveTo(0, 0).lineTo(bar.props.width, 0).lineTo(bar.props.width + 10, bar.props.height).lineTo(10, bar.props.height).lineTo(0, 0);
    }


    /* EVENTS */

    onInfoChange (): void {
        const fillbarSpeed  = <Shape> this.getGraphicItem("icon-speed-fill"),
            fillbarPower    = <Shape> this.getGraphicItem("icon-power-fill"),
            spellText       = <Text> this.getGraphicItem("icon-spell-text"),
            maxWidth        = this.props.width - 70;

        fillbarSpeed.props.width    = (this.props.speed / this.MAX_SPEED) * maxWidth;
        fillbarPower.props.width    = (this.props.power / this.MAX_POWER) * maxWidth;
        spellText.props.text        = this.props.spell;

        this.drawBar(fillbarSpeed.clear().beginFill(this.SPEED_COLOR));
        this.drawBar(fillbarPower.clear().beginFill(this.POWER_COLOR));
    }
}