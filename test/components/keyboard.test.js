import Keyboard from "./../../src/Component/Keyboard";
import Engine from "./../../src/Engine";


describe("keyboard tests ", () => {
    beforeEach(() => {
        Engine.compose(new Keyboard());
    });

    it("should be attached to engine", () => {
        expect(Engine.keyboard).toBeTruthy();
    });

    it("should trigger keydown", () => {
        const e = $j.Event('keydown');
        e.keyCode = 65; // Character 'A'

        Engine.keyboard.onKeydown(e);
        expect(Engine.keyboard._input[65]).toBeTruthy();
    });

    it("should trigger keyup", () => {
        const e = $j.Event("keydown"),
            e2 = $j.Event("keyup");

        e.keyCode = 65;
        e2.keyCode = 65;

        Engine.keyboard.onKeydown(e);
        Engine.keyboard.onKeyup(e);
        expect(Engine.keyboard._input[65]).toBe("released");
    });
});