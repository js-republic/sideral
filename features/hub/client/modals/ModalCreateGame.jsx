import React from "react";
import axios from "axios";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import Snackbar from "material-ui/Snackbar";
import { connect } from "react-redux";
import * as actions from "./../redux/actions";

import Modal from "./Modal";


class ModalCreateGame extends React.Component {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {*} props: properties
     */
    constructor (props) {
        super(props);

        this.state = { open: false, errorText: false };

        this.handleOpen     = this.handleOpen.bind(this);
        this.handleClose    = this.handleClose.bind(this);
        this.handleSubmit   = this.handleSubmit.bind(this);
    }

    /**
     * @componentDidMount
     * @returns {void}
     */
    componentDidMount () {
        this.handleOpen();
    }

    /**
     * @render
     * @returns {*} view
     */
    render () {
        const actions = [
            <FlatButton label="Cancel" primary={true} onTouchTap={this.handleClose} />,
            <FlatButton label="Submit" primary={true} keyboardFocused={true} onTouchTap={this.handleSubmit} />
        ];

        return (
            <Modal title="Create a new game" actions={actions} open={this.state.open} onRequestClose={this.handleClose} onRequestOpen={this.handleOpen}>
                <TextField ref={(textField) => { this.textField = textField; }} errorText={this.state.errorText} fullWidth={true} hintText="Enter the name of the folder (3 characters min.)" />
            </Modal>
        );
    }

    /* METHODS */

    /**
     * Open the modal
     * @returns {void}
     */
    handleOpen () {
        this.setState({ open: true, errorText: null });
    }

    /**
     * Close the modal
     * @returns {void}
     */
    handleClose () {
        this.setState({ open: false });
    }

    /**
     * Click on submit button
     * @returns {void}
     */
    handleSubmit () {
        const correctValue = this.textField.input.value.length > 3;

        this.setState({ errorText: correctValue ? "" : "The name must be longer than 3 characters." });

        if (correctValue) {
            axios.post("/hub/create", {
                name: this.textField.input.value
            }).then((response) => {
                const data = response.data;

                if (data.games) {
                    this.handleClose();
                    this.props.setGames(data.games);
                    this.props.setSnackbar(<Snackbar open={true} message="Game folder created !" autoHideDuration={2000} />);
                }
            });
        }
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        setSnackbar : (snackbar) => dispatch(actions.actionSnackbar(snackbar)),
        setGames    : (games) => dispatch(actions.actionGames(games))
    };
};


export default connect(null, mapDispatchToProps)(ModalCreateGame);
