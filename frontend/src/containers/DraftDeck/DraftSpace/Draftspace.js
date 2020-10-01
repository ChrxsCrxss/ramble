import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import classes from "./Draftspace.module.css";

export default class DraftSpace extends Component {

  render() {

    return (
      <div className={classes.DraftSpace}>

        <Paper elevation={2} className={classes.DraftSpace}>

          <form>
            <textarea
              placeholder="Title"
              name='title'
              value={this.props.userTextInput.title}
              onChange={(event) => this.props.changeUserTextInput(event)}
            />
          </form>

          <hr />

          <form>
            <textarea
              className={classes.DraftContent}
              onChange={(event) => this.props.changeUserTextInput(event)}
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

