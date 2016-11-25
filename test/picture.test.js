import Picture from "./../src/Picture";
import Scene from "./../src/Scene";


describe("Picture testing", () => {
    const path = "https://dummyimage.com/20/20/fff";
    let picture;

    it("should load image", (done) => {
        picture = new Picture(path, () => {
            done();
        });
    });

    it("should not load until we pass a path", (done) => {
        picture = new Picture();

        expect(picture.loaded).toBeFalsy();
        picture.load(path, () => {
            done();
        });
    });

    it("should throw an error when loading a picture without any path", () => {
        picture = new Picture();

        expect(() => { picture.load(); }).toThrowError();
    });

    it("should not render picture if it is not loaded", () => {
        picture = new Picture();

        expect(picture.render()).toBeNull();
    });

    it("should render a picture", (done) => {
        const scene = new Scene();

        scene.width(20);
        scene.height(20);
        scene.initialize();
        picture.setData("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAElBMVEUgICD///9XV1dzc3M7OzuPj49aCGd5AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAPUlEQVQImWNgoBVgAZMuQFrFyADEV1IxYjBmMGBiUGAA0gzODAYgismZgYEZwnRiZgCqVQAqYAoCqqUYAADM/gTfJ366qgAAAABJRU5ErkJggg==");
        scene.canvas.clear();
        picture.render(scene.canvas.context, 0, 0);
        done();
    });
});
