import { SideralObject } from "./SideralObject";

import { SignalEvent, Util } from "./Tool";

import { IModuleProps, IModuleSignals, ISpawnMultiple, IFollow } from "./Interface";
import {TimerManager} from "./Tool/TimerManager";


/**
 * SideralObject visible on screen
 */
export class Module extends SideralObject {

    /* ATTRIBUTES */

    /**
     * Properties of the module
     */
    props: IModuleProps;

    /**
     * Signals of the module
     */
    signals: IModuleSignals;

    /**
     * Manager of timers for this module
     */
    timers: TimerManager;

    /**
     * PIXI Container (a module must have a pixi container)
     * @readonly
     */
    container: PIXI.Container = new PIXI.Container();


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.timers = <TimerManager> this.add(new TimerManager());

        this.signals.click = new SignalEvent(this.onBindClick.bind(this), this.onRemoveClick.bind(this));

        this.signals.propChange.bind("visible", this.onVisibleChange.bind(this));
        this.signals.propChange.bind(["x", "y", "width", "height", "angle"], this.updateContainerPosition.bind(this));
        this.signals.propChange.bind("flip", this.onFlipChange.bind(this));

        this.signals.update.add(this.updateFollow.bind(this));
    }

    /**
     * @override
     */
    kill () {
        super.kill();

        this.container.destroy(true);
    }


    /* METHODS */

    /**
     * Set a new position of the module
     * @param x - The position in x axis
     * @param y - The position in y axis
     */
    position (x?: number, y?: number): void {
        x = typeof x === "undefined" ? this.props.x : x;
        y = typeof y === "undefined" ? this.props.y : y;

        if (!this.initialized) {
            this.setProps({ x, y });

        } else {
            this.props.x = x;
            this.props.y = y;

        }
    }

    /**
     * Set a new size of the module
     * @param width - The next width of the module
     * @param height - The next height of the module
     */
    size (width?: number, height?: number): void {
        width  = typeof width === "undefined" ? this.props.width : width;
        height = typeof height === "undefined" ? this.props.height : height;

        if (!this.initialized) {
            this.setProps({ width, height });

        } else {
            this.props.width  = width;
            this.props.height = height;

        }
    }

    /**
     * Add an item to the current object. The item added will enter into the lifecycle of the object and will become a children
     * of this object. The method "initialize" of the item will be called.
     * @access public
     * @param item - A SideralObject
     * @param props - Props to merge to the item
     * @param z - The z index of the item
     * @returns The item initialized
     */
    add (item: SideralObject, props: any = {}, z?: number): SideralObject {
        if (typeof z !== "undefined") {
            props.z = z;
        }

        super.add(item);

        if (item instanceof Module) {
            if (typeof props.z !== "undefined") {
                this.container.addChildAt(item.container, z);
            } else {
                this.container.addChild(item.container);
            }
        }

        return item;
    }

    /**
     * This method is an helper to add a module. It is much faster than add when you must give a "x" and "y" properties
     * @access public
     * @param item - Module to add
     * @param x - The position in x axis
     * @param y - The position in y axis
     * @param props - Other properties to merge to the module
     * @param z - The z index of the item
     * @returns The module initialize
     */
    spawn (item: Module, x: number, y: number, props: any = {}, z?: number): Module {
        if (!(item instanceof Module)) {
            throw new Error("Module.spawn : The item must ben an instance of Module");
        }

        props.x = x;
        props.y = y;

        return <Module> this.add(item, props, z);
    }

    /**
     * Spawn multiple modules
     * @param params - Parameters of the multiple spawn
     */
    spawnMultiple (params: ISpawnMultiple[]): void {
        params.forEach(param => {
            if (!param.props) {
                param.props = {};
            }

            param.props.x = param.x;
            param.props.y = param.y;
            param.props.z = param.z;
        });

        super.addMultiple(params);
    }

    /**
     * Swap the current PIXI container to another PIXI container. This is usefull if you want to change
     * the PIXI Object without destroy children and parent relationship.
     * @access protected
     * @param nextContainer: PIXI Container
     * @returns -
     */
    swapContainer (nextContainer): void {
        if (!this.parent || !(this.parent instanceof Module)) {
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
     * Use this method to follow this entity by an other entity
     * @param centered - if True, the follower will be centered to the followed
     * @param offsetX - Offset in x axis
     * @param offsetY - Offset in y axis
     * @param offsetFlipX - Set a special offset in x axis if the followed is flipped
     * @returns Configuration object to follow this entity
     */
    beFollowed (centered: boolean = false, offsetX: number = 0, offsetY: number = 0, offsetFlipX: number = null): IFollow {
        return {
            target      : this,
            centered    : centered,
            offsetX     : offsetX,
            offsetY     : offsetY,
            offsetFlipX : offsetFlipX
        };
    }


    /* EVENTS */

    /**
     * Update the position of the pixi container
     */
    updateContainerPosition (): void {
        if (this.container) {
            this.container.pivot.set(this.props.width / 2, this.props.height / 2);
            this.container.position.set(this.props.x + this.container.pivot.x + (this.props.flip ? this.props.width : 0), this.props.y + this.container.pivot.y);
            this.container.rotation = Util.toRadians(this.props.angle);
        }
    }

    /**
     * Update the position of this entity if it follows a target
     */
    updateFollow (): void {
        if (this.props.follow) {
            const { offsetX, offsetY, offsetFlipX, centered, target } = this.props.follow;

            this.props.x = target.props.x + (target.props.flip && offsetFlipX !== null ? offsetFlipX : offsetX) + (centered ? (target.props.width / 2) - (this.props.width / 2) : 0);
            this.props.y = target.props.y + offsetY + (centered ? (target.props.height / 2) - (this.props.height / 2) : 0);
        }
    }

    /**
     * When "visible" property has change
     */
    onVisibleChange (): void {
        this.container.visible = this.props.visible;
    }

    /**
     * When "flip" attribute change
     */
    onFlipChange (): void {
        this.container.scale.x = Math.abs(this.container.scale.x) * (this.props.flip ? -1 : 1);

        if (this.container instanceof PIXI.Sprite) {
            this.container.anchor.x = this.props.flip ? -0.5 : 0.5;
        }

        this.updateContainerPosition();
    }

    /**
     * Fired when a listener is added to the signal click
     */
    onBindClick (): void {
        if (this.container && this.signals.click.listenerLength === 1) {
            this.container.interactive  = true;
            this.container.buttonMode   = true;

            this.container.on("click", this.signals.click.dispatch.bind(this));
        }
    }

    /**
     * Fired when a listener is removed from the signal click
     */
    onRemoveClick (): void {
        if (this.container && !this.signals.click.listenerLength) {
            this.container.interactive  = false;
            this.container.buttonMode   = false;

            this.container.off("click", this.signals.click.dispatch.bind(this));
        }
    }
}
