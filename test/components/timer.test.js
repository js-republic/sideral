import Element from "./../../src/Element";
import Timer from "./../../src/Component/Timer";


describe("Timer testing", () => {
    let timer,
        element;

    beforeEach(() => {
        element = new Element();
    });

    it("should be initialized with correct value", () => {
        timer = new Timer({ duration: 10 });
        expect(timer.value).toBe(10);
    });

    it("should be initialized when attached to an element", () => {
        let initialized = false;

        element.compose(new Timer({
            duration: 10,
            eventInit: () => { initialized = true; }
        }));

        expect(initialized).toBeTruthy();
    });

    it("should call completed when timer is finished", () => {
        let completed = false;

        element.compose(new Timer({
            duration: 1,
            eventComplete: () => { completed = true; }
        }));

        element.update();
        expect(completed).toBeTruthy();
    });

    it("should update when element which compose it is updated", () => {
        element.compose(new Timer({ duration: 10 }));
        element.update();
        expect(element.timer.value).toBe(9);
    });

    it("should have a correct value rationed", () => {
        timer = new Timer({ duration: 10 });

        expect(timer.getValueRationed()).toBe(1);
    });

    it("should stop the timer", () => {
        element.compose(new Timer({ duration: 10 }));
        element.update();
        element.timer.stop();
        element.update();

        expect(element.timer.value).toBe(9);
    });

    it("should restart the timer", () => {
        element.compose(new Timer({ duration: 10 }));
        element.update();
        element.timer.restart();

        expect(element.timer.value).toBe(10);
    });

    it("should convert frames to ms", () => {
        expect(Timer.toMs(60)).toBe(1);
    });

    it("should restart to initial value with recurrence", () => {
        element.compose(new Timer({ duration: 1, recurrence: 1 }));
        element.update();

        expect(element.timer.value).toBe(1);
    });

    it("should reverse the tendance when there is recurrence and reversible", () => {
        element.compose(new Timer({ duration: 2, recurrence: 1, reversible: true }));
        element.update();
        element.update();
        element.update();

        expect(element.timer.value).toBe(1);
    });
});
