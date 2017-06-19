import { Module } from "./../Module";
import { Shape } from "./../Graphics";
import { Color, Enum } from "./../Tool";
import { ITransitionProps } from "./../Interface";


export class Transition extends Module {

    /* ATTRIBUTES */

    /**
     * Properties of a transition
     */
    props: ITransitionProps;

    /**
     * Fade 
     */
    _fade: Shape;


    /* LIFECYCLE */

    constructor () {
        super();

        this.signals.propChange.bind("transition", this.onTransitionChange.bind(this));
    }


    /* METHODS */

    /**
     * Create a new transition
     * @param type - Type of transition (see Enum.TRANSITION)
     * @param duration - Duration of the transition
     * @param options - Options to pass to the transition
     */
    createTransition (type: string, duration: number, options: any = {}): void {
        switch (type) {
            case Enum.TRANSITION.FADE_IN: this.fadeIn(duration, options);
                break;

            case Enum.TRANSITION.FADE_OUT: this.fadeOut(duration, options);
                break;
        }
    }

    /**
     * Create a fadeIn effect
     * @param duration - Duration of the effect
     * @param options - Options of the effect
     */
    fadeIn (duration: number, options: any = {}): void {
        const transition: any = {};

        this._fade = <Shape> this.add(new Shape(), Object.assign({
            width       : (<any> this.parent).props.width,
            height      : (<any> this.parent).props.height,
            fillAlpha   : 0
        }, options));

        this.timers.addTimer("fade", duration, () => this._fade.props.fillAlpha = 0, {
            update: (tick, value, ratio) => this._fade.props.fillAlpha = 1 - ratio
        });
    }

    /**
     * Create a fadeOut effect
     * @param duration - Duration of the effect
     * @param options - Options of the effect
     */
    fadeOut (duration: number, options: any = {}): void {
        if (!this._fade) {
            this._fade = <Shape> this.add(new Shape(), Object.assign({
                width   : (<any> this.parent).props.width,
                height  : (<any> this.parent).props.height,
                fillAlpha: 1
            }, options));
        }

        this.timers.addTimer("fade", duration, () => this._fade.props.fillAlpha = 1, {
            update: (tick, value, ratio) => this._fade.props.fillAlpha = ratio
        });
    }

    /* EVENTS */

    onTransitionChange (): void {

    }
}