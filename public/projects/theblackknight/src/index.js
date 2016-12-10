import Engine from "src/Engine";
import Scene from "src/Scene";
import Entity from "src/Entity";


// Define the size of the engine
Engine.width(500);
Engine.height(200);

// Render the engine into a dom
Engine.attachDOM(document.getElementById("sideral-app"));

// Start the loop
Engine.run();


// Custom code
const scene = new Scene(),
    entity = new Entity();

entity.debug = true;

scene.attachEntity(entity, 10, 10);
Engine.attachScene(scene);

scene.canvas.clearColor = "whitesmoke";