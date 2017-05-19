import * as PIXI from 'pixi.js';
import { Signal } from "./Tool/Signal";
import { TimerManager } from "./Tool/TimerManager";


/**
 * The entry class of all object in Sideral
 * @class SideralObject
 */
export class SideralObject {
    id: string = SideralObject.generateId();
    props: any = {};
    last: any = {};
    signals: {[key: string]: Signal} = {
        update: null,
        propChange: null,
    };
    children: SideralObject[] = [];
    initialized = false;
    timers: TimerManager = new TimerManager();
    parent: SideralObject = null;
    container: PIXI.Container = new PIXI.Container();
    killed = false;

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {

        /**
         * Unique id for the current object
         * @name SideralObject#id
         * @type {string}
         * @default SideralObject.generateId()
         */
        this.id = SideralObject.generateId();

        /**
         * Properties of the class
         * @name SideralObject#props
         * @type {Object}
         * @default {}
         */
        this.props      = {};

        /**
         * Last value of properties of the class
         * @name SideralObject#last
         * @readonly
         * @type {Object}
         * @default {}
         */
        this.last       = {};

        /**
         * Slots for signals
         * @name SideralObject#signals
         * @type {Object}
         */
        this.signals    = {

            /**
             * Fired every time the SideralObject updates
             * @event update
             */
            update      : new Signal(),

            /**
             * Fired every time the value of a property change
             * @event propChange
             * @param {string} name - The name of the property
             * @param {*} value - The new value of the property
             * @example
             *  this.signals.propChange.add("x", () => console.log("x has changed !"));
             *  this.props.x = 2; // The event below will be executed
             */
            propChange  : new Signal()
        };

        /**
         * Children of AbstractClass
         * @name SideralObject#children
         * @readonly
         * @type {Array<SideralObject>}
         * @default []
         */
        this.children   = [];

        /**
         * Know when the object has been initialized by a parent
         * @name SideralObject#initialized
         * @readonly
         * @type {boolean}
         * @default false
         */
        this.initialized = false;

        /**
         * List of current timers
         * @type {TimerManager}
         * @name SideralObject#timers
         * @default new TimerManager()
         */
        this.timers     = new TimerManager();

        /**
         * Parent of the object
         * @type {SideralObject}
         * @name SideralObject#parent
         * @default null
         */
        this.parent     = null;

        /**
         * PIXI Container
         * @type {PIXI.Container}
         * @name SideralObject#container
         * @default new PIXI.Container()
         */
        this.container  = new PIXI.Container();

        /**
         * Know if the object is killed
         * @type {boolean}
         * @default false
         * @readonly
         * @name SideralObject#killed
         */
        this.killed     = false;
    }

    /**
     * Lifecycle - When initialized by a parent (called only once when the instance is attached to the lifecycle of the game)
     * @access public
     * @param {Object} props - properties to merge
     * @returns {void}
     */
    initialize (props: any = {}) {
        Object.keys(props).forEach(key => this.props[key] = props[key]);

        this.initialized = true;
    }

    /**
     * Lifecycle - Destroy the current instance
     * @access public
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
     * Lifecycle - Called every loop
     * @access protected
     * @returns {void}
     */
    update () {
        this.children.forEach(child => child.update());
        this.timers.update();
        this.signals.update.dispatch();
    }

    /**
     * Lifecycle - Called before a next game loop
     * @access protected
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
     * Set new properties to the object. All attribute contained in "props" are public and can be edited by external source.
     * Properties can be observe via the "propChange" event. Update a property attribute via "setProps" will not fire the "propChange" event.
     * @access public
     * @param {Object} props - properties to merge
     * @returns {*} current instance
     * @example
     *  this.setProps({
     *      test: 1
     *  });
     *
     *  this.props.test; // 1
     */
    setProps (props: any): this {
        Object.keys(props).forEach(key => this.last[key] = this.props[key] = props[key]);

        return this;
    }

    /**
     * Swap the current PIXI container to another PIXI container. This is usefull if you want to change
     * the PIXI Object without destroy children and parent relationship.
     * @param {PIXI.DisplayObject} nextContainer: PIXI Container
     * @access protected
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
     * Add an item to the current object. The item added will enter into the lifecycle of the object and will become a children
     * of this object. The method "initialize" of the item will be called.
     * @access public
     * @param {SideralObject} item - a SideralObject
     * @param {Object=} settings - props to merge to the item
     * @param {number=} index - set an index position for the item
     * @returns {SideralObject} The item initialized
     */
    add(item: SideralObject, settings: any = {}, index?: number): SideralObject {
        if (!(item instanceof SideralObject)) {
            throw new Error("SideralObject.add : item must be an instance of Sideral Abstract Class");
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
     * Check if a property (an attribute from "this.props") has changed
     * @access public
     * @param {string} propName - name of the property to check
     * @returns {boolean} property has changed ?
     */
    hasChanged(propName: string): boolean {
        if (!this.props[propName]) {
            return false;
        }

        return this.props[propName] !== this.last[propName];
    }


    /* STATICS */

    /**
     * Generate an unique id
     * @access public
     * @returns {string} The unique id
     */
    static generateId(): string {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    static generateIdNumber(): number {
        return Math.floor((1 + Math.random()) * 0x100000);
    }
}

