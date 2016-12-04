import Engine from "src/Engine";
import Scene from "src/Scene";

import EntityPlayer from "./../entities/EntityPlayer";


export default class SceneWorld extends Scene {

    /* LIFECYCLE */

    /**
     * @initialize
     * @returns {void}
     */
    initialize () {
        super.initialize();

        this.canvas.clearColor  = "black";
        this.player             = new EntityPlayer();

        this.attachEntity(this.player, 10, 10);
    }

    /**
     * @update
     * @returns {void}
     */
    update () {
        super.update();

        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_RIGHT)) {
            this.player.right();

        } else if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_LEFT)) {
            this.player.left();

        } else if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_UP)) {
            this.player.top();

        } else if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_DOWN)) {
            this.player.bottom();

        } else if (this.player.moving) {
            this.player.idle();
        }
    }
}
