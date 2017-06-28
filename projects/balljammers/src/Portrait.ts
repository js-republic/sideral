import { Module, Shape, Sprite } from "sideral/Module";
import { Enum, Color } from "sideral/Tool";
import { IModuleProps } from "sideral/Interface";


export interface IPortraitProps extends IModuleProps {

    /**
     * The imageId of the portrait
     */
    imageId: string;

    player1: boolean;

    player2: boolean;
}


export class Portrait extends Module {

    /* ATTRIBUTES */

    props: IPortraitProps;

    /**
     * The shape
     */
    shape: Shape;

    shapePlayer1: Shape;

    shapePlayer2: Shape;

    /**
     * The sprite to display
     */
    sprite: Sprite;


    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            width: 102,
            height: 102
        });

        this.signals.propChange.bind("imageId", this.onImageIdChange.bind(this));
        this.signals.hoverStart.add(this.onHoverStart.bind(this));
        this.signals.hoverEnd.add(this.onHoverEnd.bind(this));
    }

    initialize (props) {
        super.initialize(props);

        this.shape = <Shape> this.add(new Shape(), {
            width: this.props.width,
            height: this.props.height,
            fill: Color.black,
            fillAlpha: 0.7,
            stroke: Color.cyan400,
            strokeThickness: 2,
            radius: 2
        });

        this.sprite = <Sprite> this.spawn(new Sprite(), 11, 21, {
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
            this.shape.props.fill = Color.green900;

            if (!this.shapePlayer1) {
                this.shapePlayer1 = <Shape> this.add(new Shape(), {
                    width: this.props.width,
                    height: this.props.height,
                    fill: Color.transparent,
                    stroke: Color.green400,
                    strokeThickness: 5
                });
            }

        } else {
            this.shape.props.fill = Color.black;

            if (this.shapePlayer1) {
                this.shapePlayer1.kill();
                this.shapePlayer1 = null;
            }
        }
    }

    onPlayer2Change (): void {
        if (this.props.player2) {
            this.shape.props.fill = Color.red900;

            if (!this.shapePlayer2) {
                this.shapePlayer2 = <Shape> this.add(new Shape(), {
                    width: this.props.width,
                    height: this.props.height,
                    fill: Color.transparent,
                    stroke: Color.red400,
                    strokeThickness: 5
                });
            }

        } else {
            this.shape.props.fill = Color.black;

            if (this.shapePlayer2) {
                this.shapePlayer2.kill();
                this.shapePlayer2 = null;
            }
        }
    }

    onHoverStart (): void {
        const player = (<any> this.parent).currentPlayer;

        this.shape.props.stroke = player === "player1" ? Color.green400 : Color.red400;
        this.shape.props.strokeThickness    = 5;
    }

    onHoverEnd (): void {
        this.shape.props.stroke = Color.cyan400;
        this.shape.props.strokeThickness = 2;
    }
}