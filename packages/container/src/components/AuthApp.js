import { mount } from 'auth/AuthApp';
import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default () => {
  const ref = useRef(null);
  // this history object is the copy of the Browser history, not the memory history (used only in the microfrontends)
  const history = useHistory();

  useEffect(() => {
    // we are returning a callback function to be able to tell the microfrontend that there was a navigation in the container level
    const { onParentNavigate } = mount(ref.current, {
      // necessary to pass initialPath to make sure that the component is mounted correctly (knowing the current browser history path so it can decide what to render)
      initialPath: history.location.pathname,
      // the onNavigate function is a callback that will be called by the history object inside the microfrontend marketing app whenever a navigation occurs. It calls the function with the location object as parameter and it contains information about the path we are navigating to in the pathname key (the only key we are deconstructing)
      // { pathname: nextPathname } does two things at once: deconstruct the location object by taking its pathname key AND rename it to nextPathname (because we are going to use pathname in the browser history object as well)
      onNavigate: ({ pathname: nextPathname }) => {
        // to avoid infinite loop, we need to check if the navigation is valid (if we are attempting to navigate to a different page)
        const { pathname } = history.location;
        if (pathname !== nextPathname) {
          history.push(nextPathname);
        }
      },
      // pass a callback to 'notify' container about sign in events
      onSignIn: () => {
        console.log("User signed in");
      }
    });

    history.listen(onParentNavigate);
  }, []);

  return <div ref={ref} />;
};