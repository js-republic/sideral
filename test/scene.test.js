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
        scene.width = 100;
        scene.update();

        expect(scene.canvas.width).toBe(100);
    });

    it("should resize canvas when changing height", () => {
        Engine.attachScene(scene);
        scene.height = 50;
        scene.update();

        expect(scene.canvas.height).toBe(50);
    });

    it("should add entity", () => {
        scene.attachEntity(new Entity());
        expect(scene.entities[0]).not.toBeUndefined();
    });

    it("should throw an error if attachEntity parameter is not an instance of Entity", () => {
        expect(() => scene.attachEntity(new Scene())).toThrowError();
    });

    it("should place entity at right position", () => {
        scene.attachEntity(new Entity({ props: { x: 10, y: 150 } }));
        expect(scene.entities[0].x).toBe(10);
        expect(scene.entities[0].y).toBe(150);
    });

    it("should follow the entity", () => {
        const entity = new Entity({ props: { x: 10, y: 10 }});

        scene.attachEntity(entity);
        scene.camera.follow = entity;
        scene.width = 100;
        scene.update();

        expect(scene.camera.x).toBe(-35);
    });

    it("should update and render entity when scene respectively update and render", () => {
        const entity = new Entity({
            props: {
                x: 10,
                y: 10
            },

            update () {
                this.updated = true;
                this.requestRender = true;
            },

            render () {
                this.rendered = true;
            }
        });

        Engine.attachScene(scene);
        scene.attachEntity(entity);
        scene.update();
        expect(scene.entities[0].updated).toBeTruthy();

        scene.render();
        expect(scene.entities[0].rendered).toBeTruthy();
    });
});
