import Game from "../../../src/Game";

import Arena from "./Arena";


(<any>window).game     = Game.start(832, 576);
(<any>window).scene    = Game.addScene((new Arena()));