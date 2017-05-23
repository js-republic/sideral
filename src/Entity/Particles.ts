import { Entity } from "../Entity";
import { Scene } from "../Scene";

import { Enum } from "../Tool/Enum";

import "pixi-particles";


/**
 * Generator of particles
 * @class Particles
 * @extends Entity
 */
export class Particles extends Entity {

    /* ATTRIBUTES */

    loaded: boolean = false;
    type: number    = Enum.TYPE.NONE;
    emitter: any    = null;


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        /**
         * Properties of the class
         * @name Particles#props
         * @type {Object}
         * @property {Entity} follow - If "follow" is not null, the particles will follow the entity
         * @property {Array<string>|string} images - List of all images used for the particles (mustnot be null)
         * @property {Object} config - Configuration Object for the particles
         * @property {boolean} centered - If true, the position will be centered related to it's size when initialized
         * @property {boolean} autoRun - if True, the particles will be emitted once the textures has been loaded
         */
        this.setProps({
            config      : null,
            images      : [],
            duration    : 0,
            autoRun     : true
        });

        /**
         * PIXI Emitter object
         * @readonly
         * @type {PIXI.particles.Emitter}
         * @default null
         */
        this.emitter = new (<any>PIXI.particles).Emitter(this.container, null, { emit: false });

        this.signals.propChange.bind("config", this.onConfigurationChange.bind(this));
        this.signals.update.add(this.updateFollow.bind(this));
    }

    /**
     * @override
     */
    kill () {
        super.kill();

        if (this.emitter) {
            this.emitter.destroy();
        }
    }

    /**
     * @update
     * @override
     */
    update (tick) {
        super.update(tick);

        if (this.emitter.emit && this.loaded) {
            this.emitter.resetPositionTracking();
            this.emitter.updateSpawnPos(this.props.x, this.props.y);
            this.emitter.update((this.context.game.currentUpdate - this.context.game.lastUpdate) * 0.001);
        }
    }


    /* METHODS */

    run () {
        if (this.props.duration) {
            this.timers.add("duration", this.props.duration, this.kill.bind(this));
        }

        this.emitter.emit = true;
    }

    stop () {
        this.timers.remove("duration");
        this.emitter.cleanup();

        this.emitter.emit = false;
    }

    isRunning () {
        return this.emitter.emit;
    }


    /* EVENTS */

    /**
     * @override
     */
    updateContainerPosition () {}

    /**
     * When property "configuration" has changed
     * @access protected
     * @returns {void}
     */
    onConfigurationChange () {
        this.emitter.cleanup();
        this.emitter.init([].concat(this.props.images).map(image => PIXI.Texture.fromImage(image)), this.props.config);
        this.loaded         = true;

        if (this.props.autoRun) {
            this.run();

        } else {
            this.emitter.emit = false;
        }
    }
}