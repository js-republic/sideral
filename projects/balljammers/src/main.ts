import { Game } from "sideral/SideralObject";
import { Assets } from "sideral/Tool";

import { Intro } from "./Scenes";


const game = new Game();


Assets.getSound().mute();

game.enableKeyboard(true);
game.start(832, 576);

const scene = game.add(new Intro());

(<any> window).game = game;
(<any> window).scene = scene;
(<any> window).Assets = Assets;
