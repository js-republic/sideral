import Scene from "./../src/Scene";
import Entity from "./../src/Entity";
import Engine from "./../src/Engine";


describe("Scene testing", () => {
    let scene;

    beforeEach(() => {
        scene = new Scene();
    });

    it("should be named 'scene'", () => {
        expect(scene.name).toBe("scene");
    });

    it("should compose a canvas", () => {
        Engine.attachScene(scene);
        expect(scene.canvas).not.toBeUndefined();
    });

    it("should resize canvas when changing width", () => {
        Engine.attachScene(scene);
        scene.width(100);

        expect(scene.canvas.width()).toBe(100);
    });

    it("should resize canvas when changing height", () => {
        Engine.attachScene(scene);
        scene.height(50);

        expect(scene.canvas.height()).toBe(50);
    });

    it("should add entity", () => {
        scene.attachEntity(new Entity());
        expect(scene.entities[0]).not.toBeUndefined();
    });

    it("should throw an error if attachEntity parameter is not an instance of Entity", () => {
        expect(() => scene.attachEntity(new Scene())).toThrowError();
    });

    it("should place entity at right position", () => {
        scene.attachEntity(new Entity(), 10, 150);
        expect(scene.entities[0].x()).toBe(10);
        expect(scene.entities[0].y()).toBe(150);
    });

    it("should follow the eneity", () => {
        const entity = new Entity();

        scene.attachEntity(entity, 10, 10);
        scene.camera.follow = entity;
        scene.width(100);
        scene.update();
        expect(scene.camera.x).toBe(-35);
    });

    it("should reset an entity with pooling", () => {
        const entity = new Entity(),
            target = new Entity();

        entity.pooling  = true;
        entity.key      = "entity";
        target.key      = "target";
        target.pooling  = true;

        scene.attachEntity(entity, 10, 10);
        entity.destroy();
        expect(scene.entities.length).toBe(1);

        scene.attachEntity(target, 50, 50);
        expect(scene.entities.length).toBe(1);
        expect(scene.entities[0].x()).toBe(50);
        expect(scene.entities[0].destroyed).toBeFalsy();
        expect(scene.entities[0].key).toBe("entity");
    });

    it("should update and render entity when scene respectively update and render", () => {
        class EntityExtended extends Entity {
            update () {
                super.update();
                this.updated = true;
            }

            render (context) {
                super.render(context);
                this.rendered = true;
            }
        }

        Engine.attachScene(scene);
        scene.attachEntity(new EntityExtended(), 0, 0);
        scene.update();
        expect(scene.entities[0].updated).toBeTruthy();

        scene.render();
        expect(scene.entities[0].rendered).toBeTruthy();
    });
});
