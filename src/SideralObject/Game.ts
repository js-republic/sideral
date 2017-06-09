import { SideralObject, Keyboard } from "./index";
import { Scene } from "./../Module";
import { Util, Assets } from "./../Tool";
import { IGameProps } from "./../Interface";


/**
 * The engine of the game
 * @class Game
 * @extends SideralObject
 */
export class Game extends SideralObject {

    /* ATTRIBUTES */

    /**
     * The PIXI System Renderer
     * @readonly
     */
    renderer: PIXI.SystemRenderer;

    /**
     * Properties of the game
     */
    props: IGameProps = {
        width       : 10,
        height      : 10,
        background  : "#DDDDDD"
    };

    container: HTMLElement = document.getElementById("sideral");

    /**
     * The current frame per second of the game
     * @readonly
     */
    fps: number = 60;

    /**
     * The current latency of the game (in ms)
     * @readonly
     */
    latency: number = 0;

    /**
     * The factor of time to avoid framerate dependance
     * @readonly
     */
    tick: number = 1;

    /**
     * The date of the current update in timestamp
     * @readonly
     */
    currentUpdate: number = 0;

    /**
     * The date of the last update in timestamp
     * @readonly
     */
    lastUpdate: number = 0;

    /**
     * Know if the game is currently running or not
     */
    stopped: boolean = true;

    /**
     * The keyboard event manager (you must enable it before use it)
     * @readonly
     */
    keyboard: Keyboard;


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.renderer       = PIXI.autoDetectRenderer(this.props.width, this.props.height, { autoResize: true, roundPixels: false });
        this.context.game   = this;

        this.signals.propChange.bind(["width", "height"], this._resizeGame.bind(this));
        this.signals.propChange.bind("background", this._backgroundChange.bind(this));
    }

    /**
     * Update loop
     * @param performance - Performance returned by the navigator
     */
    update (performance?: number): void {
        if (this.stopped) {
            return null;
        }

        performance = performance || window.performance.now();
        requestAnimationFrame(this.update.bind(this));

        // 100ms latency max
        this.currentUpdate  = performance;
        this.latency        = Util.limit(performance - this.lastUpdate, 0, 100);
        this.fps            = Math.floor(1000 / this.latency);
        this.tick           = 1000 / (this.fps * 1000);
        this.tick           = this.tick < 0 ? 0 : this.tick;

        this.children.forEach(child => child.update(this.tick));
        this.getScenes().forEach(scene => this.renderer.render(scene.container));

        this.nextCycle();

        this.lastUpdate     = window.performance.now();
    }


    /* METHODS */

    /**
     * Start the game loop
     * @acess public
     * @param width - width of the game
     * @param height - height of the game
     * @param container - container to attach the game
     * @returns current instance
     */
    start (width: number, height: number, container?: HTMLElement): this {
        this.setProps({
            width       : width || this.props.width,
            height      : height || this.props.height
        });

        if (!this.props.width || !this.props.height) {
            throw new Error("Engine.start: You must set 'width', 'height' and a 'container' container");
        }

        this.stopped = false;
        this.attach(container);
        this._resizeGame();

        // Load the global assets
        Assets.load(() => this.update());

        return this;
    }

    /**
     * resize the current canvas
     */
    resize (): void {
        if (!this.renderer) {
            return null;
        }

        this.renderer.resize(this.props.width, this.props.height);
    }

    /**
     * Enable keyboard events
     * @param preventInputPropagation - If true, the event provided by the keyboard will not be propaged outside the Sideral engine
     * @returns The current instance of Keyboard
     */
    enableKeyboard (preventInputPropagation?: boolean): Keyboard {
        this.keyboard = <Keyboard> this.add(new Keyboard());

        this.keyboard.preventInputPropagation = preventInputPropagation;

        return this.keyboard;
    }

    /**
     * Disable keyboard events
     */
    disableKeyboard (): void {
        if (this.keyboard) {
            this.keyboard.kill();
        }

        this.keyboard = null;
    }

    /**
     * Get all scenes from the current game
     * @returns Scenes
     */
    getScenes (): Array<Scene> {
        return <Array<Scene>> this.children.filter(child => child instanceof Scene);
    }

    /**
     * Attach the game to a dom
     */
    attach (container?: HTMLElement): void {
        container = container || this.container;

        if (this.container) {
            try {
                this.container.removeChild(this.renderer.view);
            } catch (e) { }
        }

        this.container = container;
        this.container.appendChild(this.renderer.view);
    }


    /* PRIVATE */

    /**
     * When width or height attributes change
     * @private
     */
    _resizeGame (): void {
        if (!this.renderer) {
            return null;
        }

        this.renderer.resize(this.props.width, this.props.height);
    }

    /**
     * When background attribute changes
     * @private
     */
    _backgroundChange (): void {
        const color = Util.colorToDecimal(this.props.background) as number;

        if (!isNaN(color)) {
            this.renderer.backgroundColor = color;
        }
    }
}

PIXI.utils.skipHello();
