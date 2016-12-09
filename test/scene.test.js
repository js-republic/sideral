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
        Engine.compose(scene);
        expect(scene.canvas).not.toBeUndefined();
    });

    it("should resize canvas when changing width", () => {
        Engine.compose(scene);
        scene.width = 100;

        expect(scene.canvas.width).toBe(100);
    });

    it("should resize canvas when changing height", () => {
        Engine.compose(scene);
        scene.height = 50;

        expect(scene.canvas.height).toBe(50);
    });

    it("should add entity", () => {
        scene.compose(new Entity());
        expect(scene.entities[0]).not.toBeUndefined();
    });

    it("should throw an error if attachEntity parameter is not an instance of Entity", () => {
        expect(() => scene.attachEntity(new Scene())).toThrowError();
    });

    it("should place entity at right position", () => {
        scene.compose(new Entity({ x: 10, y: 150 }), (entity) => {
            expect(entity.x).toBe(10);
            expect(entity.y).toBe(150);
        });
    });

    it("should follow the entity", () => {
        scene.compose(new Entity({ x: 10, y: 10 }), (entity) => {
            scene.camera.follow = entity;
            scene.width = 100;
            scene.update();

            expect(scene.camera.x).toBe(-35);
        });
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

        Engine.compose(scene);
        scene.compose(new EntityExtended());

        scene.update();
        expect(scene.entities[0].updated).toBeTruthy();

        scene.render();
        expect(scene.entities[0].rendered).toBeTruthy();
    });
});
