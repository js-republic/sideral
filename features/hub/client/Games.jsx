import React from "react";
import Drawer from "material-ui/Drawer";
import { List, ListItem } from "material-ui/List";
import Subheader from "material-ui/Subheader";
import Divider from "material-ui/Divider";
import RaisedButton from "material-ui/RaisedButton";
import Paper from "material-ui/Paper";
import axios from "axios";
import { connect } from "react-redux";

import * as actions from "./redux/actions";
import ModalCreateGame from "./modals/ModalCreateGame";


class Games extends React.Component {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {{}} props: properties
     */
    constructor (props) {
        super(props);

        this.handleClickCreate  = this.handleClickCreate.bind(this);
        this.handleClickGame    = this.handleClickGame.bind(this);
    }

    /**
     * @componentWillMount
     * @returns {void}
     */
    componentWillMount () {
        axios.get("/hub/games").then((response) => {
            const data = response.data;

            if (response.data && data.games) {
                this.props.setGames(data.games || []);
            }
        });
    }

    /**
     * @render
     * @returns {*} render
     */
    render () {
        return (
            <Drawer docked={false} openSecondary={true} width={300} open={this.props.drawerGames} onRequestChange={open => this.props.setDrawerGames(open)}>
                <List>
                    <Subheader>Select a game</Subheader>
                    {this.props.games.map(game => <ListItem key={game} onTouchTap={() => this.handleClickGame(game)} primaryText={game} />)}
                    <Divider />
                    <br />
                    <Paper style={{ padding: 15 }} zDepth={0}>
                        <RaisedButton label="Create a new game" primary={true} fullWidth={true} onClick={this.handleClickCreate} />
                    </Paper>
                </List>
            </Drawer>
        );
    }

    /* METHODS */

    /**
     * Handle click to add modal
     * @event click
     * @returns {void}
     */
    handleClickCreate () {
        this.props.setModal(<ModalCreateGame />);
    }

    /**
     * Handle click to set the game
     * @event click
     * @param {string} game: game folder
     * @returns {void}
     */
    handleClickGame (game) {
        this.props.setGame(game);
        this.props.setDrawerGames(false);
    }
}


const mapStateToProps = (state) => {
    return {
        drawerGames : state.drawerGames,
        games       : state.games
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDrawerGames  : (open) => dispatch(actions.actionDrawerGames(open)),
        setModal        : (modal) => dispatch(actions.actionModal(modal)),
        setGames        : (games) => dispatch(actions.actionGames(games)),
        setGame         : (game) => dispatch(actions.actionGame(game))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Games);
