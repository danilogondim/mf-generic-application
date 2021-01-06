import React from 'react';
import ReactDOM from 'react-dom';
import { createMemoryHistory } from 'history';
import App from './App';

// Mount function to start up the app
const mount = (el, { onNavigate }) => {
  // this object will let us use memory history instead of the browser history that is only used in the container
  const history = createMemoryHistory();

  // the history has a built-in functionality, an event listener called listen. Every time a navigation occurs and the memory history is updated, the history object will call the function we are providing on the listen key
  if (onNavigate) {
    history.listen(onNavigate);
  };

  ReactDOM.render(<App history={history} />, el);
};

// If we are in development and in isolation, call mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#_marketing-dev-root');

  if (devRoot) {
    mount(devRoot, {});
  }
}

// Export the mount function to be able to use it in container as well
export { mount };