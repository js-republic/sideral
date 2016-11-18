import Element from "./../src/Element";

describe("element testing", () => {

    let element;

    beforeEach(() => {
        element = new Element();
    });

    it("should be created", () => {

        expect(element.id).not.toBeNull();

    });

});