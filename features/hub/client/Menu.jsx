import React from "react";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import IconMap from "material-ui/svg-icons/maps/map";
import IconMerge from "material-ui/svg-icons/editor/merge-type";
import IconExplore from "material-ui/svg-icons/action/explore";
import IconArt from "material-ui/svg-icons/av/art-track";
import { red500, indigo500, green500, orange500 } from "material-ui/styles/colors";
import { List } from "material-ui/List";
import { connect } from "react-redux";
import * as actions from "./redux/actions";


class Menu extends React.Component {

    /* LIFECYCLE */

    /**
     * @render
     * @returns {*} view
     */
    render () {
        return (
            <Drawer docked={false} width={300} open={this.props.drawerMenu} onRequestChange={(open) => this.props.setDrawerMenu(open)}>
                <List>
                    <Subheader inset={true}>Applications</Subheader>
                    <Divider />
                    <br />
                </List>

                <MenuItem href="/map" target="_blank" leftIcon={<IconMap color={red500} />} primaryText="Map editor" />
                <MenuItem href="/code" target="_blank" leftIcon={<IconArt color={orange500} />} primaryText="Code & play" />
                <Divider />
                <MenuItem href="https://github.com/js-republic/sideral/" target="_blank" leftIcon={<IconMerge color={indigo500} />} primaryText="Github repository" />
                <MenuItem href="http://www.js-republic.com" target="_blank" leftIcon={<IconExplore color={green500} />} primaryText="Visit JS-Republic" />
            </Drawer>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        drawerMenu: state.drawerMenu
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDrawerMenu: (open) => dispatch(actions.actionDrawerMenu(open))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Menu);
