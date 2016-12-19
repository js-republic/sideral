import Engine from "src/Engine";
import Keyboard from "src/Component/Keyboard";

import SceneGame from "./SceneGame";


Engine.attachDOM(document.getElementById("sideral-app"));

Engine.setProps({
    width : 500,
    height: 200
});

Engine.compose(new Keyboard()).compose(new SceneGame());

Engine.run();
