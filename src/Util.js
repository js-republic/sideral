export default class Util {

    /* STATICS */

    /**
     * Debounce a function
     * @param {function} func: function to debounce
     * @param {number=} wait: time to wait before call function
     * @param {boolean} immediate: if true, the function will be called immediately
     * @returns {function} the debounce function
     */
    debounce (func, wait = 200, immediate = false) {
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
}
