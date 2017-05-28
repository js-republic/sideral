import { SignalEvent } from "./Tool/SignalEvent";

import { IProps, ISignals, IAddMultiple } from "./Interface";


/**
 * The entry class of all object in Sideral
 */
export class SideralObject {

    /* ATTRIBUTES */

    /**
     * Unique id of the object
     * @readonly
     */
    id: number = SideralObject.generateId();

    /**
     * Name of the object (used to identify object, you should not forget to fill this value)
     * @type {string}
     */
    name: string = "";

    /**
     * Properties of the object
     */
    props: IProps = {};

    /**
     * Last values of properties of the object
     */
    last: any = {};

    /**
     * Context is a object which you can store anything, the content of the context will be passed to its children
     */
    context: any = {};

    /**
     * List of all signals of the element
     */
    signals: ISignals = {
        update: new SignalEvent(),
        propChange: new SignalEvent(),
        addChild: new SignalEvent(),
        removeChild: new SignalEvent()
    };

    /**
     * List of all children of this object
     */
    children: SideralObject[] = [];

    /**
     * Parent of this object
     */
    parent: SideralObject = null;

    /**
     * Know if this object has been initialized
     * @readonly
     */
    initialized: boolean = false;

    /**
     * Know if this object has been killed
     * @readonly
     */
    killed: boolean = false;


    /* LIFECYCLE */

    /**
     * Lifecycle - When initialized by a parent (called only once when the instance is attached to the lifecycle of the game)
     * @access public
     * @param props - properties to merge
     */
    initialize (props: any = {}): void {
        Object.keys(props).forEach(key => this.props[key] = props[key]);

        this.initialized = true;
    }

    /**
     * Lifecycle - Destroy the current instance
     * @access public
     */
    kill (): void {
        Object.keys(this.signals).forEach(key => this.signals[key].removeAll());

        this.children.forEach(child => child.kill());

        if (this.parent) {
            this.parent.children = this.parent.children.filter(child => child.id !== this.id);
        }

        this.killed = true;

        this.parent.signals.removeChild.dispatch(this.name, this);
    }

    /**
     * Lifecycle - Called every loop
     * @access protected
     * @param {number} tick - The tick factor (to prevent the dependance of the framerate)
     * @returns {void}
     */
    update (tick: number): void {
        this.children.forEach(child => child.update(tick));
        this.signals.update.dispatch(tick);
    }

    /**
     * Lifecycle - Called before a next game loop
     * @access protected
     * @returns {void}
     */
    nextCycle (): void {
        const propChanged = [];

        this.children.forEach(child => child.nextCycle());

        Object.keys(this.props).forEach(key => {
            if (this.props[key] !== this.last[key]) {
                propChanged.push(key);
            }

            this.last[key] = this.props[key];
        });

        propChanged.forEach(prop => this.signals.propChange.dispatch(prop, this.props[prop]));
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
     * Add an item to the current object. The item added will enter into the lifecycle of the object and will become a children
     * of this object. The method "initialize" of the item will be called.
     * @access public
     * @param item - A SideralObject
     * @param props - Props to merge to the item
     * @returns The item initialized
     */
    add(item: SideralObject, props: any = {}): SideralObject {
        if (!(item instanceof SideralObject)) {
            throw new Error("SideralObject.add : item must be an instance of Sideral Abstract Class");
        }

        item.parent = this;

        Object.keys(this.context).forEach(key => item.context[key] = this.context[key]);
        this.children.push(item);
        item.initialize(props);
        this.signals.addChild.dispatch(item.name, item);

        return item;
    }

    /**
     * Add multiple items
     * @param params - Parameters of the multiple add
     */
    addMultiple (params: IAddMultiple[]): void {
        params.forEach(param => {
            this.add(param.item, param.props);

            if (param.assign) {
                this[param.assign] = param.item;
            }

            if (param.callback) {
                param.callback(param.item);
            }
        });
    }

    /**
     * Check if a property (an attribute from "this.props") has changed
     * @access public
     * @param propName - name of the property to check
     * @returns Property has changed ?
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
     * @returns The unique id
     */
    static generateId(): number {
        return Math.floor((1 + Math.random()) * 0x100000);
    }
}

