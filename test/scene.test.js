import Scene from "./../src/Scene";
import Canvas from "./../src/components/Canvas";


describe("Scene testing", () => {
    let scene;

    beforeEach(() => {
        scene = new Scene();
    });

    it("should be named 'scene'", () => {
        expect(scene.name).toBe("scene");
    });

    it("should compose a canvas", () => {
        scene.compose(new Canvas(10, 10));
        expect(scene.canvas).not.toBeUndefined();
    });

    it("should resize canvas when changing width", () => {
        scene.compose(new Canvas(10, 10));
        scene.width = 100;

        expect(scene.canvas.width).toBe(100);
    });

    it("should resize canvas when changing height", () => {
        scene.compose(new Canvas(10, 10));
        scene.height = 50;

        expect(scene.canvas.height).toBe(50);
    })
});