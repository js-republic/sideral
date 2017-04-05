import AbstractClass from "./Abstract/AbstractClass";
import Game from "./Game";


export default class Scene extends AbstractClass {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            gravity : 0,
            scale   : 1,
            width   : Game.props.width,
            height  : Game.props.height,
            tilemap : null
        });

    }

    /**
     * When intialized by the game
     * @lifecycle
     * @param {{}=} props: properties to transmit to the current object
     * @returns {void}
     */
    initialize (props = {}) {
        this.setProps(props);

        Game.bind(Game.SIGNAL.KEY_PRESS(Game.KEY.M), pressed => console.log(pressed));
    }
}
