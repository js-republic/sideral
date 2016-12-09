import Scene from "src/Scene";

import EntityPlayer from "./../entities/EntityPlayer";


export default class SceneWorld extends Scene {

    /* LIFECYCLE */

    initialize (parent) {
        super.initialize(parent);

        this.canvas.clearColor  = "whitesmoke";
        this.player             = new EntityPlayer({x: 10, y: 10});

        this.compose(this.player);
    }
}
