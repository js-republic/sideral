import React from "react";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";
import IconPlay from "material-ui/svg-icons/av/play-arrow";
import IconStop from "material-ui/svg-icons/av/stop";
import { connect } from "react-redux";
import * as actions from "./redux/actions";

import Projects from "./Projects";
import Frame from "./Frame";
import Menu from "./Menu";


class App extends React.Component {

    /* LIFECYCLE */

    constructor (props) {
        super(props);

        this.handleClickDrawerProjects  = this.handleClickDrawerProjects.bind(this);
        this.handleClickDrawerMenu      = this.handleClickDrawerMenu.bind(this);
    }

    /**
     * @render
     * @returns {XML} view
     */
    render () {
        return (
            <div>
                <AppBar title={`Slime - ${this.props.game || "HUB"}`} onLeftIconButtonTouchTap={this.handleClickDrawerMenu}
                    iconElementRight={<FlatButton label={this.props.project ? "Change project" : "Play projects"} icon={this.props.game ? <IconStop /> : <IconPlay />} onTouchTap={this.handleClickDrawerProjects} />} />
                <Frame />
                <Projects />
                <Menu />
                {this.props.modal}
                {this.props.snackbar}
            </div>
        );
    }

    /* METHODS */

    /**
     * Open the drawer Projects
     * @event click
     * @returns {void}
     */
    handleClickDrawerProjects () {
        this.props.setProject(null);
        this.props.setDrawerProjects(true);
    }

    /**
     * Open the drawer Menu
     * @event click
     * @returns {void}
     */
    handleClickDrawerMenu () {
        this.props.setDrawerMenu(true);
    }
}


const mapStateToProps = (state) => {
    return {
        project         : state.project,
        drawerProjects  : state.drawerProjects,
        modal           : state.modal,
        snackbar        : state.snackbar
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDrawerProjects   : (open) => dispatch(actions.actionDrawerProjects(open)),
        setDrawerMenu       : (open) => dispatch(actions.actionDrawerMenu(open)),
        setProject          : (project) => dispatch(actions.actionProject(project))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
