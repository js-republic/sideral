import { Scene, Sprite } from "./../Module";
import { Assets, Color } from "./../Tool";
import { Progress, Text, Spinner } from "./../Graphic";


Assets.preloadBase64("jsRepublic", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAAA8CAMAAAAwnIpjAAAC/VBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9SksSbAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfhBhITHDnDjsBPAAACvklEQVRo3u3Z30vcMBwA8PztG2xw+HC+bKhTpg/DIQNxIFPkcBtz+jAFN7w59rAfuLEqDq7jnHe3L+abtL0kJmlyG/Sb4Rf0mmubfsw3SdPKmCs2nzD6ATxSMFJ35gi8ew9/n1E1PkbdZ9zKcGuObrKtBTrx3mRRdCJpVv9queoAFJNtDibaRlJp30PIziR/Ao2GLG6YeMA72kaMYbPNOQi9fINp34hJJR67ksDap5nmjL7ofBLK1o3yP1Yu4SR1drsp5e4IvjqUT8WsOFIeK3isOpSvQH32UE5QS3dEQWkXdaeoed/cXS7GMU69SgD9qn4luJXQ8yhFyaLEPcNH98/lEU7l0I68plRSApBpfUl+9uQuUykL3xxKXt+BL" +
        "He8SohSMreSb3SdSr6xa1F2DZVfeSiXwZd/qQSf8tiiBMgjlIOamShQ+cuntGT8gYmqy/iXMOVvr9LdL+2jB2KVPI5qlevVqB4UUUGmykHqGOOnzKo8ClQ+tA+eCeZL8M2XP+3KhUClNhVNuZVZ1h+n72JRxpIoZTy+r+npD8z4WqiSzQXN6qKOH0Vd1n7pU+JbHptyEKzk8adUvvT2y+p+Ea9kNuVe8OgxXhLWKKFWOR+hZNFKFqDkxyz6lSOdVae8qLv3vBWoHPesj5Uf/cq8uLRTyaoqwJzVwXEfr5tAeWwFr4m01YZ6gl7xgaxku+oc3U6n82a8JqrOU9ZE5cgwlcpFNqKUy3VK9lyrSq/ZomSXxtxrQYKzKY1oT5cb7Tb+lDGN3xjHHis1yaNaTCu2ZSVq88P59X6pqjZDkI0895SqsoFe9GBE4gWr3lK30PiJ3ov0BP75lJKykbdokziH9JliXnqWRnOm0j0TcLbGtyPScYLOmZu0/0vna/rMlQRHe07c2ZcbfcLMD+LmfkI++cVqeCaF7pnAKJpdpWO5AlQ8kQSijBntAAAAAElFTkSuQmCC")
    .preloadBase64("sideral", "data:image/png;base64,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");


export class SceneLoading extends Scene {

    /* ATTRIBUTES */

    /**
     * The progress child
     */
    progress: Progress;

    /**
     * The sprite to display JS-Republic logo
     */
    spriteJSR: Sprite;

    /**
     * The sprite to display Sideral logo
     */
    spriteSideral: Sprite;

    /**
     * Text used for loading
     */
    textLoading: Text;

    /**
     * The spinner
     */
    spinner: Spinner;


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
            strokeColor: Color.cyan400,
            backgroundColor: Color.white
        });

        this.spriteJSR = <Sprite> this.spawn(new Sprite(), 10, 0, {
            imageId: "jsRepublic",
            spritesheet: false,
            centered: false
        });

        this.spriteSideral = <Sprite> this.spawn(new Sprite(), 0, 0, {
            spritesheet: false,
            centered: false,
            imageId: "sideral"
        });

        this.textLoading = <Text> this.spawn(new Text(), 0, 0, {
            text: "Now loading...",
            fill: Color.white
        });

        this.spinner = <Spinner> this.spawn(new Spinner(), 0, 0);

        this.textLoading.signals.propChange.bind(["width", "height"], this.onTextLoadingChange.bind(this));
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
            this.spriteJSR.props.y = this.props.height - 70;
        }

        if (this.spriteSideral) {
            this.spriteSideral.props.x = (this.props.width / 2) - 100;
            this.spriteSideral.props.y = (this.props.height / 2) - 110;
        }

        this.onTextLoadingChange();
    }

    /**
     * When size attributes of the text has changed
     */
    onTextLoadingChange (): void {
        if (this.textLoading) {
            const offsetX = (this.spinner ? this.spinner.props.width + 30 : 0) + 20;

            this.textLoading.props.x = this.props.width - this.textLoading.props.width - offsetX;
            this.textLoading.props.y = this.props.height - this.textLoading.props.height - 20;
        }

        if (this.spinner) {
            this.spinner.props.x = this.props.width - this.spinner.props.width - 30;
            this.spinner.props.y = this.props.height - this.spinner.props.height - 22;
        }
    }

    /**
     * When progress signals has been fired
     */
    onProgressChange (progress): void {
        if (this.progress) {
            this.progress.props.value = progress;
        }

        if (progress === 100) {
            this.spinner.kill();
            this.textLoading.props.text = "Loaded !";
            this.textLoading.props.fill = Color.green400;
        }
    }

    onAssetsLoaded (done: Function): void {
        this.fade("out", Color.black, 1500, done);
    }
}