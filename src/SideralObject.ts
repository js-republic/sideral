import * as PIXI from "pixi.js";

import { Signal } from "./Tool/Signal";
import { TimerManager } from "./Tool/TimerManager";


/**
 * The entry class of all object in Sideral
 * @class SideralObject
 */
export class SideralObject {

    /* ATTRIBUTES */

    /**
     * Unique id of the object
     * @type {number}
     */
    id: number = SideralObject.generateId();

    /**
     * List of all properties of the object
     * @type {any}
     */
    props: any = {};

    /**
     * List of all last value of properties of the object
     * @type {any}
     */
    last: any = {};

    /**
     * Context is a object which you can store anything, the content of the context will be passed to its children
     * @type {any}
     */
    context: any = {};

    /**
     * List of all signals of the element
     * @type {{[string]: Signal}}
     */
    signals: {[key: string]: Signal} = {
        update: new Signal(),
        propChange: new Signal(),
    };

    /**
     * List of all children of this object
     * @type {Array<SideralObject>}
     */
    children: SideralObject[] = [];

    /**
     * Parent of this object
     * @type {SideralObject}
     */
    parent: SideralObject = null;

    /**
     * Manage all timers of this object
     * @type {TimerManager}
     */
    timers: TimerManager = new TimerManager(this);

    /**
     * Know if this object has been initialized
     * @readonly
     * @type {boolean}
     */
    initialized: boolean = false;

    /**
     * Know if this object has been killed
     * @readonly
     * @type {boolean}
     */
    killed: boolean = false;

    /**
     * PIXI Container
     * @type {PIXI.Container}
     */
    container: PIXI.Container = new PIXI.Container();


    /* LIFECYCLE */

    /**
     * Lifecycle - When initialized by a parent (called only once when the instance is attached to the lifecycle of the game)
     * @access public
     * @param {any} props - properties to merge
     * @returns {void}
     */
    initialize (props: any = {}): void {
        Object.keys(props).forEach(key => this.props[key] = props[key]);

        this.initialized = true;
    }

    /**
     * Lifecycle - Destroy the current instance
     * @access public
     * @returns {void}
     */
    kill (): void {
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
     * @param {number} tick - The tick factor (to prevent the dependance of the framerate)
     * @returns {void}
     */
    update (tick: number): void {
        this.children.forEach(child => child.update(tick));
        this.timers.update(tick);
        this.signals.update.dispatch(tick);
    }

    /**
     * Lifecycle - Called before a next game loop
     * @access protected
     * @returns {void}
     */
    nextCycle (): void {
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
    swapContainer (nextContainer): void {
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

        Object.keys(this.context).forEach(key => item.context[key] = this.context[key]);
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
     * @returns {number}
     */
    static generateId(): number {
        return Math.floor((1 + Math.random()) * 0x100000);
    }
}

