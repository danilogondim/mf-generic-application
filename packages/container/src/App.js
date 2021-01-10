import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom'; // after adding dashboard, we are importing Router instead of BrowserRouter. The only reason is that we need access to the browser history in the same component (App.js) where the BrowserRouter was implicitly creating a history object. To access this object in this very specific level, we need to use the Router component and to keep this refactor working as before we then pass a copy of the browser history as prop. If we had to access the history in a children component, we could had used the BrowserHistory (in fact we were doing this before such change)
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';

import Progress from './components/Progress';
import Header from './components/Header';

const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/AuthApp'));
const DashboardLazy = lazy(() => import('./components/DashboardApp'));

const generateClassName = createGenerateClassName({
  productionPrefix: 'co',
});

// create the browser history to pass to the Router component (BrowserHistory was implicitly doing this for us before, but now we need access to this object to controle dashboard access)
const history = createBrowserHistory();

export default () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      history.push('/dashboard');
    }
    // we can't use an else statement to redirect not logged users to homepage because if we do this, every user that gets to our application will be automatically redirected to the homepage (and maybe he/she is just trying to see the pricing page and not the dashboard as we want to control the access)
  }, [isSignedIn]);

  return (
    <Router history={history}>
      <StylesProvider generateClassName={generateClassName}>
        <div>
          <Header
            isSignedIn={isSignedIn}
            onSignOut={() => setIsSignedIn(false)}
          />
          <Suspense fallback={<Progress />}>
            <Switch>
              <Route path="/auth">
                <AuthLazy onSignIn={() => setIsSignedIn(true)} />
              </Route>
              <Route path="/dashboard">
                {!isSignedIn && <Redirect to='/' /> /* if the user tries to go to the dashboard route, but it is not signed in, then we will mount the redirect component (that does exactly what the name says, redirects the user to the specified path (homepage) */}
                <DashboardLazy />
              </Route>
              <Route path="/" component={MarketingLazy} />
            </Switch>
          </Suspense>
        </div>
      </StylesProvider>
    </Router>
  );
};