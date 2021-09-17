import React, { Component } from "react";
import '../styles/404Page.scss'

class NotFoundPage extends Component {
  render() {
    return (
      <div className="notFound-container">
        <h1>404</h1>
        <p>Oops! Something is wrong.</p>
        <a className="button" href="javascript:void(0)" onClick={() => this.props.history.replace('/')}>
          <i className="icon-home"></i> Go back in initial page, is better.
        </a>
      </div>
    );
  }
}

export default NotFoundPage;
