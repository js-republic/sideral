import Engine from "src/Engine";
import Scene from "src/Scene";
import Entity from "src/Entity";


const scene = new Scene(),
    entity  = new Entity();


// Define the size of the engine
Engine.width(500);
Engine.height(500);

// Define entity properties
entity.width(20);
entity.height(20);
entity.debug = true;

// Let's start the engine
Engine.attachScene(scene);
scene.attachEntity(entity, 10, 10);

// Render the engine into a dom
Engine.attachDOM(document.getElementById("sideral-app"));

// Start the loop
Engine.run();
