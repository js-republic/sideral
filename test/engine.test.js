import Engine from "./../src/Engine";
import Scene from "./../src/Scene";


describe("engine testing", () => {
    it("should be named 'engine'", () => {
        expect(Engine.name).toBe("engine");
    });

    it("should attach a scene", () => {
        Engine.compose(new Scene());
        expect(Engine.scenes.length).toBe(1);
    });

    it("should resize scene width", () => {
        Engine.width = 50;

        expect(Engine.scenes[0].width).toBe(50);
    });

    it("should resize scene height", () => {
        Engine.height = 150;

        expect(Engine.scenes[0].height).toBe(150);
    });

    it("should throw an error when you attach an empty dom", () => {
        expect(() => Engine.attachDOM()).toThrowError();
    });

    it("should throw an error when attach a scene which is not an instance of scene", () => {
        expect(() => Engine.compose(new (function test () {})())).toThrowError();
    });

    it("should attach a dom", () => {
        Engine.attachDOM(document.body);
        expect(Engine.dom.id).toBe(Engine.id);
    });

    it("should resize dom width", () => {
        Engine.attachDOM(document.body);
        Engine.width = 100;

        expect(Engine.width).toBe(100);
        expect(Engine.dom.style.width).toBe("100px");
    });

    it("should resize dom height", () => {
        Engine.attachDOM(document.body);
        Engine.height = 100;

        expect(Engine.height).toBe(100);
        expect(Engine.dom.style.height).toBe("100px");
    });

    it("should run", () => {
        Engine.run();
        expect(Engine.tick).not.toBe(0);
    });

    it("should be stopped", () => {
        Engine.stop();
        Engine.run();
        expect(Engine.tick).toBe(0);
    });

    it("should rerun", () => {
        Engine.restart();
        expect(Engine.tick).not.toBe(0);
    });
});
