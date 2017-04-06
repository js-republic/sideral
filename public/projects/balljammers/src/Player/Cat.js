import Player from "./../Player";


export default class PlayerCat extends Player {

    /* LIFECYCLE */

    initialize (props) {
        super.initialize(props);

        this.name   = "cat";

        this.size(25, 45);
        this.setSpritesheet("images/characters/cat.png", 65, 65, { x: 5, y: 7 });
    }
}
