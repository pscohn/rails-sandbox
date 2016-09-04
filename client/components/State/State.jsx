import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';


import {
  onSaveState,
  onLoadState,
} from './stateActions';

class State extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      loadState: null,
    };
    this.onLoadState = this.onLoadState.bind(this);
  }

  handleOpen = () => {
    this.setState({ isModalOpen: true });
  };

  handleClose = () => {
    this.setState({ isModalOpen: false });
  };

  setLoadState = (e) => {
    this.setState({ loadState: e.target.value });
  };

  onLoadState() {
    const state = JSON.parse(this.state.loadState);
    this.props.onLoadState(state);
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.onLoadState}
      />,
    ];

    return (
      <div className="state">
        <FlatButton label="Save" onClick={this.props.onSaveState} />
        <FlatButton label="Load" onClick={this.handleOpen} />
        <Dialog
          title="Load State"
          actions={actions}
          modal={false}
          open={this.state.isModalOpen}
          onRequestClose={this.handleClose}
        >
          <TextField
            onChange={this.setLoadState}
            multiLine={true}
            rows={4}
            fullWidth
          />
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { lists, todos, listTodos } = state;
  return {
    lists,
    todos,
    listTodos,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSaveState: () => {
      dispatch(onSaveState());
    },
    onLoadState: (json) => {
      dispatch(onLoadState(json));
    },
  }
}

export default connect(undefined, mapDispatchToProps)(State);
