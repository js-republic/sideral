import { Entity } from "../Entity";

import { Enum } from "../Tool/Enum";


export class Effect extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     * @lifecycle
     */
    constructor () {
        super();

        this.setProps({
            gravityFactor   : 0,
            follow          : null,
            duration        : 0,
            maxLoop         : -1,
            maxDuration     : 0,
            frames          : null,
            path            : null
        });

        this.type = Enum.TYPE.NONE;
    }

    /**
     * @intialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        if (this.props.centered) {
            this.props.x -= this.props.width / 2;
            this.props.y -= this.props.height / 2;
        }

        if (this.props.path) {
            this.addSprite(this.props.path, this.props.width, this.props.height);

            if (this.props.frames) {
                this.sprite.addAnimation("idle", this.props.duration, this.props.frames, this.props.maxLoop);
            }

            if (this.props.maxLoop > 0) {
                this.timers.add("effect", this.props.duration * this.props.maxLoop, this.kill.bind(this));

            } else if (this.props.maxDuration) {
                this.timers.add("effet", this.props.maxDuration, this.kill.bind(this));
            }
        }
    }
}
