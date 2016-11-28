import React from "react";
import ReactDOM from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import injectTapEventPlugin from "react-tap-event-plugin";

import App from "./App";


const AppTheme = Object.assign({}, lightBaseTheme, {});

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
    <MuiThemeProvider muiTheme={getMuiTheme(AppTheme)}>
        <App />
    </MuiThemeProvider>,

    document.getElementById("app")
);
