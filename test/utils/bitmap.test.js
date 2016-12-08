import Bitmap from "./../../src/Util/Bitmap";
import Scene from "./../../src/Scene";


describe("Bitmap testing", () => {
    const path = "https://dummyimage.com/20/20/fff";
    let bitmap;

    it("should load image", (done) => {
        bitmap = new Bitmap(path, () => {
            done();
        });
    });

    it("should not load until we pass a path", (done) => {
        bitmap = new Bitmap();

        expect(bitmap.loaded).toBeFalsy();
        bitmap.load(path, () => {
            done();
        });
    });

    it("should throw an error when loading a picture without any path", () => {
        bitmap = new Bitmap();

        expect(() => { bitmap.load(); }).toThrowError();
    });

    it("should not render picture if it is not loaded", () => {
        bitmap = new Bitmap();

        expect(bitmap.render()).toBeNull();
    });

    it("should render a picture", (done) => {
        const scene = new Scene({ props: { width: 20, height: 20 } });

        scene.initialize();
        bitmap.setData("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAElBMVEUgICD///9XV1dzc3M7OzuPj49aCGd5AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAPUlEQVQImWNgoBVgAZMuQFrFyADEV1IxYjBmMGBiUGAA0gzODAYgismZgYEZwnRiZgCqVQAqYAoCqqUYAADM/gTfJ366qgAAAABJRU5ErkJggg==");
        scene.canvas.clear();
        bitmap.render(scene.canvas.context, 0, 0);
        done();
    });
});
