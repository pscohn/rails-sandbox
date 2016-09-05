import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

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
    };
    this.socket = io(`/${this.props.params.room}`);
    this.socket.on('chat message', (msg) => {
      let messages = this.state.messages.slice();
      messages.push(msg);
      this.setState({
        message: '',
        messages,
      })
    });
    this.socket.on('nicks', (nicks) => {
      this.setState({
        nicks,
      });
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
    console.log(this.state.nicks, this.state.nick);
    if (this.state.nick.length > 0 && this.state.nicks.indexOf(this.state.nick) === -1) {
      this.setState({ isNickSet: true });
      this.socket.emit('nick set', this.state.nick);
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
        <ul className="messages">
          {this.state.messages.map((message, i) => {
            return <li key={i}>{message.nick}: {message.text}</li>;
          })}
        </ul>
        People in room: {this.state.nicks}
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
