import React, { Component, PropTypes } from 'react';

class NickForm extends Component {
  static propTypes = {
    room: PropTypes.string.isRequired,
    nick: PropTypes.string.isRequired,
    nicks: PropTypes.string.isRequired,
    onChangeNick: PropTypes.func.isRequired,
    onSubmitNick: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div>
        <h1>Joining room {this.props.room}</h1>
        <form onSubmit={this.props.onSubmitNick}>
          <input onChange={this.props.onChangeNick} value={this.props.nick} />
          <button>Set Nick</button>
        </form>
        People in room: {this.props.nicks}
      </div>
    );
  }
}

export default NickForm;
