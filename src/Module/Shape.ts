import { Module } from "./../Module";

import { IShapeProps } from "./../Interface";

import { Util, Enum, Color } from "./../Tool/";


/**
 * The module to display shapes
 */
export class Shape extends Module {

    /* ATTRIBUTES */

    /**
     * Properties of a Shape
     */
    props: IShapeProps;

    /**
     * PIXI Container
     * @readonly
     */
    container: PIXI.Graphics = new PIXI.Graphics();


    /* LIFECYCLE */

    /**
     * @constructor
     */
    constructor () {
        super();

        this.setProps({
            stroke  : Color.transparent,
            strokeAlpha: 1,
            strokeThickness: 1,
            fill    : Color.white,
            fillAlpha: 1,
            box     : Enum.BOX.RECTANGLE
        });

        this.signals.propChange.bind(["box", "fill", "stroke", "strokeThickness", "strokeAlpha", "fillAlpha", "width", "height", "radius"], this._updateShape.bind(this));
    }


    /* METHODS */

    /**
     * The arc method creates an arc/curve (used to create circles, or parts of circles)
     * @param cx - The position of the center of the circle in x axis
     * @param cy - The position of the center of the circle in y axis
     * @param radius - The radius of the circle
     * @param startAngle - The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
     * @param endAngle - The ending angle, in radians
     * @param anticlockwise - Specifies whether the drawing should be counter-clockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise
     */
    arc (cx: number, cy: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean = false): this {
        this.container.arc(cx, cy, radius, startAngle, endAngle, anticlockwise);

        return this;
    }

    /**
     * The arcTo() method creates an arc/curve between two tangents on the canvas
     * @param x1 - The position of the beginning of the arc in x axis
     * @param y1 - The position of the beginning of the arc in y axis
     * @param x2 - The position of the end of the arc in x axis
     * @param y2 - The position of the end of the arc in y axis
     * @param radius - The radius of the arc
     */
    arcTo (x1: number, y1: number, x2: number, y2: number, radius: number): this {
        this.container.arcTo(x1, y1, x2, y2, radius);

        return this;
    }

    /**
     * Specifies a simple one-color fill that subsequent calls to other Shape methods (such as lineTo() or drawCircle()), use when drawing
     * @param color - The color of the fill
     * @param alpha - The alpha of the fill
     */
    beginFill (color?: string, alpha: number = 1): this {
        this.container.beginFill(Util.colorToDecimal(color), alpha);

        return this;
    }

    /**
     * Applies a fill to the lines and shapes that were added since the last call to te beginFill() method
     */
    endFill (): this {
        this.container.endFill();

        return this;
    }

    /**
     * Calculate the points for a bezier curve and the draws it
     * @param cpX - Control point in x axis
     * @param cpY - Control point in y axis
     * @param cpX2 - Second control point in x axis
     * @param cpY2 - Second control point in y axis
     * @param toX - Destination point in x axis
     * @param toY - Destination point in y axis
     */
    bezierCurveTo (cpX: number, cpY: number, cpX2: number, cpY2: number, toX: number, toY: number): this {
        this.container.bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY);

