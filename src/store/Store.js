import RootReducer from './Reducer/RootReducer';
import { createStore, applyMiddleware, compose  } from 'redux';
import thunk from 'redux-thunk';
// import logger from 'redux-logger'
 
const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

let middleware = [thunk]; //logger

/**
 * Create store to store app data
 */
export const store = createStore(RootReducer, composeEnhancers(applyMiddleware(...middleware)));