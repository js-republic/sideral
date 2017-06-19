import { Game } from "sideral/SideralObject";
import { Assets } from "sideral/Tool";

import { Arena } from "./Scenes";


const game = new Game();


Assets.getSound().mute();

game.enableKeyboard(true);
game.start(832, 576);

const scene = game.add(new Arena());

(<any> window).game = game;
(<any> window).scene = scene;
(<any> window).Assets = Assets;
