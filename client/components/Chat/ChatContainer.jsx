import React, { Component } from 'react';
import { connect } from 'react-redux';

// import {
// } from './chatActions';

class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNickSet: false,
      nick: '',
      message: '',
      messages: []
    };
    this.socket = io();
    this.socket.on('chat message', (msg) => {
      let messages = this.state.messages.slice();
      messages.push(msg);
      this.setState({
        message: '',
        messages,
      })
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const message = { nick: this.state.nick, text: this.state.message };
    this.socket.emit('chat message', message);
    return false;
  }

  onChangeMessage(e) {
    this.setState({ message: e.target.value });
  }

  onChangeNick(e) {
    this.setState({ nick: e.target.value });
  }

  onSubmitNick(e) {
    e.preventDefault();
    if (this.state.nick.length > 0) {
      this.setState({ isNickSet: true });
    }
  }

  render() {
    if (this.state.isNickSet === false) {
      return (
        <form onSubmit={::this.onSubmitNick}>
          <input onChange={::this.onChangeNick} value={this.state.nick} />
          <button>Set Nick</button>
        </form>
      );
    }

    return (
      <div>
        <ul>
          {this.state.messages.map((message, i) => {
            return <li key={i}>{message.nick}: {message.text}</li>;
          })}
        </ul>
        <form onSubmit={::this.onSubmit}>
          <input onChange={::this.onChangeMessage} value={this.state.message} />
          <button>Send</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {  } = state;
  return {
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    // onCreateList: () => {
    //   dispatch(onCreateList());
    // },
    // onDeleteList: (listId) => {
    //   dispatch(onDeleteList(listId));
    // },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);
