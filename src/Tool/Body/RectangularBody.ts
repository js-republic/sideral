import * as p2 from 'p2';
import { Body } from './Body';

export class RectangularBody extends Body {
    constructor (scene, x: number, y: number, width: number, height: number, props: any = {}) {
        super(scene, Object.assign(props, {
            x       : x,
            y       : y,
            width   : width,
            height  : height,
            shape   : new p2.Box({ width, height })
        }));
    }
}
