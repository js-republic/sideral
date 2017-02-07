import Mixin from "./../src/Mixin";


describe("Mixin tests", () => {
    let mixin;

    it("should be named 'mixin'", () => {
        mixin = new Mixin();

        expect(mixin.name).toBe("mixin");
    });
});
