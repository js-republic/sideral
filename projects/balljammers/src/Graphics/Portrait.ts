import { Sprite } from "sideral/Module";
import { Graphic } from "sideral/Graphic";
import { Enum, Color } from "sideral/Tool";
import { IGraphicProps } from "sideral/Interface";


export interface IPortraitProps extends IGraphicProps {

    /**
     * The imageId of the portrait
     */
    imageId: string;

    imageIdleId: string;

    player1: boolean;

    player2: boolean;
}


export class Portrait extends Graphic {

    /* ATTRIBUTES */

    props: IPortraitProps;

    /**
     * The sprite to display
     */
    sprite: Sprite;


    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            width: 52,
            height: 52
        });

        this.signals.propChange.bind("imageId", this.onImageIdChange.bind(this));
        this.signals.propChange.bind("player1", this.onPlayer1Change.bind(this));
        this.signals.propChange.bind("player2", this.onPlayer2Change.bind(this));
    }

    initialize (props) {
        super.initialize(props);

        this.shape("shape", {
            width: this.props.width,
            height: this.props.height,
            fill: Color.transparent,
            fillAlpha: 0,
            stroke: Color.cyan400,
            strokeThickness: 2,
            radius: 2
        });

        this.sprite = <Sprite> this.spawn(new Sprite(), 1, 1, {
            spritesheet: false,
            centered: false,
            imageId: this.props.imageId
        });

        this.onPlayer1Change();
        this.onPlayer2Change();
    }


    /* EVENTS */

    onImageIdChange (): void {
        this.sprite.props.imageId = this.props.imageId;
    }

    onPlayer1Change (): void {
        if (this.props.player1) {
            this.shape("player1-shape", {
                x: -10,
                y: -9,
                width: 20,
                height: 20,
                fill: Color.green400,
                box: Enum.BOX.CIRCLE

            }).text("player1-text", {
                centered: true,
                text: "P1",
                fill: Color.white,
                fontSize: 11
            });

        } else {
            this.removeGraphic("player1-shape").removeGraphic("player1-text");
        }
    }

    onPlayer2Change (): void {
        if (this.props.player2) {
            this.shape("player2-shape", {
                x: this.props.width - 10,
                y: -9,
                width: 20,
                height: 20,
                fill: Color.red400,
                box: Enum.BOX.CIRCLE

            }).text("player2-text", {
                x: this.props.width,
                centered: true,
                text: this.context.twoPlayers ? "P2" : "PC",
                fill: Color.white,
                fontSize: 11
            });

        } else {
            this.removeGraphic("player2-shape").removeGraphic("player2-text");
        }
    }
}