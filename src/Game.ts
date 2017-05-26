import { SideralObject } from "./SideralObject";
import { Scene } from "./Scene";

import { Keyboard } from "./Tool/Keyboard";
import { Util } from "./Tool/Util";
import { Signal } from "./Tool/Signal";

import { IGameProps } from "./Interface";


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
        background  : "#DDDDDD",
        container   : document.getElementById("sideral")
    };

    /**
     * The current frame per second of the game
     * @readonly
     */
    fps: number = 60;

    /**
     * The current latency of the game (in ms)
     */
    latency: number = 0;

    /**
     * The factor of time to avoid framerate dependance
     */
    tick: number = 1;

    /**
     * The date of the current update in timestamp
     */
    currentUpdate: number = 0;

    /**
     * The date of the last update in timestamp
     */
    lastUpdate: number = 0;

    /**
     * Know if the game is currently running or not
     */
    stopped: boolean = true;

    /**
     * The keyboard event manager (you must enable it before use it)
     */
    keyboard: Keyboard;


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor (width: number, height: number) {
        super();

        this.props.width    = width;
        this.props.height   = height;
        this.renderer       = PIXI.autoDetectRenderer(this.props.width, this.props.height, { autoResize: true, roundPixels: false });

        this.context.game = this;

        this.signals.keyPress = new Signal();

        this.signals.propChange.bind("dom", this._attachGame.bind(this));
        this.signals.propChange.bind(["width", "height"], this._resizeGame.bind(this));
        this.signals.propChange.bind("background", this._backgroundChange.bind(this));
    }

    /**
     * Update loop
     * @override
     * @lifecycle
     * @param {number=} performance - performance returned by the navigator
     * @returns {void|null} -
     */
    update (performance?: number) {
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

        this.children.forEach(scene => scene.update(this.tick));
        this.children.forEach(scene => this.renderer.render(scene.container));

        this.nextCycle();

        this.lastUpdate     = window.performance.now();
    }


    /* METHODS */

    /**
     * Start the game loop
     * @acess public
     * @param width - width of the game
     * @param height - height of the game
     * @param dom - dom to attach the game
     * @returns current instance
     */
    start (width: number, height: number, dom?): this {
        this.setProps({
            width   : width || this.props.width,
            height  : height || this.props.height,
            dom     : dom || this.props.dom
        });

        if (!this.props.width || !this.props.height || !this.props.dom) {
            throw new Error("Engine.start: You must set 'width', 'height' and a 'dom' container");
        }

        this.stopped = false;
        this._attachGame();
        this._resizeGame();
        this.update();

        return this;
    }

    /**
     * resize the current canvas
     * @returns -
     */
    resize () {
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


    /* PRIVATE */

    /**
     * Attach the game to the dom in props
     * @private
     * @returns {void}
     */
    _attachGame () {
        if (this.last.container) {
            try {
                this.last.container.removeChild(this.renderer.view);
            } catch (e) { }
        }

        if (this.props.container) {
            this.props.container.appendChild(this.renderer.view);
        }
    }

    /**
     * When width or height attributes change
     * @private
     * @returns {void|null} -
     */
    _resizeGame () {
        if (!this.renderer) {
            return null;
        }

        this.renderer.resize(this.props.width, this.props.height);
    }

    /**
     * When background attribute changes
     * @private
     * @returns {void}
     */
    _backgroundChange () {
        const color = Util.colorToDecimal(this.props.background) as number;

        if (!isNaN(color)) {
            this.renderer.backgroundColor = color;
        }
    }
}

PIXI.utils.skipHello();
