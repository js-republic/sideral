import Animation from "./../../src/Entity/Animation";
import Scene from "./../../src/Scene";
import Entity from "./../../src/Entity";


describe("Animation ", () => {
    const path = "https://dummyimage.com/20/20/fff";
    let animation;

    it("should be named 'animation'", () => {
        animation = new Animation();

        expect(animation.name).toBe("animation");
    });

    it("should create a sprite", () => {
        const scene = new Scene();
        animation = new Animation({ path: path, width: 10, height: 10, duration: 1, frames: [0] });

        scene.compose(animation);
        expect(animation.sprite.animation.name).toBe("idle");
    });

    it("should follow an entity", () => {
        const scene = new Scene(),
            entity = new Entity({ x: 10, y: 10 });

        animation = new Animation({ path: path, width: 10, height: 10 });

        scene.compose(entity).compose(animation);
        animation.follow = entity;
        scene.update();

        expect(animation.x).toBe(10);
    });
});
