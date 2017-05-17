import * as p2 from 'p2';
import { Body } from './Body';

export class CircularBody extends Body {
    constructor (scene, x: number, y: number, radius: number, props: any = {}) {
        super(scene, Object.assign(props, {
            x       : x,
            y       : y,
            width   : radius * 2,
            height  : radius * 2,
            shape   : new p2.Circle({ radius: radius })
        }));
    }
}
