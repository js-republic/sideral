import { currentGame } from "../../../src/Game";

import { Arena } from "./Arena";


(<any>window).game     = currentGame.start(832, 576);
(<any>window).scene    = currentGame.addScene((new Arena()));
