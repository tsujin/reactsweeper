import React, { Component } from 'react';

import Cell from './Cell.js'

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.setBombs(this.props.cells)
  }

  renderCell(x, y) {
    return (
      <Cell
        key={x, y} // keep the unique position of the cell as a key
        value={this.props.cells[x][y].value}
        onClick={() => this.props.onClick(x, y)}
        onContextMenu={(e) => this.props.onContextMenu(e, x, y)}
        isOpen={this.props.cells[x][y].isOpen}
      />
    )
  }

  renderBoard() {
    const rows = [];
    for (let x=0; x<this.props.sides; x++) {
      let cols = [];
      for (let y=0; y<this.props.sides; y++) {
        cols.push(this.renderCell(x, y));
      }
      rows.push(<div key={x} className="board-row">{cols}</div>);
    }
    return rows
  }

  setBombs(cells) {
    for (let i=0; i<this.props.bombs; i++) {
      let x = Math.floor(Math.random() * this.props.sides);
      let y = Math.floor(Math.random() * this.props.sides);

      while (cells[x][y].hasBomb === true) {
        x = Math.floor(Math.random() * this.props.sides);
        y = Math.floor(Math.random() * this.props.sides);
      }
      cells[x][y].hasBomb = true;
    }
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    )
  }
}
