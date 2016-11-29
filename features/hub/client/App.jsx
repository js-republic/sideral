import React from "react";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";
import IconPlay from "material-ui/svg-icons/av/play-arrow";
import IconStop from "material-ui/svg-icons/av/stop";
import { connect } from "react-redux";
import * as actions from "./redux/actions";

import Games from "./Games";
import Frame from "./Frame";
import Menu from "./Menu";


class App extends React.Component {

    /* LIFECYCLE */

    constructor (props) {
        super(props);

        this.handleClickDrawerGames = this.handleClickDrawerGames.bind(this);
        this.handleClickDrawerMenu  = this.handleClickDrawerMenu.bind(this);
    }

    /**
     * @render
     * @returns {XML} view
     */
    render () {
        return (
            <div>
                <AppBar title={`Slime - ${this.props.game || "HUB"}`} onLeftIconButtonTouchTap={this.handleClickDrawerMenu}
                    iconElementRight={<FlatButton label={this.props.game ? "Change game" : "Play games"} icon={this.props.game ? <IconStop /> : <IconPlay />} onTouchTap={this.handleClickDrawerGames} />} />
                <Frame />
                <Games />
                <Menu />
                {this.props.modal}
                {this.props.snackbar}
            </div>
        );
    }

    /* METHODS */

    /**
     * Open the drawer Games
     * @event click
     * @returns {void}
     */
    handleClickDrawerGames () {
        this.props.setGame(null);
        this.props.setDrawerGames(true);
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
        game        : state.game,
        drawerGames : state.drawerGames,
        modal       : state.modal,
        snackbar    : state.snackbar
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDrawerGames  : (open) => dispatch(actions.actionDrawerGames(open)),
        setDrawerMenu   : (open) => dispatch(actions.actionDrawerMenu(open)),
        setGame         : (game) => dispatch(actions.actionGame(game))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
