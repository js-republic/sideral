import Mixin from "./Mixin";


export default class Component extends Mixin {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        /**
         * Position X
         * @type {number}
         */
        this.x  = 0;

        /**
         * Position Y
         * @type {number}
         */
        this.y  = 0;

        /**
         * Size width
         * @type {number}
         */
        this.width = 0;

        /**
         * Size height
         * @type {number}
         */
        this.height = 0;

        /**
         * List of all components children
         * @type {Array<Component>}
         */
        this.children = [];

        /**
         * Parent component
         * @type {Component}
         */
        this.parent = null;

        /**
         * PIXI Container
         * @type {PIXI.DisplayObject}
         */
        this._container = null;
    }

    /**
     * @update
     * @override
     */
    update () {
        this.children.forEach(child => child.update());
    }

    /**
     * Render lifecycle
     * @returns {void}
     */
    render () {
        this.children.forEach(child => child.render());
    }

    /* METHODS */

    /**
     * Set and get the current position
     * @param {number=} x: position x
     * @param {number=} y: position y
     * @returns {{x: number, y: number}} current position
     */
    position (x, y) {
        if (typeof x !== "undefined") {
            this.x = x;
        }

        if (typeof y !== "undefined") {
            this.y = y;
        }

        return {x: this.x, y: this.y};
    }

    /**
     * Set and get the current size
     * @param {number=} width: the width
     * @param {number=} height: the height
     * @returns {{width: number, height: number}} current size
     */
    size (width, height) {
        if (typeof width !== "undefined") {
            this.width = width;
        }

        if (typeof height !== "undefined") {
            this.height = height;
        }

        return {width: this.width, height: this.height};
    }

    /**
     * Compose a component and set it has a children of the current Component
     * @param {Component} component: child
     * @param {{}=} injectProps: props to inject after parent created
     * @param {*=} next: function callback
     * @returns {Component} current Component
     */
    compose (component, injectProps = {}, next = null) {
        if (!component || !(component instanceof Component)) {
            throw new Error("Component.compose : parameter 1 must be an instance of 'Component'.");
        }

        if (!component.canBeUsed(this)) {
            return this;
        }

        this.children.push(component);

        const name = component.name;

        component.parent = this;
        component.set(injectProps);
        component.initialize();


        if (this.prototype) {
            delete this.prototype[name];
        }

        Object.defineProperty(this, name, {
            value           : component,
            writable        : false,
            configurable    : true
        });

        if (next) {
            next(component);
        }

        return this;
    }

    /* GETTERS & SETTERS */

    get name () {
        return "component";
    }
}
