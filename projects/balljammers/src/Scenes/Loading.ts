import { Scene, Sprite } from "sideral/Module";
import { Assets, Color } from "sideral/Tool";
import { Progress } from "sideral/Graphics";


Assets.preload("jsRepublic", "images/js-republic.png");


export class Loading extends Scene {

    /* ATTRIBUTES */

    /**
     * The progress child
     */
    progress: Progress;

    /**
     * The sprite to display JS-Republic logo
     */
    spriteJSR: Sprite;


    /* LIFECYCLE */

    constructor () {
        super();

        this.signals.progress.add(this.onProgressChange.bind(this));
        this.signals.propChange.bind(["width", "height"], this.onSizeChange.bind(this));
    }

    initialize (props) {
        super.initialize(props);

        this.props.backgroundColor = Color.black;

        this.progress = <Progress> this.add(new Progress(), {
            width: 300,
            height: 50,
            strokeColor: Color.red500,
            backgroundColor: Color.white
        });

        this.spriteJSR = <Sprite> this.spawn(new Sprite(), 10, 0, {
            imageId: "jsRepublic",
            spritesheet: false
        });

        this.onSizeChange();
    }


    /* EVENTS */

    /**
     * When size attributes has changed
     */
    onSizeChange (): void {
        if (this.progress) {
            this.progress.props.x = (this.props.width / 2) - (this.progress.props.width / 2);
            this.progress.props.y = (this.props.height / 2) - (this.progress.props.height / 2);
        }

        if (this.spriteJSR) {
            // this.spriteJSR.props.y = this.props.height - 300;
        }
    }

    /**
     * When progress signals has been fired
     */
    onProgressChange (progress): void {
        if (this.progress) {
            this.progress.props.value = progress;
        }
    }
}