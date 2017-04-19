import Game from "src/Game";

import Arena from "./Arena";


window.game = Game.start(832, 576);

Game.addScene(new Arena());
