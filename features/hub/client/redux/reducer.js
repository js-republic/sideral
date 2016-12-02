import { createStore } from "redux";


/**
 * Merge an action data into store
 * @param {*} state: current state of reducer
 * @param {string} type: state type to merge
 * @param {*} data: data from the type
 * @returns {*} the new state
 */
const mergeState = (state, type, data) => {
    const newState = Object.assign({}, state);

    newState[type] = data;

    return newState;
};


/**
 * Remove an attribute from the store
 * @param {*} state: current state of reducer
 * @param {string} type: state type to remove
 * @returns {*} the new state
 */
const removeState = (state, type) => {
    const newState = Object.assign({}, state);

    newState[type] = null;

    return newState;
};


/**
 * Main reducer
 * @param {{}} state: current state of the reducer
 * @param {{}} action: action dispatched
 * @returns {*} the new state
 */
const hubReducer = (state, action) => {
    if (typeof state[action.type] !== "undefined") {
        switch (action.type) {
        // Specific case

        // Default case
        default: return action.data === null ? removeState(state, action.type) : mergeState(state, action.type, action.data);
        }
    }

    return state;
};


/**
 * Default store
 * @type {*}
 */
const defaultStore = {
    // Current modal
    modal   : null,

    // Drawer Project opened
    drawerProjects: false,

    // Drawer menu opened
    drawerMenu: false,

    // Current snackbar
    snackbar: null,

    // List of projects
    projects: [],

    // Current project selected
    project: null
};


export default createStore(hubReducer, defaultStore);
