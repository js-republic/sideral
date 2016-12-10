import Sprite from "./../../src/Component/Sprite";


describe("Sprite component", () => {
    const path = "https://dummyimage.com/20/20/fff";
    let sprite,
        entity;

    it("should be named 'sprite'", () => {
        sprite = new Sprite({ path: path });
        expect(sprite.name).toBe("sprite");
    });

    it("should throw an error if we donnot provide any path to the sprite constructor", () => {
        expect(() => { new Sprite(); }).toThrowError();
    });

    it("should set tilesize of bitmap", () => {
        sprite = new Sprite({ path: path, width: 50, height: 50 });

        expect(sprite.bitmap.tilesize.width).toBe(50);
    });

    it("should add animation", () => {
        sprite = new Sprite({ path: path });

        sprite.addAnimation("idle", 1, [0]);
        expect(sprite.getAnimationByName("idle")).not.toBeNull();
    });

    it("shouldnot add animation", () => {
        sprite = new Sprite({ path: path });

        expect(() => { sprite.addAnimation(); }).toThrowError();
    });

    it("should remove animation", () => {
        sprite = new Sprite({ path: path });

        sprite.addAnimation("idle", 1, [0]);
        expect(sprite.removeAnimation("idle")).toBeTruthy();
        expect(sprite.getAnimationByName("idle")).toBeUndefined();
    });

    it("shouldnot remove animation", () => {
        sprite = new Sprite({ path: path });

        sprite.addAnimation("move", 1, [0]);
        sprite.removeAnimation("idle");
        expect(sprite.animations.length).toBe(1);
    });

    it("should set the current animation", () => {
        sprite = new Sprite({ path: path });

        sprite.addAnimation("idle", 1, [0]);
        sprite.currentAnimation("idle", true);
        expect(sprite.animation.name).toBe("idle");
    });

    it("should return the correct duration animation", () => {
        sprite = new Sprite({ path: path });

        sprite.addAnimation("idle", 0.5, [0, 1, 2]);
        expect(sprite.getAnimationDuration("idle")).toBe(1.5);
        expect(sprite.getAnimationDuration("idle", 2)).toBe(4.5);
    });

    it("should update the animation", () => {
        sprite = new Sprite({ path: path });

        sprite.addAnimation("idle", 1, [0, 1]);
        sprite.currentAnimation("idle");
        sprite.update();

        expect(sprite.animation.frame).toBe(1);
    });

    it("should loop the animation", () => {
        sprite = new Sprite({ path: path, width: 10, height: 10 });

        sprite.addAnimation("idle", 1, [0, 1]).currentAnimation("idle");
        sprite.update();
        sprite.update();
        expect(sprite.animation.loop).toBe(1);
        expect(sprite.animation.frame).toBe(0);
    });
});
