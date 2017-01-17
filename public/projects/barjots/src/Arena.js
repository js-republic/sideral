import Scene from "src/Scene";
import Engine from "src/Engine";

import Player from "./Player";


export default class SceneArena extends Scene {

    /* LIFECYCLE */

    /**
     * @override
     */
    initialize (props) {
        super.initialize(props);
        this.background = 0x000000;
        // this.compose(new Player(), { debug: true });
    }

    update () {
        super.update();

        if (Engine.keyboard.isPressed(Engine.keyboard.KEY.ARROW_RIGHT)) {
            this.children[0].x += 10;
        }
    }
}
