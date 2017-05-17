import Entity from "./../Entity";

import Game from "./../Game";

import Enum from "./../Tool/Enum";

import "pixi-particles";


/**
 * Generator of particles
 * @class Particles
 * @extends Entity
 */
export default class Particles extends Entity {

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
         * @property {number} duration - Lifetime of the particles engine
         * @property {boolean} autoRun - if True, the particles will be emitted once the textures has been loaded
         */
        this.setProps({
            config      : null,
            images      : [],
            duration    : 0,
            autoRun     : true
        });

        this.type       = Enum.TYPE.NONE;
        this.loaded     = false;

        /**
         * PIXI Emitter object
         * @readonly
         * @type {PIXI.particles.Emitter}
         * @default null
         */
        this.emitter = new PIXI.particles.Emitter(this.container);

        window.particles = this;

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
    update () {
        super.update();

        if (this.emitter.emit && this.loaded) {
            this.emitter.resetPositionTracking();
            this.emitter.updateSpawnPos(this.props.x, this.props.y);
            this.emitter.update((Game.currentUpdate - Game.lastUpdate) * 0.001);
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
    updateContainerPosition () { }

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
        }

        /*
        const loader = new PIXI.loaders.Loader();

        [].concat(this.props.images).forEach(image => loader.add(image));

        this.loaded = false;

        loader.load((currentLoader, resources) => {
            this.emitter.cleanup();
            this.emitter.init(Object.keys(resources).map(key => resources[key]), this.props.config);
            this.loaded         = true;

            if (this.props.autoRun) {
                this.run();
            }
        });
        */
    }
}
