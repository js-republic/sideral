import Mixin from "./Mixin";


export default class Component extends Mixin {

    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        /**
         * Name of the Component
         * @type {string}
         */
        this.name = "component";

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
        this.width = 10;

        /**
         * Size height
         * @type {number}
         */
        this.height = 10;

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

        // auto-binding

        this._containerPosition = this._containerPosition.bind(this);
        this._containerSize     = this._containerSize.bind(this);
    }

    /**
     * @override
     */
    initialize () {
        this.reactivity.
            when("x", "y").change(this._containerPosition).
            when("width", "height").change(this._containerSize);

        super.initialize();
    }

    /**
     * @update
     * @override
     */
    update () {
        super.update();

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

        component.parent = this;
        component.set(injectProps);
        component.initialize();
        this.willReceiveChild(component);

        const name = component.name;

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

    /**
     * Decompose a component
     * @param {Component} component child
     * @param {*=} next: function callback
     * @returns {Component} current instance
     */
    decompose (component, next) {
        if (!component || !(component instanceof Component)) {
            throw new Error("Component.compose : parameter 1 must be an instance of 'Component'.");
        }

        this.willLoseChild(component);

        this.components = this.components.filter(x => x.id === component.id);

        if (this.prototype) {
            delete this.prototype[component.name];
        }

        component.kill();

        if (next) {
            next(component);
        }

        return this;
    }

    /**
     * Lifecycle when a new child is composed
     * @param {Component} child: the child
     * @returns {void}
     */
    willReceiveChild (child) {
        if (this._container && child && child._container) {
            this._container.addChild(child._container);
        }
    }

    /**
     * Lifecycle when a child is removed
     * @param {Component} child: the child to remove
     * @returns {void}
     */
    willLoseChild (child) {
        if (this._container && child && child._container) {
            this._container.removeCHild(child._container);
        }
    }

    /* REACTIVITY */

    /**
     * Replace the current component into the canvas
     * @private
     * @returns {void}
     */
    _containerPosition () {
        if (this._container) {
            this._container.position.set(this.x, this.y);
        }
    }

    /**
     * Replace the current size of the component
     * @private
     * @returns {void}
     */
    _containerSize () {
        if (!this.children.length && this._container) {
            this._container.width   = this.width;
            this._container.height  = this.height;
        }
    }
}
