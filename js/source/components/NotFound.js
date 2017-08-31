import React, { Component } from 'react';
import classnames from 'classnames';

export default class NotFound extends Component {

  render() {
    return (
      <div className={classnames('NotFound')}>
        <h1>
          404 <small>Not Found :(</small>
        </h1>
      </div>
    );
  }
}
