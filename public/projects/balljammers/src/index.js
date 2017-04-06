
/*
import Engine from "src/Engine";
import Keyboard from "src/Mixin/Keyboard";

import Arena from "./Arena";


Engine.set({
    width       : 608,
    height      : 332,
    dom         : document.getElementById("sideral-app")
}).start();

Engine.mix(new Keyboard()).
    compose(new Arena());

window.Engine = Engine;
*/


import Game from "src/Game";
import Scene from "src/Scene";
import Entity from "src/Entity";
import grassData from "./../tilemaps/grass.json";


window.game = Game.start(608, 302);

const scene = Game.addScene(new Scene()),
    entity  = scene.addEntity(new Entity(), 0, 0, { debug: true, width: 32, height: 32 });

scene.setTilemap(grassData);
entity.addSprite("images/ball.png", entity.props.width, entity.props.height);


window.ent = entity;
