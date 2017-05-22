import { SideralObject } from "./SideralObject";
import { Util } from "./Tool/Util";
import { Signal } from "./Tool/Signal";
import { Scene } from "./Scene";


/**
 * The engine of the game
 * @class Game
 * @extends SideralObject
 */
export class Game extends SideralObject {
    inputs: any             = {};
    _inputs: any            = {};
    fps: number             = 60;
    latency: number         = 0;
    tick: number            = 1;
    currentUpdate: number   = 0;
    lastUpdate: number      = 0;
    stopped: boolean        = true;
    KEY: any;
    preventInputPropagation: boolean = true;
    renderer: PIXI.SystemRenderer;

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        /**
         * Properties of the class
         * @name Game#props
         * @type {Object}
         * @property {number} width - The width of the game
         * @property {number} height - The height of the game
         * @property {Element} dom - The DOM Element to attach the game
         * @property {string} background - The color of the background of the game
         */
        this.setProps({
            width       : 10,
            height      : 10,
            dom         : document.getElementById("sideral"),
            background  : "#DDDDDD"
        });

        /**
         * @override
         */
        this.renderer  = PIXI.autoDetectRenderer(this.props.width, this.props.height, { autoResize: true, roundPixels: false });

        /**
         * List of all keyboard input pressed or released
         * @type {Object}
         * @name Game#inputs
         * @readonly
         */
        this.inputs     = {};
        this._inputs    = {};

        /**
         * The current frame per second of the engine
         * @readonly
         * @name Game#fps
         * @type {number}
         */
        this.fps        = 60;

        /**
         * The current latency of the game (in ms)
         * @readonly
         * @name Game#latency
         * @type {number}
         */
        this.latency    = 0;

        /**
         * The factor of velocity of object related to the latency
         * @readonly
         * @name Game#tick
         * @type {number}
         */
        this.tick       = 1;

        /**
         * The date of the current update in timestamp
         * @readonly
         * @name Game#currentUpdate
         * @type {number}
         */
        this.currentUpdate = 0;

        /**
         * The date of the last update in timestamp
         * @readonly
         * @name Game#lastUpdate
         * @type {number}
         */
        this.lastUpdate = 0;

        /**
         * Know if the game is currently looping or not
         * @readonly
         * @name Game#stopped
         * @type {boolean}
         */
        this.stopped    = true;

        /**
         * If true, the keyboard event will not be propaged
         * @name Game#preventInputPropagation
         * @type {boolean}
         */
        this.preventInputPropagation    = true;

        this.context.game = this;

        this.signals.keyPress = new Signal();

        this.signals.propChange.bind("dom", this._attachGame.bind(this));
        this.signals.propChange.bind(["width", "height"], this._resizeGame.bind(this));
        this.signals.propChange.bind("background", this._backgroundChange.bind(this));

        window.addEventListener("keydown", this._onKeydown.bind(this));
        window.addEventListener("keyup", this._onKeyup.bind(this));
    }

    /**
     * @override
     */
    kill () {
        super.kill();

        window.removeEventListener("keydown", this._onKeydown.bind(this));
        window.removeEventListener("keyup", this._onKeydown.bind(this));
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

        this._updateInputs();

        this.children.forEach(scene => scene.update(this.tick));
        this.children.forEach(scene => this.renderer.render(scene.container));

        this.nextCycle();

        this.lastUpdate     = window.performance.now();
    }


    /* METHODS */

    /**
     * @override
     */
    add (item: Scene, props: any = {}, index?: number): Scene {
        if (!(item instanceof Scene)) {
            throw new Error("Game.add : object must be an instance of Sideral Scene Class.");
        }

        if (typeof index !== "undefined") {
            this.children.splice(index, 0, item);

        } else {
            this.children.push(item);
        }

        item.parent = this;

        Object.keys(this.context).forEach(key => item.context[key] = this.context[key]);
        item.initialize(props);

        return item;
    }

    /**
     * Start the game loop
     * @acess public
     * @param {number=} width - width of the game
     * @param {number=} height - height of the game
     * @param {Element=} dom - dom to attach the game
     * @returns {Game} current instance
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
     * @returns {void|null} -
     */
    resize () {
        if (!this.renderer) {
            return null;
        }

        this.renderer.resize(this.props.width, this.props.height);
    }


    /* PRIVATE */

    /**
     * Update all device inputs
     * @private
     * @returns {void}
     */
    _updateInputs () {
        const HOLD      = "HOLD",
            PRESSED     = "PRESSED",
            RELEASED    = "RELEASED";

        for (const key in this._inputs) {
            if (!this._inputs.hasOwnProperty(key)) {
                continue;
            }

            const input = this.inputs[key],
                _input = this._inputs[key];

            // Pressed
            if (_input === PRESSED) {
                if (input === _input) {
                    this.inputs[key] = HOLD;

                } else if (input !== HOLD) {
                    this.inputs[key] = PRESSED;
                    this.signals.keyPress.dispatch(key, true);
                }

            // Released
            } else if (_input === RELEASED) {
                if (!input) {
                    this.inputs[key] = PRESSED;

                } else if (input === _input) {
                    delete this.inputs[key];
                    delete this._inputs[key];

                } else {
                    this.inputs[key] = RELEASED;
                    this.signals.keyPress.dispatch(key, false);
                }
            }
        }
    }

    /**
     * Attach the game to the dom in props
     * @private
     * @returns {void}
     */
    _attachGame () {
        if (this.last.dom) {
            try {
                this.last.dom.removeChild(this.renderer.view);
            } catch (e) { }
        }

        if (this.props.dom) {
            this.props.dom.appendChild(this.renderer.view);
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

    /**
     * event on keydown
     * @event keydown
     * @param {*} e - event
     * @returns {Boolean} Input propagation
     */
    _onKeydown (e) {
        if (this.preventInputPropagation) {
            e.preventDefault();
            e.stopPropagation();
        }

        this._inputs[e.keyCode] = "PRESSED";

        return !this.preventInputPropagation;
    }

    /**
     * event on keyup
     * @event keyup
     * @param {*} e - event
     * @returns {Boolean} Input propagation
     */
    _onKeyup (e) {
        if (this.preventInputPropagation) {
            e.preventDefault();
            e.stopPropagation();
        }

        this._inputs[e.keyCode] = "RELEASED";

        return !this.preventInputPropagation;
    }
}

PIXI.utils.skipHello();
