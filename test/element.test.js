import Element from "../src/Element";
import Component from "../src/components/Component";


describe("element testing", () => {
    let element;

    beforeEach(() => {
        element = new Element();
    });

    it("should be created", () => {
        expect(element.id).not.toBeNull();
    });

    it("should be destroyed", () => {
        element.destroy();
        expect(element.destroyed).toBeTruthy();
    });

    it("should be reset", () => {
        element.destroy();
        element.reset();
        expect(element.destroyed).toBeFalsy();
    });

    it("should add the component", () => {
        element.compose(new Component());
        expect(element.components.length).toBe(1);
    });

    it("should throw an error if the component is not an instance of Component", () => {
        expect(() => element.compose(new Element())).toThrow();
    });

    it("should decompose a component", () => {
        element.compose(new Component());
        element.decompose("component");

        expect(element.components.length).toBe(0);
    });

    it("should return true if element is composed of a component", () => {
        element.compose(new Component());
        expect(element.isComposedOf("component")).toBeTruthy();
    });

    it("should return false if element is not composed of a component passed in parameters", () => {
        element.compose(new Component());
        expect(element.isComposedOf("componentThatDoesntExist")).toBeFalsy();
    });

    it("should remove all components when element is destroyed", () => {
        element.compose(new Component());
        element.destroy();
        expect(element.components.length).toBe(0);
    });

    it("should add destroy function into componentFunction when you add a component", () => {
        class ComponentExtended extends Component {
            toto () { }
        }

        element.toto = () => {};
        element.compose(new ComponentExtended());
        expect(element.componentFunctions.toto.length).toBe(1);
    });

    it("should call components function with same function name", () => {
        class ComponentExtended extends Component {
            toto (value) {
                this.test = value;
            }
        }

        element.toto = function toto (value) {
            this.callComponentFunction("toto", ...arguments);
        };

        const componentExtended = new ComponentExtended();

        element.compose(componentExtended);
        element.toto(4);
        expect(componentExtended.test).toBe(4);
    });

    it("should not add componentFunction if a function of a component doesnot exist into element", () => {
        class ComponentExtended extends Component {
            toto () { }
        }

        element.compose(new ComponentExtended());
        expect(element.componentFunctions.toto).toBeUndefined();
    });

    it("should remove componentsFunction when component is decomposed from an element", () => {
        class ComponentExtended extends Component {
            toto () {}
        }

        element.toto = () => {};
        element.compose(new ComponentExtended());
        element.decompose("component");
        expect(element.componentFunctions.toto.length).toBe(0);
    });
});
