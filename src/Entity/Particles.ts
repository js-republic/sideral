import { Entity } from "./../Entity";

import { Enum } from "./../Tool";

import { IParticlesProps } from "./../Interface";

import "pixi-particles";


/**
 * Generator of particles
 */
export class Particles extends Entity {

    /* ATTRIBUTES */

    /**
     * Properties of Particles
     */
    props: IParticlesProps;

    /**
     * Know if the particles is loaded and ready to emit
     */
    loaded: boolean = false;

    /**
     * The PIXI Emitter
     */
    emitter: any;


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            type        : Enum.TYPE.NONE,
            config      : null,
            images      : [],
            duration    : 0,
            autoRun     : true
        });

        this.emitter = new (<any>PIXI.particles).Emitter(this.container, null, { emit: false });

        this.signals.propChange.bind("config", this.onConfigurationChange.bind(this));
        this.signals.update.add(this.updateFollow.bind(this));
    }

    /**
     * @override
     */
    kill (): void {
        super.kill();

        if (this.emitter) {
            this.emitter.destroy();
        }
    }

    /**
     * @update
     * @override
     */
    update (tick): void {
        super.update(tick);

        if (this.emitter.emit && this.loaded) {
            this.emitter.resetPositionTracking();
            this.emitter.updateSpawnPos(this.props.x, this.props.y);
            this.emitter.update(tick);
        }
    }


    /* METHODS */

    /**
     * Run the particles emitter
     */
    run (): void {
        if (this.props.duration) {
            this.timers.addTimer("duration", this.props.duration, this.kill.bind(this));
        }

        this.emitter.emit = true;
    }

    /**
     * Stop the current emitter
     */
    stop (): void {
        this.timers.remove("duration");
        this.emitter.cleanup();

        this.emitter.emit = false;
    }

    /**
     * Know if this object is emitting
     */
    isRunning (): boolean {
        return this.emitter.emit;
    }


    /* EVENTS */

    /**
     * @override
     */
    updateContainerPosition (): void {}

    /**
     * When property "configuration" has changed
     * @access protected
     */
    onConfigurationChange (): void {
        this.emitter.cleanup();
        this.emitter.init([].concat(this.props.images).map(image => PIXI.Texture.fromImage(image)), this.props.config);
        this.loaded = true;

        if (this.props.autoRun) {
            this.run();

        } else {
            this.emitter.emit = false;
        }
    }
}