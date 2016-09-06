import React, { Component, PropTypes } from 'react';

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
}

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
