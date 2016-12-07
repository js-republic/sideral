/*
import Engine from "src/Engine";
import Keyboard from "src/Component/Keyboard";

import SceneWorld from "./scenes/SceneWorld";


// Define the size of the engine
Engine.width(500);
Engine.height(200);

// Let's start the engine
Engine.compose(new Keyboard())
    .attachScene(new SceneWorld());

// Render the engine into a dom
Engine.attachDOM(document.getElementById("sideral-app"));

// Start the loop
Engine.run();
*/

import Engine from "src/Engine";
import Scene from "src/Scene";
import Keyboard from "src/Component/Keyboard";

import EntityPlayer from "./entities/EntityPlayer";


const scene = new Scene(),
    entity  = EntityPlayer({ x: 10, y: 10 });

Engine.width = 500;
Engine.height = 200;

Engine.compose(new Keyboard()).attachScene(scene);

Engine.attachDOM(document.getElementById("sideral-app"));

Engine.run();


scene.attachEntity(entity);

window.setTimeout(() => { entity.x = 20; }, 2000);
