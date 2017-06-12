"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = (function () {
    function Util() {
    }
    /* STATICS */
    /**
     * Debounce a function
     * @param {function} func: function to debounce
     * @param {number=} wait: time to wait before call function
     * @param {boolean} immediate: if true, the function will be called immediately
     * @returns {function} the debounce function
     */
    Util.debounce = function (func, wait, immediate) {
        if (wait === void 0) { wait = 200; }
        if (immediate === void 0) { immediate = false; }
        var timeout = null;
        return function debounceCallback() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(void 0, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(void 0, args);
            }
        };
    };
    /**
     * Convert degree to radians
     * @param {number} degree: number of degree
     * @returns {number} number of radians
     */
    Util.toRadians = function (degree) {
        return degree * Math.PI / 180;
    };
    /**
     * Convert radians to degree
     * @param {number} radians: number of radians
     * @returns {number} number of degrees
     */
    Util.toDegree = function (radians) {
        /*
        radians = radians % (2 * Math.PI);

        if (radians < 0) {
            radians += 2 * Math.PI;
        }
        */
        return radians * 180 / Math.PI;
    };
    /**
     * Convert pixels to meters (for p2 physic)
     * @param {number} px: number of pixels
     * @param {Boolean=} inversed: if true, the value will be inversed
     * @returns {number} number of meters
     */
    Util.pixelToMeter = function (px, inversed) {
        return px * 0.05 * (inversed ? -1 : 1);
    };
    /**
     * Convert meters to pixels (for p2 physic)
     * @param {number} meter: number of meters
     * @param {Boolean=} inversed: if true, the value will be inversed
     * @returns {number} number of pixels
     */
    Util.meterToPixel = function (meter, inversed) {
        return meter * 20 * (inversed ? -1 : 1);
    };
    /**
     * Ensure that the value is more than min and less than max
     * @param {number} value: number value
     * @param {number} min: number min
     * @param {number} max: number max
     * @returns {number} the value limited
     */
    Util.limit = function (value, min, max) {
        return Math.max(min, Math.min(max, value));
    };
    /**
     * Convert a number to hex string
     * @param {number} decimal: number to format
     * @returns {string} hex value in string
     */
    Util.decimalToHex = function (decimal) {
        if (decimal < 0) {
            decimal = 0xFFFFFFFF + decimal + 1;
        }
        return decimal.toString(16).toUpperCase();
    };
    /**
     * Convert hexadecimal value to decimal value
     * @param {string} hex: hexadecimal value
     * @returns {Number} decimal value
     */
    Util.hexToDecimal = function (hex) {
        if (hex.indexOf("#") === 0) {
            hex = hex.substring(1);
        }
        return parseInt(hex, 16);
    };
    /**
     * Convert a rgb/rgba string or array to hex value
     * @param {string|Array<number>} rgb: rgb value
     * @returns {string} hex value
     */
    Util.rgbToHex = function (rgb) {
        var rgbArray;
        if (typeof rgb === 'string') {
            rgbArray = rgb.replace(/[a-zA-Z() ]/g, "").split(",").map(parseInt);
        }
        else {
            rgbArray = rgb;
        }
        if (rgbArray.length > 3) {
            rgbArray.pop();
        }
        return rgbArray.reduce(function (acc, value) { return acc + value.toString(16); }, '');
    };
    /**
     * Convert a color string (rgb or hex) to decimal value
     * @param {string|number} color: color value (rgb or hex)
     * @returns {number} Decimal value
     */
    Util.colorToDecimal = function (color) {
        if (color === void 0) { color = 0; }
        switch (typeof color) {
            case "string":
                color = color;
                if (color.toLowerCase().indexOf("rgb") > 1) {
                    return Util.hexToDecimal(Util.rgbToHex(color));
                }
                else {
                    return Util.hexToDecimal(color);
                }
            case "number":
                return color;
            case "object":
                if (color instanceof Array) {
                    return Util.hexToDecimal(Util.rgbToHex(color));
                }
        }
    };
    return Util;
}());
exports.Util = Util;
