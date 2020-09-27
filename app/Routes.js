import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import Home from './components/Home';
import Chat from './components/Chat';

export default () => (
  <App>
    <Switch>
      <Route path={routes.CHAT} component={Chat} />
      <Route path={routes.HOME} component={Home} />
    </Switch>
  </App>
);
