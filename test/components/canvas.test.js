import Element from "./../../src/Element";
import Canvas from "./../../src/Component/Canvas";


describe("canvas testing", () => {
    let canvas;

    it("should be created with correct size", () => {
        canvas = new Canvas({ width: 100, height: 100 });
        expect(canvas.width).toBe(100);
    });

    it("should be render to body when initialized", () => {
        const element = new Element();

        element.compose(new Canvas({ width: 100, height: 100, parentDOM: document.body }));
        expect(document.getElementById(element.canvas.id).parentNode).toBe(document.body);
    });

    it("should resizing the canvas dom element", () => {
        const element = new Element();

        element.compose(new Canvas({ width: 100, height: 100, parentDOM: document.body }));
        element.canvas.width = 50;
        element.update();

        expect(document.getElementById(element.canvas.id).width).toBe(50);
    });

    it("should clear the canvas with color passed by parameter", () => {
        const element = new Element();

        canvas = new Canvas({ width: 10, height: 10 });

        element.compose(canvas);
        canvas.clear("white");

        expect(canvas.context.getImageData(0, 0, 1, 1).data[0]).toBe(255);
    });
});