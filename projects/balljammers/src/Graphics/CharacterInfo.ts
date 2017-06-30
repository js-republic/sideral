import { Graphic } from "sideral/Graphic";
import { Sprite, Shape } from "sideral/Module";
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
    MAX_SPEED: number = 750;

    /**
     * The max power
     * @readonly
     */
    MAX_POWER: number = 500;


    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            width: 250,
            height: 200
        });

        this.signals.propChange.bind("imageId", () => this.sprite.props.imageId = this.props.imageId);
    }

    initialize (props) {
        super.initialize(props);

        this.sprite = <Sprite> this.spawn(new Sprite(), this.props.width / 2, this.props.height / 2, {
            spritesheet: false,
            flip: this.props.spriteFlip
        });

        this.addIcon(10, this.props.height - 80, "icon-speed", Color.lightGreen700);
        this.addIcon(10, this.props.height - 40, "icon-power", Color.amber700);

        const barSpeed = <Shape> this.spawn(new Shape(), 50, this.props.height - 65, {
            width: this.props.width - 70,
            box: null,
            height: 10
        }), barPower = <Shape> this.spawn(new Shape(), 50, this.props.height - 25, {
            width: this.props.width - 70,
            box: null,
            height: 10
        });

        barSpeed.lineStyle(2, Color.lightGreen700);
        barPower.lineStyle(2, Color.amber700);

        [barSpeed, barPower].forEach(bar => bar.beginFill(Color.black, 0.7)
            .moveTo(0, 0).lineTo(bar.props.width - 10, 0).lineTo(bar.props.width, bar.props.height).lineTo(10, bar.props.height).lineTo(0, 0));
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
}