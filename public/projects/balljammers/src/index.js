
/*
import Game from "src/Game";

import Arena from "./Arena";


window.game     = Game.start(832, 576);
window.scene    = Game.addScene(new Arena());
*/


import p2 from "p2";


var renderer, stage, container, graphics, zoom, world, boxShape, boxBody, planeBody, planeShape;

function init () {
    world = new p2.World();

    boxShape    = new p2.Box({ width: 2, height: 1 });
    boxBody     = new p2.Body({ mass: 1, position: [0, 2], angularVelocity: 1 });

    boxBody.addShape(boxShape);
    world.addBody(boxBody);

    planeShape  = new p2.Plane();
    planeBody   = new p2.Body({ position: [0, -1] });
    planeBody.addShape(planeShape);
    world.addBody(planeBody);

    zoom = 100;

    renderer    = PIXI.autoDetectRenderer(600, 400);
    stage       = new PIXI.Stage(0xFFFFFF);

    container   = new PIXI.Container();
    stage.addChild(container);

    document.body.appendChild(renderer.view);

    container.position.x    = renderer.width / 2;
    container.position.y    = renderer.height / 2;
    container.scale.x       = zoom;
    container.scale.y       = -zoom;

    graphics    = new PIXI.Graphics();
    graphics.beginFill(0xFF0000);
    graphics.drawRect(-boxShape.width / 2, -boxShape.height / 2, boxShape.width, boxShape.height);

    container.addChild(graphics);
}

function animate (t) {
    t = t || 0;
    requestAnimationFrame(animate);

    world.step(1 / 60);

    graphics.position.x = boxBody.position[0];
    graphics.position.y = boxBody.position[1];
    graphics.rotation   = boxBody.angle;

    renderer.render(stage);
}

init();
animate();