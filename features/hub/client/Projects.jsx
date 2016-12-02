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
import ModalCreateProject from "./modals/ModalCreateProject";


class Projects extends React.Component {

    /* LIFECYCLE */

    /**
     * @constructor
     * @param {{}} props: properties
     */
    constructor (props) {
        super(props);

        this.handleClickCreate  = this.handleClickCreate.bind(this);
        this.handleClickProject = this.handleClickProject.bind(this);
    }

    /**
     * @componentWillMount
     * @returns {void}
     */
    componentWillMount () {
        axios.get("/hub/projects").then((response) => {
            const data = response.data;

            if (response.data && data.projects) {
                this.props.setProjects(data.projects|| []);
            }
        });
    }

    /**
     * @render
     * @returns {*} render
     */
    render () {
        return (
            <Drawer docked={false} openSecondary={true} width={300} open={this.props.drawerProjects} onRequestChange={open => this.props.setDrawerProjects(open)}>
                <List>
                    <Subheader>Select a project</Subheader>
                    {this.props.projects.map(project => <ListItem key={project} onTouchTap={() => this.handleClickProject(project)} primaryText={project} />)}
                    <Divider />
                    <br />
                    <Paper style={{ padding: 15 }} zDepth={0}>
                        <RaisedButton label="Create a new project" primary={true} fullWidth={true} onClick={this.handleClickCreate} />
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
        this.props.setModal(<ModalCreateProject />);
    }

    /**
     * Handle click to set the project
     * @event click
     * @param {string} project: project folder
     * @returns {void}
     */
    handleClickProject (project) {
        this.props.setProject(project);
        this.props.setDrawerProjects(false);
    }
}


const mapStateToProps = (state) => {
    return {
        drawerProjects : state.drawerProjects,
        projects       : state.projects
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDrawerProjects   : (open) => dispatch(actions.actionDrawerProjects(open)),
        setModal            : (modal) => dispatch(actions.actionModal(modal)),
        setProjects         : (projects) => dispatch(actions.actionProjects(projects)),
        setProject          : (project) => dispatch(actions.actionProject(project))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Projects);
