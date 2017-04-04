export default class SideralObject {

    /**
     * @constructor
     * @param {number} width: width of the canvas
     * @param {number} height: height of the canvas
     */
    constructor (width = 10, height = 10) {
        // this.width  = width;
        this.height = height;

        this.width = this.bind(width, x => this.toSquare(x));
    }

    bind (defaultValue, next) {
        return {
            value   : defaultValue,
            last    : defaultValue,
            next    : next
        };
    }

    toSquare (value) {
        this.width  = value;
        this.height = value;
    }

}
