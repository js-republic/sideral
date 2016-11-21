import Element from "../src/Element";
import Canvas from "../src/components/Canvas";


describe("element testing", () => {
    let canvas;

    it("should be created with correct size", () => {
        canvas = new Canvas(100, 100);
        expect(canvas.size.width).toBe(100);
    });

    it("should be render to body when initialized", () => {
        const element = new Element();

        element.compose(new Canvas(100, 100, document.body));
        expect(document.getElementById(element.canvas.id).parentNode).toBe(document.body);
    });

    it("should resizing the canvas dom element", () => {
        const element = new Element();

        element.compose(new Canvas(100, 100, document.body));
        element.canvas.setSize(50, 150);
        expect(document.getElementById(element.canvas.id).width).toBe(50);
    });
});
