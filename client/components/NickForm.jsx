import React, { Component, PropTypes } from 'react';

class NickForm extends Component {
  static propTypes = {
    room: PropTypes.string.isRequired,
    nick: PropTypes.string.isRequired,
    onChangeNick: PropTypes.func.isRequired,
    onSubmitNick: PropTypes.func.isRequired,
    error: PropTypes.string,
  };

  render() {
    return (
      <div className="chat">
        <div className="messages">
          <h1>Joining room {this.props.room}</h1>
          <div className="nick-error">
            {this.props.error ? this.props.error : undefined}<br />
          </div>
        </div>
        <div className="chatbar">
          <form onSubmit={this.props.onSubmitNick}>
            <input onChange={this.props.onChangeNick} placeholder="set your nickname" value={this.props.nick} />
            <button>Set Nick</button>
          </form>
        </div>
      </div>
    );
  }
}

export default NickForm;
