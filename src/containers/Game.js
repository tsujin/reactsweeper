import React, { Component } from 'react';
import './Game.css';

import Board from 'components/Board.js';
import Cell from 'components/Cell.js'

export class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cells: this.setCells(),
      flags: this.props.bombs,
      emoji: '😐',
      clock: 0,
    }
    // copy the board to avoid mutating the state directly
    this.board = this.state.cells.slice();

    this.tick = this.tick.bind(this);
    this.playing = true;
    this.firstclick = true;
    this.movesRemaining = this.props.sides * this.props.sides - this.props.bombs;
  }

  isValid(row, col) {
      return row >= 0 && row < this.props.sides && col >= 0 && col < this.props.sides
  }

  setCells() {
    var arr = [];
    for (let x=0; x<this.props.sides; x++) {
      arr[x] = [];
      for (let y=0; y<this.props.sides; y++) {
        arr[x][y] = new Cell();
      }
    }
    return arr
  }

  countNeighboringBombs(x, y) {
    let count = 0;
    for (let i = x-1; i<x+2; i++) {
      for (let j = y-1; j<y+2; j++) {
        if (this.isValid(i, j) && this.board[i][j].isOpen && this.board[i][j].hasBomb) {
          count++;
        }
      }
    }
    return count
  }

  closeCells(x, y) {
    this.movesRemaining--;
    this.board[x][y].isOpen = false;
    let count = this.countNeighboringBombs(x, y);
    if (!count) {
      if (this.isValid(x-1, y)) {
        if (this.board[x-1][y].isOpen && !this.board[x-1][y].hasBomb) {
          this.closeCells(x-1, y)
        }
      }
      if (this.isValid(x+1, y)) {
        if (this.board[x+1][y].isOpen && !this.board[x+1][y].hasBomb) {
          this.closeCells(x+1, y)
        }
      }
      if (this.isValid(x, y-1)) {
        if (this.board[x][y-1].isOpen && !this.board[x][y-1].hasBomb) {
          this.closeCells(x, y-1)
        }
      }
      if (this.isValid(x, y+1)) {
        if (this.board[x][y+1].isOpen && !this.board[x][y+1].hasBomb) {
          this.closeCells(x, y+1)
        }
      }
      if (this.isValid(x-1, y+1)) {
        if (this.board[x-1][y+1].isOpen && !this.board[x-1][y+1].hasBomb) {
          this.closeCells(x-1, y+1)
        }
      }
      if (this.isValid(x+1, y-1)) {
        if (this.board[x+1][y-1].isOpen && !this.board[x+1][y-1].hasBomb) {
          this.closeCells(x+1, y-1)
        }
      }
      if (this.isValid(x-1, y-1)) {
        if (this.board[x-1][y-1].isOpen && !this.board[x-1][y-1].hasBomb) {
          this.closeCells(x-1, y-1)
        }
      }
      if (this.isValid(x+1, y+1)) {
        if (this.board[x+1][y+1].isOpen && !this.board[x+1][y+1].hasBomb) {
          this.closeCells(x+1, y+1)
        }
      }
    }
    else {
      this.board[x][y].value = count;
    }
  }

  tick() {
    if (this.state.clock < 999) {
      this.setState({clock: this.state.clock + 1})
    }
    else {
      clearInterval(this.state.interval)
    }
  }

  handleClick(x, y) {
    let emoji = this.state.emoji;
    // if the first click is a bomb, we relocate the bombs
    if (this.firstclick) {
      this.firstclick = false;
      if (this.board[x][y].hasBomb) {
        loop1:
        for (let row=0; row<this.props.sides; row++) {
          for (let col=0; col<this.props.sides; col++) {
            if (!this.board[row][col].hasBomb && this.board[row][col] !== this.board[x][y]) {
              this.board[row][col].hasBomb = true;
              break loop1;
            }
          }
        }
        this.board[x][y].hasBomb = false;
      }
      var interval = setInterval(this.tick, 1000);
      this.setState({interval: interval})
    }
    if (!this.board[x][y].isOpen || this.board[x][y].hasFlag || !this.playing) {
      return
    }
    else if (this.board[x][y].hasBomb) {
      for (let row=0; row<this.props.sides; row++) {
        for (let col=0; col<this.props.sides; col++) {
          if (this.board[row][col].hasBomb) {
            this.board[row][col].value = '💣';
          }
        }
      }
      this.board[x][y].value = '💥';
      this.playing = false;
      emoji = '💩'
    }
    else {
      this.closeCells(x, y)
    }
    if (this.movesRemaining === 0 && this.playing) {
      this.playing = false;
      emoji = '😎';
    }
    if (!this.playing) {
      clearInterval(this.state.interval)
    }
    this.setState({
      cells: this.board,
      emoji: emoji,
    })
  }

  handleRightClick(e, x, y,) {
    // stop context menu from opening, and instead place or remove flags on the board
    e.preventDefault();
    // copy flags to avoid directly mutating the state
    let flags = this.state.flags;
    if (this.playing) {
      if (this.board[x][y].hasFlag) {
        this.board[x][y].hasFlag = false;
        flags++;
        // remove flag so it will not render
        this.board[x][y].value = null;
      }
      else {
        if (flags < 1) {
          return
        }

        else {
          if (this.board[x][y].isOpen) {
            this.board[x][y].hasFlag = true;
            flags--;
            this.board[x][y].value = '🚩';
          }
          else {
            return
          }
        }
      }
      this.setState({
        cells: this.board,
        flags: flags,
      })
    }
    else {
      return
    }
  }

  render() {
    return (
      <div className="game-container">
        <div className="board-header">
          <span className="flags">{this.state.flags}</span>
          <span className="emoji">{this.state.emoji}</span>
          <span className="timer">{this.state.clock}</span>
        </div>
        <Board
          cells={this.state.cells}
          onClick={(x, y) => this.handleClick(x, y)}
          onContextMenu={(e, x, y) => this.handleRightClick(e, x, y)}
          sides={this.props.sides}
          bombs={this.props.bombs}
        />
      </div>
    )
  }
}
