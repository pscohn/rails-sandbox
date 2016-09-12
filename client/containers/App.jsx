import React, { Component } from 'react';
import ChatContainer from '../components/ChatContainer';
import Home from '../components/Home';

export default class App extends Component {
  render() {
    if (this.props.children) {
      return (
        <div>
          {this.props.children}
        </div>
      )
    }

    return <Home />;
  }
}
