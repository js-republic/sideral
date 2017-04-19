import Game from "./../src/Game";
import Scene from "./../src/Scene";
import Entity from "./../src/Entity";


const tiledata = {"path":"images/grass.png","backgrounds":[],"tilewidth":64,"tileheight":64,"grid":{"visual":[[[],[],[],[],[],[],[-1,-1,-1,-1,-1,10,8,9],[10,8,8,8,8,13,12,15,8,8,8,8,9],[0,12,12,12,12,12,12,12,12,12,12,12,17]]],"logic":[[],[],[],[],[],[],[0,0,0,0,0,1,1,1,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,1]]},"decorators":{"data":{},"items":[]}};

describe("Physic and collision test of entity", () => {
    const scene = Game.addScene(new Scene()),
        entity  = scene.addEntity(new Entity(), 10, 0, { gravityFactor: 0, name: "entity" }),
        target  = scene.addEntity(new Entity(), 500, 0, { gravityFactor: 0, name: "target" }),
        other   = scene.addEntity(new Entity(), 1000, 500, { gravityFactor: 0, name: "other" });

    entity.props.mass = Entity.MASS.SOLID;
    entity.size(10, 10);
    target.size(10, 10);
    other.size(10, 10);
    scene.setTilemap(tiledata);

    it("should going to the left", () => {
        entity.resolveMovementX(20);
        expect(entity.props.x).toBe(20);
    });

    it("should going to the right", () => {
        entity.resolveMovementX(0);
        expect(entity.props.x).toBe(0);
    });

    it("should going to the bottom", () => {
        entity.resolveMovementY(10);
        expect(entity.props.y).toBe(10);
    });

    it("should going to the top", () => {
        entity.resolveMovementY(0);
        expect(entity.props.y).toBe(0);
    });

    it("should be replaced because of the wall on x axis from the left", () => {
        entity.props.x = tiledata.tilewidth * 4;
        entity.props.y = tiledata.tileheight * 6;
        entity.resolveMovementX(tiledata.tilewidth * 6);
        expect(entity.props.x).toBe((tiledata.tilewidth * 5) - entity.props.width);
    });

    it("should be replaced because of the wall on x axis from the right", () => {
        entity.props.x = tiledata.tilewidth * 9;
        entity.resolveMovementX(tiledata.tilewidth * 4);
        expect(entity.props.x).toBe(tiledata.tilewidth * 8);
    });

    it("should be replaced because of the wall on y axis from the top", () => {
        entity.props.y = tiledata.tileheight * 6;
        entity.resolveMovementY(tiledata.tileheight * 7);
        expect(entity.props.y).toBe((tiledata.tileheight * 7) - entity.props.height);
    });

    it("should be replaced because of the wall on y axis from the bottom", () => {
        entity.props.y = tiledata.tileheight * 8;
        entity.resolveMovementY(tiledata.tileheight * 6);
        expect(entity.props.y).toBe(tiledata.tileheight * 8);
    });

    it("should be stopped by the target on x axis with a SOLID Mass from the left", () => {
        entity.props.x      = 50;
        target.props.x      = 60;
        entity.props.y      = target.props.y = 0;
        target.props.mass   = Entity.MASS.SOLID;

        entity.resolveMovementX(70);
        expect(entity.props.x).toBe(target.props.x - entity.props.width);
    });

    it("should be stopped by the target on x axis with a SOLID Mass from the right", () => {
        entity.props.x = 70;
        target.props.x = 60;

        entity.resolveMovementX(20);
        expect(entity.props.x).toBe(target.props.x + target.props.width);
    });

    it ("should be stopped by the target on y axis with a SOLID MASS from the top", () => {
        entity.props.x = target.props.x = 50;
        entity.props.y = 0;
        target.props.y = 20;

        entity.resolveMovementY(30);
        expect(entity.props.y).toBe(target.props.y - entity.props.height);
    });

    it("should be stopped by the target on y axis with a SOLID MASS from the bottom", () => {
        entity.props.x = target.props.x = 50;
        target.props.y = 20;
        entity.props.y = 50;

        entity.resolveMovementY(0);
        expect(entity.props.y).toBe(target.props.y + target.props.height);
    });

    it("should move correctly on x axis with a target with a WEAK MASS from the left", () => {
        entity.props.y      = target.props.y = 0;
        entity.props.x      = 0;
        target.props.x      = 20;
        target.props.mass   = Entity.MASS.WEAK;

        entity.resolveMovementX(50);
        expect(entity.props.x).toBe(50);
        expect(target.props.x).toBe(entity.props.x + entity.props.width);
    });

    it("should move correctly on x axis with a target with a WEAK MASS from the right", () => {
        entity.props.y      = target.props.y = 0;
        entity.props.x      = 50;
        target.props.x      = 10;

        entity.resolveMovementX(0);
        expect(entity.props.x).toBe(0);
        expect(target.props.x).toBe(entity.props.x - target.props.width);
    });

    it("should move correctly on y axis with a target with a WEAK MASS from the top", () => {
        entity.props.x      = target.props.x = 50;
        entity.props.y      = 0;
        target.props.y      = 20;

        entity.resolveMovementY(40);
        expect(entity.props.y).toBe(40);
        expect(target.props.y).toBe(entity.props.y + entity.props.height);
    });

    it("should move correctly on y axis with a target with a WEAK MASS from the bottom", () => {
        entity.props.x      = target.props.x = 100;
        entity.props.y      = 50;
        target.props.y      = 10;

        entity.resolveMovementY(-50);
        expect(entity.props.y).toBe(-50);
        expect(target.props.y).toBe(entity.props.y - target.props.height);
    });

    it("should be replaced because of the wall on x axis with a target with a WEAK MASS from the left", () => {
        entity.props.y = target.props.y = tiledata.tileheight * 6;
        entity.props.x = 0;
        target.props.x = 20;

        entity.resolveMovementX(tiledata.tilewidth * 6);
        expect(target.props.x).toBe((tiledata.tilewidth * 5) - target.props.width);
        expect(entity.props.x).toBe((tiledata.tilewidth * 5) - target.props.width - entity.props.width);
    });

    it("should be replaced because of the wall on x axis with a target with a WEAK MASS from the right", () => {
        entity.props.y = target.props.y = tiledata.tileheight * 6;
        entity.props.x = tiledata.tilewidth * 64;
        target.props.x = tiledata.tilewidth * 9;

        entity.resolveMovementX(tiledata.tilewidth * 2);
        expect(target.props.x).toBe(tiledata.tilewidth * 8);
        expect(entity.props.x).toBe((tiledata.tilewidth * 8) + target.props.width);
    });

    it("should be replaced because of the wall on y axis with a target with a WEAK MASS from the top", () => {
        entity.props.x = target.props.x = 50;
        entity.props.y = tiledata.tileheight * 2;
        target.props.y = tiledata.tileheight * 3;

        entity.resolveMovementY(tiledata.tileheight * 9);
        expect(target.props.y).toBe((tiledata.tileheight * 7) - target.props.height);
        expect(entity.props.y).toBe(target.props.y - entity.props.height);
    });

    it("should be replace because of the wall on y axis with a target with a WEAK MASS from the bottom", () => {
        entity.props.x = target.props.x = 100;
        entity.props.y = tiledata.tileheight * 10;
        target.props.y = tiledata.tileheight * 9;

        entity.resolveMovementY(0);
        expect(target.props.y).toBe(tiledata.tileheight * 8);
        expect(entity.props.y).toBe(target.props.y + target.props.height);
    });

    it("should move weaks entities until the solid mass on x axis from the left", () => {
        other.props.mass    = Entity.MASS.SOLID;
        entity.props.mass   = target.props.mass = Entity.MASS.WEAK;

        entity.position(0, 0);
        target.position(20, 5);
        other.position(50, 10);

        entity.resolveMovementX(100);
        expect(other.props.x).toBe(50);
        expect(target.props.x).toBe(other.props.x - target.props.width);
        expect(entity.props.x).toBe(target.props.x - entity.props.width);
    });

    it("should move weaks entities until the solid mass on x axis from the right", () => {
        entity.position(100, 0);
        target.position(50, 0);
        other.position(10, 0);

        entity.resolveMovementX(0);
        expect(other.props.x).toBe(10);
        expect(target.props.x).toBe(other.props.x + other.props.width);
        expect(entity.props.x).toBe(target.props.x + target.props.width);
    });

    it("should move weaks entities until the solid mass on y axis from the top",  () => {
        entity.props.x  = target.props.x = other.props.x = 100;
        entity.props.y  = 0;
        target.props.y  = 20;
        other.props.y   = 50;

        entity.resolveMovementY(800);
        expect(other.props.y).toBe(50);
        expect(target.props.y).toBe(other.props.y - target.props.height);
        expect(entity.props.y).toBe(target.props.y - entity.props.height);
    });

    it("should move weaks entities untile the soldi mass on y axis from the bottom", () => {
        entity.props.x  = target.props.x = other.props.x = 50;
        entity.props.y  = 100;
        target.props.y  = 50;
        other.props.y   = 0;

        entity.resolveMovementY(0);
        expect(other.props.y).toBe(0);
        expect(target.props.y).toBe(other.props.y + other.props.height);
        expect(entity.props.y).toBe(target.props.y + target.props.height);
    });

    it("should be replaced because of the wall on x axis with mutiple targets with a WEAK MASS from the left", () => {
        entity.props.mass = target.props.mass = other.props.mass = Entity.MASS.WEAK;

        entity.props.y  = target.props.y = other.props.y = tiledata.tileheight * 6;
        entity.props.x  = 0;
        target.props.x  = 20;
        other.props.x   = 35;

        entity.resolveMovementX(tiledata.tilewidth * 6);
        expect(other.props.x).toBe((tiledata.tilewidth * 5) - other.props.width);
        expect(target.props.x).toBe((tiledata.tilewidth * 5) - other.props.width - target.props.width);
        expect(entity.props.x).toBe(target.props.x - entity.props.width);
    });

    it("should be replaced because of the wall on x axis with mutiple targets with a WEAK MASS from the right", () => {
        entity.props.y  = target.props.y = other.props.y = tiledata.tileheight * 6;
        entity.props.x  = tiledata.tilewidth * 64;
        target.props.x  = (tiledata.tilewidth * 9) + 15;
        other.props.x   = tiledata.tilewidth * 9;

        entity.resolveMovementX(tiledata.tilewidth * 2);
        expect(other.props.x).toBe(tiledata.tilewidth * 8);
        expect(target.props.x).toBe((tiledata.tilewidth * 8) + other.props.width);
        expect(entity.props.x).toBe(target.props.x + target.props.width);
    });

    it("should be replaced because of the wall on y axis with mutiple targets with a WEAK MASS from the top", () => {
        entity.props.x  = target.props.x = other.props.x = 50;
        entity.props.y  = tiledata.tileheight * 2;
        target.props.y  = tiledata.tileheight * 3;
        other.props.y   = tiledata.tileheight * 4;

        entity.resolveMovementY(tiledata.tileheight * 9);
        expect(other.props.y).toBe((tiledata.tileheight * 7) - other.props.height);
        expect(target.props.y).toBe(other.props.y - target.props.height);
        expect(entity.props.y).toBe(target.props.y - entity.props.height);
    });

    it("should be replace because of the wall on y axis with mutiple targets with a WEAK MASS from the bottom", () => {
        entity.props.x  = target.props.x = other.props.x = 100;
        entity.props.y  = tiledata.tileheight * 11;
        target.props.y  = tiledata.tileheight * 10;
        other.props.y   = tiledata.tileheight * 9;

        entity.resolveMovementY(0);
        expect(other.props.y).toBe(tiledata.tileheight * 8);
        expect(target.props.y).toBe(other.props.y + other.props.height);
        expect(entity.props.y).toBe(target.props.y + target.props.height);
    });

    it("should place the entity at the right side of the target -> TOP", () => {
        entity.props.mass = target.props.mass = Entity.MASS.SOLID;

        entity.position(0, 0);
        target.position(10, 10);
        entity.resolveMovement(15, 30);

        expect(entity.props.x).toBe(15);
        expect(entity.props.y).toBe(target.props.y - entity.props.height);
    });

    it("should place the entity at the right side of the target -> LEFT", () => {
        entity.position(20, 20);
        target.position(50, 10);
        entity.resolveMovement(70, 5);

        expect(entity.props.x).toBe(target.props.x - entity.props.width);
        expect(entity.props.y).toBe(5);
    });

    it("should place the entity at the right side of the target -> RIGHT", () => {
        entity.position(50, 50);
        target.position(0, 0);
        entity.resolveMovement(-185, 9);

        expect(entity.props.x).toBe(target.props.x + target.props.width);
        expect(entity.props.y).toBe(9);
    });

    it("should place the entity at the right side of the target -> BOTTOM", () => {
        entity.position(20, 20);
        target.position(20, 0);
        entity.resolveMovement(10, 0);

        expect(entity.props.x).toBe(10);
        expect(entity.props.y).toBe(target.props.y + target.props.height);
    });

    /*
    it("should replace two entities into the middle of theirs movement", () => {
        entity.props.mass = target.props.mass = Entity.MASS.WEAK;
        entity.props.vx = 100;
        target.props.vx = -100;

        entity.position(0, 0);
        target.position(100, 0);
        entity.resolveMovementX(entity.props.x + entity.props.vx);
        target.resolveMovementX(target.props.x + target.props.vx);

        expect(entity.props.x).toBe(40);
        expect(target.props.x).toBe(50);
    });

    it("should replace two entities into the correct distance of each other of theirs movement", () => {
        entity.props.vx = 500;
        target.props.vx = -200;

        entity.position(0, 0);
        target.position(300, 0);
        entity.resolveMovementX(entity.props.x + entity.props.vx);
        target.resolveMovementX(target.props.x + target.props.vx);

        expect(Math.floor(entity.props.x)).toBe(204);
        expect(Math.floor(target.props.x)).toBe(300 - 86);
    });

    it("should replace two entities into the middle of theirs movement on y axis", () => {
        entity.props.mass = target.props.mass = Entity.MASS.WEAK;
        entity.props.vy = 100;
        target.props.vy = -100;

        entity.position(0, 0);
        target.position(0, 100);
        entity.resolveMovementY(entity.props.y + entity.props.vy);
        target.resolveMovementY(target.props.y + target.props.vy);

        expect(entity.props.y).toBe(40);
        expect(target.props.y).toBe(50);
    });

    it("should replace two entities into the correct distance of each other of theirs movement on y axis", () => {
        entity.props.vy = 500;
        target.props.vy = -200;

        entity.position(0, 0);
        target.position(0, 300);
        entity.resolveMovementY(entity.props.y + entity.props.vy);
        target.resolveMovementY(target.props.y + target.props.vy);

        expect(Math.floor(entity.props.y)).toBe(204);
        expect(Math.floor(target.props.y)).toBe(300 - 86);
    });
    */

});
