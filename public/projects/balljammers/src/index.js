import Engine from "src/Engine";
import Keyboard from "src/Mixin/Keyboard";
import Scene from "src/Scene";


class Arena extends Scene {

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
