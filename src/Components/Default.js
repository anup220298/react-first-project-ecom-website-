import React, { Component } from "react";

export default class Default extends Component {
  render() {
    return (
      <div>
        <h3 className="text-title">
          the requested path
          <span className="text-danger">
            "{this.props.location.pathname}"
          </span>{" "}
          is not defined
        </h3>
      </div>
    );
  }
}
