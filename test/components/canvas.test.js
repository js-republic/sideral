import Component from "./../../src/Component";
import Canvas from "./../../src/Component/Canvas";


describe("canvas testing", () => {
    let canvas;

    it("should be created with correct size", () => {
        canvas = new Canvas({ width: 100, height: 100 });
        expect(canvas.width).toBe(100);
    });

    it("should be render to body when initialized", () => {
        const component = new Component();

        component.compose(new Canvas({ width: 100, height: 100, parentDOM: document.body }));
        expect(document.getElementById(component.canvas.id).parentNode).toBe(document.body);
    });

    it("should resizing the canvas dom element", () => {
        const component = new Component();

        component.compose(new Canvas({ width: 100, height: 100, parentDOM: document.body }));
        component.canvas.width = 50;
        component.update();

        expect(document.getElementById(component.canvas.id).width).toBe(50);
    });

    it("should clear the canvas with color passed by parameter", () => {
        const component = new Component();

        canvas = new Canvas({ width: 10, height: 10 });

        component.compose(canvas);
        canvas.clear("white");

        expect(canvas.context.getImageData(0, 0, 1, 1).data[0]).toBe(255);
    });
});