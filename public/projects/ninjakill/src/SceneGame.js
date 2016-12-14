import Scene from "src/Scene";

import Ninja from "./characters/Ninja";


export default class SceneGame extends Scene {

    /* LIFECYCLE */

    initialize (parent) {
        super.initialize(parent);
        this.scale = 2;

        this.compose(new Ninja({x: 0, y: 0}));
    }
}
