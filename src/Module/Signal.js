export default class Signal {

    /**
     * @constructor
     * @param {string} name: name of the signal
     * @param {Array<*>|*} properties: property or array of properties
     * @param {function=} onTrigger: event when the signal is triggered
     */
    constructor (name, properties, onTrigger) {
        this.properties = [].concat(properties);
        this.onTrigger  = onTrigger;
        this.name       = name;

        this.actions    = [];
    }

    /**
     * Call all actions with the value passed in parameters
     * @param {*} value: value to pass to actions
     * @returns {void}
     */
    callActions (value) {
        this.actions.forEach(action => action(value));
    }

    /**
     * Function to trigger the signal
     * @param {*} value: value to triggered
     * @returns {void|null} -
     */
    trigger (value) {
        if (this.onTrigger) {
            this.onTrigger(this, value);

        } else {
            this.callActions(value);

        }
    }

    /**
     * Check if properties match with the properties of the signal
     * @param {Array<*>|*} properties: properties to check
     * @returns {boolean} has matched with the properties of the signal
     */
    hasProperties (properties) {
        let hasMatched = false;

        properties.forEach(property => {
            if (this.properties.find(x => x === property)) {
                hasMatched = true;
            }
        });

        return hasMatched;
    }
}
