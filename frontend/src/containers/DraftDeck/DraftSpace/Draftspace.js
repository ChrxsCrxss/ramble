import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import classes from "./Draftspace.module.css";
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

class DraftSpace extends Component {

  render() {

    return (
      <div className={classes.DraftSpace}>

        <Paper elevation={2} className={classes.DraftSpace}>

          <form>
            <textarea
              placeholder="Title"
              name='title'
              value={this.props.userTextInput.title}
              onChange={(event) => this.props.updateUserInput({name: event.target.name, value: event.target.value})}
            />
          </form>

          <hr />

          <form>
            <textarea
              className={classes.DraftContent}
              onChange={(event) => this.props.updateUserInput({name: event.target.name, value: event.target.value})}
              placeholder="Content: text or paste your argument here!"
              value={this.props.userTextInput.content}
              name='content'
            />
          </form>

        </Paper>

      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
      onDynamicAddNode: (payload) => dispatch(actions.updateUserInput(payload))
  };
}

const mapStateToProps = state => {
  return {
    userTextInput : state.userTextInput
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DraftSpace); 