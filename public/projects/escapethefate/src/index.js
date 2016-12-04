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
