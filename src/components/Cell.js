import React, { Component } from 'react';

export default class Cell extends Component {
  constructor(props) {
    super(props);
    this.isOpen = true;
    this.hasBomb = false;
    this.hasFlag = false;
  }

  render() {
    return (
      <button
        className = {
          this.props.isOpen ? 'cell' : 'cell-closed'
        }
        onClick={this.props.onClick}
        onContextMenu={this.props.onContextMenu}>
        {this.props.value}
      </button>
    )
  }
}
