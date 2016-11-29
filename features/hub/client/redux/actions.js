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
 * @param {Array<string>} games: list of games
 * @returns {{type: *}} action
 */
export const actionGames = (games) => {
    return createAction(games, "games");
};

/**
 * Select a current game
 * @param {string} game: the name of the folder
 * @returns {{type: *}} action
 */
export const actionGame = (game) => {
    return createAction(game, "game");
};

/**
 * Toggle drawer for games
 * @param {boolean} open: drawer open
 * @returns {{type: *}} action
 */
export const actionDrawerGames = (open) => {
    return createAction(open, "drawerGames");
};

/**
 * Toggle drawer for menu
 * @param {boolean} open: drawer menu
 * @returns {{type: *}} action
 */
export const actionDrawerMenu = (open) => {
    return createAction(open, "drawerMenu");
};
