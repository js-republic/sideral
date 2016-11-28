import React from "react";
import { List, ListItem } from "material-ui/List";
import Subheader from "material-ui/Subheader";
import Divider from "material-ui/Divider";
import RaisedButton from "material-ui/RaisedButton";
import { connect } from "react-redux";
import * as actions from "./redux/actions";


class Games extends React.Component {

    /* LIFECYCLE */
    constructor (props) {
        super(props);

        this.handleClickCreate = this.handleClickCreate.bind(this);
    }

    /**
     * @render
     * @returns {*} render
     */
    render () {
        return (
            <div style={{ border: "1px solid silver", width: 300 }}>
                <List>
                    <Subheader>Select a game</Subheader>
                    <ListItem primaryText="JS-Republic Game" />
                    <Divider />
                    <br />
                    <RaisedButton label="Create a new game" primary={true} fullWidth={true} onClick={this.handleClickCreate} />
                </List>
            </div>
        );
    }

    /* METHODS */

    handleClickCreate () {

    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        setModal: (modal) => dispatch(actions.actionModal(modal))
    };
};


export default connect(mapDispatchToProps)(Games);
