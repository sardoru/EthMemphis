import React from 'react';
import ReactDOM from 'react-dom';
// import { render } from 'react-dom';
import { Provider } from 'react-redux';
// import { combineReducers, applyMiddleware, createStore } from 'redux' // moved to store.js
// import {BrowserRouter, Route} from 'react-router-dom'; // not needed
// import createHistory from 'history/createBrowserHistory';
import { createBrowserHistory } from 'history'
import registerServiceWorker from './registerServiceWorker';

// import { routerReducer } from './reducer'
// import { routerMiddleware } from './middleware'
import { startListener } from './listener'
// import { push } from './actions'
// import { createBrowserHistory, startListener, Router } from 'redux-json-router';
import { RouterContainer } from './Router';
import { configureStore } from './store';
// import routes from './routes.json'; // webpack-loaded JSON routing config
import { routes } from 'const/constants'; // plain JavaScript routing config

// Layouts
// import App from './containers/App';
import BaseLayout from './containers/BaseLayout'
// import Home from './components/Home'
// import App from './containers/App'
// import Prospectus from './containers/Prospectus';
import './styles/index.css';

// create a history singleton
const history = createBrowserHistory();

// Build the root reducer
// const rootReducer = combineReducers({
//   // ...otherReducers,
//   router: routerReducer,
// })                     // moved to store.js
  
// Build the middleware
// const middleware = routerMiddleware(history) // moved to store.js

// Create the store
const store = configureStore(history);

// dispatch actions when the history is manually changed (with navigation buttons / address bar)
startListener(history, store);

// // Now you can read location data from the store!
// let currentLocation = store.getState().router.pathname

// // You can also subscribe to changes in the location!
// let unsubscribe = store.subscribe(() => {
//   let previousLocation = currentLocation
//   currentLocation = store.getState().router.pathname
//   if (previousLocation !== currentLocation) {
//     // You can render your application reactively here!
//   }
// })

// // And you can dispatch navigation actions from anywhere!
// store.dispatch(push('/about'))

// render the application with <Router /> to match the current URL to the routing config
ReactDOM.render(
  <Provider store={store}>
    <BaseLayout>
      <RouterContainer routes={routes} />
    </BaseLayout>
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();