import React, { Component, PropTypes } from 'react';
import { generateUUID } from '../services/utils';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { room: '' };
  }
  generate() {
    const uuid = generateUUID();
    window.location = '/' + uuid;
  }
  gotoRoom() {
    if (this.state.room === '') {
      return;
    }
    window.location = '/' + this.state.room;
  }
  changeRoomName(e) {
    this.setState({ room: e.target.value });
  }
  render() {
    return (
      <div>
        <h1>Chat</h1>
        <button onClick={this.generate}>Generate Random Room</button>
        <br />
        <input onChange={::this.changeRoomName} />
        <button onClick={::this.gotoRoom}>Make Room</button>
      </div>
    );
  }
}

export default Home;
