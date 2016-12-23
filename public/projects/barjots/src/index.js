import Engine from "src/Engine";
import Keyboard from "src/Component/Keyboard";

import SceneArena from "./scenes/Arena";


Engine.attachDOM(document.getElementById("sideral-app"));

Engine.setProps({
    width : 608,
    height: 336
});

Engine.compose(new Keyboard()).compose(new SceneArena());

Engine.run();
