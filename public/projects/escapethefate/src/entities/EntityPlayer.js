import Entity from "src/Entity";
import Engine from "src/Engine";


export default (props = {}) => new Entity({
    components: [],

    props: Object.assign({
        width   : 20,
        height  : 20,
        debug   : true
    }, props),

    beforeUpdate () {
        if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_RIGHT)) {
            this.x += 10;

        } else if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_LEFT)) {
            this.x -= 10;

        } else if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_UP)) {
            this.y -= 10;

        } else if (Engine.keyboard.isHeld(Engine.keyboard.KEY.ARROW_DOWN)) {
            this.y += 10;

        }
    }
});
