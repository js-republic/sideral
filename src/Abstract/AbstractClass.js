import Signal from "./../Command/Signal";
import TimerManager from "./../Command/TimerManager";


export default class AbstractClass {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {

        /**
         * Unique id for the current object
         * @type {string}
         */
        this.id = AbstractClass.generateId();

        /**
         * Properties of the class
         * @type {{}}
         */
        this.props      = {};

        /**
         * Last value of properties of the class
         * @readonly
         * @type {{}}
         */
        this.last       = {};

        /**
         * Slots for signals
         * @type {*}
         */
        this.signals    = {
            update      : new Signal(),
            propChange  : new Signal()
        };

        /**
         * Children of AbstractClass
         * @readonly
         * @type {Array<Object>}
         */
        this.children   = [];

        /**
         * Know when the object has been initialized by a parent
         * @readonly
         * @type {boolean}
         */
        this.initialized = false;

        /**
         * List of current timers
         * @type {TimerManager}
         */
        this.timers     = new TimerManager();

        /**
         * Parent of the object
         * @type {*}
         */
        this.parent     = null;

        /**
         * PIXI Container
         * @type {*}
         */
        this.container  = new PIXI.Container();

        /**
         * Know if the object is killed
         * @type {boolean}
         */
        this.killed     = false;
    }

    /**
     * When initialized by a parent
     * @lifecycle
     * @param {Object} props: properties to merge
     * @returns {void}
     */
    initialize (props = {}) {
        Object.keys(props).forEach(key => this.props[key] = props[key]);

        this.initialized = true;
    }

    /**
     * Kill event
     * @lifecycle
     * @returns {void}
     */
    kill () {
        Object.keys(this.signals).forEach(key => this.signals[key].removeAll());

        this.children.forEach(child => child.kill());

        if (this.container) {
            this.container.destroy(true);
        }

        if (this.parent) {
            this.parent.children = this.parent.children.filter(child => child.id !== this.id);
        }

        this.killed = true;
    }

    /**
     * Update called every loop
     * @lifecycle
     * @returns {void}
     */
    update () {
        this.children.forEach(child => child.update());
        this.timers.update();
        this.signals.update.dispatch();
    }

    /**
     * Called before a new game loop
     * @lifecycle
     * @returns {void}
     */
    nextCycle () {
        this.children.forEach(child => child.nextCycle());

        Object.keys(this.props).forEach(key => {
            if (this.props[key] !== this.last[key]) {
                this.signals.propChange.dispatch(key, this.props[key]);
            }

            this.last[key] = this.props[key];
        });
    }


    /* METHODS */

    /**
     * Set new properties to the object
     * @param {Object} props: properties to merge
     * @returns {*} current instance
     */
    setProps (props) {
        Object.keys(props).forEach(key => this.last[key] = this.props[key] = props[key]);

        return this;
    }

    /**
     * Swap the current PIXI container to another PIXI container
     * @param {*} nextContainer: PIXI Container
     * @returns {void|null} -
     */
    swapContainer (nextContainer) {
        if (!this.parent || (this.parent && !this.parent.container)) {
            return null;
        }

        const containerIndex    = this.parent.container.children.findIndex(child => child === this.container),
            children            = this.container.children.slice(0);

        this.parent.container.removeChild(this.container);
        this.container.destroy();

        if (containerIndex > -1) {
            this.parent.container.addChildAt(nextContainer, containerIndex);
        } else {
            this.parent.container.addChild(nextContainer);
        }

        this.container = nextContainer;
        children.forEach(child => this.container.addChild(child));
    }

    /**
     * Add an item to the current object
     * @param {Object} item: an AbstractClass inheritance item
     * @param {Object=} settings: props to merge to the item
     * @param {number=} index: set an index position for the item
     * @returns {Object} the item initialized
     */
    add (item, settings = {}, index) {
        if (!(item instanceof AbstractClass)) {
            throw new Error("AbstractClass.add : item must be an instance of Sideral Abstract Class");
        }

        item.parent = this;

        this.children.push(item);
        item.initialize(settings);

        if (item.container && this.container) {
            if (typeof index !== "undefined") {
                this.container.addChildAt(item.container, index);
            } else {
                this.container.addChild(item.container);
            }
        }

        return item;
    }

    /**
     * Check if a property has changed
     * @param {string} propName: name of the property to check
     * @returns {boolean} property has changed ?
     */
    hasChanged (propName) {
        if (!this.props[propName]) {
            return false;
        }

        return this.props[propName] !== this.last[propName];
    }


    /* STATICS */

    /**
     * Generate an unique id
     * @returns {string} return the unique id
     */
    static generateId () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
}
