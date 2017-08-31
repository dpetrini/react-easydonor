// src/routes.js
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import About from './About';
import NotFound from './NotFound'
import Body from './Body'

class MyRoutes extends Component {

/* Use components to define routes */
  render() {
    return (
      <Switch>
        <Route exact={true} path="/" component={Body}/>
        <Route path="/about" component={About} /> 
        <Route path="/:user" component={User}/>
        <Route component={NotFound} />
      </Switch>

    );
  }
}

export default MyRoutes;

const User = ({ match }) => (
  <div>
    <h2>User: {match.params.user}</h2>
  </div>
)