        return this;
    }

    /**
     * Draws a circle
     * @param x - The coordinate of the center of the circle in x axis
     * @param y - The coordinate of the center of the circle in y axis
     * @param radius - The radius of the circle
     */
    circle (x: number, y: number, radius: number): this {
        this.container.drawCircle(x, y, radius);

        return this;
    }

    /**
     * Draws an ellipse
     * @param x - The coordinate of the center of the ellipse in x axis
     * @param y - The coordinate of the center of the ellipse in y axis
     * @param width - The half width of the ellipse
     * @param height - The half height of the ellipse
     */
    ellipse (x: number, y: number, width: number, height: number): this {
        this.container.drawEllipse(x, y, width, height);

        return this;
    }

    /**
     * Draws a polygon using the given path
     * @param path - The path data used to constructh the polygon
     */
    polygon (path: Array<number> | Array<PIXI.Point>): this {
        this.container.drawPolygon(path);

        return this;
    }

    /**
     * Draws a rectangle
     * @param x - The coordinate of the top-left of the rectangle in x axis
     * @param y - The coordinate of the top-left of the rectangle in y axis
     * @param width - The width of the rectangle
     * @param height - The height of the rectangle
     */
    rectangle (x: number, y: number, width: number, height: number): this {
        this.container.drawRect(x, y, width, height);

        return this;
    }

    /**
     * Draws a rounded rectangle
     * @param x - The coordinate of the top-left of the rectangle in x axis
     * @param y - The coordinate of the top-left of the rectangle in y axis
     * @param width - The width of the rectangle
     * @param height - The height of the rectangle
     * @param radius - The radius of the rectangle corners
     */
    roundedRectangle (x: number, y: number, width: number, height: number, radius: number): this {
        this.container.drawRoundedRect(x, y, width, height, radius);

        return this;
    }

    /**
     * Specifies the line style used for subsequent calls to the Shape methods such as the lineTo() method or the circle() method
     * @param width - Width of the line to draw, will update the objects stored style
     * @param color - Color of the line to draw, will update the objects stored style
     * @param alpha - Alpha of the line to draw, will update the objects stored style
     */
    lineStyle (width: number = 0, color?: string, alpha: number = 1): this {
        this.container.lineStyle(width, Util.colorToDecimal(color), alpha);

        return this;
    }

    /**
     * Draws a line using the current line style from the current drawing position to (x, y); The current drawing position is then set to (x, y).
     * @param x - The coordinate in x axis to draw to
     * @param y - The coordinate in y axis to draw to
     */
    lineTo (x: number, y: number): this {
        this.container.lineTo(x, y);

        return this;
    }

    /**
     * Moves the current drawing position to (x, y)
     * @param x - The coordinate in x axis to move to
     * @param y - The coordinate in y axis to move to
     */
    moveTo (x: number, y: number): this {
        this.container.moveTo(x, y);

        return this;
    }

    /**
     * Calculate the points for a quadratic bezier curve and the draws it
     * @param cpX - Control point in x axis
     * @param cpY - Control point in y axis
     * @param toX - Destination point in x axis
     * @param toY - Destination point in y axis
     */
    quadraticCurveTo (cpX: number, cpY: number, toX: number, toY: number): this {
        this.container.quadraticCurveTo(cpX, cpY, toX, toY);

        return this;
    }

    /**
     * Clears the graphics that were drawn to this shape objetct, and resets fill and line style settings
     */
    clear (): this {
        this.container.clear();

        return this;
    }

    /**
     * Clone the current shape
     * @param props - Properties to pass to the cloned shape
     * @returns The cloned shape
     */
    clone (props?: any): Shape {
        const clonedShape = new Shape();

        clonedShape.container = this.container.clone();

        return clonedShape;
    }


    /* PRIVATE */

    /**
     * Update the current shape
     * @private
     */
    _updateShape (): void {
        if (!this.props.box) {
            return null;
        }

        const stroke    = Util.colorToDecimal(this.props.stroke),
            fill        = this.props.fill === "transparent" ? 0x000000 : Util.colorToDecimal(this.props.fill);

        this.container.clear();

        if (this.props.stroke !== Color.transparent && !isNaN(stroke)) {
            this.container.lineStyle(this.props.strokeThickness, stroke, this.props.strokeAlpha);
        }

        this.container.beginFill(fill, this.props.fill === Color.transparent ? 0 : this.props.fillAlpha);
        this._drawShape();
        this.container.endFill();
    }

    /**
     * Draw the shape with the current type value
     * @private
     */
    _drawShape (): void {
        const { offsetX, offsetY, width, height, radius, box } = this.props;

        switch (box) {
            case Enum.BOX.CIRCLE:
                if (width !== height) {
                    this.ellipse(width / 2, height / 2, width / 2, height / 2);
                } else {
                    this.circle(width / 2, width / 2, width / 2);
                }
                break;

            case Enum.BOX.RECTANGLE: 
                if (this.props.radius) {
                    this.roundedRectangle(offsetX, offsetY, width, height, radius);
                } else {
                    this.rectangle(offsetX, offsetY, width, height);
                }
                break;
        }
    }
}
