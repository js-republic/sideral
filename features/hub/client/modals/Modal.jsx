import React from "react";
import Dialog from "material-ui/Dialog";
import { connect } from "react-redux";


class Modal extends React.Component {

    /* LIFECYCLE */

    /**
     * @componentWillReceiveProps
     * @param {{}} nextProps: next properties
     * @returns {void}
     */
    componentWillReceiveProps (nextProps) {
        if (nextProps.modal !== this.props.modal && this.props.onRequestOpen) {
            this.props.onRequestOpen();
        }
    }

    /**
     * @render
     * @returns {*} view
     */
    render () {
        return (
            <Dialog title={this.props.title} open={this.props.open} onRequestClose={this.props.onRequestClose} actions={this.props.actions || []}>
                {this.props.children}
            </Dialog>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        modal: state.modal
    };
};


export default connect(mapStateToProps)(Modal);
