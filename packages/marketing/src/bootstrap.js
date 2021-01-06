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

  // to create a way of communication from container to the component, we will return an object with some functions that the container will be able to call to give information to the component (we can not pass as prop in this case because we do not want to use it here, inside the component. We actually want the action to happen inside the container. As we are doing here by calling a callback in case of a memory history change, we want to call the returned callback when the browser history change in the container level)
  return {
    onParentNavigate({ pathname: nextPathname }) {
      const { pathname } = history.location;

      if (pathname !== nextPathname) {
        history.push(nextPathname);
      }
    }
  };
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