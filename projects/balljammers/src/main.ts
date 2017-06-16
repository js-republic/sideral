import { Game } from "sideral/SideralObject";
import { Assets } from "sideral/Tool";

import { Arena, Loading } from "./Scenes";


const game = new Game();


Assets.getSound().mute();

const scene = game.addLoadingScene(new Loading());
game.enableKeyboard(true);
game.start(832, 576);

// const scene = game.add(new Loading());

(<any> window).game = game;
(<any> window).scene = scene;
(<any> window).Assets = Assets;
