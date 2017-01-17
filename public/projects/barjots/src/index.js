import Engine from "src/Engine";
import Keyboard from "src/Component/Keyboard";

import Arena from "./Arena";


Engine.set({
    width       : 608,
    height      : 306,
    dom         : document.getElementById("sideral-app")

}).start();

Engine.compose(new Keyboard()).compose(new Arena());

window.Engine = Engine;
