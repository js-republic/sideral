export default class Util {

    /* STATICS */

    /**
     * Debounce a function
     * @param {function} func: function to debounce
     * @param {number=} wait: time to wait before call function
     * @param {boolean} immediate: if true, the function will be called immediately
     * @returns {function} the debounce function
     */
    static debounce (func, wait = 200, immediate = false) {
        let timeout = null;

        return function debounceCallback () {
            const later = () => {
                timeout = null;

                if (!immediate) {
                    func(...arguments);
                }
            };

            const callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) {
                func(...arguments);
            }
        };
    }

    /**
     * Convert a number to hex string
     * @param {number} decimal: number to format
     * @returns {string} hex value in string
     */
    static decimalToHex (decimal) {
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
    static hexToDecimal (hex) {
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
    static rgbToHex (rgb) {
        const rgbArray = rgb instanceof Array ? rgb : rgb.replace(/[a-zA-Z() ]/g, "").split(",");

        if (rgbArray.length > 3) {
            rgbArray.pop();
        }

        return rgbArray.reduce((acc, value) => acc + parseInt(value).toString(16), "");
    }

    /**
     * Convert a color string (rgb or hex) to decimal value
     * @param {string|number} color: color value (rgb or hex)
     * @returns {number} Decimal value
     */
    static colorToDecimal (color = 0) {
        if (typeof color === "number") {
            return color;
        }

        return Util.hexToDecimal(
            (color instanceof Array) || (typeof color === "string" && color.toLowerCase().indexOf("rgb") > -1)
                ? Util.rgbToHex(color)
                : color
        );
    }
}
