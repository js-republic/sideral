/**
 * Create an action pattern
 * @param {*} data: data to check
 * @param {string} type: type of the data
 * @returns {{type: *}} Action object
 */
const createAction = (data, type) => {
    const action = { type: type };

    action.data = data;

    return action;
};


export const actionModal = (modal) => {
    return createAction(modal, "modal");
};
