import Element from "../../src/Element";
import Canvas from "../../src/components/Canvas";


describe("canvas testing", () => {
    let canvas;

    it("should be created with correct size", () => {
        canvas = new Canvas(100, 100);
        expect(canvas.width()).toBe(100);
    });

    it("should be render to body when initialized", () => {
        const element = new Element();

        element.compose(new Canvas(100, 100, document.body));
        expect(document.getElementById(element.canvas.id).parentNode).toBe(document.body);
    });

    it("should resizing the canvas dom element", () => {
        const element = new Element();

        element.compose(new Canvas(100, 100, document.body));
        element.canvas.width(50);
        element.canvas.height(150);
        expect(document.getElementById(element.canvas.id).width).toBe(50);
    });

    it("should clear the canvas with color passed by parameter", () => {
        const element = new Element();

        canvas = new Canvas(10, 10);

        element.compose(canvas);
        canvas.clear("white");
        expect(canvas.context.getImageData(0, 0, 1, 1).data[0]).toBe(255);
    });
});