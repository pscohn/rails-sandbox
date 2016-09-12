import React from 'react';
import ReactDOM from 'react-dom';
//import { Provider } from 'react-redux';
//import { store } from './services/configureStore';
import { Route, Router, browserHistory } from 'react-router';

import App from './containers/App';
import ChatContainer from './components/ChatContainer';
import Home from './components/Home';

const routes = (
  <Route path="/" component={App}>
    <Route path=":room" component={ChatContainer} />
  </Route>
);

ReactDOM.render(
//  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />,
//  </Provider>,
  document.getElementById('app')
);
