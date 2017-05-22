export class Util {

    /* STATICS */

    /**
     * Debounce a function
     * @param {function} func: function to debounce
     * @param {number=} wait: time to wait before call function
     * @param {boolean} immediate: if true, the function will be called immediately
     * @returns {function} the debounce function
     */
    static debounce (func: Function, wait: number = 200, immediate: boolean = false) {
        let timeout = null;

        return function debounceCallback (...args) {
            const later = () => {
                timeout = null;

                if (!immediate) {
                    func(...args);
                }
            };

            const callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) {
                func(...args);
            }
        };
    }

    /**
     * Convert degree to radians
     * @param {number} degree: number of degree
     * @returns {number} number of radians
     */
    static toRadians (degree: number): number {
        return degree * Math.PI / 180;
    }

    /**
     * Convert radians to degree
     * @param {number} radians: number of radians
     * @returns {number} number of degrees
     */
    static toDegree (radians: number): number {
        return radians * 180 / Math.PI;
    }

    /**
     * Convert pixels to meters (for p2 physic)
     * @param {number} px: number of pixels
     * @param {Boolean=} inversed: if true, the value will be inversed
     * @returns {number} number of meters
     */
    static pixelToMeter (px: number, inversed?: boolean): number {
        return px * 0.05 * (inversed ? -1 : 1);
    }

    /**
     * Convert meters to pixels (for p2 physic)
     * @param {number} meter: number of meters
     * @param {Boolean=} inversed: if true, the value will be inversed
     * @returns {number} number of pixels
     */
    static meterToPixel (meter: number, inversed?: boolean): number {
        return meter * 20 * (inversed ? -1 : 1);
    }

    /**
     * Ensure that the value is more than min and less than max
     * @param {number} value: number value
     * @param {number} min: number min
     * @param {number} max: number max
     * @returns {number} the value limited
     */
    static limit (value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * Convert a number to hex string
     * @param {number} decimal: number to format
     * @returns {string} hex value in string
     */
    static decimalToHex (decimal: number): string {
        if (decimal < 0) {
            decimal = 0xFFFFFFFF + decimal + 1;
        }

        return decimal.toString(16).toUpperCase();
    }

    /**
     * Convert hexadecimal value to decimal value
     * @param {string} hex: hexadecimal value
     * @returns {Number} decimal value
     */
    static hexToDecimal (hex: string): number {
        if (hex.indexOf("#") === 0) {
            hex = hex.substring(1);
        }

        return parseInt(hex, 16);
    }

    /**
     * Convert a rgb/rgba string or array to hex value
     * @param {string|Array<number>} rgb: rgb value
     * @returns {string} hex value
     */
    static rgbToHex (rgb: string | [number, number, number]) {
        let rgbArray: [number, number, number];
        if (typeof rgb === 'string') {
            rgbArray = <[number, number, number]> rgb.replace(/[a-zA-Z() ]/g, "").split(",").map(parseInt);
        } else {
            rgbArray = rgb;
        }

        if (rgbArray.length > 3) {
            rgbArray.pop();
        }

        return rgbArray.reduce(
            (acc, value) => acc + value.toString(16),
            ''
        );
    }

    /**
     * Convert a color string (rgb or hex) to decimal value
     * @param {string|number} color: color value (rgb or hex)
     * @returns {number} Decimal value
     */
    static colorToDecimal (color: (number | string | [number, number, number]) = 0): number {
        switch (typeof color) {
            case 'string':
                color = color as string;
                // if (color.toLowerCase().indexOf("rgb") > 1) {
                    return Util.hexToDecimal(Util.rgbToHex(color));
                // } else {
                //     return color;
                // }
            case 'number':
                return color as number;
            case 'object':
                if (color instanceof Array) {
                    return Util.hexToDecimal(Util.rgbToHex(color));
                }
        }
    }
}
