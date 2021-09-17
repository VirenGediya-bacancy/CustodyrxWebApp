import React, { Component } from "react";

class EditButton extends Component {
  render() {
    const { path, history, handleEdit } = this.props;
    return (
      <div className="cross">
        <i
          className="fa fa-edit"
          onClick={() =>
            path ? history.push(path) : handleEdit()
          }
        ></i>
      </div>
    );
  }
}

export default EditButton;
