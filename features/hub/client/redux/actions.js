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

/**
 * Action for modal
 * @param {{}} modal: modal component
 * @returns {{type: *}} action
 */
export const actionModal = (modal) => {
    return createAction(modal, "modal");
};

/**
 * Action for snackbar
 * @param {{}} snackbar: snackbar component
 * @returns {{type: *}} action
 */
export const actionSnackbar = (snackbar) => {
    return createAction(snackbar, "snackbar");
};

/**
 * Action for games list
 * @param {Array<string>} projects: list of games
 * @returns {{type: *}} action
 */
export const actionProjects = (projects) => {
    return createAction(projects, "projects");
};

/**
 * Select a current project
 * @param {string} project: the name of the folder
 * @returns {{type: *}} action
 */
export const actionProject = (project) => {
    return createAction(project, "project");
};

/**
 * Toggle drawer for projects
 * @param {boolean} open: drawer open
 * @returns {{type: *}} action
 */
export const actionDrawerProjects = (open) => {
    return createAction(open, "drawerProjects");
};

/**
 * Toggle drawer for menu
 * @param {boolean} open: drawer menu
 * @returns {{type: *}} action
 */
export const actionDrawerMenu = (open) => {
    return createAction(open, "drawerMenu");
};
