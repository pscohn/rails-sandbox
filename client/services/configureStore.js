import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const logger = createLogger();

const enhancer = compose(
  applyMiddleware(logger, thunk)
);

export const store = createStore(rootReducer, enhancer);
