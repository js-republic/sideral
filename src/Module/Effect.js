import Entity from "./../Entity";


export default class Effect extends Entity {

    /* LIFECYCLE */

    /**
     * @constructor
     * @lifecycle
     */
    constructor () {
        super();

        this.setProps({
            gravityFactor   : 0,
            centered        : false,
            offsetX         : 0,
            offsetY         : 0,
            follow          : null,
            duration        : 10,
            path            : null
        });

        this.signals.update.bind(this.updateFollow.bind(this));
    }

    /**
     * @intialize
     * @lifecycle
     * @override
     */
    initialize (props) {
        super.initialize(props);

        this.timers.add("effect", this.duration, this.kill.bind(this));
    }


    /* EVENTS */

    /**
     * Update the position if there is an entity to follow
     * @returns {void}
     */
    updateFollow () {
        if (this.props.follow) {
            this.props.x = this.props.follow.props.x + this.props.offsetX - (this.props.centered ? this.props.width / 2 : 0);
            this.props.y = this.props.follow.props.y + this.props.offsetY - (this.props.centered ? this.props.height / 2 : 0);
        }
    }
}
