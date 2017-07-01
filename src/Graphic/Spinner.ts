import { Graphic } from "./../Graphic";
import { Shape } from "./../Module";
import { Color } from "./../Tool";
import { ISpinnerProps } from "./../Interface";


export class Spinner extends Graphic {

    /* ATTRIBUTES */

    /**
     * Properties of a spinner
     */
    props: ISpinnerProps;

    /**
     * Shape lines of the spinner
     */
    lines: Array<Shape> = [];


    /* LIFECYCLE */

    constructor () {
        super();

        this.setProps({
            lines: 16,
            lineWidth: 10,
            centerSpacing: 15,
            lineHeight: 2,
            speed: 1000,
            color: Color.white
        });

        this.signals.propChange.bind(["lineWidth", "lines"], this.onLineChange.bind(this));
        this.signals.propChange.bind("speed", this.onSpeedChange.bind(this));
    }

    initialize (props): void {
        super.initialize(props);

        this.onSpeedChange();
        this.onLineChange();
    }


    /* EVENTS */

    /**
     * Update the alpha of each lines
     * @param tick - Tick provided by the timer
     * @param value - Value of the timer
     * @param ratio - Ratio of the timer
     */
    updateLinesAlpha (tick: number, value: number, ratio: number): void {
        const length = this.lines.length;

        this.lines.forEach((line, i) => line.props.fillAlpha = 1 - (ratio + (i / this.props.lines)) % 1);
    }

    /**
     * When lines attributes has changed
     */
    onLineChange (): void {
        const angleFactor   = 360 / this.props.lines;

        this.lines.forEach(lines => lines.kill());
        this.lines = [];

        for (let i = 0; i < this.props.lines; i++) {
            this.lines.push(<Shape> this.spawn(new Shape(), this.props.centerSpacing, 0, {
                offsetX     : this.props.centerSpacing,
                offsetY     : 0,
                fill        : this.props.color,
                fillAlpha   : (i / this.props.lines) % 1,
                width       : this.props.lineWidth,
                height      : this.props.lineHeight,
                angle       : angleFactor * i
            }));
        }

        this.lines.reverse();
        this.props.width = this.container.width;
        this.props.height = this.container.height;
    }

    onSpeedChange (): void {
        this.timers.addTimer("spin", this.props.speed, null, {
            recurrence: -1,
            update: this.updateLinesAlpha.bind(this)
        });
    }
}