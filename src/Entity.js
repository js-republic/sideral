import AbstractClass from "./Abstract/AbstractClass";


export default class Entity extends AbstractClass {

    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            gravityFactor   : 0,
            vx              : 0,
            vy              : 0,
            x               : 0,
            y               : 0
        });

        this.falling    = false;
        this.standing   = false;
        this.moving     = false;
    }


    /* METHODS */

    addEntity (entity, x, y, settings = {}) {
        settings.scene = this;

        this.children.push(entity);

        entity.initialize(x, y, settings);
        this.container.addChild(entity.container);

        return entity;
    }
}
