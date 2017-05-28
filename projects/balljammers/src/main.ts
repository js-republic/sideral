import { Game } from "src/Game";

import { Arena } from "./Arena";

const game = new Game();

game.enableKeyboard(true);
game.start(832, 576);

const scene = game.add((new Arena()));

(<any> window).game = game;
(<any> window).scene = scene;
