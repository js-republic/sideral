import Engine from "src/Engine";
import Keyboard from "src/Mixin/Keyboard";
import Scene from "src/Scene";
import Sprite from "src/Entity/Sprite";


class Arena extends Scene {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.player = new Player();

        window.player = this.player;
        this.compose(this.player, { debug: true });
    }

    /**
     * @update
     * @override
     */
    update () {
        super.update();

        if (!this.player) {
            return null;
        }

        if (Engine.keyboard.isPressed(Engine.keyboard.KEY.ARROW_RIGHT)) {
            this.player.x += 10;
        }
    }
}

class Player extends Sprite {

    /* LIFECYCLE */

}


Engine.set({
    width       : 608,
    height      : 306,
    dom         : document.getElementById("sideral-app")
}).start();

Engine.mix(new Keyboard()).
    compose(new Arena());

window.Engine = Engine;
