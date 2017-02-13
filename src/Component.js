import Mixin from "./Mixin";
import Reactivity from "./Mixin/Reactivity";


export default class Component extends Mixin {

    /* LIFECYCLE */

    /**
     * @initialize
     * @override
     */
    initialize (props) {
        this.mix(new Reactivity());
        this.setReactivity();
        super.initialize(props);
    }

    /**
     * @constructor
     */
    constructor () {
        super();

        /**
         * Name of the Component
         * @type {string}
         */
        this.name   = "component";

        /**
         * Position X
         * @type {number}
         */
        this.x      = 0;

        /**
         * Position Y
         * @type {number}
         */
        this.y      = 0;

        /**
         * Z index. if -1, the z-index is made automatically
         * @type {number}
         */
        this.z      = -1;

        /**
         * Size width
         * @type {number}
         */
        this.width  = 10;

        /**
         * Reactivity mixin
         * @readonly
         * @type {Reactivity}
         */
        this.reactivity = null;

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

        // private

        /**
         * PIXI Container
         * @type {PIXI.DisplayObject}
         * @private
         */
        this._container = null;

        /**
         * When a child has changed its z index
         * @type {boolean}
         * @private
         */
        this._sortChildrenRequested = false;

        /**
         * List of real children names
         * @type {Array}
         * @private
         */
        this._childrenNames         = [];

        // auto-binding

        this._onZChange         = this._onZChange.bind(this);
        this._onPositionChange  = this._onPositionChange.bind(this);
        this._onSizeChange      = this._onSizeChange.bind(this);
    }

    /**
     * @override
     */
    setReactivity () {
        this.reactivity.
            when("x", "y").change(this._onPositionChange).
            when("width", "height").change(this._onSizeChange).
            when("z").change(this._onZChange);
    }

    /**
     * @update
     * @override
     */
    update () {
        this.children.forEach(child => child.update());
        super.update();
    }

    /**
     * @afterUpdate
     * @override
     */
    afterUpdate () {
        this.children.forEach(child => child.afterUpdate());
        super.afterUpdate();

        if (this._sortChildrenRequested) {
            this._container.children    = this._container.children.sort((a, b) => (a.z || 0) - (b.z || 0));
            this._sortChildrenRequested = false;
        }
    }

    /**
     * @nextCycle
     * @override
     */
    nextCycle () {
        this.children.forEach(child => child.nextCycle());
        super.nextCycle();
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
     * Check if a mixin / component exist
     * @override
     * @param {string} name: name of the mixin or component
     * @returns {boolean} if the mixin or component exists
     */
    has (name) {
        return super.has(name) || Boolean(this._childrenNames.find(childrenName => childrenName === name));
    }

    /**
     * Compose a component and set it has a children of the current Component
     * @param {Component} component: child
     * @param {*=} injectProps: props to inject after parent created
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
        this._childrenNames.push(component.name);

        component.parent = this;
        component.initialize(injectProps);
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
            if (child.z > -1) {
                this._container.addChildAt(child._container, child.z);
            } else {
                this._container.addChild(child._container);
            }
        }
    }

    /**
     * Lifecycle when a child is removed
     * @param {Component} child: the child to remove
     * @returns {void}
     */
    willLoseChild (child) {
        if (this._container && child && child._container) {
            this._container.removeChild(child._container);
        }
    }

    /* REACTIVITY */

    /**
     * When x or y attribute has changed
     * @private
     * @returns {void}
     */
    _onPositionChange () {
        this._container.position.set(this.x, this.y);
    }

    /**
     * When width or height attribute has changed
     * @private
     * @returns {void}
     */
    _onSizeChange () {
        if (this._container && !this.children.length) {
            this._container.width   = this.width;
            this._container.height  = this.height;
        }
    }

    /**
     * When z attribute change
     * @private
     * @returns {void}
     */
    _onZChange () {
        if (this.parent) {
            this.parent._sortChildrenRequested = true;
        }

        this._container.z = this.z;
    }
}
