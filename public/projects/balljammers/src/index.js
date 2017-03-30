import Engine from "src/Engine";
import Keyboard from "src/Mixin/Keyboard";

import Arena from "./Arena";


Engine.set({
    width       : 704,
    height      : 576,
    dom         : document.getElementById("sideral-app")
}).start();

Engine.mix(new Keyboard()).
    compose(new Arena());

window.Engine = Engine;
