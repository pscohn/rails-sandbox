import React, { Component, PropTypes } from 'react';
import NickForm from './NickForm';

class ChatContainer extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isNickSet: false,
      nick: '',
      message: '',
      messages: [],
      nicks: [],
      nickError: null,
    };
    this.socket = io(`/${this.props.params.room}`);
    this.socket.on('chat message', (msg) => {
      let messages = this.state.messages.slice();
      messages.push(msg);
      this.setState({
        messages,
      })
    });
    this.socket.on('nicks', (nicks) => {
      this.setState({
        nicks,
      });
    });
    window.onbeforeunload = () => {
      this.socket.emit('user left', this.state.nick);
    };
  }

  onSubmit(e) {
    e.preventDefault();
    const message = { nick: this.state.nick, text: this.state.message };
    this.socket.emit('chat message', message);
    this.setState({ message: '' });
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
    console.log(this.state.nicks, this.state.nick);
    if (this.state.nick.length === 0) {
      this.setState({ nickError: 'You must set a username' });
      return;
    }

    if (this.state.nicks.indexOf(this.state.nick) > -1) {
      this.setState({ nickError: 'There is already someone in the room with that name' });
      return;
    }

    this.setState({ isNickSet: true, nickError: null });
    this.socket.emit('nick set', this.state.nick);
  }

  render() {
    if (this.state.isNickSet === false) {
      return (
        <NickForm
          onSubmitNick={::this.onSubmitNick}
          onChangeNick={::this.onChangeNick}
          nick={this.state.nick}
          nicks={this.state.nicks.join(', ')}
          error={this.state.nickError}
          room={this.props.params.room}
        />
      );
    }

    return (
      <div className="chat">
        People in room: {this.state.nicks.join(', ')}
        <ul className="messages">
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

export default ChatContainer;
