import Component from "./../../src/Component";
import Timer from "./../../src/Component/Timer";


describe("Timer testing", () => {
    let timer,
        component;

    beforeEach(() => {
        component = new Component();
    });

    it("should be initialized with correct value", () => {
        timer = new Timer({ duration: 10 });
        expect(timer.value).toBe(10);
    });

    it("should be initialized when attached to an element", () => {
        let initialized = false;

        component.compose(new Timer({
            duration: 10,
            eventInit: () => { initialized = true; }
        }));

        expect(initialized).toBeTruthy();
    });

    it("should call completed when timer is finished", () => {
        let completed = false;

        component.compose(new Timer({
            duration: 1,
            eventComplete: () => { completed = true; }
        }));

        component.update();
        expect(completed).toBeTruthy();
    });

    it("should update when element which compose it is updated", () => {
        component.compose(new Timer({ duration: 10 }));
        component.update();
        expect(component.timer.value).toBe(9);
    });

    it("should have a correct value rationed", () => {
        timer = new Timer({ duration: 10 });

        expect(timer.getValueRationed()).toBe(1);
    });

    it("should stop the timer", () => {
        component.compose(new Timer({ duration: 10 }));
        component.update();
        component.timer.stop();
        component.update();

        expect(component.timer.value).toBe(9);
    });

    it("should restart the timer", () => {
        component.compose(new Timer({ duration: 10 }));
        component.update();
        component.timer.reset();

        expect(component.timer.value).toBe(10);
    });

    it("should convert frames to ms", () => {
        expect(Timer.toMs(60)).toBe(1);
    });

    it("should restart to initial value with recurrence", () => {
        component.compose(new Timer({ duration: 1, recurrence: 1 }));
        component.update();

        expect(component.timer.value).toBe(1);
    });

    it("should reverse the tendance when there is recurrence and reversible", () => {
        component.compose(new Timer({ duration: 2, recurrence: 1, reversible: true }));
        component.update();
        component.update();
        component.update();

        expect(component.timer.value).toBe(1);
    });
});
