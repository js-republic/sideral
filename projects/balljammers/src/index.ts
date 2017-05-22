import { Game } from "src/Game";

import { Arena } from "./Arena";


(<any>window).game     = new Game();

window.game.start(832, 576);

(<any>window).scene    = window.game.add((new Arena()));
