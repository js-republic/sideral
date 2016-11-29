import React from "react";
import { connect } from "react-redux";


class Frame extends React.Component {

    /* LIFECYCLE */

    /**
     * @render
     * @returns {*} view
     */
    render () {
        return (
            <div>
                {this.props.game ? <iframe src={`games/${this.props.game}`} style={{ width: "100%", height: "calc(100vh - 50px)", border: "none" }} /> : ""}
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        game: state.game
    };
};


export default connect(mapStateToProps)(Frame);