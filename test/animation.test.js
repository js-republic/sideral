import Animation from "./../src/Animation";
import Scene from "./../src/Scene";
import Entity from "./../src/Entity";


describe("Animation ", () => {
    const path = "https://dummyimage.com/20/20/fff";
    let animation;

    it("should be named 'animation'", () => {
        animation = new Animation();

        expect(animation.name).toBe("animation");
    });

    it("should create a sprite", () => {
        const scene = new Scene();
        animation = new Animation(path, 10, 10, 1, [0]);

        scene.attachEntity(animation);
        expect(animation.sprite.animation.name).toBe("idle");
    });

    it("should follow an entity", () => {
        const scene = new Scene(),
            entity = new Entity();

        animation = new Animation(path, 10, 10);

        scene.attachEntity(entity, 10, 10).attachEntity(animation);
        animation.follow = entity;
        scene.update();
        expect(animation.x()).toBe(10);
    })
});
