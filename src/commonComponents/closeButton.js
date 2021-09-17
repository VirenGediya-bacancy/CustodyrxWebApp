import React, { Component } from "react";

class CloseButton extends Component {
  render() {
    const { path, history, state } = this.props;
    return (
      <div className="cross">
        <i
          className="fa fa-times mr-auto"
          onClick={() =>
            path
              ? history.replace({
                  pathname: path,
                  state : {...state},
                })
              : history.goBack()
          }
        ></i>
      </div>
    );
  }
}

export default CloseButton;
