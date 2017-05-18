import { Module } from "./Module";

import { currentGame } from "./Game";


/**
 * Class representing the simplest scene to add Entity
 * @class Scene
 * @extends Module
 */
export class Scene extends Module {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({

            /**
             * The scale of the scene
             * @name Scene#scale
             * @type {number}
             * @default 1
             */
            scale   : 1,

            /**
             * Follow and center the camera position to the following entity
             * @name Scene#follow
             * @type {Entity}
             * @default null
             */
            follow  : null,

            width   : currentGame.props.width,
            height  : currentGame.props.height
        });

        this.signals.update.add(this.updateFollow.bind(this));
    }


    /* EVENTS */

    /**
     * Update the position of the camera related to the following entity
     * @event update
     * @returns {void}
     */
    updateFollow () {
        if (this.props.follow) {
            const follow = this.props.follow;

            if (!follow.killed) {
                this.props.x = -(follow.props.x + (follow.props.width / 2) - (this.props.width / 2));
                this.props.y = -(follow.props.y + (follow.props.height / 2) - (this.props.height / 2));

            } else {
                this.props.follow = null;

            }
        }
    }
}
