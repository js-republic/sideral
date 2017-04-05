
/*
import Engine from "src/Engine";
import Keyboard from "src/Mixin/Keyboard";

import Arena from "./Arena";


Engine.set({
    width       : 608,
    height      : 332,
    dom         : document.getElementById("sideral-app")
}).start();

Engine.mix(new Keyboard()).
    compose(new Arena());

window.Engine = Engine;
*/


import Game from "src/Game";
import Scene from "src/Scene";


window.game = Game.start(608, 302);

Game.addScene(new Scene());