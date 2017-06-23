import { Switch, Button } from "sideral/Graphic";
import { Color } from "sideral/Tool";

import { Dialogs } from "./../Dialogs";


export class DialogOptions extends Dialogs {

    /* ATTRIBUTES */

    /**
     * The switch for the music
     */
    switchMusic: Switch;

    /**
     * The switch for the sound
     */
    switchSound: Switch;

    buttonValid: Button;


    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            width: 200,
            height: 300
        });
    }

    initialize (props) {
        super.initialize(props);

        this.text("label", {
            text: "OPTIONS"
        });

        this.switchMusic = (<Switch> this.spawn(new Switch(), 20, 80, {
            isActive: true

        })).text("label", {
            text: "Music"

        });

        this.switchSound = (<Switch> this.spawn(new Switch(), 20, 110, {
            isActive: true

        })).text("label", {
            text: "Sounds"

        });

        this.buttonValid = (<Button> this.spawn(new Button(), (this.props.width / 2) - 50, this.props.height - 60, {
            width: 100,
            height: 40

        })).text("label", {
            text: "Done"

        });

        this.buttonValid.signals.click.add(() => (<any>this.context.scene).hideOptions());
    }
}