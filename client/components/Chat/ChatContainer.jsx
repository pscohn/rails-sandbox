import React, { Component, PropTypes } from 'react';
import NickForm from './NickForm';
import { flashTitle, cancelFlashTitle } from '../../services/flashTitle';
import { SOUND_ENABLED, SOUND_FILE } from '../../config';

class ChatContainer extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isSoundEnabled: true,
      isNickSet: false,
      nick: '',
      message: '',
      messages: [{nick: null, text: 'This chat is not saved and will be lost upon refresh'}],
      nicks: [],
      colors: {},
      nickError: null,
    };

    if (SOUND_ENABLED) {
      this.pop = new Audio(SOUND_FILE);
    }

    this.socket = io(`/${this.props.params.room}`);
    this.socket.on('chat message', (msg) => {
      if (msg.nick !== this.state.nick) {
        this.playSound();
        flashTitle(`new message`, 10)
      }
      let messages = this.state.messages.slice();
      messages.push(msg);
      this.setState({
        messages,
      })
    });
    this.socket.on('nicks', (nicks, colors) => {
      this.setState({
        nicks,
        colors,
      });
    });
    this.socket.on('nick joined', (nick, color) => {
      this.putMessage(`${nick} has joined the room`);
      this.setState({
        colors: {...this.state.colors, ...{[nick]: color}},
      })
    });
    this.socket.on('nick left', (nick) => {
      this.putMessage(`${nick} has left the room`);
    });
    this.socket.on('disconnect', () => {
      this.putMessage('you have been disconnected. you can try refreshing but the chat will be lost')
    });
    window.onbeforeunload = () => {
      this.socket.emit('user left', this.state.nick);
    };
    window.onfocus = () => {
      cancelFlashTitle();
    }
  }

  playSound() {
    if (SOUND_ENABLED && this.state.isSoundEnabled) {
      this.pop.play();
    }
  }

  putMessage(message) {
    let messages = this.state.messages.slice();
    messages.push({ nick: null, text: message });
    this.setState({
      messages,
    })
  }

  toggleSound() {
    this.setState({ isSoundEnabled: !this.state.isSoundEnabled });
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
        <p>People in room: {this.state.nicks.join(', ')}</p>
        {SOUND_ENABLED ?
          <form><input
            type="checkbox"
            onChange={::this.toggleSound}
            checked={this.state.isSoundEnabled} /> Enable sound</form>
          : undefined}
        <ul className="messages">
          {this.state.messages.map((message, i) => {
            return <li key={i}>{message.nick ?
                <span>
                  <span style={{ color: '#' + this.state.colors[message.nick] }}>
                    {message.nick}:
                  </span> {message.text}</span> :
                <span><em>{message.text}</em></span>}
              </li>;
          })}
        </ul>
        <form className="chatbar" onSubmit={::this.onSubmit}>
          <input onChange={::this.onChangeMessage} value={this.state.message} />
          <button>Send</button>
        </form>
      </div>
    );
  }
}

export default ChatContainer;
